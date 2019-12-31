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
	SavedText         string
	Channels          map[int]chan *pb.ServerUpdateSubscriptionResponse
	NextFreeChannelId int //TODO use better unique id
}

//TODO process TextUpdateRequest and send back a status message
func (c collabTexteditorService) SendTextUpdate(ctx context.Context, request *pb.TextUpdateRequest) (*pb.TextUpdateReply, error) {

	c.repository.SavedText = request.TextUpdate

	log.Println("Server received test update: " + c.repository.SavedText)

	c.sendUpdateToSubscribers()

	return &pb.TextUpdateReply{StatusMessage: "Successfully received text update. New text has been sent to all subscribers"}, nil
}

//TODO save client id and if collabTexteditorService receives an update by SendTextUpdate, then stream the update
func (c collabTexteditorService) SubscribeToServerUpdate(request *pb.ServerUpdateSubscriptionRequest, stream pb.CollabTexteditorService_SubscribeToServerUpdateServer) error {

	log.Println("Client " + strconv.Itoa(int(request.ClientId)) + " subscribes for updates")

	channelId := c.createNewChannel()

	c.forwardChannelEventsToStream(channelId, stream)

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

//create new channel and return id
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

	textStorage := &Repository{SavedText: "", Channels: make(map[int]chan *pb.ServerUpdateSubscriptionResponse), NextFreeChannelId: 0}
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
