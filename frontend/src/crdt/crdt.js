import {TiTree} from "./tiTree";
import {TiTreeNode} from "./../model/tiTreeNode";
import {CHANGE_OBJECT_TYPE, ChangeObject} from "./../model/changeObject";

class Crdt {

    constructor(replicaId) {
        let _tiTree = new TiTree();
        const _REPLICA_ID = replicaId;

        /*

        TODO try to keep implementation as close to the paper as possible
        - buffer usage, events, ..


        - localUpdate //needs to executed asap after user input
        - read (not absolutely necessary)
        - remoteUpdate(Node, delete|insert)
            - can be delayed -> use a buffer with events
            - should return column and row of the char to insert in the editor (asap after position calculation)

        - sendLocalUpdate() //can be delayed -> use buffer with events
         */

        /**
         * @param {ChangeObject} changeObject
         * @return {TiTreeNode} Tombstone Node
         */
        this.localDelete = function(changeObject){
            //TODO call tiTree with _REPLICA_ID
            return null;
        };

        /**
         * @param {ChangeObject} changeObject
         * @return {TiTreeNode} new created node
         */
        this.localInsert = function(changeObject){
            return _tiTree.insert(changeObject.getRow(),changeObject.getColumn(),changeObject.getValue(),_REPLICA_ID)
        };

        /**
         * @param {TiTreeNode} node
         * @return {ChangeObject} position and value of the node
         */
        this.remoteDelete = function (node) {
            let position = _tiTree.deleteNode(node);
            return new ChangeObject(position,"",CHANGE_OBJECT_TYPE.DELETION);
        };

        /**
         * @param {TiTreeNode} node
         * @return {ChangeObject} position and value of the node
         */
        this.remoteInsert = function (node) {
            let position = _tiTree.insertNode(node);
            return new ChangeObject(position,node.getValue(),CHANGE_OBJECT_TYPE.INSERTION);
        };

    }

}

export {Crdt};