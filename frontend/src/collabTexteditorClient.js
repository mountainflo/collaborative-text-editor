const {Empty, ReplicaResponse, LocalUpdateRequest, LocalUpdateReply, RemoteUpdateRequest, RemoteUpdateResponse, TiTreeNode, Timestamp} = require('./collabTexteditorService_pb.js');
const {CollabTexteditorServiceClient} = require('./collabTexteditorService_grpc_web_pb.js');
import {protobufNodeToTiTreeNode, tiTreeNodeToProtobufNode} from "./collabTexteditorModelTransformer";

const LOG_OBJECT = "[cte service] ";

/**
 * Class for communicating with the collabTexteditor Service
 */
class CollabTexteditorClient {

    constructor(host) {
        let _collabTextEditorService = new CollabTexteditorServiceClient(host, '', '');
        let _replicaId;

        /**
         * Initialize collabTextEditorService by requesting a replica id from the server.
         * @return {Promise<number>}
         */
        this.requestReplicaId = async function(){
            return new Promise(
                resolve => {
                    _collabTextEditorService.createReplicaId(new Empty(), {}, function (err, response) {
                            if (err) {
                                console.log(LOG_OBJECT + err.code);
                                console.log(LOG_OBJECT + err.message);
                                //reject if error occurs
                            } else {
                                let replicaId = response.getReplicaid();
                                console.log(LOG_OBJECT + "new received replicaId:", replicaId);
                                _replicaId = replicaId;
                                resolve(replicaId);
                            }
                        }
                    );
                }
            );
        };

        /**
         * @param {TiTreeNode} node
         */
        this.sendLocalUpdate = function(node) {

            console.debug(LOG_OBJECT + "sendLocalUpdate()", node.toString());

            let request = new LocalUpdateRequest();
            request.setNode(tiTreeNodeToProtobufNode(node));
            request.setReplicaid(_replicaId);

            _collabTextEditorService.sendLocalUpdate(request, {}, function(err, response) {
                if (err) {
                    console.log(LOG_OBJECT + err.code);
                    console.log(LOG_OBJECT + err.message);
                } else {
                    console.debug(LOG_OBJECT + "sendLocalUpdate() response message: " + response);
                }
            });
        };

        this.getReplicaId = function () {
            if (_replicaId === undefined) {
                throw new Error("_replicaId is undefined. You have to request a replica id from the server");
            }
            return _replicaId;
        };

        this.subscribeForUpdates = async function(callback){

            console.log(LOG_OBJECT + "subscribe for updates ...");

            let streamRequest = new RemoteUpdateRequest();
            streamRequest.setReplicaid(_replicaId);

            const RETRY_TIME_INTERVAL_IN_MS = 5000;
            while(true){

                let stream = _collabTextEditorService.subscribeForRemoteUpdates(streamRequest, null);
                console.log(LOG_OBJECT + "opened new stream object", stream);

                await listenForUpdates(stream, callback).then(
                    function (error) {
                        console.log(LOG_OBJECT + error);
                    }
                );

                console.log(LOG_OBJECT + "retry to open stream in " + RETRY_TIME_INTERVAL_IN_MS + "ms ...");
                await sleep(RETRY_TIME_INTERVAL_IN_MS);
            }
        };

        let listenForUpdates = function(stream, callback){
            return new Promise(
                resolve => {
                    stream.on('data',function (response) {
                        let tiTreeNode = protobufNodeToTiTreeNode(response.getNode());
                        callback(tiTreeNode);
                    });

                    stream.on('error', function(err) {
                        resolve("Error code: " + err.code + " \"" + err.message + "\"");
                    });

                    stream.on('end', function() {
                        resolve("stream end signal received");
                    });
                }
            )
        };
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export { CollabTexteditorClient };