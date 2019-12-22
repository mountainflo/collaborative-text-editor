# compile proto files and run client server

FROM collabtexteditor/common

WORKDIR /github/collaborative-text-editor/greeterService

COPY /greeterService/*.proto .

WORKDIR /github/collaborative-text-editor/

COPY /frontend/src ./frontend/src

COPY /frontend/index.html /frontend/package.json /frontend/webpack.development.config.js frontend/

RUN protoc -I=. ./greeterService/greeter_service.proto \
--js_out=import_style=commonjs:./frontend/src \
--grpc-web_out=import_style=commonjs,mode=grpcwebtext:./frontend/src

WORKDIR /github/collaborative-text-editor/frontend

RUN npm install && \
  npm run build && \
  cp index.html /var/www/html && \
  cp dist/main.js /var/www/html/dist

# TODO run http-server directly in the folder, to get auto updates of the files
# WORKDIR /var/www/html

# TODO ports can be passed bei ARG from docker-compose file
EXPOSE 8081
CMD ["python", "-m", "SimpleHTTPServer", "8081"]
