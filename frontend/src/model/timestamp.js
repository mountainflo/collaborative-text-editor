class Timestamp {
    constructor(id, replicaId) {
        const _id = id;
        const _replicaId = replicaId;

        this.getReplicaId = function(){
            return _replicaId;
        };

        this.getId = function(){
            return _id;
        };

        /**
         * @param {Timestamp} other
         * @return {boolean}
         */
        this.equals = function (other) {
            return other.getId() === this.getId() && other.getReplicaId() === this.getReplicaId();
        };

        /**
         * Compare to timestamps for descending order.
         *
         * this < other => +1
         * this == other => 0
         * this > other => -1
         *
         * @param {Timestamp} other
         * @return {number}
         */
        this.compareTo = function (other) {
            if (this.getId() < other.getId()) {
                return +1;
            } else if (this.getId() > other.getId()) {
                return -1;
            } else {
                // this.getId() === other.getId()
                if (this.getReplicaId() < other.getReplicaId()) {
                    return +1;
                } else if (this.getReplicaId() > other.getReplicaId()) {
                    return -1;
                } else {
                    return 0;
                }
            }
        };

        this.toString = function () {
            return "{id=" + this.getId() + ";r=" + this.getReplicaId() + "}";
        };
    }


}

export {Timestamp};