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
        streamRequest.setClientid(99);
        streamRequest.setSubscription(true);

        let stream = this.collabTextEditorService.subscribeToServerUpdate(streamRequest, null);

        let error = await this.listenForUpdates(stream, responseParagraphId);
        console.log(LOG_OBJECT + error)
    }

    listenForUpdates(stream, responseParagraphId){
        return new Promise(
            resolve => {
                stream.on('data',function (response) {
                    console.log(LOG_OBJECT + "received stream data", response);
                    replaceTextInParagraph(responseParagraphId, response);
                });

                stream.on('error', function(err) {
                    console.error(LOG_OBJECT + 'Error code: '+ err.code + ' \"' + err.message + '\"');
                });

                stream.on('end', function() {
                    resolve(LOG_OBJECT, "stream end signal received")
                });
            }
        )
    }



}

function replaceTextInParagraph(id, data){
    document.getElementById(id).innerHTML = data;
}

export { CollabTexteditorClient };