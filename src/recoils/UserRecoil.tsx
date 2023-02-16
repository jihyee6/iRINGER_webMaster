import { atom } from 'recoil';

const basic: Array<any> = [];

export const UserDeleteState = atom({
    key: "userDelete",
    default: basic
})