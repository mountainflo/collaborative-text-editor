const {HelloRequest, HelloReply} = require('./collabTexteditorService_pb.js');
const {GreeterClient} = require('./collabTexteditorService_grpc_web_pb.js');
import './styles/styles.css';

let greeterService = new GreeterClient('http://localhost:8080', "", "");

function sendHelloRequest() {
    let request = new HelloRequest();
    request.setName('Hello World!');

    let call = greeterService.sayHello(request, {}, function(err, response) {
        if (err) {
            console.log(err.code);
            console.log(err.message);
        } else {
            console.log("HELLO client received response from server");
            console.log(response.getMessage());
        }
    });

    /*call.on('status', function(status) {
        console.log(status.code);
        console.log(status.details);
    });*/
}


function addButtonListener(){
    document.getElementById("sayHello").addEventListener("click", function(){
        console.log("[INFO] button clicked, execute sendHelloRequest()");
        sendHelloRequest();
    });
}

window.onload=function() {
    addButtonListener();
};