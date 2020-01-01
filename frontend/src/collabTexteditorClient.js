const {TextUpdateRequest, TextUpdateReply, ServerUpdateSubscriptionRequest, ServerUpdateSubscriptionResponse} = require('./collabTexteditorService_pb.js');
const {CollabTexteditorServiceClient} = require('./collabTexteditorService_grpc_web_pb.js');

class CollabTexteditorClient {

    constructor(host) {
        this.collabTextEditorService = new CollabTexteditorServiceClient(host, '', '');
    }

    sendTextUpdate(text) {

        let request = new TextUpdateRequest();
        request.setTextupdate(text);

        console.log("client sends: " + request.getTextupdate());

        this.collabTextEditorService.sendTextUpdate(request, {}, function(err, response) {
            if (err) {
                console.log(err.code);
                console.log(err.message);
            } else {
                console.log("Client receives server response after sending text update: " + response);
            }
        })
    }

    async subscribeForUpdates(responseParagraphId){

        console.log("subscribe for updates ...");

        let streamRequest = new ServerUpdateSubscriptionRequest();
        streamRequest.setClientid(99);
        streamRequest.setSubscription(true);

        let stream = this.collabTextEditorService.subscribeToServerUpdate(streamRequest, null);

        let error = await this.listenForUpdates(stream, responseParagraphId);
        console.log(error)
    }

    listenForUpdates(stream, responseParagraphId){
        return new Promise(
            resolve => {
                stream.on('data',function (response) {
                    console.log("received stream data", response);
                    replaceTextInParagraph(responseParagraphId, response);
                });

                stream.on('error', function(err) {
                    console.error('Error code: '+ err.code + ' \"' + err.message + '\"');
                });

                stream.on('end', function() {
                    //console.log("stream end signal received");
                    resolve("stream end signal received")
                });
            }
        )
    }



}

function replaceTextInParagraph(id, data){
    document.getElementById(id).innerHTML = data;
}

export { CollabTexteditorClient };