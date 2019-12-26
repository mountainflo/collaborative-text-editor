# go backend

FROM golang:1.13


RUN apt-get -qq update && apt-get -qq install -y \
  unzip

WORKDIR /tmp

RUN curl -sSL https://github.com/protocolbuffers/protobuf/releases/download/v3.8.0/\
protoc-3.8.0-linux-x86_64.zip -o protoc.zip && \
  unzip -qq protoc.zip && \
  cp ./bin/protoc /usr/local/bin/protoc



# get all proto files
WORKDIR /go/src/app/collabTexteditorService

COPY /collabTexteditorService/*.proto .



WORKDIR /go/src/app

COPY /go.mod /go.sum ./

RUN go mod download

RUN go get -u github.com/golang/protobuf/protoc-gen-go

# compile proto files
RUN protoc -I collabTexteditorService collabTexteditorService/collabTexteditorService.proto --go_out=plugins=grpc:collabTexteditorService



WORKDIR /go/src/app/backend

COPY /backend/*.go .

RUN go build -o main .

EXPOSE 9090

CMD ["./main"]