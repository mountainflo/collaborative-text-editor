# collaborative-text-editor
Collaborative Text Editor with gRPC

## Running project

```sh
docker-compose rm -f
docker-compose up --build -d
```

Open a browser tab, and go to: ```http://localhost:8081/index.html``

To shutdown: ```docker-compose down```

## Local development

### Compiling proto files for go

```sh
protoc -I greeterService/ proto/greeter_service.proto --go_out=plugins=grpc:proto
```

### Compiling proto files for js

```sh
protoc -I greeterService greeterService/greeter_service.proto \
--js_out=import_style=commonjs:./frontend \
--grpc-web_out=import_style=commonjs,mode=grpcwebtext:./frontend
```

### Compile js library and create main.js

```sh
npm install
npx webpack client.js
```
