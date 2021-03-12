go get -u google.golang.org/grpc

go get -u github.com/golang/protobuf/protoc-gen-go

protoc greet.proto --go_out=plugins=grpc:.

go get github.com/golang/protobuf/proto
go get google.golang.org/grpc
go get google.golang.org/protobuf/reflect/protoreflect@v1.25.0
