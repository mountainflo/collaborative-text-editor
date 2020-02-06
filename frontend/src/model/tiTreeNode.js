import {Timestamp} from './timestamp';

const privateProps = new WeakMap();

class TiTreeNode {
    static nextFreeId = 0; // TODO total number of ids limited to the size of the js-number

    static createUniqueId() {
      return TiTreeNode.nextFreeId++;
    }

    static updateUniqueId(id) {
      if ( id >= TiTreeNode.nextFreeId) {
        TiTreeNode.nextFreeId = ++id;
      }
    }

    constructor(replicaId, parentNodeTimestamp, value, id=undefined, tombstone=false) {
      let _id;
      if (id !== undefined) {
        _id = id;
      } else {
        _id = TiTreeNode.createUniqueId();
      }

      privateProps.set(this, {
        id: _id,
        replicaId: replicaId,
        timestamp: new Timestamp(_id, replicaId),
        parentNodeTimestamp: parentNodeTimestamp,
        value: value,
        tombstone: tombstone,
        childrenTimestamps: [],
      });
    }

    getReplicaId() {
      return privateProps.get(this).replicaId;
    };

    getId() {
      return privateProps.get(this).id;
    };

    getParentNodeTimestamp() {
      return privateProps.get(this).parentNodeTimestamp;
    };

    setParentNodeTimestamp(parentNodeTimestamp) {
      const obj = privateProps.get(this);
      obj.parentNodeTimestamp = parentNodeTimestamp;
      privateProps.set(this, obj);
    };

    getValue() {
      return privateProps.get(this).value;
    };

    isTombstone() {
      return privateProps.get(this).tombstone;
    };

    getChildrenTimestamps() {
      return privateProps.get(this).childrenTimestamps;
    };

    /**
     * Add a new child to the node.
     * The children timestamps are sorted in descending order
     * of the timestamps.
     *
     * @param {Timestamp} childTimestamp
     */
    addChildTimestamp(childTimestamp) {
      const childrenTimestamps = this.getChildrenTimestamps();
      childrenTimestamps.push(childTimestamp);
      if (childrenTimestamps.length > 1) {
        childrenTimestamps.sort((a, b) => {
          return a.compareTo(b);
        });
      }

      const obj = privateProps.get(this);
      obj.childrenTimestamps = childrenTimestamps;
      privateProps.set(this, obj);
    };

    /**
     * @return {Timestamp}
     */
    getTimestamp() {
      return privateProps.get(this).timestamp;
    };

    markAsTombstone() {
      const obj = privateProps.get(this);
      obj.tombstone = true;
      privateProps.set(this, obj);
    };

    toString() {
      let parentTimestamp = 'null';
      if (this.getParentNodeTimestamp() !== null) {
        parentTimestamp = this.getParentNodeTimestamp().toString();
      }

      const value = this.getValue() === '\n' ? '\\n' : this.getValue();

      const reducer = (accum, t) => accum + ', ' + t.toString();

      return '{' + '"timestamp":' + this.getTimestamp().toString() + ',' +
            '"parentTimestamp":' + parentTimestamp + ',' +
            '"value":"' + value + '",' +
            '"tombstone":' + this.isTombstone() + ',' +
            '"childrenTimestamps":[' + this.getChildrenTimestamps().reduce(reducer, '') + ']}';
    };

    /**
     * Deep copy of a TiTreeNode
     *
     * @param {TiTreeNode} node
     * @return {TiTreeNode}
     */
    static copyNode(node) {
      const parent = node.getParentNodeTimestamp();

      const deepCopy = new TiTreeNode(
          node.getReplicaId(),
            parent===null ? null : new Timestamp(parent.getId(), parent.getReplicaId()),
            node.getValue(),
            node.getId(),
            node.isTombstone());

      node.getChildrenTimestamps().forEach(
          (t) => deepCopy.addChildTimestamp(new Timestamp(t.getId(), t.getReplicaId())),
      );

      return deepCopy;
    }
}

export {TiTreeNode};
