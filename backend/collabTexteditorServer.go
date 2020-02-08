package main

import (
	"crypto/rand"
	"encoding/base32"
	"errors"
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
	Sessions map[string]*Session
}

type Session struct {
	NextFreeReplicaId int
	Replicas          map[int]*Replica
	History           []*pb.RemoteUpdateResponse
}

type Replica struct {
	ReplicaId int
	NickName  string
	Channel   chan *pb.RemoteUpdateResponse
}

func (c collabTexteditorService) CreateSessionId(ctx context.Context, request *pb.Empty) (*pb.SessionResponse, error) {

	sessionId := getUniqueSessionToken(10)

	//TODO delete session if not used for a specific time period
	c.repository.Sessions[sessionId] = &Session{
		NextFreeReplicaId: 0,
		Replicas:          make(map[int]*Replica),
		History:           []*pb.RemoteUpdateResponse{},
	}

	return &pb.SessionResponse{SessionId: sessionId}, nil
}

func (c collabTexteditorService) JoinSession(ctx context.Context, request *pb.JoinSessionRequest) (*pb.JoinSessionResponse, error) {

	session, ok := c.repository.Sessions[request.SessionId]

	if ok {
		newReplicaId := session.NextFreeReplicaId
		session.NextFreeReplicaId += 1

		session.Replicas[newReplicaId] = &Replica{
			ReplicaId: newReplicaId,
			NickName:  request.NickName,
		}

		return &pb.JoinSessionResponse{ReplicaId: int64(newReplicaId)}, nil
	} else {
		log.Printf("[sessionId=%v] session id does not exist\n", request.SessionId)
		return nil, errors.New("session id does not exist")
	}
}

func (c collabTexteditorService) SendLocalUpdate(ctx context.Context, request *pb.LocalUpdateRequest) (*pb.LocalUpdateReply, error) {

	log.Printf("[sessionId=%v] replica %v sent local update\n", request.SessionId, request.ReplicaId)

	c.sendUpdateToSubscribers(request.Node, request.SessionId, int(request.ReplicaId))

	//TODO could return *pb.Empty, but a message has to be sent either way
	return &pb.LocalUpdateReply{StatusMessage: "Successfully received local update"}, nil
}

// Clients subscribe to updates by opening a server-side-stream
func (c collabTexteditorService) SubscribeForRemoteUpdates(request *pb.RemoteUpdateRequest, stream pb.CollabTexteditorService_SubscribeForRemoteUpdatesServer) error {

	replicaId := int(request.ReplicaId)

	log.Printf("[sessionId=%v] replica %v subscribes for remote updates\n", request.SessionId, replicaId)

	history := c.repository.Sessions[request.SessionId].History

	for _, remoteUpdateResponse := range history {
		if err := stream.Send(remoteUpdateResponse); err != nil {
			log.Printf(err.Error())
		}
	}

	c.createNewChannel(request.SessionId, replicaId)

	c.forwardChannelEventsToStream(request.SessionId, replicaId, stream) // func returns only if stream/channel is closed or an error occurs

	//remove replica from session, if all replicas have left the session then remove the session
	delete(c.repository.Sessions[request.SessionId].Replicas, replicaId)

	if len(c.repository.Sessions) == 0 {
		log.Printf("[sessionId=%v] closing session\n", request.SessionId)
		delete(c.repository.Sessions, request.SessionId)
	}

	return nil
}

func (c collabTexteditorService) forwardChannelEventsToStream(sessionId string, replicaId int, stream pb.CollabTexteditorService_SubscribeForRemoteUpdatesServer) {
	for {
		select {
		case <-stream.Context().Done():
			log.Printf("[sessionId=%v] [replicaId=%v] Context of stream closed\n", sessionId, replicaId)
			//TODO save channelId with last remoteUpdateResponse. Tag last send response in history with channelId
			return
		case remoteUpdateResponse, ok := <-c.repository.Sessions[sessionId].Replicas[replicaId].Channel:
			if !ok {
				log.Printf("[sessionId=%v] [replicaId=%v] Channel closed\n", sessionId, replicaId)
				return
			}
			if err := stream.Send(remoteUpdateResponse); err != nil {
				log.Printf(err.Error())
				return
			}
		}
	}
}

func (c collabTexteditorService) createNewChannel(sessionId string, replicaId int) {

	channel := make(chan *pb.RemoteUpdateResponse)

	c.repository.Sessions[sessionId].Replicas[replicaId].Channel = channel

}

func (c collabTexteditorService) sendUpdateToSubscribers(node *pb.TiTreeNode, sessionId string, replicaId int) {

	log.Printf("[sessionId=%v] Send update to subscribers\n", sessionId)

	session := c.repository.Sessions[sessionId]

	nickName := session.Replicas[replicaId].NickName
	response := pb.RemoteUpdateResponse{SenderReplicaId: int64(replicaId), Node: node, Nickname: nickName}
	session.History = append(session.History, &response)

	for _, replica := range session.Replicas {
		//skip replica, which sends update
		if replica.ReplicaId != int(replicaId) {
			replica.Channel <- &response
		}
	}
}

func getUniqueSessionToken(length int) string {
	randomBytes := make([]byte, 32)
	_, err := rand.Read(randomBytes)
	if err != nil {
		panic(err)
	}
	return base32.StdEncoding.EncodeToString(randomBytes)[:length]
}

func main() {

	log.Println("Starting go server ...")

	serverData := &Repository{Sessions: make(map[string]*Session)}
	repository := &collabTexteditorService{serverData}

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
	for sessionId, session := range repository.repository.Sessions {
		log.Printf("[sessionId=%v] Close channel", sessionId)
		for _, replica := range session.Replicas {
			close(replica.Channel)
		}
	}
}
