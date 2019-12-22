# install "protoc" and the plugin "protoc-gen-grpc-web"

FROM node:10-stretch

RUN apt-get -qq update && apt-get -qq install -y \
  unzip

WORKDIR /tmp

RUN curl -sSL https://github.com/protocolbuffers/protobuf/releases/download/v3.8.0/\
protoc-3.8.0-linux-x86_64.zip -o protoc.zip && \
  unzip -qq protoc.zip && \
  cp ./bin/protoc /usr/local/bin/protoc

RUN curl -sSL https://github.com/grpc/grpc-web/releases/download/1.0.7/\
protoc-gen-grpc-web-1.0.7-linux-x86_64 -o /usr/local/bin/protoc-gen-grpc-web && \
  chmod +x /usr/local/bin/protoc-gen-grpc-web

WORKDIR /var/www/html/dist

# root dir the code runs
WORKDIR /github/grpc-web

# TODO copy code into root directory
COPY /echo.proto .
COPY /echoapp.js .

#RUN git clone https://github.com/grpc/grpc-web .
