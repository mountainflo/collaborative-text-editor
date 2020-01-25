import {TiTree} from "../src/crdt/tiTree";
import {TiTreeNode} from "../src/model/tiTreeNode";

describe("TiTree", function () {

    beforeEach(function() {
        TiTreeNode.nextFreeId = 0;
    });

    it("reads when tree is empty", function () {
        let tiTree = new TiTree();

        let actual = tiTree.read();
        expect(actual).toBe("");
    });

    it("inserts root node when row is known", function () {
        let tiTree = new TiTree();
        let tiTreeNode = new TiTreeNode(1, null, "value");

        tiTree.insertNode(tiTreeNode,0);
        let insertedNode = tiTree.getNodeFromTimestamp(tiTreeNode.getTimestamp());

        expect(insertedNode).toBe(tiTreeNode);

        let sequence = tiTree.read();
        expect(sequence).toBe("value");
    });

    it("inserts node when row is known", function () {
        let tiTree = new TiTree();
        let tiTreeNode1 = new TiTreeNode(1, null, "value1");
        let tiTreeNode2 = new TiTreeNode(1, tiTreeNode1.getTimestamp(), "value2");

        tiTree.insertNode(tiTreeNode1,0);
        tiTree.insertNode(tiTreeNode2,0);

        let insertedNode1 = tiTree.getNodeFromTimestamp(tiTreeNode1.getTimestamp());
        let insertedNode2 = tiTree.getNodeFromTimestamp(tiTreeNode2.getTimestamp());

        expect(insertedNode1).toBe(tiTreeNode1);
        expect(insertedNode2).toBe(tiTreeNode2);

        let sequence = tiTree.read();
        expect(sequence).toBe("value1value2");
    });

    it("replaces root node when row is known", function () {
        let tiTree = new TiTree();
        let tiTreeNode1 = new TiTreeNode(1, null, "value1");
        let tiTreeNode2 = new TiTreeNode(1, null, "value2");

        tiTree.insertNode(tiTreeNode1,0);
        tiTree.insertNode(tiTreeNode2,0);

        let sequence = tiTree.read();
        expect(sequence).toBe("value2value1");
    });

    it("inserts node when row is known and it´s a newline", function () {
        let tiTree = new TiTree();
        let tiTreeNode1 = new TiTreeNode(1, null, "value1");
        let tiTreeNode2 = new TiTreeNode(1, tiTreeNode1.getTimestamp(), "\n");

        tiTree.insertNode(tiTreeNode1,0);
        tiTree.insertNode(tiTreeNode2,0);

        let sequence = tiTree.read();
        expect(sequence).toBe("value1\n");
    });

    it("deletes first node and mark it as tombstone", function () {
        let tiTree = new TiTree();
        let tiTreeNode = new TiTreeNode(1, null, "value");

        tiTree.insertNode(tiTreeNode);

        let sequence = tiTree.read();
        expect(sequence).toBe("value");

        tiTree.delete(tiTreeNode);
        sequence = tiTree.read();

        expect(tiTreeNode.isTombstone()).toBe(true);
        expect(sequence).toBe("");
    });

    it("deletes node somewhere in the tree", function () {
        let tiTree = new TiTree();
        let tiTreeNode1 = new TiTreeNode(1, null, "value1");
        let tiTreeNode2 = new TiTreeNode(1, tiTreeNode1.getTimestamp(), "\n");
        let tiTreeNode3 = new TiTreeNode(1, tiTreeNode2.getTimestamp(), "value3");

        tiTree.insertNode(tiTreeNode1,0);
        tiTree.insertNode(tiTreeNode2,0);
        tiTree.insertNode(tiTreeNode3,1);

        let sequence = tiTree.read();
        expect(sequence).toBe("value1\nvalue3");

        tiTree.delete(tiTreeNode2);
        sequence = tiTree.read();

        expect(tiTreeNode2.isTombstone()).toBe(true);
        expect(sequence).toBe("value1value3");
    });

    it("inserts node when row is unknown", function () {
        let tiTree = new TiTree();
        let tiTreeNode1 = new TiTreeNode(1, null, "value1");
        let tiTreeNode2 = new TiTreeNode(1, tiTreeNode1.getTimestamp(), "value2");

        tiTree.insertNode(tiTreeNode1);
        tiTree.insertNode(tiTreeNode2);

        let sequence = tiTree.read();
        expect(sequence).toBe("value1value2");
    });

    it("inserts node when row is unknown and it´s a newline", function () {
        let tiTree = new TiTree();
        let tiTreeNode1 = new TiTreeNode(1, null, "value1");
        let tiTreeNode2 = new TiTreeNode(1, tiTreeNode1.getTimestamp(), "value2");
        let tiTreeNode3 = new TiTreeNode(1, tiTreeNode2.getTimestamp(), "\n");
        let tiTreeNode4 = new TiTreeNode(1, tiTreeNode3.getTimestamp(), "value3");
        let tiTreeNode5 = new TiTreeNode(1, tiTreeNode1.getTimestamp(), "\n");

        tiTree.insertNode(tiTreeNode1);
        tiTree.insertNode(tiTreeNode2);
        tiTree.insertNode(tiTreeNode3);
        tiTree.insertNode(tiTreeNode4);
        tiTree.insertNode(tiTreeNode5);

        let sequence = tiTree.read();
        expect(sequence).toBe("value1\nvalue2\nvalue3");
    });

    it("inserts newline node at the end when row is unknown", function () {
        let tiTree = new TiTree();
        let tiTreeNode1 = new TiTreeNode(1, null, "value1");
        let tiTreeNode2 = new TiTreeNode(1, tiTreeNode1.getTimestamp(), "value2");
        let tiTreeNode3 = new TiTreeNode(1, tiTreeNode2.getTimestamp(), "\n");
        let tiTreeNode4 = new TiTreeNode(1, tiTreeNode3.getTimestamp(), "value3");
        let tiTreeNode5 = new TiTreeNode(1, tiTreeNode4.getTimestamp(), "\n");

        tiTree.insertNode(tiTreeNode1);
        tiTree.insertNode(tiTreeNode2);
        tiTree.insertNode(tiTreeNode3);
        tiTree.insertNode(tiTreeNode4);
        tiTree.insertNode(tiTreeNode5);

        let sequence = tiTree.read();
        expect(sequence).toBe("value1value2\nvalue3\n");
    });

    it("inserts newline string with known row", function () {
        let tiTree = new TiTree();
        let tiTreeNode1 = new TiTreeNode(1, null, "value1");
        let tiTreeNode2 = new TiTreeNode(1, tiTreeNode1.getTimestamp(), "value2");
        let tiTreeNode3 = new TiTreeNode(1, tiTreeNode2.getTimestamp(), "\n");
        let tiTreeNode4 = new TiTreeNode(1, tiTreeNode3.getTimestamp(), "value3");
        let tiTreeNode5 = new TiTreeNode(1, tiTreeNode4.getTimestamp(), "\n");

        tiTree.insertNode(tiTreeNode1);
        tiTree.insertNode(tiTreeNode2);
        tiTree.insertNode(tiTreeNode3);
        tiTree.insertNode(tiTreeNode4);
        tiTree.insertNode(tiTreeNode5);

        tiTree.insert(1,0,"\n",2);

        let sequence = tiTree.read();
        expect(sequence).toBe("value1value2\n\nvalue3\n");
    });

    it("inserts string in the second row", function () {
        let tiTree = new TiTree();
        let tiTreeNode1 = new TiTreeNode(1, null, "value1");
        let tiTreeNode2 = new TiTreeNode(1, tiTreeNode1.getTimestamp(), "value2");
        let tiTreeNode3 = new TiTreeNode(1, tiTreeNode2.getTimestamp(), "\n");
        let tiTreeNode4 = new TiTreeNode(1, tiTreeNode3.getTimestamp(), "value3");
        let tiTreeNode5 = new TiTreeNode(1, tiTreeNode4.getTimestamp(), "value4");

        tiTree.insertNode(tiTreeNode1);
        tiTree.insertNode(tiTreeNode2);
        tiTree.insertNode(tiTreeNode3);
        tiTree.insertNode(tiTreeNode4);
        tiTree.insertNode(tiTreeNode5);

        tiTree.insert(1,2,"newValue",2);

        let sequence = tiTree.read();
        expect(sequence).toBe("value1value2\nvalue3value4newValue");
    });

    it("inserts string in the first row", function () {
        let tiTree = new TiTree();
        let tiTreeNode1 = new TiTreeNode(1, null, "value1");
        let tiTreeNode2 = new TiTreeNode(1, tiTreeNode1.getTimestamp(), "value2");
        let tiTreeNode3 = new TiTreeNode(1, tiTreeNode2.getTimestamp(), "\n");
        let tiTreeNode4 = new TiTreeNode(1, tiTreeNode3.getTimestamp(), "value3");
        let tiTreeNode5 = new TiTreeNode(1, tiTreeNode4.getTimestamp(), "value4");

        tiTree.insertNode(tiTreeNode1);
        tiTree.insertNode(tiTreeNode2);
        tiTree.insertNode(tiTreeNode3);
        tiTree.insertNode(tiTreeNode4);
        tiTree.insertNode(tiTreeNode5);

        tiTree.insert(0,0,"NEW",2);

        let sequence = tiTree.read();
        expect(sequence).toBe("NEWvalue1value2\nvalue3value4");
    });

    it("inserts node into tree with tombstones", function () {
        let tiTree = new TiTree();
        let tiTreeNode1 = new TiTreeNode(1, null, "a");
        let tiTreeNode2 = new TiTreeNode(1, tiTreeNode1.getTimestamp(), "b");
        let tiTreeNode3 = new TiTreeNode(1, tiTreeNode2.getTimestamp(), "\n");
        let tiTreeNode4 = new TiTreeNode(1, tiTreeNode3.getTimestamp(), "c");
        let tiTreeNode5 = new TiTreeNode(1, tiTreeNode4.getTimestamp(), "d");
        let tiTreeNode6 = new TiTreeNode(1, tiTreeNode2.getTimestamp(), "\n");
        let tiTreeNode7 = new TiTreeNode(1, tiTreeNode2.getTimestamp(), "f");
        let tiTreeNode8 = new TiTreeNode(1, tiTreeNode7.getTimestamp(), "g");

        tiTree.insertNode(tiTreeNode1);
        tiTree.insertNode(tiTreeNode2);
        tiTree.insertNode(tiTreeNode3);
        tiTree.insertNode(tiTreeNode4);
        tiTree.insertNode(tiTreeNode5);

        let sequence = tiTree.read();
        expect(sequence).toBe("ab\ncd");

        tiTree.insertNode(tiTreeNode6);
        sequence = tiTree.read();
        expect(sequence).toBe("ab\n\ncd");

        tiTree.insertNode(tiTreeNode7);
        sequence = tiTree.read();
        expect(sequence).toBe("abf\n\ncd");

        tiTreeNode6.markAsTombstone();
        tiTreeNode7.markAsTombstone();
        sequence = tiTree.read();
        expect(sequence).toBe("ab\ncd");

        tiTree.insertNode(tiTreeNode8);
        sequence = tiTree.read();
        expect(sequence).toBe("abg\ncd");
    });
});