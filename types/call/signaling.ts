export type CallKind = "audio" | "video";

/** WebRTC negotiation payload relayed verbatim between the two peers. */
export type CallSignal =
  | { type: "offer"; sdp: string }
  | { type: "answer"; sdp: string }
  | { type: "candidate"; candidate: unknown };

export type IncomingCallPayload = {
  callId: string;
  kind: CallKind;
  fromUserId: number;
  callerName: string | null;
  callerAvatarUrl: string | null;
  callerCountryFlag: string | null;
};

export type CallIdPayload = { callId: string };

export type CallSignalPayload = {
  callId: string;
  fromUserId: number;
  signal: CallSignal;
};

/** Whether this device started the call (offerer) or answers it (answerer). */
export type CallRole = "caller" | "callee";
