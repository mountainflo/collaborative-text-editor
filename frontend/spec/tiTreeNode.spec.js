import {TiTreeNode} from "../src/model/tiTreeNode";

describe("TiTreeNode", function () {

    beforeEach(function() {
        TiTreeNode.nextFreeId = 0;
    });

    it("is not a tombstone if the node is new", function () {
        let tiTreeNode = new TiTreeNode(null, null, "value");

        expect(tiTreeNode.isTombstone()).toBe(false);
    });

    it("marked as tombstone has no value", function () {
        let tiTreeNode = new TiTreeNode(null, null, "value");

        tiTreeNode.markAsTombstone();

        expect(tiTreeNode.isTombstone()).toBe(true);
        expect(tiTreeNode.getValue()).toBe("");
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

        expect(rootTimestamp).toBe("10");
        expect(childTimestamp).toBe("11");
    });

    it("is able to add a child", function () {
        let root = new TiTreeNode(1, null, "value11");
        let child = new TiTreeNode(1, root.getTimestamp(), "value12");

        root.addChildTimestamp(child.getTimestamp());

        let childrenTimestamps = root.getChildrenTimestamps();

        expect(childrenTimestamps.length).toBe(1);
        expect(childrenTimestamps[0]).toBe("11");
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
        expect(childrenTimestamps[0]).toBe("32");
        expect(childrenTimestamps[1]).toBe("21");

        root.addChildTimestamp(child3.getTimestamp());

        childrenTimestamps = root.getChildrenTimestamps();

        expect(childrenTimestamps.length).toBe(3);
        expect(childrenTimestamps[0]).toBe("32");
        expect(childrenTimestamps[1]).toBe("23");
        expect(childrenTimestamps[2]).toBe("21");
    });
});