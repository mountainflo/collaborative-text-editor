const {Empty, JoinSessionRequest, LocalUpdateRequest, RemoteUpdateRequest} = require('./collabTexteditorService_pb.js');
const {CollabTexteditorServiceClient} = require('./collabTexteditorService_grpc_web_pb.js');
import {
  protobufNodeToTiTreeNode,
  tiTreeNodeToProtobufNode,
} from './collabTexteditorModelTransformer';

const LOG_OBJECT = '[cte service] ';

/**
 * Class for communicating with the collabTexteditor Service
 */
class CollabTexteditorClient {
  constructor(host) {
    const _collabTextEditorService = new CollabTexteditorServiceClient(host, '', '');
    let _replicaId;
    let _sessionId;

    /**
     * @return {Promise<string>}
     */
    this.createSessionId = function() {
      return new Promise(
          (resolve) => {
            _collabTextEditorService.createSessionId(new Empty(), {}, function(err, response) {
              if (err) {
                console.error(LOG_OBJECT + err.message);
              } else {
                const sessionId = response.getSessionid();
                console.log(LOG_OBJECT + 'created new session', sessionId);
                resolve(sessionId);
              }
            },
            );
          },
      );
    };

    /**
     * Initialize collabTextEditorService joining a session and
     * requesting a replica id from the server.
     *
     * @param {string} sessionId
     * @param {string} nickName
     * @return {Promise<number>}
     */
    this.joinSession = async function(sessionId, nickName) {
      _sessionId = sessionId;

      console.debug(LOG_OBJECT + nickName + ' tries to join session', sessionId);

      return new Promise(
          (resolve) => {
            const request = new JoinSessionRequest();
            request.setSessionid(_sessionId);
            request.setNickname(nickName);

            _collabTextEditorService.joinSession(request, {}, function(err, response) {
              if (err) {
                console.warn(LOG_OBJECT + err.message);
                resolve(-1);
              } else {
                const replicaId = response.getReplicaid();
                console.log(LOG_OBJECT + 'joined session and received replicaId:', replicaId);
                _replicaId = replicaId;
                resolve(replicaId);
              }
            },
            );
          },
      );
    };

    /**
     * @param {TiTreeNode} node
     */
    this.sendLocalUpdate = function(node) {
      console.debug(LOG_OBJECT + 'sendLocalUpdate()', node.toString());

      const request = new LocalUpdateRequest();
      request.setNode(tiTreeNodeToProtobufNode(node));
      request.setReplicaid(_replicaId);
      request.setSessionid(_sessionId);

      _collabTextEditorService.sendLocalUpdate(request, {}, function(err, response) {
        if (err) {
          console.warn(LOG_OBJECT + err.code);
          console.warn(LOG_OBJECT + err.message);
        } else {
          console.debug(LOG_OBJECT + 'sendLocalUpdate() response message: ' + response);
        }
      });
    };

    this.getReplicaId = function() {
      if (_replicaId === undefined) {
        throw new Error('_replicaId is undefined. You have to request a replica id from the server');
      }
      return _replicaId;
    };

    this.getSessionId = function() {
      if (_sessionId === undefined) {
        throw new Error('_sessionId is undefined. You have to join a existing session or create a new one');
      }
      return _sessionId;
    };

    this.subscribeForUpdates = async function(callback) {
      console.log(LOG_OBJECT + 'subscribe for updates ...');

      const streamRequest = new RemoteUpdateRequest();
      streamRequest.setReplicaid(_replicaId);
      streamRequest.setSessionid(_sessionId);

      const RETRY_TIME_INTERVAL_IN_MS = 5000;
      while (true) {
        const stream = _collabTextEditorService.subscribeForRemoteUpdates(streamRequest, null);
        console.log(LOG_OBJECT + 'opened new stream object', stream);

        await listenForUpdates(stream, callback).then(
            function(error) {
              console.warn(LOG_OBJECT + error);
            },
        );

        console.log(LOG_OBJECT + 'retry to open stream in ' + RETRY_TIME_INTERVAL_IN_MS + 'ms ...');
        await sleep(RETRY_TIME_INTERVAL_IN_MS);
      }
    };

    const listenForUpdates = function(stream, callback) {
      return new Promise(
          (resolve) => {
            stream.on('data', function(response) {
              let node = response.getNode();
              if (node !== undefined) {
                node = protobufNodeToTiTreeNode(node);
              }
              callback(node, response.getSenderreplicaid(), response.getNickname());
            });

            stream.on('error', function(err) {
              resolve('Error code: ' + err.code + ' "' + err.message + '"');
            });

            stream.on('end', function() {
              resolve('stream end signal received');
            });
          },
      );
    };
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export {CollabTexteditorClient};
