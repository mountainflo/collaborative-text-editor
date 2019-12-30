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

# get delve for debugging
RUN go get github.com/go-delve/delve/cmd/dlv

# compile proto files
RUN protoc -I collabTexteditorService collabTexteditorService/collabTexteditorService.proto --go_out=plugins=grpc:collabTexteditorService



WORKDIR /go/src/app/backend

COPY /backend/*.go .

# TODO move debugging configuration to seperate docker file
# RUN go build -o main .
RUN go build -gcflags "all=-N -l" -o main .

# 40000 for delve
EXPOSE 9090 40000

#CMD ["./main"]
CMD ["/go/bin/dlv", "--listen=:40000", "--headless=true", "--api-version=2", "exec", "/go/src/app/backend/main"]