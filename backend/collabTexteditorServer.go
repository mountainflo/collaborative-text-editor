package main

import (
	"fmt"
	pb "github.com/mountainflo/collaborative-text-editor/collabTexteditorService"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"log"
	"net"
	"os"
	"os/signal"
	"strconv"
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
}

// Process unary calls with TextUpdateRequest.
// Each subscriber gets the new text.
func (c collabTexteditorService) CreateReplicaId(ctx context.Context, request *pb.Empty) (*pb.ReplicaResponse, error) {

	newReplicaId := c.repository.NextFreeReplicaId
	c.repository.NextFreeReplicaId += 1

	log.Println("Created new replica Id: " + strconv.Itoa(int(newReplicaId)))

	return &pb.ReplicaResponse{ReplicaId: newReplicaId}, nil
}

func (c collabTexteditorService) SendLocalUpdate(ctx context.Context, request *pb.LocalUpdateRequest) (*pb.LocalUpdateReply, error) {

	fmt.Printf("received local update from replicaId=%v", request.ReplicaId)

	c.sendUpdateToSubscribers(request.Node, int(request.ReplicaId))

	return &pb.LocalUpdateReply{StatusMessage: "Successfully received local update"}, nil
}

// Clients subscribe to updates by opening a server-side-stream
func (c collabTexteditorService) SubscribeForRemoteUpdates(request *pb.RemoteUpdateRequest, stream pb.CollabTexteditorService_SubscribeForRemoteUpdatesServer) error {

	log.Println("Client " + strconv.Itoa(int(request.ReplicaId)) + " subscribes for updates")

	//TODO new client gets transferred all change events. Go server has to store the event history

	channelId := c.createNewChannel(int(request.ReplicaId))

	c.forwardChannelEventsToStream(channelId, stream) // func returns only if stream/channel is closed or an error occurs

	delete(c.repository.Channels, channelId)

	return nil
}

func (c collabTexteditorService) forwardChannelEventsToStream(channelId int, stream pb.CollabTexteditorService_SubscribeForRemoteUpdatesServer) {
	for {
		select {
		case <-stream.Context().Done():
			log.Println("Context of stream closed")
			return
		case remoteUpdateResponse, ok := <-c.repository.Channels[channelId]: // TODO test if element is present. elem, ok = m[key]
			if !ok {
				log.Println("Channel is closed")
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

func (c collabTexteditorService) sendUpdateToSubscribers(node *pb.TiTreeNode, replicaId int) {

	log.Println("send update to subscribers")

	response := pb.RemoteUpdateResponse{Node: node}

	for channelId, channel := range c.repository.Channels {

		//skip replica, which sends update
		if channelId != replicaId {
			log.Println("send update to subscriber: " + strconv.Itoa(channelId))
			channel <- &response
		}
	}

}

func main() {

	log.Println("starting go server ...")

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

		log.Println("close channel: " + strconv.Itoa(channelId))
		close(channel)
	}
}
