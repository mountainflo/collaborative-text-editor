const {HelloRequest} = require('./greeter_service_pb.js');
const {GreeterServiceClient} = require('./greeter_service_grpc_web_pb.js');

var greeterService = new GreeterServiceClient('http://localhost:8080');


function sendHelloRequest() {
    var request = new HelloRequest();
    request.setName('Hello World!');

    var call = greeterService.sayHello(request, {}, function(err, response) {
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