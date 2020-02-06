const {TiTreeNode} = require('./collabTexteditorService_pb.js');
import * as localNode from './model/tiTreeNode';
import * as localTimestamp from './model/timestamp';

/**
 * Change proto.collabTexteditorService.TiTreeNode to TiTreeNode.
 *
 * @param {proto.collabTexteditorService.TiTreeNode} protobufNode
 * @return {TiTreeNode} node
 */
function protobufNodeToTiTreeNode(protobufNode) {
  const protoNodeTimestamp = protobufNode.getTimestamp();
  const protoNodeParentTimestamp = protobufNode.getParenttimestamp();
  const protoNodeValue = protobufNode.getValue();
  const protoNodeTombstone = protobufNode.getTombstone();
  const protoNodeChildrenTimestamps = protobufNode.getChildrentimestampsList();

  let nodeParentTimestamp = null;

  if (protoNodeParentTimestamp !== undefined) {
    nodeParentTimestamp = new localTimestamp.Timestamp(
        protoNodeParentTimestamp.getId(),
        protoNodeParentTimestamp.getReplicaid());
  }

  const node = new localNode.TiTreeNode(
      protoNodeTimestamp.getReplicaid(),
      nodeParentTimestamp,
      protoNodeValue,
      protoNodeTimestamp.getId(),
      protoNodeTombstone);

  protoNodeChildrenTimestamps.forEach(
      (t) => node.addChildTimestamp(
          new localTimestamp.Timestamp(t.getId(), t.getReplicaid())),
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
  const protobufNode = new TiTreeNode();

  const timestamp = new TiTreeNode.Timestamp();
  timestamp.setReplicaid(node.getReplicaId());
  timestamp.setId(node.getId());
  protobufNode.setTimestamp(timestamp);

  const nodeParentNodeTimestamp = node.getParentNodeTimestamp();
  if (nodeParentNodeTimestamp !== null) {
    const parentTimestamp = new TiTreeNode.Timestamp();
    parentTimestamp.setReplicaid(node.getParentNodeTimestamp().getReplicaId());
    parentTimestamp.setId(node.getParentNodeTimestamp().getId());
    protobufNode.setParenttimestamp(parentTimestamp);
  }

  protobufNode.setValue(node.getValue());
  protobufNode.setTombstone(node.isTombstone());

  const childrenTimestamps = [];
  node.getChildrenTimestamps().forEach(
      (t) => {
        const timestamp = new TiTreeNode.Timestamp();
        timestamp.setReplicaid(t.getReplicaId());
        timestamp.setId(t.getId());
        childrenTimestamps.push(timestamp);
      },
  );

  protobufNode.setChildrentimestampsList(childrenTimestamps);

  return protobufNode;
}

export {tiTreeNodeToProtobufNode, protobufNodeToTiTreeNode};
