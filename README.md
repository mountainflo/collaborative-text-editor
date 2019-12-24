# collaborative-text-editor [![Build Status](https://travis-ci.com/mountainflo/collaborative-text-editor.svg?token=4zw9EzexndWUV9DTxZpz&branch=master)](https://travis-ci.com/mountainflo/collaborative-text-editor)
Collaborative Text Editor with gRPC

## Running the project

The project is built with docker-compose. Before getting started you have to install ```docker-compose```

```sh
docker-compose rm -f
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build # starting the dev env
```

The dev-configuration uses hot-reloads.

Open a browser tab, and go to: ```http://localhost:8081/index.html```

To shutdown: ```docker-compose down```


## Local development

### Compiling proto files for go

```sh
go get -u google.golang.org/grpc
go get -u github.com/golang/protobuf/protoc-gen-go

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
npm run build
```

### Debugging with docker

To open the console of a specific container run:

```sh
docker exec -it collaborative-text-editor_frontend-client_1 /bin/bash
```

The following command gives you a list of status of all containers:

```sh
docker-compose ps
```