package main

import (
	pb "github.com/mountainflo/collaborative-text-editor/collabTexteditorService"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"log"
	"net"
	"strconv"
)

const (
	port = ":9090"
)

//TODO if not possible to store SubscriberStreams, use a simple blob-store also connected via gRPC
type collabTexteditorService struct {
	repository *Repository
}

type Repository struct {
	SavedText string
	Streams   []*pb.CollabTexteditorService_SubscribeToServerUpdateServer
}

//TODO process TextUpdateRequest and send back a status message
func (c collabTexteditorService) SendTextUpdate(ctx context.Context, request *pb.TextUpdateRequest) (*pb.TextUpdateReply, error) {

	c.repository.SavedText = request.TextUpdate

	log.Println("Server received test update: " + c.repository.SavedText)

	c.sendUpdateToSubscribers()

	return &pb.TextUpdateReply{StatusMessage: "Successfully received text update"}, nil
}

//TODO save client id and if collabTexteditorService receives an update by SendTextUpdate, then stream the update
func (c collabTexteditorService) SubscribeToServerUpdate(request *pb.ServerUpdateSubscriptionRequest, stream pb.CollabTexteditorService_SubscribeToServerUpdateServer) error {

	log.Println("Client " + strconv.Itoa(int(request.ClientId)) + " subscribes for updates")

	c.repository.Streams = append(c.repository.Streams, &stream)

	//return nil //end the stream
	return nil
}

func (c collabTexteditorService) sendUpdateToSubscribers() {

	log.Println("send update to subscribers")

	response := pb.ServerUpdateSubscriptionResponse{LatestServerContent: c.repository.SavedText}

	counter := 0

	for _, stream := range c.repository.Streams {

		log.Println("send update to subscriber: " + strconv.Itoa(counter))

		if err := (*stream).Send(&response); err != nil {
			log.Printf(err.Error())
		}

		counter++
	}

}

func main() {

	textStorage := &Repository{}
	repository := &collabTexteditorService{textStorage}

	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	// Creates a new gRPC collabTexteditorService
	s := grpc.NewServer()

	pb.RegisterCollabTexteditorServiceServer(s, repository)
	s.Serve(lis)

	//TODO close SubscriberStreams before shutdown (using signals and defer)
}
