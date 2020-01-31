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

            console.debug(LOG_OBJECT + "delete(row:" + row + ", column: " + column + ")");

            let startTimestamp;
            let charsToPass = column;

            if (row > 0) {
                startTimestamp = _newLineArray.getNewLineReference(row-1);
                charsToPass = column + 1;
            } else {
                startTimestamp = _rootNodeTimestamp;
            }

            //goUpTheTree not possible, because the tail/rightest node is unknown
            let self = this;
            let result =  goDownTheTree(self,startTimestamp,undefined, 0, abortionFunctionCountChars(charsToPass));
            console.debug(LOG_OBJECT + "goDownTheTree(): {lastNodeTimestamp:" + result.lastNodeTimestamp.toString() + ", passedChars:" + result.passedChars + "}");

            let nodeToDelete = this.getNodeFromTimestamp(result.lastNodeTimestamp);

            if (nodeToDelete.getValue() === LINE_SEPARATOR) {
                _newLineArray.removeNewLineReference(row);
            }

            nodeToDelete.markAsTombstone();

            console.debug(LOG_OBJECT + "delete(row, column): returning node ", nodeToDelete.toString());

            return nodeToDelete;
        };

        /**
         * Mark the node to the corresponding timestamp as tombstone.
         *
         * @param {TiTreeNode} node
         * @return {Position} position of the changed node
         */
        this.deleteNode = function (node) {

            console.debug(LOG_OBJECT + "deleteNode(node): ", node.toString());

            let timestamp = node.getTimestamp();

            if(node.getValue() === LINE_SEPARATOR){
                _newLineArray.removeNewLineReferenceByTimestamp(timestamp);
            }

            let self = this;
            let result = goUpTheTree(self,timestamp,undefined, 0, abortionFunction);

            console.debug(LOG_OBJECT + "goUpTheTree(): {lastNodeTimestamp:" + result.lastNodeTimestamp.toString() + ", passedChars:" + result.passedChars + "}");

            // getNewLineReferenceByTimestamp returns "-1" if nothing found ==> goUpTheTree reached root node
            let row = _newLineArray.getNewLineReferenceByTimestamp(result.lastNodeTimestamp) + 1;

            let nodeToBeDeleted = this.getNodeFromTimestamp(timestamp);
            nodeToBeDeleted.markAsTombstone();

            let position = new Position(row, result.passedChars - 1);
            console.debug(LOG_OBJECT + "deleteNode(node) returning Position: {row:" + position.getRow() + ", column:" + position.getColumn() + "}");

            return position;
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

            console.debug(LOG_OBJECT + "insert(row:" + row + ", column: " + column + ", value:" + value + ", replicaId:" + replicaId + ")");

            let startTimestamp;
            let charsToPass = column;

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
                charsToPass = column - 1;
            }

            let self = this;
            let result =  goDownTheTree(self,startTimestamp,undefined, 0, abortionFunctionCountChars(charsToPass));

            console.debug(LOG_OBJECT + "goDownTheTree(): {lastNodeTimestamp:" + result.lastNodeTimestamp.toString() + ", passedChars:" + result.passedChars + "}");

            let node = new TiTreeNode(replicaId, result.lastNodeTimestamp, value);
            this.setTimestampForNode(node.getTimestamp(), node);

            this.insertNodeIntoRow(node,row);

            console.debug(LOG_OBJECT + "insert(row, column, value, replicaId): returning node ", node.toString());

            return node;
        };


        /***
         * Insert of a node without a specified row.
         *
         * @param {TiTreeNode} node
         * @return {Position} position
         */
        this.insertNode = function (node) {

            console.debug(LOG_OBJECT + "insertNode(node): ", node.toString());

            TiTreeNode.updateUniqueId(node.getId());

            let timestamp = node.getTimestamp();
            this.setTimestampForNode(timestamp, node);

            let self = this;
            let result = goUpTheTree(self,timestamp,undefined, 0, abortionFunction);

            console.debug(LOG_OBJECT + "goUpTheTree(): {lastNodeTimestamp:" + result.lastNodeTimestamp.toString() + ", passedChars:" + result.passedChars + "}");

            // getNewLineReferenceByTimestamp returns "-1" if nothing found ==> goUpTheTree reached root node
            let previousNewLineSign = _newLineArray.getNewLineReferenceByTimestamp(result.lastNodeTimestamp);
            console.debug(LOG_OBJECT + "getNewLineReferenceByTimestamp("+ result.lastNodeTimestamp +"): " + previousNewLineSign);

            let row = previousNewLineSign + 1;
            this.insertNodeIntoRow(node,row);

            let position = new Position(row, result.passedChars - 1);
            console.debug(LOG_OBJECT + "insertNode(node) returning Position: {row:" + position.getRow() + ", column:" + position.getColumn() + "}");

            return position;
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
                console.warn(LOG_OBJECT + "Map does not include this timestamp:", timestamp);
                return undefined;
            }
            return _timestampsAndNodesMap.get(timestamp.toString());
        };

        /**
         * @param {Timestamp} timestamp
         * @param {TiTreeNode} node
         */
        this.setTimestampForNode = function (timestamp,node) {
            if(timestamp === undefined || timestamp === null) {
                throw new Error("Can not add undefined or null timestamp to map");
            }
            console.debug(LOG_OBJECT + "setTimestampForNode(): " + timestamp.toString());
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
        let goDownTheTree = function (object,nodeTimestamp,lastVisitedNodeTimestamp, passedChars, abortionFunction, ...args) {

            console.debug(LOG_OBJECT + "goDownTheTree(): called with {nodeTimestamp:" + nodeTimestamp.toString() + ", lastVisitedNodeTimestamp:" + lastVisitedNodeTimestamp + ", passedChars:" + passedChars + "}");

            let node = object.getNodeFromTimestamp(nodeTimestamp);

            if (!node.isTombstone()) {

                if (abortionFunction(object,passedChars,nodeTimestamp)) {
                    return {
                        lastNodeTimestamp:nodeTimestamp,
                        passedChars:passedChars
                    };
                } else {
                    if (args.length === 0) {
                        ++passedChars;
                    }
                }
            }

            let parentNodeTimestamp = node.getParentNodeTimestamp();
            let childrenTimestamps = node.getChildrenTimestamps();

            let iteratedOverLastVisitedNode;
            if (lastVisitedNodeTimestamp === undefined) {
                iteratedOverLastVisitedNode = true;
            } else {
                iteratedOverLastVisitedNode = lastVisitedNodeTimestamp.equals(parentNodeTimestamp);
            }

            for (let i = 0; i < childrenTimestamps.length; i++) {
                if (iteratedOverLastVisitedNode){
                    return goDownTheTree(object, childrenTimestamps[i], nodeTimestamp, passedChars, abortionFunction);
                } else {
                    iteratedOverLastVisitedNode = childrenTimestamps[i].equals(lastVisitedNodeTimestamp);
                }
            }

            let parentNode = object.getNodeFromTimestamp(parentNodeTimestamp);
            if ((parentNode === undefined)) {
                return {
                    lastNodeTimestamp:nodeTimestamp,
                    passedChars:passedChars
                };
            } else {
                //node has no children call parent again, but do not count the visit of the parent-node again
                return goDownTheTree(object, parentNodeTimestamp, nodeTimestamp, passedChars, abortionFunction, true);
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

            console.debug(LOG_OBJECT + "goUpTheTree(): called with {nodeTimestamp:" + nodeTimestamp.toString() + ", lastVisitedNodeTimestamp:" + lastVisitedNodeTimestamp + ", passedChars:" + passedChars + "}");

            let node = object.getNodeFromTimestamp(nodeTimestamp);
            let parentNodeTimestamp = node.getParentNodeTimestamp();
            let parentNode = object.getNodeFromTimestamp(parentNodeTimestamp);

            if( (lastVisitedNodeTimestamp !== undefined) && (parentNode !== undefined)) {
                let childrenTimestamps = node.getChildrenTimestamps();

                let iteratedOverLastVisitedNode = parentNodeTimestamp.equals(lastVisitedNodeTimestamp);

                for (let i = childrenTimestamps.length - 1; i >= 0; i--) {

                    if (iteratedOverLastVisitedNode){
                        return goUpTheTree(object, childrenTimestamps[i], nodeTimestamp, passedChars, abortionFunction);
                    } else {
                        iteratedOverLastVisitedNode = childrenTimestamps[i].equals(lastVisitedNodeTimestamp);
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
                console.debug(LOG_OBJECT + "parenNode is undefined");
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