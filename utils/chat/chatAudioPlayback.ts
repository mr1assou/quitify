type ChatAudioPlaybackListener = (playingId: string | null) => void;

let playingId: string | null = null;
const listeners = new Set<ChatAudioPlaybackListener>();

export function subscribeChatAudioPlayback(listener: ChatAudioPlaybackListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getPlayingChatAudioId(): string | null {
  return playingId;
}

export function setPlayingChatAudioId(id: string | null): void {
  if (playingId === id) return;
  playingId = id;
  listeners.forEach((listener) => listener(id));
}
