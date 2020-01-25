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
        this.localDeletion = function(changeObject){
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
         * @param {TiTreeNode} Node
         * @return {ChangeObject} position and value of the node
         */
        this.remoteDeletion = function (Node) {
            //TODO call tiTree and calculate deletion position
            return new ChangeObject(0,0,"",CHANGE_OBJECT_TYPE.DELETION);
        };

        /**
         * @param {TiTreeNode} Node
         * @return {ChangeObject} position and value of the node
         */
        this.remoteInsert = function (Node) {
            //TODO call tiTree calculate insertion position
            return new ChangeObject(0,0,"",CHANGE_OBJECT_TYPE.INSERTION);
        };

    }

}

export {Crdt};