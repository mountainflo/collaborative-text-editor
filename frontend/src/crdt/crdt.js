import {TiTree} from './tiTree';
import {CHANGE_OBJECT_TYPE, ChangeObject} from './../model/changeObject';

const LOG_OBJECT = '[crdt] ';

class Crdt {
  constructor(replicaId) {
    const _tiTree = new TiTree();
    const _REPLICA_ID = replicaId;
    const _crdtBuffer = new Set();

    /**
     * @param {ChangeObject} changeObject
     * @return {TiTreeNode} Tombstone Node
     */
    this.localDelete = function(changeObject) {
      return _tiTree.delete(changeObject.getRow(), changeObject.getColumn());
    };

    /**
     * @param {ChangeObject} changeObject
     * @return {TiTreeNode} new created node
     */
    this.localInsert = function(changeObject) {
      return _tiTree.insert(changeObject.getRow(), changeObject.getColumn(),
          changeObject.getValue(), _REPLICA_ID);
    };

    /**
     * @param {TiTreeNode} node
     * @param {function(ChangeObject)} codeMirrorFunction
     */
    this.addRemoteNodeToBuffer = function(node, codeMirrorFunction) {
      _crdtBuffer.add(new BufferObject(node, codeMirrorFunction));
      this.checkNodeBuffer();
    };

    this.checkNodeBuffer = async function() {
      console.debug(LOG_OBJECT + 'checkNodeBuffer(): bufferSize', _crdtBuffer.size);

      const bufferSizeBeforeCheck = _crdtBuffer.size;

      _crdtBuffer.forEach(
          (bufferObject) => {
            console.debug(LOG_OBJECT + 'checkNodeBuffer(): bufferObject ', bufferObject.toString());

            const node = bufferObject.getNode();
            const parentNodeTimestamp = node.getParentNodeTimestamp();

            if (!node.isTombstone()) {
              if (parentNodeTimestamp === null ||
              _tiTree.getNodeFromTimestamp(parentNodeTimestamp) !== undefined) {
                console.debug(LOG_OBJECT + 'checkNodeBuffer(): call remoteInsert()');

                const codeMirrorFunction = bufferObject.getCallback();
                codeMirrorFunction(this.remoteInsert(node));
                _crdtBuffer.delete(bufferObject);
              }
            } else {
              if (_tiTree.getNodeFromTimestamp(node.getTimestamp()) !== undefined) {
                console.debug(LOG_OBJECT + 'checkNodeBuffer(): call remoteDelete()');

                const codeMirrorFunction = bufferObject.getCallback();
                codeMirrorFunction(this.remoteDelete(node));
                _crdtBuffer.delete(bufferObject);
              }
            }
          },
      );

      if (bufferSizeBeforeCheck > _crdtBuffer.size && _crdtBuffer.size > 0) {
        this.checkNodeBuffer();
      }
    };

    /**
     * @param {TiTreeNode} node
     * @return {ChangeObject} position and value of the node
     */
    this.remoteDelete = function(node) {
      const position = _tiTree.deleteNode(node);
      return new ChangeObject(position, '', CHANGE_OBJECT_TYPE.DELETION);
    };

    /**
     * @param {TiTreeNode} node
     * @return {ChangeObject} position and value of the node
     */
    this.remoteInsert = function(node) {
      const position = _tiTree.insertNode(node);
      return new ChangeObject(position, node.getValue(), CHANGE_OBJECT_TYPE.INSERTION);
    };
  }
}

class BufferObject {
  /**
   * @param {TiTreeNode} node
   * @param {function(ChangeObject)} callback
   */
  constructor(node, callback) {
    const _node = node;
    const _callback = callback;

    this.getNode = function() {
      return _node;
    };

    this.getCallback = function() {
      return _callback;
    };

    this.toString = function() {
      return '"_node":' + _node.toString() + ',' +
        '"_callback"' + _callback + '}';
    };
  }
}

export {Crdt};
