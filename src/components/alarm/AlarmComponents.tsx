import React from 'react';

import Table from 'components/public/resultTable';

type AlarmData = {
    alarmID : number;
    alarmType : string;
    alarmName : string;
    wardName : string;
    roomName : string;
    bedName : string;
    patientName : string;
    ringerName : string;
    startTime : string;
}

type AlarmContentsType = {
    data: Array<AlarmData>;
}

function AlarmContents({data}: AlarmContentsType) {

    console.log(data);

    const th_name:string[] = ["구분", "알람내용", "병동", "병실", "베드", "환자명", "수액명", "발생일시"];

    console.log(th_name);
    return (
        <div className="monitoring">
            <div className="alarm_body">
                <Table tableUrl='alarms' name={th_name} data = {data}/>
            </div>
        </div>
    )
}

export const MemoAlarmContents = React.memo(AlarmContents);