# go backend common

FROM golang:1.13


RUN apt-get -qq update && apt-get -qq install -y \
  unzip

WORKDIR /tmp

# install protobuf
RUN curl -sSL https://github.com/protocolbuffers/protobuf/releases/download/v3.11.2/\
protoc-3.11.2-linux-x86_64.zip -o protoc.zip && \
  unzip -qq protoc.zip && \
  cp ./bin/protoc /usr/local/bin/protoc



# get all proto files
WORKDIR /go/src/app/collabTexteditorService

COPY /collabTexteditorService/*.proto .



WORKDIR /go/src/app

COPY /go.mod /go.sum ./

RUN go mod download

# go protobuf plugin
RUN go get -u github.com/golang/protobuf/protoc-gen-go

# get delve for debugging
RUN go get github.com/go-delve/delve/cmd/dlv

# compile proto files
RUN protoc -I collabTexteditorService collabTexteditorService/collabTexteditorService.proto --go_out=plugins=grpc:collabTexteditorService
