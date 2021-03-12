package main

import (
	"context"
	"fmt"
	"log"
	"net"

	"grpctuiter/greet.pb"

	"google.golang.org/grpc"
)

type server struct{}

func (*server) Greet(ctx context.Context, req *greetpb.GreetRequest) (*greetpb.GreetResponse, error) {
	fmt.Printf("Llamada funcioncita con %v", req)
	firstName := req.GetGreeting().GetFirstName()
	result := "Hello, " + firstName
	res := &greetpb.GreetResponse{
		Result: result,
	}

	return res, nil
}

func main() {
	fmt.Println("Servidor iniciando en en http://localhost:50051")

	lis, err := net.Listen("tcp", "0.0.0.0:50051")
	if err != nil {
		log.Fatalf("Error iniciando el servidor: %v", err)
	}

	fmt.Println("Servidor iniciado, empezando server gRPC")
	s := grpc.NewServer()
	greetpb.RegisterGreetServiceServer(s, &server{})
	if err := s.Serve(lis); err != nil {
		log.Fatalf("Failed to serve %v", err)
	}

	defer fmt.Println("Servidor finalizado")
}
