package main

import (
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
	SavedText         string
	Channels          map[int]chan *pb.ServerUpdateSubscriptionResponse
	NextFreeChannelId int //TODO use better unique id
}

// Process unary calls with TextUpdateRequest.
// Each subscriber gets the new text.
func (c collabTexteditorService) SendTextUpdate(ctx context.Context, request *pb.TextUpdateRequest) (*pb.TextUpdateReply, error) {

	c.repository.SavedText = request.TextUpdate

	log.Println("Server received test update: " + c.repository.SavedText)

	c.sendUpdateToSubscribers()

	return &pb.TextUpdateReply{StatusMessage: "Successfully received text update. New text has been sent to all subscribers"}, nil
}

// Clients subscribe to updates by opening a server-side-stream
func (c collabTexteditorService) SubscribeToServerUpdate(request *pb.ServerUpdateSubscriptionRequest, stream pb.CollabTexteditorService_SubscribeToServerUpdateServer) error {

	log.Println("Client " + strconv.Itoa(int(request.ClientId)) + " subscribes for updates")

	//TODO new client gets transferred all change events. Go server has to store the event history

	channelId := c.createNewChannel()

	c.forwardChannelEventsToStream(channelId, stream) // func returns only if stream/channel is closed or an error occurs

	delete(c.repository.Channels, channelId)

	return nil
}

func (c collabTexteditorService) forwardChannelEventsToStream(channelId int, stream pb.CollabTexteditorService_SubscribeToServerUpdateServer) {
	for {
		select {
		case <-stream.Context().Done():
			log.Println("Context of stream closed")
			return
		case updateEvent, ok := <-c.repository.Channels[channelId]: // TODO test if element is present. elem, ok = m[key]
			if !ok {
				log.Println("Channel is closed")
				return
			}
			if err := stream.Send(updateEvent); err != nil {
				log.Printf(err.Error())
				return
			}
		}
	}
}

func (c collabTexteditorService) createNewChannel() int {

	channel := make(chan *pb.ServerUpdateSubscriptionResponse)

	idOfNewChannel := c.repository.NextFreeChannelId

	c.repository.Channels[idOfNewChannel] = channel

	c.repository.NextFreeChannelId++

	return idOfNewChannel
}

func (c collabTexteditorService) sendUpdateToSubscribers() {

	log.Println("send update to subscribers")

	response := pb.ServerUpdateSubscriptionResponse{LatestServerContent: c.repository.SavedText}

	for channelId, channel := range c.repository.Channels {

		log.Println("send update to subscriber: " + strconv.Itoa(channelId))

		channel <- &response
	}

}

func main() {

	log.Println("starting go server ...")

	textStorage := &Repository{SavedText: "", Channels: make(map[int]chan *pb.ServerUpdateSubscriptionResponse), NextFreeChannelId: 0}
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
