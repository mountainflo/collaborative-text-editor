# collaborative-text-editor [![Build Status](https://travis-ci.com/mountainflo/collaborative-text-editor.svg?token=4zw9EzexndWUV9DTxZpz&branch=master)](https://travis-ci.com/mountainflo/collaborative-text-editor)
Collaborative Text Editor with gRPC and gRPC Web

## Running the project

The project is built with docker-compose. Before getting started you have to install ```docker-compose```

```sh
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

Open a browser tab, and go to: ```http://localhost:8081/index.html```

To shutdown: ```docker-compose down```


## Local development

### Remote debugging and hot reloads

The dev-configuration uses hot-reloads (for js and css files) and offers remote debugging for go files with `delve`.

Create a "Go Remote Debugging"-Configuration in your IDE and listen to port `40000`.

```sh
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```


### Compiling proto files for go

```sh
go get -u google.golang.org/grpc
go get -u github.com/golang/protobuf/protoc-gen-go

protoc -I collabTexteditorService/ collabTexteditorService/collabTexteditorService.proto --go_out=plugins=grpc:collabTexteditorService
```

### Compiling proto files for js

```sh
protoc -I collabTexteditorService collabTexteditorService/collabTexteditorService.proto \
--js_out=import_style=commonjs:./frontend/src \
--grpc-web_out=import_style=commonjs,mode=grpcwebtext:./frontend/src
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

### Bundling and building js-Frontend

```sh
npm install
npm run build
```
