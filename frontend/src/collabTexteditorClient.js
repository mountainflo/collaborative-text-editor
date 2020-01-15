const {TextUpdateRequest, TextUpdateReply, ServerUpdateSubscriptionRequest, ServerUpdateSubscriptionResponse} = require('./collabTexteditorService_pb.js');
const {CollabTexteditorServiceClient} = require('./collabTexteditorService_grpc_web_pb.js');

const LOG_OBJECT = "[cte service] ";

/**
 * Class for communicating with the collabTexteditor Service
 */
class CollabTexteditorClient {

    constructor(host) {
        this.collabTextEditorService = new CollabTexteditorServiceClient(host, '', '');
    }

    sendTextUpdate(text) {

        let request = new TextUpdateRequest();
        request.setTextupdate(text);

        console.log(LOG_OBJECT + "client sends: " + request.getTextupdate());

        this.collabTextEditorService.sendTextUpdate(request, {}, function(err, response) {
            if (err) {
                console.log(LOG_OBJECT + err.code);
                console.log(LOG_OBJECT + err.message);
            } else {
                console.log(LOG_OBJECT + "Client receives server response after sending text update: " + response);
            }
        })
    }

    async subscribeForUpdates(responseParagraphId){

        console.log(LOG_OBJECT + "subscribe for updates ...");

        let streamRequest = new ServerUpdateSubscriptionRequest();
        streamRequest.setClientid(99);  //TODO create unique id
        streamRequest.setSubscription(true);

        const RETRY_TIME_INTERVAL_IN_MS = 5000;
        while(true){

            let stream = this.collabTextEditorService.subscribeToServerUpdate(streamRequest, null);
            console.log(LOG_OBJECT + "opened new stream object", stream);

            await this.listenForUpdates(stream, responseParagraphId).then(
                function (error) {
                    console.log(LOG_OBJECT + error);
                }
            );

            console.log(LOG_OBJECT + "retry to open stream in " + RETRY_TIME_INTERVAL_IN_MS + "ms ...");
            await sleep(RETRY_TIME_INTERVAL_IN_MS);
        }
    }

    listenForUpdates(stream, responseParagraphId){
        return new Promise(
            resolve => {
                stream.on('data',function (response) {
                    console.log(LOG_OBJECT + "received stream data", response);
                    replaceTextInParagraph(responseParagraphId, response);
                });

                stream.on('error', function(err) {
                    resolve("Error code: " + err.code + " \"" + err.message + "\"");
                });

                stream.on('end', function() {
                    resolve("stream end signal received");
                });
            }
        )
    }



}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function replaceTextInParagraph(id, data){
    document.getElementById(id).innerHTML = data;
}

export { CollabTexteditorClient };