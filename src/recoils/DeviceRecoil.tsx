import { atom } from 'recoil';

const basic: Array<any> = [];

export const DeviceDeleteState = atom({
    key: "deviceDelete",
    default: basic
})