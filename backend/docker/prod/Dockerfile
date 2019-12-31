# frontend client with prod-config

FROM collabtexteditor/go-server-common

WORKDIR /go/src/app/backend

COPY /backend/*.go .

RUN go build -o main .

EXPOSE 9090

CMD ["./main"]