// Code generated by protoc-gen-go. DO NOT EDIT.
// source: collabTexteditorService.proto

package collabTexteditorService

import (
	context "context"
	fmt "fmt"
	proto "github.com/golang/protobuf/proto"
	grpc "google.golang.org/grpc"
	codes "google.golang.org/grpc/codes"
	status "google.golang.org/grpc/status"
	math "math"
)

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion3 // please upgrade the proto package

type TextUpdateRequest struct {
	TextUpdate           string   `protobuf:"bytes,1,opt,name=textUpdate,proto3" json:"textUpdate,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *TextUpdateRequest) Reset()         { *m = TextUpdateRequest{} }
func (m *TextUpdateRequest) String() string { return proto.CompactTextString(m) }
func (*TextUpdateRequest) ProtoMessage()    {}
func (*TextUpdateRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_1d586bc6f59f1daa, []int{0}
}

func (m *TextUpdateRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_TextUpdateRequest.Unmarshal(m, b)
}
func (m *TextUpdateRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_TextUpdateRequest.Marshal(b, m, deterministic)
}
func (m *TextUpdateRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_TextUpdateRequest.Merge(m, src)
}
func (m *TextUpdateRequest) XXX_Size() int {
	return xxx_messageInfo_TextUpdateRequest.Size(m)
}
func (m *TextUpdateRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_TextUpdateRequest.DiscardUnknown(m)
}

var xxx_messageInfo_TextUpdateRequest proto.InternalMessageInfo

func (m *TextUpdateRequest) GetTextUpdate() string {
	if m != nil {
		return m.TextUpdate
	}
	return ""
}

type TextUpdateReply struct {
	StatusMessage        string   `protobuf:"bytes,1,opt,name=statusMessage,proto3" json:"statusMessage,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *TextUpdateReply) Reset()         { *m = TextUpdateReply{} }
func (m *TextUpdateReply) String() string { return proto.CompactTextString(m) }
func (*TextUpdateReply) ProtoMessage()    {}
func (*TextUpdateReply) Descriptor() ([]byte, []int) {
	return fileDescriptor_1d586bc6f59f1daa, []int{1}
}

func (m *TextUpdateReply) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_TextUpdateReply.Unmarshal(m, b)
}
func (m *TextUpdateReply) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_TextUpdateReply.Marshal(b, m, deterministic)
}
func (m *TextUpdateReply) XXX_Merge(src proto.Message) {
	xxx_messageInfo_TextUpdateReply.Merge(m, src)
}
func (m *TextUpdateReply) XXX_Size() int {
	return xxx_messageInfo_TextUpdateReply.Size(m)
}
func (m *TextUpdateReply) XXX_DiscardUnknown() {
	xxx_messageInfo_TextUpdateReply.DiscardUnknown(m)
}

var xxx_messageInfo_TextUpdateReply proto.InternalMessageInfo

func (m *TextUpdateReply) GetStatusMessage() string {
	if m != nil {
		return m.StatusMessage
	}
	return ""
}

