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

//TODO if not possible to store subscriberStreams, use a simple blob-store also connected via gRPC
type server struct {
	pb.UnimplementedCollabTexteditorServiceServer
	subscriberStreams []pb.CollabTexteditorService_SubscribeToServerUpdateServer
	savedText         string
}

//TODO process TextUpdateRequest and send back a status message
func (s server) SendTextUpdate(ctx context.Context, request *pb.TextUpdateRequest) (*pb.TextUpdateReply, error) {

	s.savedText = request.TextUpdate

	log.Println("Server received test update: " + s.savedText)

	s.sendUpdateToSubscribers()

	return &pb.TextUpdateReply{StatusMessage: "Successfully received text update"}, nil
}

//TODO save client id and if server receives an update by SendTextUpdate, then stream the update
func (s server) SubscribeToServerUpdate(request *pb.ServerUpdateSubscriptionRequest, stream pb.CollabTexteditorService_SubscribeToServerUpdateServer) error {

	log.Println("Client " + strconv.Itoa(int(request.ClientId)) + " subscribes for updates")

	s.subscriberStreams = append(s.subscriberStreams, stream)

	//return nil //end the stream
	return nil
}

func (s server) sendUpdateToSubscribers() {

	log.Println("send update to subscribers")

	response := pb.ServerUpdateSubscriptionResponse{LatestServerContent: s.savedText}

	counter := 0

	for _, stream := range s.subscriberStreams {

		log.Println("send update to subscriber: " + strconv.Itoa(counter))

		if err := stream.Send(&response); err != nil {
			log.Printf(err.Error())
		}

		counter++
	}

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

	//TODO close subscriberStreams before shutdown (using signals)
}
