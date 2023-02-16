import { atom } from 'recoil';

export const DeviceSelectState = atom({
    key: "deviceSelect",
    default: "",
})

export const RingerSelectState = atom({
    key: "ringerSelect",
    default: {
        ringerName : "", 
        ringerSpeed : 0, 
        ringerTotal : 0,
    }
})

export const HospitalSelectState = atom({
    key: "hospitalSelect",
    default: 0
})


