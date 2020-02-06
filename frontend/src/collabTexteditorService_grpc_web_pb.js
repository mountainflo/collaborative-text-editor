/**
 * @fileoverview gRPC-Web generated client stub for collabTexteditorService
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');

const proto = {};
proto.collabTexteditorService = require('./collabTexteditorService_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.collabTexteditorService.CollabTexteditorServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.collabTexteditorService.CollabTexteditorServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.collabTexteditorService.JoinSessionRequest,
 *   !proto.collabTexteditorService.JoinSessionResponse>}
 */
const methodDescriptor_CollabTexteditorService_JoinSession = new grpc.web.MethodDescriptor(
  '/collabTexteditorService.CollabTexteditorService/JoinSession',
  grpc.web.MethodType.UNARY,
  proto.collabTexteditorService.JoinSessionRequest,
  proto.collabTexteditorService.JoinSessionResponse,
  /**
   * @param {!proto.collabTexteditorService.JoinSessionRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.collabTexteditorService.JoinSessionResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.collabTexteditorService.JoinSessionRequest,
 *   !proto.collabTexteditorService.JoinSessionResponse>}
 */
const methodInfo_CollabTexteditorService_JoinSession = new grpc.web.AbstractClientBase.MethodInfo(
  proto.collabTexteditorService.JoinSessionResponse,
  /**
   * @param {!proto.collabTexteditorService.JoinSessionRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.collabTexteditorService.JoinSessionResponse.deserializeBinary
);


/**
 * @param {!proto.collabTexteditorService.JoinSessionRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.collabTexteditorService.JoinSessionResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.collabTexteditorService.JoinSessionResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.collabTexteditorService.CollabTexteditorServiceClient.prototype.joinSession =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/collabTexteditorService.CollabTexteditorService/JoinSession',
      request,
      metadata || {},
      methodDescriptor_CollabTexteditorService_JoinSession,
      callback);
};


/**
 * @param {!proto.collabTexteditorService.JoinSessionRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.collabTexteditorService.JoinSessionResponse>}
 *     A native promise that resolves to the response
 */
proto.collabTexteditorService.CollabTexteditorServicePromiseClient.prototype.joinSession =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/collabTexteditorService.CollabTexteditorService/JoinSession',
      request,
      metadata || {},
      methodDescriptor_CollabTexteditorService_JoinSession);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.collabTexteditorService.Empty,
 *   !proto.collabTexteditorService.SessionResponse>}
 */
const methodDescriptor_CollabTexteditorService_CreateSessionId = new grpc.web.MethodDescriptor(
  '/collabTexteditorService.CollabTexteditorService/CreateSessionId',
  grpc.web.MethodType.UNARY,
  proto.collabTexteditorService.Empty,
  proto.collabTexteditorService.SessionResponse,
  /**
   * @param {!proto.collabTexteditorService.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.collabTexteditorService.SessionResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.collabTexteditorService.Empty,
 *   !proto.collabTexteditorService.SessionResponse>}
 */
const methodInfo_CollabTexteditorService_CreateSessionId = new grpc.web.AbstractClientBase.MethodInfo(
  proto.collabTexteditorService.SessionResponse,
  /**
   * @param {!proto.collabTexteditorService.Empty} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.collabTexteditorService.SessionResponse.deserializeBinary
);


/**
 * @param {!proto.collabTexteditorService.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.collabTexteditorService.SessionResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.collabTexteditorService.SessionResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.collabTexteditorService.CollabTexteditorServiceClient.prototype.createSessionId =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/collabTexteditorService.CollabTexteditorService/CreateSessionId',
      request,
      metadata || {},
      methodDescriptor_CollabTexteditorService_CreateSessionId,
      callback);
};


/**
 * @param {!proto.collabTexteditorService.Empty} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.collabTexteditorService.SessionResponse>}
 *     A native promise that resolves to the response
 */
proto.collabTexteditorService.CollabTexteditorServicePromiseClient.prototype.createSessionId =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/collabTexteditorService.CollabTexteditorService/CreateSessionId',
      request,
      metadata || {},
      methodDescriptor_CollabTexteditorService_CreateSessionId);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.collabTexteditorService.LocalUpdateRequest,
 *   !proto.collabTexteditorService.LocalUpdateReply>}
 */
