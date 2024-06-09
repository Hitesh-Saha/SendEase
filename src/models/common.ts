export type RecieverData = {
    id: string;
    username: string;
    avatar: string;
}

export type RecieverPanelProps = {
    reciever: RecieverData | null;
    status?: string;
    isRecieveMode: boolean;
    connectReciever?: () => void;
};