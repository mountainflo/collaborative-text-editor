# install "protoc" and the plugin "protoc-gen-grpc-web"

FROM collabtexteditor/chromium

WORKDIR /tmp

RUN apk -U --no-cache add protobuf@edge

RUN curl -sSL https://github.com/grpc/grpc-web/releases/download/1.0.7/\
protoc-gen-grpc-web-1.0.7-linux-x86_64 -o /usr/local/bin/protoc-gen-grpc-web && \
  chmod +x /usr/local/bin/protoc-gen-grpc-web

WORKDIR /tmp

COPY /collabTexteditorService/*.proto .