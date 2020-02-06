const privateProps = new WeakMap();

class Timestamp {
  constructor(id, replicaId) {
    privateProps.set(this, {id: id, replicaId: replicaId});
  }

  getId() {
    return privateProps.get(this).id;
  };

  getReplicaId() {
    return privateProps.get(this).replicaId;
  };

  /**
   * @param {Timestamp} other
   * @return {boolean}
   */
  equals(other) {
    if (other === undefined) {
      return false;
    } else {
      return other.getId() === this.getId() && other.getReplicaId() === this.getReplicaId();
    }
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
  compareTo(other) {
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

  toString() {
    return '{' + '"id":' + this.getId() + ',' +
      '"replicaId":' + this.getReplicaId() + '}';
  };
}

export {Timestamp};
