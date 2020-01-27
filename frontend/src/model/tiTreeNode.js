import {Timestamp} from "./timestamp";

class TiTreeNode {

    static nextFreeId = 0;  //TODO total number of ids limited to the size of the js-number

    static createUniqueId(){
        return TiTreeNode.nextFreeId++;
    }

    static updateUniqueId(id){
        if( id >= TiTreeNode.nextFreeId) {
            TiTreeNode.nextFreeId = ++id;
        }
    }

    constructor(replicaId, parentNodeTimestamp, value, ...args) {
        let _id;
        let _tombstone = false;

        if (args.length === 2) {
            _id = args[0];
            _tombstone = args[1];
        } else {
            _id = TiTreeNode.createUniqueId();
        }

        let _replicaId = replicaId;
        let _timestamp = new Timestamp(_id, _replicaId);
        let _parentNodeTimestamp = parentNodeTimestamp;
        let _value = value;
        let _childrenTimestamps = [];

        this.getReplicaId = function(){
            return _replicaId;
        };

        this.getId = function(){
            return _id;
        };

        this.getParentNodeTimestamp = function(){
            return _parentNodeTimestamp;
        };

        this.setParentNodeTimestamp = function(parentNodeTimestamp){
            _parentNodeTimestamp = parentNodeTimestamp;
        };

        this.getValue = function(){
            return _value;
        };

        this.isTombstone = function () {
            return _tombstone;
        };

        this.getChildrenTimestamps = function () {
            return _childrenTimestamps;
        };

        /**
         * @return {Timestamp}
         */
        this.getTimestamp = function () {
            return _timestamp;
        };

        this.markAsTombstone = function () {
            _tombstone = true;
            _value = "";
        };

        /**
         * Add a new child to the node.
         * The children timestamps are sorted in descending order
         * of the timestamps.
         *
         * @param {Timestamp} childTimestamp
         */
        this.addChildTimestamp = function (childTimestamp) {
            //TODO is it possible one childTimestamp is inserted two times?
            _childrenTimestamps.push(childTimestamp);
            if (_childrenTimestamps.length > 1) {
                _childrenTimestamps.sort((a, b) => {return a.compareTo(b)});
            }

        };
    }

}

export {TiTreeNode};