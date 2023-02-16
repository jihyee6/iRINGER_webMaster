import 'css/Dashboard.scss';
import * as Components from 'components/dashboard/DashboardComponents';
// api
import deviceStatusInfo from 'apis/DeviceStatusData';
import AlarmInfo from 'apis/AlarmStatusData';
import NoticeData from 'apis/NoticeData';
import { UseApis } from 'hooks/UseApi';
import { apiLists } from 'apis/ApiLists';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    
    const deviceDataType = ["/total", "/using", "/waiting"];
    const [ deviceStatusType, setDeviceStatusType ] = useState(0);
    const [ devicePageNum, setDevicePageNum ] = useState(1);

    const alarmDataType = ["/fast", "/slow", "/stop", "/battery"];
    const [ alarmStatusType, setAlarmStatusType ] = useState(0);
    const [ alarmPageNum, setAlarmPageNum ] = useState(1);

    const devicecCountApi = UseApis({method: "get", url : apiLists.dashboardDevice + "/count", apiName: "dashboardDeviceCount", time : 15000, async: true});
    const deviceApi = UseApis({method: "get", url : apiLists.dashboardDevice + deviceDataType[deviceStatusType], params : {pageCount: 12, pageNum : devicePageNum }, apiName: "dashboardDevice", time : 15000, async: true});

    const alarmCountApi = UseApis({method: "get", url : apiLists.dashboardAlarm + "/count", apiName: "dashboardAlarmCount", time : 15000, async: true});
    const alarmApi = UseApis({method: "get", url : apiLists.dashboardAlarm + alarmDataType[alarmStatusType], params : {pageCount: 12, pageNum : alarmPageNum }, apiName: "dashboardAlarm", time : 15000, async: true});

    useEffect(() => {
        deviceApi.refetch();
    },[deviceStatusType, devicePageNum])

    useEffect(() => {
        alarmApi.refetch();
    },[alarmStatusType, alarmPageNum])

    return (
        <div className="dashboard_contents_body">
            {!devicecCountApi.isLoading &&  !deviceApi.isLoading &&
                <Components.MemoInfomationBig name='기기 사용현황' infoType='device' deviceCount = {devicecCountApi.data.data} data={deviceApi.data.data} 
                    setStatusType = {setDeviceStatusType} setPageNum = {setDevicePageNum} statusType = {deviceStatusType} pageNum = {devicePageNum}
                />     
            }
            {!alarmCountApi.isLoading &&  !alarmApi.isLoading &&
                <Components.MemoInfomationBig name='경고알람 현황' infoType='alarm' alarmCount = {alarmCountApi.data.data} data={alarmApi.data.data} 
                    setStatusType = {setAlarmStatusType} setPageNum = {setAlarmPageNum} statusType = {alarmStatusType} pageNum = {alarmPageNum}
                />      
            }
            <Components.MemoNotice data={NoticeData}/>
        </div>
    )
}

