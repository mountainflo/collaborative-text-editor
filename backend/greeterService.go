package main

import (
	pb "github.com/mountainflo/collaborative-text-editor/greeterService"
	"golang.org/x/net/context"
	"google.golang.org/grpc"
	"log"
	"net"
)

const (
	port = ":9090"
)

type server struct {
	pb.UnimplementedGreeterServer
}

func (s server) SayHello(ctx context.Context, in *pb.HelloRequest) (*pb.HelloReply, error) {

	log.Println("HelloRequest from Client: " + in.Name)

	return &pb.HelloReply{Message: "hello world, this is an answer from the server"}, nil
}

func main() {
	lis, err := net.Listen("tcp", port)
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	// Creates a new gRPC server
	s := grpc.NewServer()

	pb.RegisterGreeterServer(s, &server{})
	s.Serve(lis)
}
