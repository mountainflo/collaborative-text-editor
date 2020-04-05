# Documentation

## Table of Contents

* [TechStack](#techstack)
* [The RGA-Protocol](#the-rga-protocol)
    * [Operations of the Ti Tree](#operations-of-the-ti-tree)
    * [The protocol](#the-protocol)
* [Using the CodeMirror Library](#using-the-codemirror-library)
* [Implementation of the RGA-Protocol](#implementation-of-the-rga-protocol)
    * [Definition of the gRPC-Service](#definition-of-the-grpc-service)
    * [go-Server](#go-server)
    * [Implementation of the TI Tree](#implementation-of-the-ti-tree)
* [Future Work](#future-work)
* [References](#references)

## TechStack

The complete project is built with *Docker* and *Docker Compose*.

Used Technologies for the Backend:
* Go (go1.13)
* Delve debugger

Used Technologies for the Frontend-Clients:
* [CodeMirror](https://codemirror.net)
* npm
* Webpack
* Babel
* ESLint
* Jasmine
* Karma

## The RGA-Protocol

The used protocol is based on the specification from Attiya et al.
[\[1\]](#ref1). The protocol uses replicas. Each replica contains
the current state of its user´s text editor. Changes from the user
will be propagated via the server to all other replicas.

The for RGAs necessary list is in [\[1\]](#ref1) implemented as
*timestamped insertion (TI) tree*. A node of the TI tree can
contain zero or more children, which are ordered lexicographically.
Each node of the TI tree contains a unique timestamp. The timestamp
is a tuple *(x, rpl<sub>id</sub>)*, where *x* is a global
logical clock and *rpl<sub>id</sub>* a unique replica-id.
The timestamps are ordered as followed:

*((x, rpl<sub>id</sub>) < (x', rpl'<sub>id</sub>)) &hArr;
(x < x') &or; ( (x = x') &and; (rpl<sub>id</sub> < rpl'<sub>id</sub>) )*

### Operations of the Ti Tree

* **Delete:** The element which needs to be deleted is marked as
*tombstone* an remains in the tree.
* **Read:** The tree is traversed by depth-first search. All visited
elements are assembled into the sequence *s(N)*. Tombstones will be
skipped and child-nodes are visited in descending order.
* **Insert:** The new element *a* will be inserted at the position
*k* in *s(N)*. The new node is a tuple *n = (a,t,p)*, where
*t = ((x+1), rpl<sub>id</sub>)* and *x* is the highest value
of the logical clock. For the parent-node *p=a<sub>k-1</sub>*
if *k>0*. *p* is the new root node if *k=0*.

### The protocol

The protocol is based on specification from [\[1\]](#ref1), but some
simplifications have been made. A replica is a state machine which is
defined as *(N,A,L)*. *N* is the TI tree, *A* the send-buffer and
*L* the receive-buffer. The initial state of a replica is
*(&empty;,&empty;,&empty;)*. The following state transitions are
possible:

* **Insertion/Deletion:** Insertions and deletions of nodes corresponds
to the section [Operations of the Ti Tree](#operations-of-the-ti-tree).
After a insertion or a deletion the node is added to the buffer *A*.
* **Send:** If *A &ne; &empty;* all messages of *A* will be sent
to all other replicas.
* **Receive:** If *L &ne; &empty;* and
*l &isin; L &and; l.p &isin; N* then *l* will be added to *N*. If the
parent-node of *l* is not in *N* then *l* remains in the buffer.
Tombstone-nodes are only added to *N*, if they already exist
in *N*.

## Using the CodeMirror Library

[CodeMirror](https://codemirror.net) is a library which extends a
html-```textarea``` with the functions of a normal text editor. CodeMirror
organizes the characters in the text editor as matrix. An API provides
the necessary functions to manipulate the content and to get notified
via ```Change```-Event when changes by the user are made. For the
remote cursor we use the ```bookmark```s. A ```bookmark``` marks a
character with an html-element and follows the character if any changes
in the text editor are made.

## Implementation of the RGA-Protocol

### Definition of the gRPC-Service

The gRPC-Service contains four gRPC-methods. Two of them are used
for replica- and session-handling. The other two methods are for
the RGA-protocol.

#### CreateSessionId

The client can open a new session. From the server he gets back
the unique ```sessionId```.

```protobuf
rpc CreateSessionId(Empty) returns (SessionResponse);
	
message Empty {
}
	
message SessionResponse {
	string sessionId = 1;
}
```

#### JoinSession

The client can use a ```sessionId``` from a friend, who has invited
him to the session or he has already created an id with the previous
RPC-method ```CreateSessionId```. For the remote-cursors it is
necessary to specify a ```nickName```, which will be displayed to
the other users. The response to this unary RPC-method contains
a unique  ```replicaId```.

```protobuf
rpc JoinSession(JoinSessionRequest) returns (JoinSessionResponse);
	
message JoinSessionRequest {
	string sessionId = 1;
	string nickName = 2;
}
	
message JoinSessionResponse {
	int64 replicaId = 1;
}
```

#### SendLocalUpdate

Every local change from a client will be propagated immediately to the
server via ```LocalUpdateRequest```. For the mapping of the change
to the correct session the server needs the ```sessionId```.

```protobuf
rpc SendLocalUpdate(LocalUpdateRequest) returns (LocalUpdateResponse);
	
message LocalUpdateRequest {
	TiTreeNode node = 1;
	int64 replicaId = 2;
	string sessionId = 3;
}
	
message LocalUpdateResponse {
	string statusMessage = 1;
}
```

#### SubscribeForRemoteUpdates

This gRPC-method is for server-side streaming. With the request a
stream will be opened at the server. Via the stream the server will
send all former changes of the session and all upcoming changes.

```protobuf
rpc SubscribeForRemoteUpdates(RemoteUpdateRequest) returns (stream RemoteUpdateResponse);
			
message RemoteUpdateRequest {
	int64 replicaId = 1;
	string sessionId = 2;
}
	
message RemoteUpdateResponse {
	int64 senderReplicaId = 1;
	TiTreeNode node = 2;
	string nickname = 3;
}
```

### go-Server

The gRPC-Server is implemented in go. It propagates the change-messages
of the clients to all other clients of the same session. The messages are
transmitted according to the *Publisher/Subscriber Pattern*. A client
(Subscriber) has to register for a topic (session). After the registration
the client receives all previous messages and all future messages
from all other replicas of the session.

The following code-listing shows the datastructure of the gRPC-Server.
Each Session, identified by a unique ```SessionId```, has a ```map``` of all its replicas,
as well as a session history. Each replica of the session has
a unique ```ReplicaId```, a self chosen ```NickName``` and go-channel.

Via go-channels values of a specified element type can be sent to
and received by other goroutines. Because every request to the
gRPC-Server is handled by a separate goroutine, the goroutines need a
way to communicate with each other. This is realized with the
go-channels. A client sends a new change-message to the server by
the gRPC-Method ```SendLocalUpdate```. Via the go-channels, the message
is send to all the other goroutines, which have a open server-side
stream to a replica of the session.

```go
type Repository struct {
	Sessions map[string]*Session
}
		
type Session struct {
	NextFreeReplicaId int
	Replicas          map[int]*Replica
	History           []*pb.RemoteUpdateResponse
}
		
type Replica struct {
	ReplicaId int
	NickName  string
	Channel   chan *pb.RemoteUpdateResponse
}
```

### Implementation of the TI Tree

To accelerate the depth-first search through the TI tree, the implementation
manages a list of all newline-nodes. With the list of the newline-nodes
the search-algorithm only needs to go through one line of characters.

The TI tree has two search-algorithms. ```goDownTheTree``` and
```goUpTheTree```. Both algorithms go through the nodes of TI tree and can
start at any node in the tree. A ```abortionFunction``` stops the
execution of the search-algorithms. The return-value of the algorithm
is the count of passed characters (without tombstones) and the reference
of the last node.

## Future Work

In [\[2\]](#ref2) Lv et al. propose a improvement of the RGA-algorithm.
The implemented algorithm we used was character-based. The new algorithm
in [\[2\]](#ref2) is string-based. The idea of RGASS (RGA Supporting
String) is to divide a into several sub-nodes if an change in the
string happens. Because of the string-based approach the
tree-search-algorithms have to visit less nodes than they would with
the character-based approach. Especially for copy-paste operations
with many characters the new approach is faster, because it only has
to create one node with the complete string.

## References

<a name="ref1">\[1\]</a> Hagit Attiya et al. „Specification and
Complexity of Collaborative Text Editing“. In: *Proceedings of the
2016 ACM Symposium on Principles of Distributed Computing*.
PODC ’16. Chicago, Illinois, USA: Association for Computing Machinery,
2016, pages 259–268. url:
[https://doi.org/10.1145/2933057.2933090](https://doi.org/10.1145/2933057.2933090)

<a name="ref2">\[2\]</a> X. Lv et al. „An efficient collaborative
editing algorithm supporting string-based operations“. In:
2016 IEEE 20th International Conference on Computer Supported
Cooperative Work in Design (CSCWD). Nanchang, China: IEEE, Mai 2016,
pages 45–50. url: [https://doi.org/10.1109/CSCWD.2016.7565961](https://doi.org/10.1109/CSCWD.2016.7565961)
