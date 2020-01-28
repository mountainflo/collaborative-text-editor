import {NewLineArray} from "./newLineArray";
import {TiTreeNode} from "./../model/tiTreeNode";
import {Position} from "../model/position";

const LINE_SEPARATOR = "\n";
const LOG_OBJECT = "[TiTree] ";

class TiTree {

    constructor() {
        let _rootNodeTimestamp = null;
        let _timestampsAndNodesMap = new Map();
        let _newLineArray = new NewLineArray();

        /**
         * @param {TiTree} obj
         * @param {number} passedChars
         * @param {Timestamp} timestamp
         * @return {boolean}
         */
        let abortionFunction = function(obj, passedChars, timestamp){
            let node = obj.getNodeFromTimestamp(timestamp);
            return passedChars > 0 && node.getValue() === LINE_SEPARATOR;
        };

        /**
         * @param {number} charsToPass
         * @return {function(TiTree, number, Timestamp): boolean} abortionFunction(obj, passedChars, timestamp)
         */
        let abortionFunctionCountChars = function(charsToPass){
            return function(obj, passedChars, timestamp){
                return passedChars === charsToPass;
            };
        };

        /**
         * Delete value at given position into the tree by marking the node as tombstone.
         *
         * @param {int} row
         * @param {int} column
         * @return {TiTreeNode} deleted node
         */
        this.delete = function (row, column) {

            let startTimestamp;

            if (row > 0) {
                startTimestamp = _newLineArray.getNewLineReference(row-1);
            } else {
                startTimestamp = _rootNodeTimestamp;
            }

            //goUpTheTree not possible, because the tail/rightest node is unknown
            let self = this;
            let result =  goDownTheTree(self,startTimestamp,undefined, 0, abortionFunctionCountChars(column));

            let nodeToDelete = this.getNodeFromTimestamp(result.lastNodeTimestamp);

            if (nodeToDelete.getValue() === LINE_SEPARATOR) {
                _newLineArray.removeNewLineReference(row);
            }

            nodeToDelete.markAsTombstone();

            return nodeToDelete;
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

            let startTimestamp;

            if (row > 0) {
                startTimestamp = _newLineArray.getNewLineReference(row-1);
            } else if (row === 0 && column === 0) {
                //new root node
                let node = new TiTreeNode(replicaId, null, value);
                this.insertNodeIntoRow(node,row);
                this.setTimestampForNode(node.getTimestamp(), node);
                return node;
            } else {
                startTimestamp = _rootNodeTimestamp;
            }

            let self = this;
            let result =  goDownTheTree(self,startTimestamp,undefined, 0, abortionFunctionCountChars(column));

            let node = new TiTreeNode(replicaId, result.lastNodeTimestamp, value);
            this.setTimestampForNode(node.getTimestamp(), node);

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

            TiTreeNode.updateUniqueId(node.getId());

            let timestamp = node.getTimestamp();
            this.setTimestampForNode(timestamp, node);

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
                let parentNode = this.getNodeFromTimestamp(parentNodeTimestamp);
                parentNode.addChildTimestamp(nodeTimestamp);
            }

            if(node.getValue() === LINE_SEPARATOR){
                _newLineArray.addNewLineReference(nodeTimestamp, row);
            }
        };

        /**
         * @param {Timestamp} timestamp
         * @return {TiTreeNode}
         */
        this.getNodeFromTimestamp = function (timestamp) {

            if (timestamp === null) {
                return undefined;
            }
            return _timestampsAndNodesMap.get(timestamp.toString());
        };

        /**
         * @param {Timestamp} timestamp
         * @param {TiTreeNode} node
         */
        this.setTimestampForNode = function (timestamp,node) {
            _timestampsAndNodesMap.set(timestamp.toString(),node);
        };

        /**
         * Create sequence by traversing the complete tree. Ignore all tombstones.
         *
         * @param {TiTree} self
         * @param {Timestamp} nodeTimestamp
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
         * Go down the tree by starting at a specific timestamp.
         * While going down the tree until abortion function returns true,
         * all passed nodes/chars (without tombstones) are counted.
         *
         * @param {TiTree} object
         * @param {Timestamp} nodeTimestamp
         * @param {Timestamp} lastVisitedNodeTimestamp
         * @param {number} passedChars
         * @param {function(TiTree, number, Timestamp): boolean} abortionFunction(obj, passedChars, timestamp)
         * @return {{lastNodeTimestamp: Timestamp, passedChars: number}}
         */
        let goDownTheTree = function (object,nodeTimestamp,lastVisitedNodeTimestamp, passedChars, abortionFunction) {

            let node = object.getNodeFromTimestamp(nodeTimestamp);

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

            let parentNodeTimestamp = node.getParentNodeTimestamp();
            let childrenTimestamps = node.getChildrenTimestamps();
            let iteratedOverLastVisitedNode = lastVisitedNodeTimestamp === undefined || lastVisitedNodeTimestamp === parentNodeTimestamp;

            for (let i = 0; i < childrenTimestamps.length; i++) {
                if (iteratedOverLastVisitedNode){
                    return goDownTheTree(object, childrenTimestamps[i], nodeTimestamp, passedChars, abortionFunction);
                } else {
                    iteratedOverLastVisitedNode = childrenTimestamps[i] === lastVisitedNodeTimestamp;
                }
            }

            let parentNode = object.getNodeFromTimestamp(parentNodeTimestamp);
            if ((parentNode === undefined)) {
                return {
                    lastNodeTimestamp:nodeTimestamp,
                    passedChars:passedChars
                };
            } else {
                return goDownTheTree(object, parentNodeTimestamp, nodeTimestamp, passedChars, abortionFunction);
            }
        };

        /**
         * Go up the tree by starting at a specific timestamp.
         * While going up the tree until abortion function returns true,
         * all passed nodes/chars (without tombstones) are counted.
         *
         * @param {TiTree} object
         * @param {Timestamp} nodeTimestamp
         * @param {Timestamp} lastVisitedNodeTimestamp
         * @param {number} passedChars
         * @param {function(TiTree, number, Timestamp): boolean} abortionFunction(obj, passedChars, timestamp)
         * @return {{lastNodeTimestamp: Timestamp, passedChars: number}}
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