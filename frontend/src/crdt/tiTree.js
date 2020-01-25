import {NewLineArray} from "./newLineArray";
import {TiTreeNode} from "./tiTreeNode";

class TiTree {

    constructor() {
        let _rootNodeTimestamp = null;
        let _timestampsAndNodesMap = new Map();
        let _newLineArray = new NewLineArray();

        /**
         * Mark the node to the corresponding timestamp as tombstone.
         *
         * @param {TiTreeNode} node
         */
        this.delete = function (node) {

            let timestamp = node.getTimestamp();

            if(node.getValue() === "\n"){
                _newLineArray.removeNewLineReferenceByTimestamp(timestamp);
            }

            node.markAsTombstone();
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
         */
        this.insert = function (row, column, value, replicaId) {

            let startNodeTimestamp;

            if (row > 0) {
                startNodeTimestamp = _newLineArray.getNewLineReference(row-1);
            } else {
                startNodeTimestamp = _rootNodeTimestamp;
            }

            let self = this;
            let parentNodeTimestamp = findParentNodeTimestampInColumn(self, startNodeTimestamp, column, undefined);

            let node = new TiTreeNode(replicaId, parentNodeTimestamp, value);
            this.insertNode(node,row);
        };


        /***
         * Insert of a remote node without a specified row.
         *
         * @param {TiTreeNode} node
         */
        this.insertNode = function (node) {
            let row = undefined;

            if (node.getValue() === "\n"){
                let newLineTimestamp;
                try {
                    let self = this;
                    newLineTimestamp = traverseTreeUntilNewLineReached(self, node.getTimestamp(), 0, undefined);
                } catch (e) {
                    newLineTimestamp = _newLineArray.length();
                }
                row = _newLineArray.getNewLineReferenceByTimestamp(newLineTimestamp);
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

            if(node.getValue() === "\n"){
                _newLineArray.addNewLineReference(nodeTimestamp, row);
            }

            _timestampsAndNodesMap.set(nodeTimestamp, node);
        };

        this.getNodeFromTimestamp = function (timestamp) {
            return _timestampsAndNodesMap.get(timestamp);
        };

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
         * Traverse the tree by a given number of chars to find the parentNode.
         *
         * @param {TiTree} object
         * @param {string} nodeTimestamp
         * @param {int} remainingCharsToPass
         * @param {string} lastVisitedNodeTimestamp
         * @returns {string}
         */
        let findParentNodeTimestampInColumn = function (object, nodeTimestamp, remainingCharsToPass, lastVisitedNodeTimestamp) {
            let node = object.getNodeFromTimestamp(nodeTimestamp);

            if(!node.isTombstone()) {
                --remainingCharsToPass; //visiting current node. One char fewer to pass.
            }

            if (remainingCharsToPass === 0) {
                return nodeTimestamp;
            }

            let childrenTimestamps = node.getChildrenTimestamps();

            //iterate over all children starting after the lastVisitedNodeTimestamp
            let iteratedOverLastVisitedNode = lastVisitedNodeTimestamp === undefined;

            for (let i = 0; childrenTimestamps < i; i++) {

                if (iteratedOverLastVisitedNode){
                    let childNode = object.getNodeFromTimestamp(childrenTimestamps[i]);
                    return findParentNodeTimestampInColumn(object, childNode, remainingCharsToPass, nodeTimestamp);
                } else {
                    iteratedOverLastVisitedNode = childrenTimestamps[i] === lastVisitedNodeTimestamp;
                }
            }

            let parentNodeTimestamp = node.getParentNodeTimestamp();

            if (parentNodeTimestamp == null) {
                throw new Error("Tree does not contain a not with the specified timestamp");
            }

            return findParentNodeTimestampInColumn(object, parentNodeTimestamp, remainingCharsToPass,  nodeTimestamp);
        };


        /**
         * TODO traverse the tree until you find a new line => return the row
         *
         * @param {TiTree} object
         * @param {string} nodeTimestamp
         * @param {int} passedNumberOfChars
         * @param {string} lastVisitedNodeTimestamp
         * @returns {string}
         */
        let traverseTreeUntilNewLineReached = function (object, nodeTimestamp, passedNumberOfChars, lastVisitedNodeTimestamp) {
            let node = object.getNodeFromTimestamp(nodeTimestamp);

            if(!node.isTombstone()){
                if (passedNumberOfChars > 0 && node.getValue() === "\n"){
                    return nodeTimestamp;
                }
                ++passedNumberOfChars;
            }

            let childrenTimestamps = node.getChildrenTimestamps();

            //iterate over all children starting after the lastVisitedNodeTimestamp
            let iteratedOverLastVisitedNode = lastVisitedNodeTimestamp === undefined;

            for (let i = 0; childrenTimestamps < i; i++) {

                if (iteratedOverLastVisitedNode){
                    let childNode = object.getNodeFromTimestamp(childrenTimestamps[i]);
                    return traverseTreeUntilNewLineReached(object, childNode, passedNumberOfChars, nodeTimestamp);
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