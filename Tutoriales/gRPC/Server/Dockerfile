FROM golang
WORKDIR /
COPY . .
ENV HOST=0.0.0.0:50051
RUN go mod download
EXPOSE 50051
CMD ["go", "run", "server.go"]