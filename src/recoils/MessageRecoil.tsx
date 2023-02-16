import { atom, } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export type MessageType = {
    body: string | undefined;
    title: string | undefined;
}

export const MessageState = atom<MessageType>({
    key: "Message",
    default: {body:"", title: ""},
    effects_UNSTABLE: [persistAtom],
})