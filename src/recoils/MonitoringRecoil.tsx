import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query';
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const MonitoringState = atom({
    key: "monitor",
    default: 1
})

type AlarmState = {
    wardName: string,
    patientName: string,
    alarmType: boolean,
    ringerName: string,
    alarmID: number,
    alarmName: string,
    startTime: string,
    roomName: string,
    bedName: string
}

export type MonitoringPop = {
    roomName : string,
    bedName: string,
    patientName: string,
    remainTime: string,
    totalRinger: number,
    ringerName: string,
    remainRinger: number,
    ringerSpeed: number,
    remainBattery: number,
    state: string,
}

export const bedIDState = atom<AlarmState[]>({
    key: "bedIDState",
    default: 
        [
            {
                wardName: "",
                patientName: "",
                alarmType: false,
                ringerName: "",
                alarmID: 0,
                alarmName: "",
                startTime: "",
                roomName: "",
                bedName: ""
            }
        ]
})

export const deviceIDState = atom({
    key: "deivceIDState",
    default: ""
})

export const patientNameState = atom({
    key: "patientNameState",
    default: ""
})

export const wardIDState = atom({
    key: "wardIDState",
    default: 0
})

export const popupList = atom<MonitoringPop>({
    key: "popupList",
    default: 
        {
            roomName : "",
            bedName: "",
            patientName: "",
            remainTime: "",
            totalRinger: 0,
            ringerName: "",
            remainRinger: 0,
            ringerSpeed: 0,
            remainBattery: 0,
            state: "",
        },
    effects_UNSTABLE: [persistAtom]
})