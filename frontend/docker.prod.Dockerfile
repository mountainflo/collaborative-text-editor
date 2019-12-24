# compile proto files and run client server

FROM collabtexteditor/common

WORKDIR /tmp

RUN protoc -I=. ./greeter_service.proto \
--js_out=import_style=commonjs:./ \
--grpc-web_out=import_style=commonjs,mode=grpcwebtext:./

WORKDIR /app/src

WORKDIR /app

COPY ./ ./

RUN cp /tmp/*pb.js /app/src

RUN npm install && \
    npm run build

EXPOSE 8081
CMD ["python", "-m", "SimpleHTTPServer", "8081"]