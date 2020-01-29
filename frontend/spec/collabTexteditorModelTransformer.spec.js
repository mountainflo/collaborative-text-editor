import {tiTreeNodeToProtobufNode, protobufNodeToTiTreeNode} from "../src/collabTexteditorModelTransformer";
import * as localNode from "./../src/model/tiTreeNode";
import * as localTimestamp from "./../src/model/timestamp";
const {TiTreeNode, Timestamp} = require('./../src/collabTexteditorService_pb.js');

describe("Model-Transformer ", function () {

    it("should transform protobuf-Node to TiTreeNode", function () {

        let protoNode = new TiTreeNode();

        let protoNodeTimestamp = new TiTreeNode.Timestamp();
        protoNodeTimestamp.setId(11);
        protoNodeTimestamp.setReplicaid(1);
        protoNode.setTimestamp(protoNodeTimestamp);

        let protoNodeParentTimestamp = new TiTreeNode.Timestamp();
        protoNodeParentTimestamp.setId(12);
        protoNodeParentTimestamp.setReplicaid(1);
        protoNode.setParenttimestamp(protoNodeParentTimestamp);

        protoNode.setValue("a");
        protoNode.setTombstone(false);

        let protoNodeChild1Timestamp = new TiTreeNode.Timestamp();
        protoNodeChild1Timestamp.setId(23);
        protoNodeChild1Timestamp.setReplicaid(1);

        let protoNodeChild2Timestamp = new TiTreeNode.Timestamp();
        protoNodeChild1Timestamp.setId(24);
        protoNodeChild1Timestamp.setReplicaid(1);

        let protoNodeChildren = [];
        protoNodeChildren.push(protoNodeChild1Timestamp);
        protoNodeChildren.push(protoNodeChild2Timestamp);
        protoNode.setChildrentimestampsList(protoNodeChildren);

        let node = protobufNodeToTiTreeNode(protoNode);

        expect(node.getValue()).toBe(protoNode.getValue());
        expect(node.getReplicaId()).toBe(protoNode.getTimestamp().getReplicaid());
        expect(node.getId()).toBe(protoNode.getTimestamp().getId());
        expect(node.isTombstone()).toBe(protoNode.getTombstone());
        expect(node.getParentNodeTimestamp().getReplicaId())
            .toBe(protoNode.getParenttimestamp().getReplicaid());
        expect(node.getParentNodeTimestamp().getId())
            .toBe(protoNode.getParenttimestamp().getId());

        let nodeChildren = node.getChildrenTimestamps();

        expect(nodeChildren[0].getId()).toBe(protoNodeChildren[0].getId());
        expect(nodeChildren[0].getId()).toBe(protoNodeChildren[0].getId());
        expect(nodeChildren[1].getReplicaId()).toBe(protoNodeChildren[1].getReplicaid());
        expect(nodeChildren[1].getReplicaId()).toBe(protoNodeChildren[1].getReplicaid());
    });

    it("should transform protobuf-Node to TiTreeNode (no parent and no children)", function () {

        let protoNode = new TiTreeNode();

        let protoNodeTimestamp = new TiTreeNode.Timestamp();
        protoNodeTimestamp.setId(11);
        protoNodeTimestamp.setReplicaid(1);
        protoNode.setTimestamp(protoNodeTimestamp);

        protoNode.setValue("a");
        protoNode.setTombstone(false);

        let node = protobufNodeToTiTreeNode(protoNode);

        expect(node.getValue()).toBe(protoNode.getValue());
        expect(node.getReplicaId()).toBe(protoNode.getTimestamp().getReplicaid());
        expect(node.getId()).toBe(protoNode.getTimestamp().getId());
        expect(node.isTombstone()).toBe(protoNode.getTombstone());
        expect(node.getParentNodeTimestamp()).toBe(null);
        expect(node.getChildrenTimestamps().length).toBe(0);
    });

    it("should transform TiTreeNode to protobuf-Node", function () {

        let node = new localNode.TiTreeNode(
            1,
            new localTimestamp.Timestamp(2,3),
            "a",
            42,
            false);

        let nodeChild1 = new localNode.TiTreeNode(
            1,
            new localTimestamp.Timestamp(2,3),
            "b",
            24,
            true);

        let nodeChild2 = new localNode.TiTreeNode(
            1,
            new localTimestamp.Timestamp(2,3),
            "c",
            11,
            false);

        node.addChildTimestamp(nodeChild1.getTimestamp());
        node.addChildTimestamp(nodeChild2.getTimestamp());

        let protoNode = tiTreeNodeToProtobufNode(node);

        expect(protoNode.getValue()).toBe(node.getValue());
        expect(protoNode.getTimestamp().getReplicaid()).toBe(node.getReplicaId());
        expect(protoNode.getTimestamp().getId()).toBe(node.getId());
        expect(protoNode.getTombstone()).toBe(node.isTombstone());
        expect(protoNode.getParenttimestamp().getReplicaid())
            .toBe(node.getParentNodeTimestamp().getReplicaId());
        expect(protoNode.getParenttimestamp().getId())
            .toBe(node.getParentNodeTimestamp().getId());

        let protoNodeChildren = protoNode.getChildrentimestampsList();
        let nodeChildren =node.getChildrenTimestamps();

        expect(protoNodeChildren[0].getId()).toBe(nodeChildren[0].getId());
        expect(protoNodeChildren[0].getId()).toBe(nodeChildren[0].getId());
        expect(protoNodeChildren[1].getReplicaid()).toBe(nodeChildren[1].getReplicaId());
        expect(protoNodeChildren[1].getReplicaid()).toBe(nodeChildren[1].getReplicaId());
    });

    it("should transform TiTreeNode to protobuf-Node (no parent and no children)", function () {

        let node = new localNode.TiTreeNode(
            1,
            null,
            "a",
            42,
            false);

        let protoNode = tiTreeNodeToProtobufNode(node);

        expect(protoNode.getValue()).toBe(node.getValue());
        expect(protoNode.getTimestamp().getReplicaid()).toBe(node.getReplicaId());
        expect(protoNode.getTimestamp().getId()).toBe(node.getId());
        expect(protoNode.getTombstone()).toBe(node.isTombstone());
        expect(protoNode.getParenttimestamp()).toBe(undefined);
        expect(protoNode.getChildrentimestampsList().length).toBe(0);
    });

});