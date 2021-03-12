FROM golang
WORKDIR /
COPY . .
RUN go mod download
EXPOSE 5000
CMD ["go", "run", "client.go"]