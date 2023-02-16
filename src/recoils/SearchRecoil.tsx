import { atom } from 'recoil';

const deviceBasic: any = null;

export const DeviceSearchState = atom({
    key: "deviceSearch",
    default: deviceBasic,
})

export const RingerSearchState = atom({
    key: "ringerSearch",
    default: ""
})

export const AlarmSearchState = atom({
    key: "alarmSearch",
    default: {
        startDate: "",
        endDate: "",
        alarmName: ""
    }
})

export const UserSearchState = atom({
    key: "userSearch",
    default : ""
})

export const userTypeSearchState = atom({
    key: "userTypeSearch",
    default: 0,
})

export const userLockSearchState = atom({
    key: "userLockSearch",
    default: false,
})

export const hospitalSearchState = atom({
    key: "hospitalState",
    default : 0,
})

export const logSearchState = atom({
    key: "logSearch",
    default : ""
})