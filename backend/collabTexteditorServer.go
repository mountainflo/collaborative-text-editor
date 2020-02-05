package main

import (
	pb "github.com/mountainflo/collaborative-text-editor/collabTexteditorService"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"log"
	"net"
	"os"
	"os/signal"
	"syscall"
)

const (
	port = ":9090"
)

type collabTexteditorService struct {
	repository *Repository
}

type Repository struct {
	NextFreeReplicaId int64
	Channels          map[int]chan *pb.RemoteUpdateResponse
	History           []*pb.RemoteUpdateResponse
}

// Process unary calls with TextUpdateRequest.
// Each subscriber gets the new text.
func (c collabTexteditorService) CreateReplicaId(ctx context.Context, request *pb.Empty) (*pb.ReplicaResponse, error) {

	newReplicaId := c.repository.NextFreeReplicaId
	c.repository.NextFreeReplicaId += 1

	log.Printf("[replicaId=%v] Created new replica id\n", newReplicaId)

	return &pb.ReplicaResponse{ReplicaId: newReplicaId}, nil
}

func (c collabTexteditorService) SendLocalUpdate(ctx context.Context, request *pb.LocalUpdateRequest) (*pb.LocalUpdateReply, error) {

	log.Printf("[replicaId=%v] Received local update\n", request.ReplicaId)

	c.sendUpdateToSubscribers(request.Node, request.ReplicaId)

	//TODO could return *pb.Empty, but a message has to be sent either way
	return &pb.LocalUpdateReply{StatusMessage: "Successfully received local update"}, nil
}

// Clients subscribe to updates by opening a server-side-stream
func (c collabTexteditorService) SubscribeForRemoteUpdates(request *pb.RemoteUpdateRequest, stream pb.CollabTexteditorService_SubscribeForRemoteUpdatesServer) error {

	log.Printf("[replicaId=%v] New subscription for remote updates\n", request.ReplicaId)

	//TODO eventually transfer the complete array in one single response (create new proto-message-type)
	//TODO send all missed events starting by the event after the last send
	/*for i := 0; i < len(c.repository.History); i++ {
		remoteUpdateResponse := c.repository.History[i]
		if err := stream.Send(remoteUpdateResponse); err != nil {
			log.Printf(err.Error())
		}
	}*/

	channelId := c.createNewChannel(int(request.ReplicaId))

	c.forwardChannelEventsToStream(channelId, stream) // func returns only if stream/channel is closed or an error occurs

	delete(c.repository.Channels, channelId)

	return nil
}

func (c collabTexteditorService) forwardChannelEventsToStream(channelId int, stream pb.CollabTexteditorService_SubscribeForRemoteUpdatesServer) {
	for {
		select {
		case <-stream.Context().Done():
			log.Printf("[channelId=%v] Context of stream closed\n", channelId)
			//TODO save channelId with last remoteUpdateResponse. Tag last send response in history with channelId
			return
		case remoteUpdateResponse, ok := <-c.repository.Channels[channelId]:
			if !ok {
				log.Printf("[channelId=%v] Channel closed\n", channelId)
				return
			}
			if err := stream.Send(remoteUpdateResponse); err != nil {
				log.Printf(err.Error())
				return
			}
		}
	}
}

func (c collabTexteditorService) createNewChannel(replicaId int) int {

	channel := make(chan *pb.RemoteUpdateResponse)

	c.repository.Channels[replicaId] = channel

	return replicaId
}

func (c collabTexteditorService) sendUpdateToSubscribers(node *pb.TiTreeNode, replicaId int64) {

	log.Printf("Send update to subscribers\n")

	response := pb.RemoteUpdateResponse{SenderReplicaId: replicaId, Node: node}

	c.repository.History = append(c.repository.History, &response)

	for channelId, channel := range c.repository.Channels {

		//skip replica, which sends update
		if channelId != int(replicaId) {
			log.Printf("[replicaId=%v] Send update to subscriber\n", channelId)
			channel <- &response
		}
	}

}

func main() {

	log.Println("Starting go server ...")

	textStorage := &Repository{NextFreeReplicaId: 0, Channels: make(map[int]chan *pb.RemoteUpdateResponse)}
	repository := &collabTexteditorService{textStorage}

	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}

	s := grpc.NewServer()

	pb.RegisterCollabTexteditorServiceServer(s, repository)

	go func() {
		if err := s.Serve(lis); err != nil {
			log.Fatalf("Failed to serve: %v", err)
		}
	}()

	log.Printf("Successfully started go server on port %s\n", port)

	// Create a channel to receive OS signals
	c := make(chan os.Signal, 1)

	// Relay os.Interrupt to our channel (os.Interrupt = CTRL+C)
	// Ignore other incoming signals
	signal.Notify(c, os.Interrupt, syscall.SIGTERM, syscall.SIGINT)

	<-c // Block main routine until a signal is received

	log.Println("Gracefully stopping the go server ...")

	// Graceful shutdown. Close SubscriberStreams before by closing open channels
	for channelId, channel := range repository.repository.Channels {

		log.Printf("[channelId=%v] Close channel", channelId)
		close(channel)
	}
}
