import {TiTreeNode} from "../src/model/tiTreeNode";
import {Timestamp} from "../src/model/timestamp";

describe("TiTreeNode", function () {

    beforeEach(function() {
        TiTreeNode.nextFreeId = 0;
    });

    it("is not a tombstone if the node is new", function () {
        let tiTreeNode = new TiTreeNode(null, null, "value");

        expect(tiTreeNode.isTombstone()).toBeFalse();
    });

    it("has initially no children", function () {
        let tiTreeNode = new TiTreeNode(null, null, "value");

        expect(tiTreeNode.getChildrenTimestamps().length).toBe(0);
    });

    it("gives each node a unique id", function () {
        let root = new TiTreeNode(1, null, "value");
        let child = new TiTreeNode(1, root.getTimestamp(), "value");

        let rootTimestamp = root.getTimestamp();
        let childTimestamp = child.getTimestamp();

        expect(rootTimestamp.equals(new Timestamp(0,1))).toBeTrue();
        expect(childTimestamp.equals(new Timestamp(1,1))).toBeTrue();
    });

    it("is able to add a child", function () {
        let root = new TiTreeNode(1, null, "value11");
        let child = new TiTreeNode(1, root.getTimestamp(), "value12");

        root.addChildTimestamp(child.getTimestamp());

        let childrenTimestamps = root.getChildrenTimestamps();

        expect(childrenTimestamps.length).toBe(1);
        expect(childrenTimestamps[0].equals(new Timestamp(1,1))).toBeTrue();
    });

    it("sorts its children in descending order", function () {
        let root = new TiTreeNode(1,  null, "value11");
        let child1 = new TiTreeNode(2, root.getTimestamp(), "value12");
        let child2 = new TiTreeNode(3, root.getTimestamp(), "value12");
        let child3 = new TiTreeNode(2, root.getTimestamp(), "value12");

        root.addChildTimestamp(child1.getTimestamp());
        root.addChildTimestamp(child2.getTimestamp());

        let childrenTimestamps = root.getChildrenTimestamps();

        expect(childrenTimestamps.length).toBe(2);
        expect(childrenTimestamps[0].equals(new Timestamp(2,3))).toBeTrue();
        expect(childrenTimestamps[1].equals(new Timestamp(1,2))).toBeTrue();

        root.addChildTimestamp(child3.getTimestamp());

        childrenTimestamps = root.getChildrenTimestamps();

        expect(childrenTimestamps.length).toBe(3);
        expect(childrenTimestamps[0].equals(new Timestamp(3,2))).toBeTrue();
        expect(childrenTimestamps[1].equals(new Timestamp(2,3))).toBeTrue();
        expect(childrenTimestamps[2].equals(new Timestamp(1,2))).toBeTrue();
    });

    it('handles args in the constructor', function () {
        let node = new TiTreeNode(1,null,"a", 42,true);
        expect(node.isTombstone()).toBeTrue();
        expect(node.getId()).toBe(42);
    });
});