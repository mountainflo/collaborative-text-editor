import {NewLineArray} from "./newLineArray";
import {TiTreeNode} from "./../model/tiTreeNode";

const LINE_SEPARATOR = "\n";

class TiTree {

    constructor() {
        let _rootNodeTimestamp = null;
        let _timestampsAndNodesMap = new Map();
        let _newLineArray = new NewLineArray();

        /**
         * Mark the node to the corresponding timestamp as tombstone.
         *
         * @param {TiTreeNode} node
         * @return {TiTreeNode} node marked as tombstone
         */
        this.delete = function (node) {

            let timestamp = node.getTimestamp();

            if(node.getValue() === LINE_SEPARATOR){
                _newLineArray.removeNewLineReferenceByTimestamp(timestamp);
            }

            node.markAsTombstone();

            return node;
        };

        /**
         * Traverse the tree by depth-first search.
         * Ignore tombstones during traversing the tree.
         *
         * @returns {string} sequence of the tree without tombstones
         */
        this.read = function(){

            if(_rootNodeTimestamp == null){
                return "";
            }

            let self = this;
            return traverseTree(self, _rootNodeTimestamp);
        };

        /**
         * Insert value at given position into the tree by creating a new node.
         *
         * @param {int} row
         * @param {int} column
         * @param {string} value
         * @param {int} replicaId
         * @return {TiTreeNode} new created node
         */
        this.insert = function (row, column, value, replicaId) {

            let startTimestampForTraversing;

            if (row > 0) {
                startTimestampForTraversing = _newLineArray.getNewLineReference(row-1);
            } else if (row === 0 && column === 0) {
                //new root node
                let node = new TiTreeNode(replicaId, null, value);
                this.insertNode(node,row);
                return node;
            } else {
                startTimestampForTraversing = _rootNodeTimestamp;
            }

            let self = this;
            let parentNodeTimestamp = passXCharsInTheTree(self, startTimestampForTraversing, column+1, undefined);

            let node = new TiTreeNode(replicaId, parentNodeTimestamp, value);
            this.insertNode(node,row);

            return node;
        };


        /***
         * Insert of a remote node without a specified row.
         *
         * @param {TiTreeNode} node
         * @return {ChangeObject} changeObject
         */
        this.insertNode = function (node) {
            let row = undefined;

            if (node.getValue() === LINE_SEPARATOR){
                let newLineTimestamp;
                try {
                    let self = this;
                    newLineTimestamp = traverseTreeUntilNewLineReached(self, node.getTimestamp(), 0, undefined);
                } catch (e) {
                    newLineTimestamp = _newLineArray.length();
                }
                row = _newLineArray.getNewLineReferenceByTimestamp(newLineTimestamp);
                //TODO start in the previous row and traverse tree until the newline is reached
            }

            this.insertNode(node, row);
        };

        /**
         * Insert node into the tree, by specifying the row.
         *
         * @param {TiTreeNode} node
         * @param {int} row
         */
        this.insertNode = function (node, row) {

            let nodeTimestamp = node.getTimestamp();
            let parentNodeTimestamp = node.getParentNodeTimestamp();

            if (parentNodeTimestamp == null) {
                let oldRootNodeTimestamp = _rootNodeTimestamp;
                _rootNodeTimestamp = nodeTimestamp;

                if(oldRootNodeTimestamp != null) {
                    node.addChildTimestamp(oldRootNodeTimestamp);
                    this.getNodeFromTimestamp(oldRootNodeTimestamp).setParentNodeTimestamp(_rootNodeTimestamp);
                }

            } else {
                let parentNode = _timestampsAndNodesMap.get(parentNodeTimestamp);
                parentNode.addChildTimestamp(nodeTimestamp);
            }

            if(node.getValue() === LINE_SEPARATOR){
                _newLineArray.addNewLineReference(nodeTimestamp, row);
            }

            _timestampsAndNodesMap.set(nodeTimestamp, node);
        };

        this.getNodeFromTimestamp = function (timestamp) {
            return _timestampsAndNodesMap.get(timestamp);
        };

        /**
         * Create sequence by traversing the complete tree. Ignore all tombstones.
         *
         * @param {TiTree} self
         * @param {string} nodeTimestamp
         * @returns {string} sequence
         */
        let traverseTree = function (self, nodeTimestamp) {
            let sequence = "";
            let node =  self.getNodeFromTimestamp(nodeTimestamp);

            if (!node.isTombstone()){
                sequence = node.getValue();
            }

            node.getChildrenTimestamps().forEach(
                (childTimestamp) => {
                    sequence = sequence + traverseTree(self, childTimestamp)
                });

            return sequence;
        };

        /**
         * Traverse the tree by passing X Chars.
         *
         * Tombstones are ignored. Function will return the timestamp reached,
         * when already passed X chars.
         *
         * @param {TiTree} object
         * @param {string} nodeTimestamp
         * @param {int} remainingCharsToPass
         * @param {string} lastVisitedNodeTimestamp
         * @returns {string} timestamp of the node
         */
        let passXCharsInTheTree = function (object, nodeTimestamp, remainingCharsToPass, lastVisitedNodeTimestamp) {
            let node = object.getNodeFromTimestamp(nodeTimestamp);

            if(!node.isTombstone()) {
                --remainingCharsToPass; //visiting current node. One char fewer to pass.
            }

            if (remainingCharsToPass <= 0) {
                return nodeTimestamp;
            }

            let childrenTimestamps = node.getChildrenTimestamps();

            //iterate over all children starting after the lastVisitedNodeTimestamp
            let iteratedOverLastVisitedNode = lastVisitedNodeTimestamp === undefined;

            for (let i = 0; i < childrenTimestamps.length; i++) {

                if (iteratedOverLastVisitedNode){
                    // go down in the tree. None of the children has been already visited.
                    return passXCharsInTheTree(object, childrenTimestamps[i], remainingCharsToPass, undefined);
                } else {
                    iteratedOverLastVisitedNode = childrenTimestamps[i] === lastVisitedNodeTimestamp;
                }
            }

            let parentNodeTimestamp = node.getParentNodeTimestamp();

            if (parentNodeTimestamp == null) {
                throw new Error("Tree does not contain a node with the specified timestamp");
            }

            return passXCharsInTheTree(object, parentNodeTimestamp, remainingCharsToPass,  nodeTimestamp);
        };


        /**
         * Traverse the tree until you find a new line.
         * Returns the timestamp of the new line node.
         *
         * @param {TiTree} object
         * @param {string} nodeTimestamp
         * @param {int} passedNumberOfChars
         * @param {string} lastVisitedNodeTimestamp
         * @returns {string} timestamp
         */
        let traverseTreeUntilNewLineReached = function (object, nodeTimestamp, passedNumberOfChars, lastVisitedNodeTimestamp) {
            let node = object.getNodeFromTimestamp(nodeTimestamp);

            if(!node.isTombstone()){
                if (passedNumberOfChars > 0 && node.getValue() === LINE_SEPARATOR){
                    return nodeTimestamp;
                }
                ++passedNumberOfChars;
            }

            let childrenTimestamps = node.getChildrenTimestamps();

            //iterate over all children starting after the lastVisitedNodeTimestamp
            let iteratedOverLastVisitedNode = lastVisitedNodeTimestamp === undefined;

            for (let i = 0; i < childrenTimestamps.length; i++) {

                if (iteratedOverLastVisitedNode){
                    return traverseTreeUntilNewLineReached(object, childrenTimestamps[i], passedNumberOfChars, nodeTimestamp);
                } else {
                    iteratedOverLastVisitedNode = childrenTimestamps[i] === lastVisitedNodeTimestamp;
                }
            }

            let parentNodeTimestamp = node.getParentNodeTimestamp();

            if (parentNodeTimestamp == null) {
                throw new Error("Tree does not contain a not with the specified timestamp"); //TODO reached the last element => new line is at the end
            }

            return traverseTreeUntilNewLineReached(object, parentNodeTimestamp, passedNumberOfChars, nodeTimestamp);
        }
    }

}

export {TiTree};