const methodDescriptor_CollabTexteditorService_SendLocalUpdate = new grpc.web.MethodDescriptor(
  '/collabTexteditorService.CollabTexteditorService/SendLocalUpdate',
  grpc.web.MethodType.UNARY,
  proto.collabTexteditorService.LocalUpdateRequest,
  proto.collabTexteditorService.LocalUpdateReply,
  /**
   * @param {!proto.collabTexteditorService.LocalUpdateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.collabTexteditorService.LocalUpdateReply.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.collabTexteditorService.LocalUpdateRequest,
 *   !proto.collabTexteditorService.LocalUpdateReply>}
 */
const methodInfo_CollabTexteditorService_SendLocalUpdate = new grpc.web.AbstractClientBase.MethodInfo(
  proto.collabTexteditorService.LocalUpdateReply,
  /**
   * @param {!proto.collabTexteditorService.LocalUpdateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.collabTexteditorService.LocalUpdateReply.deserializeBinary
);


/**
 * @param {!proto.collabTexteditorService.LocalUpdateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.collabTexteditorService.LocalUpdateReply)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.collabTexteditorService.LocalUpdateReply>|undefined}
 *     The XHR Node Readable Stream
 */
proto.collabTexteditorService.CollabTexteditorServiceClient.prototype.sendLocalUpdate =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/collabTexteditorService.CollabTexteditorService/SendLocalUpdate',
      request,
      metadata || {},
      methodDescriptor_CollabTexteditorService_SendLocalUpdate,
      callback);
};


/**
 * @param {!proto.collabTexteditorService.LocalUpdateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.collabTexteditorService.LocalUpdateReply>}
 *     A native promise that resolves to the response
 */
proto.collabTexteditorService.CollabTexteditorServicePromiseClient.prototype.sendLocalUpdate =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/collabTexteditorService.CollabTexteditorService/SendLocalUpdate',
      request,
      metadata || {},
      methodDescriptor_CollabTexteditorService_SendLocalUpdate);
};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.collabTexteditorService.RemoteUpdateRequest,
 *   !proto.collabTexteditorService.RemoteUpdateResponse>}
 */
const methodDescriptor_CollabTexteditorService_SubscribeForRemoteUpdates = new grpc.web.MethodDescriptor(
  '/collabTexteditorService.CollabTexteditorService/SubscribeForRemoteUpdates',
  grpc.web.MethodType.SERVER_STREAMING,
  proto.collabTexteditorService.RemoteUpdateRequest,
  proto.collabTexteditorService.RemoteUpdateResponse,
  /**
   * @param {!proto.collabTexteditorService.RemoteUpdateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.collabTexteditorService.RemoteUpdateResponse.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.collabTexteditorService.RemoteUpdateRequest,
 *   !proto.collabTexteditorService.RemoteUpdateResponse>}
 */
const methodInfo_CollabTexteditorService_SubscribeForRemoteUpdates = new grpc.web.AbstractClientBase.MethodInfo(
  proto.collabTexteditorService.RemoteUpdateResponse,
  /**
   * @param {!proto.collabTexteditorService.RemoteUpdateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.collabTexteditorService.RemoteUpdateResponse.deserializeBinary
);


/**
 * @param {!proto.collabTexteditorService.RemoteUpdateRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.collabTexteditorService.RemoteUpdateResponse>}
 *     The XHR Node Readable Stream
 */
proto.collabTexteditorService.CollabTexteditorServiceClient.prototype.subscribeForRemoteUpdates =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/collabTexteditorService.CollabTexteditorService/SubscribeForRemoteUpdates',
      request,
      metadata || {},
      methodDescriptor_CollabTexteditorService_SubscribeForRemoteUpdates);
};


/**
 * @param {!proto.collabTexteditorService.RemoteUpdateRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.collabTexteditorService.RemoteUpdateResponse>}
 *     The XHR Node Readable Stream
 */
proto.collabTexteditorService.CollabTexteditorServicePromiseClient.prototype.subscribeForRemoteUpdates =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/collabTexteditorService.CollabTexteditorService/SubscribeForRemoteUpdates',
      request,
      metadata || {},
      methodDescriptor_CollabTexteditorService_SubscribeForRemoteUpdates);
};


module.exports = proto.collabTexteditorService;

