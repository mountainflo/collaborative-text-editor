class TiTreeNode {

    constructor(replicaId, parentNodeTimestamp, value) {
        let _replicaId = replicaId;
        let _id = TiTreeNode.createUniqueId();
        let _parentNodeTimestamp = parentNodeTimestamp;
        let _value = value;
        let _tombstone = false;
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

        this.getValue = function(){
            return _value;
        };

        this.isTombstone = function () {
            return _tombstone;
        };

        this.getChildrenTimestamps = function () {
            return _childrenTimestamps;
        };

        this.getTimestamp = function () {
            return _replicaId.toString() + _id.toString();
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
         * @param {string} childTimestamp
         */
        this.addChild = function (childTimestamp) {
            _childrenTimestamps.push(childTimestamp);
            if (_childrenTimestamps.length > 1) {
                _childrenTimestamps.sort();
            }

        };
    }

    static nextFreeId = 0;

    static createUniqueId(){
        return TiTreeNode.nextFreeId++;
    }

}

export {TiTreeNode};