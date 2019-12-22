const {HelloRequest} = require('./greeter_service_pb.js');
const {GreeterClient} = require('./greeter_service_grpc_web_pb.js');

let greeterService = new GreeterClient('http://localhost:8080', "", "");

function sendHelloRequest() {
    let request = new HelloRequest();
    request.setName('Hello World!');

    let call = greeterService.sayHello(request, {}, function(err, response) {
        if (err) {
            console.log(err.code);
            console.log(err.message);
        } else {
            console.log(response.getName());
        }
    });

    call.on('status', function(status) {
        console.log(status.code);
        console.log(status.details);
    });
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