export interface RecieverData {
  id: string;
  username: string;
  avatar: string;
};

export interface RecieverPanelProps {
  reciever: RecieverData | null;
  status?: string;
  isRecieveMode: boolean;
  connectReciever?: () => void;
};

export interface RecievedFileType {
  name: string;
  size: number;
  type: string;
};

export interface FileMetaData {
  type: 'file-meta';
  fileName: string;
  fileSize: number;
  fileType: string;
}

export interface ChunkData {
  type: 'file-data-chunk';
  sequence: number;
  contents: string;
}

export interface ConnectData {
  type: 'connect';
  senderAvatar: string;
  senderName: string;
  key: string;
}

export type PeerData = FileMetaData | ChunkData | ConnectData | { type: 'start' } | { type: 'end' };

