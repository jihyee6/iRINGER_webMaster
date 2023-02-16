import React, { useEffect, useState } from 'react';

import Table from 'components/public/resultTable';
import Button from 'components/public/button';
import { useRecoilValue } from 'recoil';
import { LoginState } from 'recoils/LoginRecoil';
import { MemoCharts } from 'components/public/newCharts';
import { UseApis } from 'hooks/UseApi';
import { apiLists, apiListsV2 } from 'apis/ApiLists';
import { useLocation } from 'react-router-dom';

type LogType = {
    wardName: string,
    roomName: string,
    patientName : string,
    startTime: string,
    endTime: string,
    pairingID : number,
}
type LogContentType ={
    data: Array<LogType>
}

function LogContents({data}:LogContentType) {

    console.log(data);

    const th_name:string[] = ["병동","병실", "환자명", "시작", "종료"]
    const [logId, setLogId] = useState(-1);

    console.log(logId);

    return (
        <div className="monitoring">
            <div className="log_body">
                <Table tableUrl='logs' name={th_name} data = {data} setLogId={setLogId}/>
                {logId !== -1 && <LogSideBox logId={logId} />}
            </div>
        </div>
    )
}

export const MemoLogContents = React.memo(LogContents);

// type ringerData ={
//     time: number;
//     speed: number;
// }
// type alarmData = {
//     alarmName :string;
//     alarmID : number;
//     startTime : string;
//     endTime: string;
// }

// type bedDetail = {
//     alarmList: Array<alarmData>;
//     deviceID : string;
//     ringerLog: Array<ringerData>;
//     startTime: string;
//     bedName :string;
//     injectRinger : number;
//     patientName : string;
//     totalRinger : number;
// }

// type logSideData = {
//     data: bedDetail;
//     alarmData: Array<alarmData>;
// }

type sideData = {
    logId : number;
}

function LogSideBox({logId} :sideData) {
    
    const [all, setAll] = useState<boolean>(false);
    
    const th_name:string[] = ["구분","알람내용", "발생일시"]
    console.log(logId);

    const monitoringDetails = UseApis({method: 'get', url : apiListsV2.monitoring_detail, apiName: "monitoring_details", params : {pairing: logId}, time : false, async: true});
    const alarmDetailApi = UseApis({method: 'get', url : apiListsV2.alarmLog, apiName: "alarmLog", params : {pairingID: logId}, time : false, async: true});

    if(!monitoringDetails.isLoading){
        console.log(monitoringDetails.data);
    }
    if(!alarmDetailApi.isLoading){
        console.log(alarmDetailApi.data.data);
    }
    
    useEffect(() => {
        monitoringDetails.refetch();
        alarmDetailApi.refetch();
    }, [logId])

    return(
        <>
        {(!monitoringDetails.isLoading && !alarmDetailApi.isLoading) && 
        <div className='logSide'>
            <div>
                <p className='logSideTitle'>측정정보</p>
                <div className='chartsBox'>
                    <div className='logInfoBox'>
                        <p className='logInfoTitle'>{monitoringDetails.data.data.bedName}</p>
                        <p className='logInfoTime'>측정시작 : {monitoringDetails.data.data.startTime}</p>
                        {/* | 측정종료 : 2022-01-01 02:00 */}
                    </div>
                    <MemoCharts apiData={monitoringDetails.data.data.ringerLog} all = {all} url ="log"/>
                </div>
            </div>
            <div>
                <p className='logSideTitle' style={{marginTop: '32px'}}>알림정보</p>
                <Table tableUrl='alarmLog' name={th_name} data = {alarmDetailApi.data.data}/>
            </div>
        </div>
    }
        </>
    )
}
export const MemoLogSideBox = React.memo(LogSideBox);

