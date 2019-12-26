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

type server struct {
	pb.UnimplementedCollabTexteditorServiceServer

	savedText string
}

//TODO process TextUpdateRequest and send back a status message
func (s server) SendTextUpdate(ctx context.Context, request *pb.TextUpdateRequest) (*pb.TextUpdateReply, error) {

	s.savedText = request.TextUpdate

	log.Println("Server received test update: " + s.savedText)

	return &pb.TextUpdateReply{StatusMessage: "Successfully received text update"}, nil
}

//TODO save client id and if server receives an update by SendTextUpdate, then stream the update
func (s server) SubscribeToServerUpdate(request *pb.ServerUpdateSubscriptionRequest, stream pb.CollabTexteditorService_SubscribeToServerUpdateServer) error {

	log.Println("Client " + strconv.Itoa(int(request.ClientId)) + " subscribes for updates")

	response := pb.ServerUpdateSubscriptionResponse{LatestServerContent: s.savedText}

	if err := stream.Send(&response); err != nil {
		return err
	}

	return nil //end the stream
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	// Creates a new gRPC server
	s := grpc.NewServer()

	pb.RegisterCollabTexteditorServiceServer(s, &server{})
	s.Serve(lis)
}
