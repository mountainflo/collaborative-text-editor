import {NewLineArray} from "./newLineArray";
import {TiTreeNode} from "./../model/tiTreeNode";
import {Position} from "../model/position";

const LINE_SEPARATOR = "\n";

class TiTree {

    constructor() {
        let _rootNodeTimestamp = null;
        let _timestampsAndNodesMap = new Map();
        let _newLineArray = new NewLineArray();

        /**
         * @param {TiTree} obj
         * @param {number} passedChars
         * @param {string} timestamp
         * @return {boolean}
         */
        let abortionFunction = function(obj, passedChars, timestamp){
            let node = obj.getNodeFromTimestamp(timestamp);
            return passedChars > 0 && node.getValue() === LINE_SEPARATOR;
        };

        /**
         * Mark the node to the corresponding timestamp as tombstone.
         *
         * @param {TiTreeNode} node
         * @return {Position} position of the changed node
         */
        this.deleteNode = function (node) {

            let timestamp = node.getTimestamp();

            if(node.getValue() === LINE_SEPARATOR){
                _newLineArray.removeNewLineReferenceByTimestamp(timestamp);
            }

            let self = this;
            let result = goUpTheTree(self,timestamp,undefined, 0, abortionFunction);

            // getNewLineReferenceByTimestamp returns "-1" if nothing found ==> goUpTheTree reached root node
            let row = _newLineArray.getNewLineReferenceByTimestamp(result.lastNodeTimestamp) + 1;

            node.markAsTombstone();

            return new Position(row, result.passedChars - 1);
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
                this.insertNodeIntoRow(node,row);
                _timestampsAndNodesMap.set(node.getTimestamp(), node);
                return node;
            } else {
                startTimestampForTraversing = _rootNodeTimestamp;
            }

            let self = this;
            let parentNodeTimestamp = passXCharsInTheTree(self, startTimestampForTraversing, column+1, undefined);

            let node = new TiTreeNode(replicaId, parentNodeTimestamp, value);
            _timestampsAndNodesMap.set(node.getTimestamp(), node);

            this.insertNodeIntoRow(node,row);

            return node;
        };


        /***
         * Insert of a node without a specified row.
         *
         * @param {TiTreeNode} node
         * @return {Position} position
         */
        this.insertNode = function (node) {

            let timestamp = node.getTimestamp();
            _timestampsAndNodesMap.set(timestamp, node);

            let self = this;
            let result = goUpTheTree(self,timestamp,undefined, 0, abortionFunction);

            // getNewLineReferenceByTimestamp returns "-1" if nothing found ==> goUpTheTree reached root node
            let row = _newLineArray.getNewLineReferenceByTimestamp(result.lastNodeTimestamp) + 1;
            this.insertNodeIntoRow(node,row);

            return new Position(row, result.passedChars - 1);
        };

        /**
         * Insert node into the tree, by specifying the row.
         *
         * @param {TiTreeNode} node
         * @param {int} row
         */
        this.insertNodeIntoRow = function (node, row) {

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
        };

        /**
         * Go up the tree by starting at a specific timestamp.
         * While going up the tree until abortion function returns true,
         * all passed nodes/chars (without tombstones) are counted.
         *
         * @param {TiTree} object
         * @param {string} nodeTimestamp
         * @param {string} lastVisitedNodeTimestamp
         * @param {number} passedChars
         * @param {function({TiTree}, {number}, {string}): boolean} abortionFunction(obj, passedChars, timestamp)
         * @return {{lastNodeTimestamp: string, passedChars: number}}
         */
        let goUpTheTree = function (object,nodeTimestamp,lastVisitedNodeTimestamp, passedChars, abortionFunction) {

            let node = object.getNodeFromTimestamp(nodeTimestamp);
            let parentNodeTimestamp = node.getParentNodeTimestamp();
            let parentNode = object.getNodeFromTimestamp(parentNodeTimestamp);

            if( (lastVisitedNodeTimestamp !== undefined) && (parentNode !== undefined)) {
                let childrenTimestamps = parentNode.getChildrenTimestamps();

                let iteratedOverLastVisitedNode = parentNodeTimestamp === lastVisitedNodeTimestamp;

                for (let i = childrenTimestamps.length - 1; i >= 0; i--) {

                    if (iteratedOverLastVisitedNode){
                        return goUpTheTree(object, childrenTimestamps[i], nodeTimestamp, passedChars, abortionFunction);
                    } else {
                        iteratedOverLastVisitedNode = childrenTimestamps[i] === lastVisitedNodeTimestamp;
                    }
                }
            }

            if (!node.isTombstone()) {

                if (abortionFunction(object,passedChars,nodeTimestamp)) {
                    return {
                        lastNodeTimestamp:nodeTimestamp,
                        passedChars:passedChars
                    };
                } else {
                    ++passedChars;
                }
            }

            if ((parentNode === undefined)) {
                return {
                    lastNodeTimestamp:nodeTimestamp,
                    passedChars:passedChars
                };
            } else {
                return goUpTheTree(object, parentNodeTimestamp, nodeTimestamp, passedChars, abortionFunction);
            }
        };
    }

}

export {TiTree};