import {TiTree} from "../src/crdt/tiTree";
import {TiTreeNode} from "../src/crdt/tiTreeNode";

describe("TiTree", function () {

    it("read returns empty string if tree is empty", function () {
        let tiTree = new TiTree();

        let actual = tiTree.read();
        expect(actual).toBe("");
    });

    /*it("root node can be inserted and read", function () {
        let tiTree = new TiTree();
        let tiTreeNode = new TiTreeNode(1, null, "value");

        tiTree.insert(tiTreeNode);
        let insertedNode = tiTree.getNodeFromTimestamp(tiTreeNode.getTimestamp());

        expect(insertedNode).toBe(tiTreeNode);

        let sequence = tiTree.read();
        expect(sequence).toBe("value");
    });

    it("can delete node and mark it as tombstone", function () {
        let tiTree = new TiTree();
        let tiTreeNode = new TiTreeNode(1, null, "value");

        tiTree.insert(tiTreeNode);

        let sequence = tiTree.read();
        expect(sequence).toBe("value");

        tiTree.delete(tiTreeNode.getTimestamp());
        sequence = tiTree.read();

        expect(tiTreeNode.isTombstone()).toBe(true);
        expect(sequence).toBe("");
    });*/


});