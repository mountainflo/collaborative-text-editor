# compile proto files and run client server

FROM collabtexteditor/common

WORKDIR /tmp

RUN protoc -I=. ./greeter_service.proto \
--js_out=import_style=commonjs:./ \
--grpc-web_out=import_style=commonjs,mode=grpcwebtext:./

WORKDIR /app/src

WORKDIR /app

COPY ./package-lock.json ./package.json ./webpack.development.config.js ./

EXPOSE 8081

CMD cp /tmp/*pb.js /app/src && \
    npm install && \
    npm run build:dev && \
    npm run start:dev