type ServerUpdateSubscriptionRequest struct {
	ClientId             int64    `protobuf:"varint,1,opt,name=clientId,proto3" json:"clientId,omitempty"`
	Subscription         bool     `protobuf:"varint,2,opt,name=subscription,proto3" json:"subscription,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *ServerUpdateSubscriptionRequest) Reset()         { *m = ServerUpdateSubscriptionRequest{} }
func (m *ServerUpdateSubscriptionRequest) String() string { return proto.CompactTextString(m) }
func (*ServerUpdateSubscriptionRequest) ProtoMessage()    {}
func (*ServerUpdateSubscriptionRequest) Descriptor() ([]byte, []int) {
	return fileDescriptor_1d586bc6f59f1daa, []int{2}
}

func (m *ServerUpdateSubscriptionRequest) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_ServerUpdateSubscriptionRequest.Unmarshal(m, b)
}
func (m *ServerUpdateSubscriptionRequest) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_ServerUpdateSubscriptionRequest.Marshal(b, m, deterministic)
}
func (m *ServerUpdateSubscriptionRequest) XXX_Merge(src proto.Message) {
	xxx_messageInfo_ServerUpdateSubscriptionRequest.Merge(m, src)
}
func (m *ServerUpdateSubscriptionRequest) XXX_Size() int {
	return xxx_messageInfo_ServerUpdateSubscriptionRequest.Size(m)
}
func (m *ServerUpdateSubscriptionRequest) XXX_DiscardUnknown() {
	xxx_messageInfo_ServerUpdateSubscriptionRequest.DiscardUnknown(m)
}

var xxx_messageInfo_ServerUpdateSubscriptionRequest proto.InternalMessageInfo

func (m *ServerUpdateSubscriptionRequest) GetClientId() int64 {
	if m != nil {
		return m.ClientId
	}
	return 0
}

func (m *ServerUpdateSubscriptionRequest) GetSubscription() bool {
	if m != nil {
		return m.Subscription
	}
	return false
}

type ServerUpdateSubscriptionResponse struct {
	LatestServerContent  string   `protobuf:"bytes,1,opt,name=latestServerContent,proto3" json:"latestServerContent,omitempty"`
	XXX_NoUnkeyedLiteral struct{} `json:"-"`
	XXX_unrecognized     []byte   `json:"-"`
	XXX_sizecache        int32    `json:"-"`
}

func (m *ServerUpdateSubscriptionResponse) Reset()         { *m = ServerUpdateSubscriptionResponse{} }
func (m *ServerUpdateSubscriptionResponse) String() string { return proto.CompactTextString(m) }
func (*ServerUpdateSubscriptionResponse) ProtoMessage()    {}
func (*ServerUpdateSubscriptionResponse) Descriptor() ([]byte, []int) {
	return fileDescriptor_1d586bc6f59f1daa, []int{3}
}

func (m *ServerUpdateSubscriptionResponse) XXX_Unmarshal(b []byte) error {
	return xxx_messageInfo_ServerUpdateSubscriptionResponse.Unmarshal(m, b)
}
func (m *ServerUpdateSubscriptionResponse) XXX_Marshal(b []byte, deterministic bool) ([]byte, error) {
	return xxx_messageInfo_ServerUpdateSubscriptionResponse.Marshal(b, m, deterministic)
}
func (m *ServerUpdateSubscriptionResponse) XXX_Merge(src proto.Message) {
	xxx_messageInfo_ServerUpdateSubscriptionResponse.Merge(m, src)
}
func (m *ServerUpdateSubscriptionResponse) XXX_Size() int {
	return xxx_messageInfo_ServerUpdateSubscriptionResponse.Size(m)
}
func (m *ServerUpdateSubscriptionResponse) XXX_DiscardUnknown() {
	xxx_messageInfo_ServerUpdateSubscriptionResponse.DiscardUnknown(m)
}

var xxx_messageInfo_ServerUpdateSubscriptionResponse proto.InternalMessageInfo

func (m *ServerUpdateSubscriptionResponse) GetLatestServerContent() string {
	if m != nil {
		return m.LatestServerContent
	}
	return ""
}

func init() {
	proto.RegisterType((*TextUpdateRequest)(nil), "collabTexteditorService.TextUpdateRequest")
	proto.RegisterType((*TextUpdateReply)(nil), "collabTexteditorService.TextUpdateReply")
	proto.RegisterType((*ServerUpdateSubscriptionRequest)(nil), "collabTexteditorService.ServerUpdateSubscriptionRequest")
	proto.RegisterType((*ServerUpdateSubscriptionResponse)(nil), "collabTexteditorService.ServerUpdateSubscriptionResponse")
}

func init() { proto.RegisterFile("collabTexteditorService.proto", fileDescriptor_1d586bc6f59f1daa) }

var fileDescriptor_1d586bc6f59f1daa = []byte{
	// 280 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x9c, 0x92, 0x4f, 0x4b, 0xf3, 0x40,
	0x10, 0xc6, 0x49, 0x5f, 0x78, 0xa9, 0x83, 0x7f, 0x70, 0x3d, 0xa4, 0x04, 0xd4, 0x10, 0x3c, 0x04,
	0x0f, 0xa5, 0xd8, 0x83, 0x7a, 0xee, 0xc9, 0x83, 0x97, 0x24, 0x7e, 0x80, 0x4d, 0x32, 0xca, 0xc2,
	0xb2, 0xbb, 0xee, 0x4c, 0x44, 0xbf, 0x85, 0x07, 0x3f, 0xb0, 0xa4, 0x69, 0x6b, 0x8a, 0x0d, 0x8a,
	0xc7, 0x7d, 0x66, 0x9e, 0x79, 0x76, 0x7e, 0xbb, 0x70, 0x5a, 0x59, 0xad, 0x65, 0x59, 0xe0, 0x2b,
	0x63, 0xad, 0xd8, 0xfa, 0x1c, 0xfd, 0x8b, 0xaa, 0x70, 0xea, 0xbc, 0x65, 0x2b, 0xc2, 0x81, 0x72,
	0x32, 0x87, 0xe3, 0x56, 0x7c, 0x70, 0xb5, 0x64, 0xcc, 0xf0, 0xb9, 0x41, 0x62, 0x71, 0x06, 0xc0,
	0x1b, 0x71, 0x12, 0xc4, 0x41, 0xba, 0x97, 0xf5, 0x94, 0xe4, 0x1a, 0x8e, 0xfa, 0x26, 0xa7, 0xdf,
	0xc4, 0x05, 0x1c, 0x10, 0x4b, 0x6e, 0xe8, 0x1e, 0x89, 0xe4, 0xd3, 0xda, 0xb5, 0x2d, 0x26, 0x12,
	0xce, 0xdb, 0x60, 0xf4, 0x9d, 0x35, 0x6f, 0x4a, 0xaa, 0xbc, 0x72, 0xac, 0xac, 0x59, 0x67, 0x47,
	0x30, 0xae, 0xb4, 0x42, 0xc3, 0x77, 0xf5, 0x72, 0xc6, 0xbf, 0x6c, 0x73, 0x16, 0x09, 0xec, 0x53,
	0xcf, 0x32, 0x19, 0xc5, 0x41, 0x3a, 0xce, 0xb6, 0xb4, 0xa4, 0x80, 0x78, 0x38, 0x82, 0x9c, 0x35,
	0x84, 0x62, 0x06, 0x27, 0x5a, 0x32, 0x12, 0x77, 0x9d, 0x0b, 0x6b, 0x18, 0x0d, 0xaf, 0xae, 0xbc,
	0xab, 0x74, 0xf5, 0x31, 0x82, 0x70, 0xb1, 0x1b, 0xa1, 0x78, 0x84, 0xc3, 0x1c, 0x4d, 0xfd, 0x45,
	0x44, 0x5c, 0x4e, 0x87, 0x5e, 0xe3, 0x1b, 0xeb, 0x28, 0xfd, 0x55, 0x6f, 0x8b, 0xf8, 0x3d, 0x80,
	0x70, 0xb5, 0x4e, 0x89, 0x85, 0xed, 0x6f, 0x29, 0x6e, 0x06, 0xa7, 0xfc, 0xc0, 0x3b, 0xba, 0xfd,
	0x83, 0xb3, 0xc3, 0x38, 0x0b, 0xca, 0xff, 0xcb, 0xdf, 0x35, 0xff, 0x0c, 0x00, 0x00, 0xff, 0xff,
	0x2d, 0x86, 0x69, 0x91, 0x7e, 0x02, 0x00, 0x00,
}

// Reference imports to suppress errors if they are not otherwise used.
var _ context.Context
var _ grpc.ClientConn

// This is a compile-time assertion to ensure that this generated file
// is compatible with the grpc package it is being compiled against.
const _ = grpc.SupportPackageIsVersion4

// CollabTexteditorServiceClient is the client API for CollabTexteditorService service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://godoc.org/google.golang.org/grpc#ClientConn.NewStream.
type CollabTexteditorServiceClient interface {
	SendTextUpdate(ctx context.Context, in *TextUpdateRequest, opts ...grpc.CallOption) (*TextUpdateReply, error)
	SubscribeToServerUpdate(ctx context.Context, in *ServerUpdateSubscriptionRequest, opts ...grpc.CallOption) (CollabTexteditorService_SubscribeToServerUpdateClient, error)
}

type collabTexteditorServiceClient struct {
	cc *grpc.ClientConn
}

func NewCollabTexteditorServiceClient(cc *grpc.ClientConn) CollabTexteditorServiceClient {
	return &collabTexteditorServiceClient{cc}
}

func (c *collabTexteditorServiceClient) SendTextUpdate(ctx context.Context, in *TextUpdateRequest, opts ...grpc.CallOption) (*TextUpdateReply, error) {
	out := new(TextUpdateReply)
	err := c.cc.Invoke(ctx, "/collabTexteditorService.CollabTexteditorService/SendTextUpdate", in, out, opts...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *collabTexteditorServiceClient) SubscribeToServerUpdate(ctx context.Context, in *ServerUpdateSubscriptionRequest, opts ...grpc.CallOption) (CollabTexteditorService_SubscribeToServerUpdateClient, error) {
	stream, err := c.cc.NewStream(ctx, &_CollabTexteditorService_serviceDesc.Streams[0], "/collabTexteditorService.CollabTexteditorService/SubscribeToServerUpdate", opts...)
	if err != nil {
		return nil, err
	}
	x := &collabTexteditorServiceSubscribeToServerUpdateClient{stream}
	if err := x.ClientStream.SendMsg(in); err != nil {
		return nil, err
	}
	if err := x.ClientStream.CloseSend(); err != nil {
		return nil, err
	}
	return x, nil
}

type CollabTexteditorService_SubscribeToServerUpdateClient interface {
	Recv() (*ServerUpdateSubscriptionResponse, error)
	grpc.ClientStream
}

type collabTexteditorServiceSubscribeToServerUpdateClient struct {
	grpc.ClientStream
}

func (x *collabTexteditorServiceSubscribeToServerUpdateClient) Recv() (*ServerUpdateSubscriptionResponse, error) {
	m := new(ServerUpdateSubscriptionResponse)
	if err := x.ClientStream.RecvMsg(m); err != nil {
		return nil, err
	}
	return m, nil
}

// CollabTexteditorServiceServer is the server API for CollabTexteditorService service.
type CollabTexteditorServiceServer interface {
	SendTextUpdate(context.Context, *TextUpdateRequest) (*TextUpdateReply, error)
	SubscribeToServerUpdate(*ServerUpdateSubscriptionRequest, CollabTexteditorService_SubscribeToServerUpdateServer) error
}

// UnimplementedCollabTexteditorServiceServer can be embedded to have forward compatible implementations.
type UnimplementedCollabTexteditorServiceServer struct {
}

func (*UnimplementedCollabTexteditorServiceServer) SendTextUpdate(ctx context.Context, req *TextUpdateRequest) (*TextUpdateReply, error) {
	return nil, status.Errorf(codes.Unimplemented, "method SendTextUpdate not implemented")
}
func (*UnimplementedCollabTexteditorServiceServer) SubscribeToServerUpdate(req *ServerUpdateSubscriptionRequest, srv CollabTexteditorService_SubscribeToServerUpdateServer) error {
	return status.Errorf(codes.Unimplemented, "method SubscribeToServerUpdate not implemented")
}

func RegisterCollabTexteditorServiceServer(s *grpc.Server, srv CollabTexteditorServiceServer) {
	s.RegisterService(&_CollabTexteditorService_serviceDesc, srv)
}

func _CollabTexteditorService_SendTextUpdate_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(TextUpdateRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CollabTexteditorServiceServer).SendTextUpdate(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/collabTexteditorService.CollabTexteditorService/SendTextUpdate",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CollabTexteditorServiceServer).SendTextUpdate(ctx, req.(*TextUpdateRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _CollabTexteditorService_SubscribeToServerUpdate_Handler(srv interface{}, stream grpc.ServerStream) error {
	m := new(ServerUpdateSubscriptionRequest)
	if err := stream.RecvMsg(m); err != nil {
		return err
	}
	return srv.(CollabTexteditorServiceServer).SubscribeToServerUpdate(m, &collabTexteditorServiceSubscribeToServerUpdateServer{stream})
}

type CollabTexteditorService_SubscribeToServerUpdateServer interface {
	Send(*ServerUpdateSubscriptionResponse) error
	grpc.ServerStream
}

type collabTexteditorServiceSubscribeToServerUpdateServer struct {
	grpc.ServerStream
}

func (x *collabTexteditorServiceSubscribeToServerUpdateServer) Send(m *ServerUpdateSubscriptionResponse) error {
	return x.ServerStream.SendMsg(m)
}

var _CollabTexteditorService_serviceDesc = grpc.ServiceDesc{
	ServiceName: "collabTexteditorService.CollabTexteditorService",
	HandlerType: (*CollabTexteditorServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "SendTextUpdate",
			Handler:    _CollabTexteditorService_SendTextUpdate_Handler,
		},
	},
	Streams: []grpc.StreamDesc{
		{
			StreamName:    "SubscribeToServerUpdate",
			Handler:       _CollabTexteditorService_SubscribeToServerUpdate_Handler,
			ServerStreams: true,
		},
	},
	Metadata: "collabTexteditorService.proto",
}