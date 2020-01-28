const {TiTreeNode, Timestamp} = require('./collabTexteditorService_pb.js');
import * as localNode from "./model/tiTreeNode";
import * as localTimestamp from "./model/timestamp";

const LOG_OBJECT = "[modelTransformer] ";

/**
 * Change proto.collabTexteditorService.TiTreeNode to TiTreeNode.
 *
 * @param {proto.collabTexteditorService.TiTreeNode} protobufNode
 * @return {TiTreeNode} node
 */
function protobufNodeToTiTreeNode(protobufNode) {

    let protoNodeTimestamp = protobufNode.getTimestamp();
    let protoNodeParentTimestamp = protobufNode.getParenttimestamp();
    let protoNodeValue = protobufNode.getValue();
    let protoNodeTombstone = protobufNode.getTombstone();
    let protoNodeChildrenTimestamps = protobufNode.getChildrentimestampsList();

    let node = new localNode.TiTreeNode(
        protoNodeTimestamp.getReplicaid(),
        new localTimestamp.Timestamp(
            protoNodeParentTimestamp.getId(),
            protoNodeParentTimestamp.getReplicaid()),
        protoNodeValue,
        protoNodeTimestamp.getId(),
        protoNodeTombstone);

    protoNodeChildrenTimestamps.forEach(
        t => node.addChildTimestamp(
            new localTimestamp.Timestamp(t.getId(),t.getReplicaid()))
    );

    return node;
}

/**
 * Change TiTreeNode to proto.collabTexteditorService.TiTreeNode.
 *
 * @param {TiTreeNode} node
 * @return {proto.collabTexteditorService.TiTreeNode} protbufNode
 */
function tiTreeNodeToProtobufNode(node) {

    let protobufNode = new TiTreeNode();

    let timestamp = new TiTreeNode.Timestamp();
    timestamp.setReplicaid(node.getReplicaId());
    timestamp.setId(node.getId());
    protobufNode.setTimestamp(timestamp);

    let parentTimestamp = new TiTreeNode.Timestamp();
    parentTimestamp.setReplicaid(node.getParentNodeTimestamp().getReplicaId());
    parentTimestamp.setId(node.getParentNodeTimestamp().getId());
    protobufNode.setParenttimestamp(parentTimestamp);

    protobufNode.setValue(node.getValue());
    protobufNode.setTombstone(node.isTombstone());

    let childrenTimestamps = [];
    node.getChildrenTimestamps().forEach(
      t => {
          let timestamp = new TiTreeNode.Timestamp();
          timestamp.setReplicaid(t.getReplicaId());
          timestamp.setId(t.getId());
          childrenTimestamps.push(timestamp);
      }
    );

    protobufNode.setChildrentimestampsList(childrenTimestamps);

    return protobufNode;
}

export {tiTreeNodeToProtobufNode, protobufNodeToTiTreeNode};