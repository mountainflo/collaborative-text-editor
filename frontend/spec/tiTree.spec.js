import {TiTree} from "../src/crdt/tiTree";
import {TiTreeNode} from "../src/model/tiTreeNode";
import {Position} from "../src/model/position";

/**
 * @param {Position} pos
 * @param {number} row
 * @param {number} ch
 */
function checkPosition(pos, row, ch){
    expect(pos.getRow()).toBe(row);
    expect(pos.getColumn()).toBe(ch);
}

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

        checkPosition(tiTree.insertNode(tiTreeNode), 0,0);
        let insertedNode = tiTree.getNodeFromTimestamp(tiTreeNode.getTimestamp());

        expect(insertedNode).toBe(tiTreeNode);

        let sequence = tiTree.read();
        expect(sequence).toBe("value");
    });

    it("inserts node when row is known", function () {
        let tiTree = new TiTree();
        let tiTreeNode1 = new TiTreeNode(1, null, "value1");
        let tiTreeNode2 = new TiTreeNode(1, tiTreeNode1.getTimestamp(), "value2");

        checkPosition(tiTree.insertNode(tiTreeNode1), 0,0);
        checkPosition(tiTree.insertNode(tiTreeNode2), 0,1);

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

        checkPosition(tiTree.insertNode(tiTreeNode1), 0,0);
        checkPosition(tiTree.insertNode(tiTreeNode2), 0,0);

        let sequence = tiTree.read();
        expect(sequence).toBe("value2value1");
    });

    it("inserts node when row is known and it´s a newline", function () {
        let tiTree = new TiTree();
        let tiTreeNode1 = new TiTreeNode(1, null, "value1");
        let tiTreeNode2 = new TiTreeNode(1, tiTreeNode1.getTimestamp(), "\n");

        checkPosition(tiTree.insertNode(tiTreeNode1), 0,0);
        checkPosition(tiTree.insertNode(tiTreeNode2), 0,1);

        let sequence = tiTree.read();
        expect(sequence).toBe("value1\n");
    });

    it("deletes first node and mark it as tombstone", function () {
        let tiTree = new TiTree();
        let tiTreeNode = new TiTreeNode(1, null, "value");

        checkPosition(tiTree.insertNode(tiTreeNode), 0,0);

        let sequence = tiTree.read();
        expect(sequence).toBe("value");

        checkPosition(tiTree.deleteNode(tiTreeNode), 0,0);
        sequence = tiTree.read();

        expect(tiTreeNode.isTombstone()).toBe(true);
        expect(sequence).toBe("");
    });

    it("deletes node somewhere in the tree", function () {
        let tiTree = new TiTree();
        let tiTreeNode1 = new TiTreeNode(1, null, "value1");
        let tiTreeNode2 = new TiTreeNode(1, tiTreeNode1.getTimestamp(), "\n");
        let tiTreeNode3 = new TiTreeNode(1, tiTreeNode2.getTimestamp(), "value3");

        checkPosition(tiTree.insertNode(tiTreeNode1), 0,0);
        checkPosition(tiTree.insertNode(tiTreeNode2), 0,1);
        checkPosition(tiTree.insertNode(tiTreeNode3), 1,0);

        let sequence = tiTree.read();
        expect(sequence).toBe("value1\nvalue3");

        checkPosition(tiTree.deleteNode(tiTreeNode2), 0,1);
        sequence = tiTree.read();

        expect(tiTreeNode2.isTombstone()).toBe(true);
        expect(sequence).toBe("value1value3");
    });

    it("inserts node when row is unknown", function () {
        let tiTree = new TiTree();
        let tiTreeNode1 = new TiTreeNode(1, null, "value1");
        let tiTreeNode2 = new TiTreeNode(1, tiTreeNode1.getTimestamp(), "value2");

        checkPosition(tiTree.insertNode(tiTreeNode1), 0,0);
        checkPosition(tiTree.insertNode(tiTreeNode2), 0,1);

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

        checkPosition(tiTree.insertNode(tiTreeNode1), 0,0);
        checkPosition(tiTree.insertNode(tiTreeNode2), 0,1);
        checkPosition(tiTree.insertNode(tiTreeNode3), 0,2);
        checkPosition(tiTree.insertNode(tiTreeNode4), 1,0);
        checkPosition(tiTree.insertNode(tiTreeNode5), 0,1);

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

        checkPosition(tiTree.insertNode(tiTreeNode1), 0,0);
        checkPosition(tiTree.insertNode(tiTreeNode2), 0,1);
        checkPosition(tiTree.insertNode(tiTreeNode3), 0,2);
        checkPosition(tiTree.insertNode(tiTreeNode4), 1,0);
        checkPosition(tiTree.insertNode(tiTreeNode5), 1,1);

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

        checkPosition(tiTree.insertNode(tiTreeNode1), 0,0);
        checkPosition(tiTree.insertNode(tiTreeNode2), 0,1);
        checkPosition(tiTree.insertNode(tiTreeNode3), 0,2);
        checkPosition(tiTree.insertNode(tiTreeNode4), 1,0);
        checkPosition(tiTree.insertNode(tiTreeNode5), 1,1);

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

        checkPosition(tiTree.insertNode(tiTreeNode1), 0,0);
        checkPosition(tiTree.insertNode(tiTreeNode2), 0,1);
        checkPosition(tiTree.insertNode(tiTreeNode3), 0,2);
        checkPosition(tiTree.insertNode(tiTreeNode4), 1,0);
        checkPosition(tiTree.insertNode(tiTreeNode5), 1,1);

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

        checkPosition(tiTree.insertNode(tiTreeNode1), 0,0);
        checkPosition(tiTree.insertNode(tiTreeNode2), 0,1);
        checkPosition(tiTree.insertNode(tiTreeNode3), 0,2);
        checkPosition(tiTree.insertNode(tiTreeNode4), 1,0);
        checkPosition(tiTree.insertNode(tiTreeNode5), 1,1);

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

        checkPosition(tiTree.insertNode(tiTreeNode1), 0,0);
        checkPosition(tiTree.insertNode(tiTreeNode2), 0,1);
        checkPosition(tiTree.insertNode(tiTreeNode3), 0,2);
        checkPosition(tiTree.insertNode(tiTreeNode4), 1,0);
        checkPosition(tiTree.insertNode(tiTreeNode5), 1,1);

        let sequence = tiTree.read();
        expect(sequence).toBe("ab\ncd");

        checkPosition(tiTree.insertNode(tiTreeNode6), 0,2);
        sequence = tiTree.read();
        expect(sequence).toBe("ab\n\ncd");

        checkPosition(tiTree.insertNode(tiTreeNode7), 0,2);
        sequence = tiTree.read();
        expect(sequence).toBe("abf\n\ncd");

        tiTreeNode6.markAsTombstone();
        tiTreeNode7.markAsTombstone();
        sequence = tiTree.read();
        expect(sequence).toBe("ab\ncd");

        checkPosition(tiTree.insertNode(tiTreeNode8), 0,2);
        sequence = tiTree.read();
        expect(sequence).toBe("abg\ncd");
    });

    it("deletes root char and mark it as tombstone", function () {
        let tiTree = new TiTree();
        let tiTreeNode = new TiTreeNode(1, null, "value");

        checkPosition(tiTree.insertNode(tiTreeNode), 0,0);

        let sequence = tiTree.read();
        expect(sequence).toBe("value");

        let deletedNode = tiTree.delete(0,0);
        sequence = tiTree.read();

        expect(deletedNode.getTimestamp()).toBe(tiTreeNode.getTimestamp());
        expect(tiTreeNode.isTombstone()).toBe(true);
        expect(sequence).toBe("");
    });

    it("deletes char somewhere in the tree", function () {
        let tiTree = new TiTree();
        let tiTreeNode1 = new TiTreeNode(1, null, "value1");
        let tiTreeNode2 = new TiTreeNode(1, tiTreeNode1.getTimestamp(), "\n");
        let tiTreeNode3 = new TiTreeNode(1, tiTreeNode2.getTimestamp(), "value3");

        checkPosition(tiTree.insertNode(tiTreeNode1), 0,0);
        checkPosition(tiTree.insertNode(tiTreeNode2), 0,1);
        checkPosition(tiTree.insertNode(tiTreeNode3), 1,0);

        let sequence = tiTree.read();
        expect(sequence).toBe("value1\nvalue3");

        let deletedNode = tiTree.delete(0,1);
        sequence = tiTree.read();

        expect(deletedNode.getTimestamp()).toBe(tiTreeNode2.getTimestamp());
        expect(tiTreeNode2.isTombstone()).toBe(true);
        expect(sequence).toBe("value1value3");
    });

    it("inserts local update 3 times in a row", function () {
        let tiTree = new TiTree();
        let node1 = tiTree.insert(0,0,"a",2);
        let node2 = tiTree.insert(0,1,"b",2);

        expect(node1.getParentNodeTimestamp()).toBe(null);
        expect(node2.getParentNodeTimestamp()).toBe(node1.getTimestamp());
        expect(tiTree.read()).toBe("ab");

        let node3 =tiTree.insert(0,2,"c",2);
        expect(node3.getParentNodeTimestamp()).toBe(node2.getTimestamp());
        expect(tiTree.read()).toBe("abc");
    });

    it("inserts local update when newlines included", function () {
        let tiTree = new TiTree();
        let node1 = tiTree.insert(0,0,"a",2);
        let node2 = tiTree.insert(0,1,"b",2);
        let node3 = tiTree.insert(0,2,"\n",2);

        expect(node1.getParentNodeTimestamp()).toBe(null);
        expect(node2.getParentNodeTimestamp()).toBe(node1.getTimestamp());
        expect(node3.getParentNodeTimestamp()).toBe(node2.getTimestamp());
        expect(tiTree.read()).toBe("ab\n");

        let node4 = tiTree.insert(1,0,"c",2);
        expect(node4.getParentNodeTimestamp()).toBe(node3.getTimestamp());
        expect(tiTree.read()).toBe("ab\nc");

        let node5 = tiTree.insert(1,1,"d",2);
        expect(node5.getParentNodeTimestamp()).toBe(node4.getTimestamp());
        expect(tiTree.read()).toBe("ab\ncd");
    });

    it("delete to following chars", function () {
        let tiTree = new TiTree();
        let tiTreeReplica = new TiTree();

        let node1 = tiTree.insert(0,0,"a",2);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node1));
        expect(tiTreeReplica.read()).toBe("a");

        let node2 = tiTree.insert(0,1,"b",2);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node2));
        expect(tiTree.read()).toBe("ab");
        expect(tiTreeReplica.read()).toBe("ab");

        let node3 = tiTree.insert(0,2,"c",2);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node3));
        let node4 = tiTree.insert(0,3,"d",2);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node4));
        expect(tiTreeReplica.read()).toBe("abcd");
        expect(tiTree.read()).toBe("abcd");

        let deletedNodeB = tiTree.delete(0,1);
        expect(deletedNodeB.isTombstone()).toBeTrue();
        expect(deletedNodeB.getParentNodeTimestamp().getId()).toBe(node1.getTimestamp().getId());
        expect(deletedNodeB.getTimestamp().getId()).toBe(node2.getTimestamp().getId());
        expect(tiTree.read()).toBe("acd");

        let deletedNodeC = tiTree.delete(0,1);
        expect(deletedNodeC.isTombstone()).toBeTrue();
        expect(deletedNodeC.getParentNodeTimestamp().getId()).toBe(node2.getTimestamp().getId());
        expect(deletedNodeC.getTimestamp().getId()).toBe(node3.getTimestamp().getId());
        expect(tiTree.read()).toBe("ad");

        tiTreeReplica.deleteNode(deletedNodeB);
        expect(tiTreeReplica.read()).toBe("acd");

        tiTreeReplica.deleteNode(deletedNodeC);
        expect(tiTreeReplica.read()).toBe("ad")
    });

    it("remote delete of line end", function () {
        let tiTree = new TiTree();
        let node1 = tiTree.insert(0,0,"a",2);
        let node2 = tiTree.insert(0,1,"\n",2);
        let node3 = tiTree.insert(1,0,"b",2);
        let node4 = tiTree.insert(1,1,"\n",2);
        let node5 = tiTree.insert(2,0,"c",2);
        let node6 = tiTree.insert(2,1,"\n",2);
        let node7 = tiTree.insert(3,0,"d",2);

        expect(tiTree.delete(1,1).getValue()).toBe(node4.getValue());

    });

    it("local deletion of remote inserted values", function () {
        let tiTree = new TiTree();
        let tiTreeReplica = new TiTree();
        let node1 = tiTree.insert(0,0,"a",2);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node1));
        let node2 = tiTree.insert(0,1,"\n",2);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node2));
        let node3 = tiTree.insert(1,0,"b",2);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node3));
        let node4 = tiTree.insert(1,1,"\n",2);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node4));
        let node5 = tiTree.insert(2,0,"c",2);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node5));
        let node6 = tiTree.insert(2,1,"\n",2);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node6));
        let node7 = tiTree.insert(3,0,"d",2);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node7));

        let node8 = tiTree.insert(2,1,"1",2);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node8));
        let node9 = tiTree.insert(2,2,"2",2);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node9));
        let node10 = tiTree.insert(2,3,"3",2);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node10));
        let node11 = tiTree.insert(2,4,"4",2);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node11));
        let node12 = tiTree.insert(2,5,"5",2);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node12));

        expect(tiTree.read()).toBe("a\nb\nc12345\nd");
        expect(tiTreeReplica.read()).toBe("a\nb\nc12345\nd");

        let deletedNode1 = tiTree.delete(2,2);
        expect(deletedNode1.getId()).toBe(node9.getId());
        let position1 = tiTreeReplica.deleteNode(deletedNode1);
        expect(position1.getRow()).toBe(2);
        expect(position1.getColumn()).toBe(2);


        let deletedNode2 = tiTree.delete(2,3);
        expect(deletedNode2.getId()).toBe(node11.getId());
        let position2 = tiTreeReplica.deleteNode(deletedNode2);
        expect(position2.getRow()).toBe(2);
        expect(position2.getColumn()).toBe(3);

        expect(tiTree.read()).toBe("a\nb\nc135\nd");
        expect(tiTreeReplica.read()).toBe("a\nb\nc135\nd");

        let deletedNode3 = tiTreeReplica.delete(2,1);
        expect(deletedNode3.getId()).toBe(node8.getId());
        expect(deletedNode3.getValue()).toBe(node8.getValue());
        let position3 = tiTree.deleteNode(deletedNode3);
        expect(position3.getRow()).toBe(2);
        expect(position3.getColumn()).toBe(1);

        expect(tiTree.read()).toBe("a\nb\nc35\nd");
        expect(tiTreeReplica.read()).toBe("a\nb\nc35\nd");
    });

    it("local delete with up and down through the tree", function () {
        let tiTree = new TiTree();
        let node1 = tiTree.insert(0,0,"a",2);
        let node2 = tiTree.insert(0,1,"\n",2);
        let node3 = tiTree.insert(1,0,"b",2);
        let node4 = tiTree.insert(1,1,"\n",2);
        let node5 = tiTree.insert(2,0,"c",2);
        let node6 = tiTree.insert(2,1,"\n",2);
        let node7 = tiTree.insert(3,0,"d",2);
        let node8 = tiTree.insert(2,1,"1",2);
        let node9 = tiTree.insert(2,2,"2",2);
        let node10 = tiTree.insert(2,3,"3",2);

        expect(tiTree.read()).toBe("a\nb\nc123\nd");

        let node11 = tiTree.insert(2,1,"0",2);
        expect(tiTree.read()).toBe("a\nb\nc0123\nd");

        let deletedNode = tiTree.delete(2,3);   //delete 2
        expect(deletedNode.getValue()).toBe(node9.getValue());
        expect(deletedNode.getId()).toBe(node9.getId());

    });

    it("remote delete with up and down through the tree", function () {
        let tiTree = new TiTree();
        let node1 = new TiTreeNode(1,null,"a");
        tiTree.insertNode(TiTreeNode.copyNode(node1));
        let node2 = new TiTreeNode(1,node1.getTimestamp(),"\n");
        tiTree.insertNode(TiTreeNode.copyNode(node2));
        let node3 = new TiTreeNode(1,node2.getTimestamp(),"b");
        tiTree.insertNode(TiTreeNode.copyNode(node3));
        let node4 = new TiTreeNode(1,node3.getTimestamp(),"\n");
        tiTree.insertNode(TiTreeNode.copyNode(node4));
        let node5 = new TiTreeNode(1,node4.getTimestamp(),"c");
        tiTree.insertNode(TiTreeNode.copyNode(node5));
        let node6 = new TiTreeNode(1,node5.getTimestamp(),"\n");
        tiTree.insertNode(TiTreeNode.copyNode(node6));
        let node7 = new TiTreeNode(1,node6.getTimestamp(),"d");
        tiTree.insertNode(TiTreeNode.copyNode(node7));
        let node8 = new TiTreeNode(1,node7.getTimestamp(),"\n");
        tiTree.insertNode(TiTreeNode.copyNode(node8));
        let node9 = new TiTreeNode(1,node8.getTimestamp(),"e");
        tiTree.insertNode(TiTreeNode.copyNode(node9));

        expect(tiTree.read()).toBe("a\nb\nc\nd\ne");

        let node10 = new TiTreeNode(1,node5.getTimestamp(),"0");
        tiTree.insertNode(TiTreeNode.copyNode(node10));
        let node11 = new TiTreeNode(1,node10.getTimestamp(),"1");
        tiTree.insertNode(TiTreeNode.copyNode(node11));
        let node12 = new TiTreeNode(1,node11.getTimestamp(),"2");
        tiTree.insertNode(TiTreeNode.copyNode(node12));
        let node13 = new TiTreeNode(1,node12.getTimestamp(),"3");
        tiTree.insertNode(TiTreeNode.copyNode(node13));

        let node14 = new TiTreeNode(1,node5.getTimestamp(),"a");
        tiTree.insertNode(TiTreeNode.copyNode(node14));
        let node15 = new TiTreeNode(1,node14.getTimestamp(),"b");
        tiTree.insertNode(TiTreeNode.copyNode(node15));
        let node16 = new TiTreeNode(1,node15.getTimestamp(),"c");
        tiTree.insertNode(TiTreeNode.copyNode(node16));
        let node17 = new TiTreeNode(1,node16.getTimestamp(),"d");
        tiTree.insertNode(TiTreeNode.copyNode(node17));

        expect(tiTree.read()).toBe("a\nb\ncabcd0123\nd\ne");

        let nodeToDelete = TiTreeNode.copyNode(node12);
        nodeToDelete.markAsTombstone();

        let position = tiTree.deleteNode(nodeToDelete);
        expect(position.getRow()).toBe(2);
        expect(position.getColumn()).toBe(7);

        expect(tiTree.read()).toBe("a\nb\ncabcd013\nd\ne");
    });

    it("should delete complete lines with one remote node", function () {
        let tiTree = new TiTree();
        let tiTreeReplica = new TiTree();

        let node1 = tiTree.insert(0,0,"0",1);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node1));
        let node2 = tiTree.insert(0,1,"0",1);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node2));
        let node3 = tiTree.insert(0,2,"\n",1);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node3));
        let node4 = tiTree.insert(1,0,"1",1);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node4));
        let node5 = tiTree.insert(1,1,"1",1);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node5));
        let node6 = tiTree.insert(1,2,"\n",1);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node6));
        let node7 = tiTree.insert(2,0,"2",1);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node7));
        let node8 = tiTree.insert(2,1,"2",1);
        tiTreeReplica.insertNode(TiTreeNode.copyNode(node8));

        expect(tiTree.read()).toBe("00\n11\n22");
        expect(tiTreeReplica.read()).toBe("00\n11\n22");

        let replicaInsertNode = tiTreeReplica.insert(0,2,"A",2);
        expect(tiTreeReplica.read()).toBe("00A\n11\n22");

        let position = tiTree.insertNode(TiTreeNode.copyNode(replicaInsertNode));
        expect(position.getRow()).toBe(0);
        expect(position.getColumn()).toBe(2);
        expect(tiTree.read()).toBe("00A\n11\n22");

        let deletionPosition = new Position(0,2);
        let deletedNode1 = tiTree.delete(deletionPosition.getRow(),deletionPosition.getColumn());
        expect(deletedNode1.getId()).toBe(replicaInsertNode.getId());
        let deletedNodePosition1 = tiTreeReplica.deleteNode(TiTreeNode.copyNode(deletedNode1));
        expect(deletedNodePosition1.getColumn()).toBe(deletionPosition.getColumn());
        expect(deletedNodePosition1.getRow()).toBe(deletionPosition.getRow());

        let deletedNode2 = tiTree.delete(deletionPosition.getRow(),deletionPosition.getColumn());
        expect(deletedNode2.getId()).toBe(node3.getId());
        let deletedNodePosition2 = tiTreeReplica.deleteNode(TiTreeNode.copyNode(deletedNode2));
        expect(deletedNodePosition2.getColumn()).toBe(deletionPosition.getColumn());
        expect(deletedNodePosition2.getRow()).toBe(deletionPosition.getRow());
    });
});