FROM golang
WORKDIR /
COPY . .
ENV CLIENT_HOST=:5000
ENV SERVER_HOST=grpcserver:50051
RUN go mod download
EXPOSE 5000
CMD ["go", "run", "client.go"]