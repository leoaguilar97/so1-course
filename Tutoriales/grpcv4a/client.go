package main

import (
	"context"

	"fmt"
	"log"

	"tuiterclient/greet.pb"

	"google.golang.org/grpc"
)

type server struct{}

func main() {
	fmt.Println("Cliente iniciado")

	cc, err := grpc.Dial("0.0.0.0:50051", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Failed to listen: %v", err)
	}

	defer cc.Close()

	c := greetpb.NewGreetServiceClient(cc)
	doUnary(c)
}

func doUnary(c greetpb.GreetServiceClient) {
	fmt.Println("Iniciando llamada a Unary RPC")
	req := &greetpb.GreetRequest{
		Greeting: &greetpb.Greeting{
			FirstName: "Leonel",
			Message:   "Helloooo!",
		},
	}

	res, err := c.Greet(context.Background(), req)
	if err != nil {
		log.Fatalf("Failed to request: %v", err)
	}

	log.Printf("Response from Greet: %v", res.Result)
}
