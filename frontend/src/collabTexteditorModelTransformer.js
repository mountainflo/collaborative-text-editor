const {TiTreeNode, Timestamp} = require('./collabTexteditorService_pb.js');
import * as localNode from "./model/tiTreeNode";
import * as localTimestamp from "./model/timestamp";


/**
 * Change proto.collabTexteditorService.TiTreeNode to TiTreeNode.
 *
 * @param protobufNode
 * @return node
 */
function protobufNodeToTiTreeNode(protobufNode) {

    let protoNodeTimestamp = protobufNode.getTimestamp();
    let protoNodeParentTimestamp = protobufNode.getParenttimestamp();
    let protoNodeValue = protobufNode.getValue();
    let protoNodeTombstone = protobufNode.getTombstone();
    let protoNodeChildrenTimestamps = protobufNode.getChildrentimestampsList();

    let localNode = new localNode.TiTreeNode(
        protoNodeTimestamp.getReplicaid(),
        new localTimestamp.Timestamp(
            protoNodeParentTimestamp.getId(),
            protoNodeParentTimestamp.getReplicaid()),
        protoNodeValue,
        protoNodeTimestamp.getId(),
        protoNodeTombstone);

    protoNodeChildrenTimestamps.forEach(
        t => localNode.addChildTimestamp(
            new localTimestamp.Timestamp(t.getId(),t.getReplicaid()))
    );

    return localNode;
}

/**
 * Change TiTreeNode to proto.collabTexteditorService.TiTreeNode.
 *
 * @param node
 * @return protbufNode
 */
function tiTreeNodeToProtobufNode(node) {

    let protobufNode = new TiTreeNode();

    let timestamp = new Timestamp();
    timestamp.setReplicaid(node.getReplicaId());
    timestamp.setId(node.getId());
    protobufNode.setTimestamp(timestamp);

    let parentTimestamp = new Timestamp();
    parentTimestamp.setReplicaid(node.getParentNodeTimestamp().getReplicaId());
    parentTimestamp.setId(node.getParentNodeTimestamp().getId());
    protobufNode.setTimestamp(parentTimestamp);

    protobufNode.setValue(node.getValue());
    protobufNode.setTombstone(node.isTombstone());

    let childrenTimestamps = [];
    node.getChildrenTimestamps().forEach(
      t => {
          let timestamp = new Timestamp();
          timestamp.setReplicaid(t.getReplicaId());
          timestamp.setId(t.getId());
          childrenTimestamps.push(timestamp);
      }
    );

    protobufNode.setChildrentimestampsList(childrenTimestamps);

    return protobufNode;
}

export {tiTreeNodeToProtobufNode, protobufNodeToTiTreeNode};