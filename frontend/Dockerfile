# compile protoc files

FROM grpcweb/common

WORKDIR /github/grpc-web

COPY /commonjs-example commonjs-example

RUN protoc -I=. echo.proto \
--js_out=import_style=commonjs:./commonjs-example \
--grpc-web_out=import_style=commonjs,mode=grpcwebtext:./commonjs-example

WORKDIR /github/grpc-web/commonjs-example

RUN npm install && \
  npx webpack && \
  cp echotest.html /var/www/html && \
  cp dist/main.js /var/www/html/dist

WORKDIR /var/www/html

EXPOSE 8081
CMD ["python", "-m", "SimpleHTTPServer", "8081"]
