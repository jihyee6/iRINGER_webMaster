import React, { useState } from 'react';

import Button from 'components/public/button';
import Table from 'components/public/resultTable';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { DeviceDeleteState } from 'recoils/DeviceRecoil';
import { UseMutation } from 'hooks/UseApi';
import { apiLists } from 'apis/ApiLists';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query';
import { LoginState } from 'recoils/LoginRecoil';

type DeviceData = {
    deviceID: string;
    ringerName: string;
    wardName: string;
    roomName: string;
    bedName: string;
    patientName: string;
    remainBattery: number;
    isUsing: boolean;
}

type _DeviceContents = {
    data: Array<DeviceData>;
    refresh: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
} 

export function DeviceContents({data, refresh}: _DeviceContents) {

    const th_name = ["check_box", "기기명", "시리얼 넘버", "수액", "병동", "병실", "베드", "환자명", "배터리(%)", "상태"];
    console.log(data);
    console.log("contents");

    return (
        <div className="monitoring">
            <DeviceContentHead count = {data.length} refresh = {refresh}/>
            <div className="device_body">
                <Table tableUrl='device' name={th_name} data = {data} />
            </div>
        </div>
    )
}

export const MemoDeviceContents = React.memo(DeviceContents);

type _DeviceContentsHead = {
    count: number;
    refresh: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
}

function DeviceContentHead({count, refresh}: _DeviceContentsHead) {

    /// 여기서 event 처리
    const deviceNum = useRecoilValue<string[]>(DeviceDeleteState);
    const deleteData = UseMutation({method: "delete", url: apiLists.device, apiName: "deleteDevices", body: {"deviceNum": deviceNum}, refresh: refresh});
    
    const resetRecoil = useResetRecoilState(DeviceDeleteState);

    const userGrade = useRecoilValue(LoginState).user_grade;

    const onClick = () => {
        deleteData.mutate();
        resetRecoil();
    }

    console.log(count);
    return (
        <div className="monitor_head">
            <div className="monitor_status">
                <div>총 <span>{count}</span>대</div>
            </div>
            <div className="monitor_array">
                <div className="array_box">
                    {userGrade !== 2 && <Button name='선택삭제' size='S' onClick={onClick}/>}
                </div>
            </div>
        </div>
    )
}

export const MemoDeviceContentHead = React.memo(DeviceContentHead);