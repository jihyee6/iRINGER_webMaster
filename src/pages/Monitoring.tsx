import 'css/Monitoring.scss';
import SideSearchbar from 'components/public/sideSearchbar';

import { UseApis } from 'hooks/UseApi';
import { apiLists } from 'apis/ApiLists';

import * as Components from 'components/monitoring/MonitoringComponents';

import { monitoringData } from 'apis/MonitoringData';
import { SearchBar } from 'hooks/UseSearchbar';
import { useRecoilState } from 'recoil';
import { useEffect } from 'react';
import { setInterval } from 'timers';
import { time } from 'console';

export default function Monitoring() {
    
    const SearchbarSelect = SearchBar();
    const today = new Date();
    const sec = today.getSeconds();
    
    // 자동갱신 시간 5초 단위 맞추기
    // 1,2,3,4 => 4, 3, 2, 1
    // 0, 5 => X
    // 6,7,8,9 => 4, 3, 2, 1

    useEffect(()=>{
        monitoringApi.refetch();
    },[])

    useEffect(() => {
        let time:number = 0;
      
        switch(sec % 5){
            case 1 : time = 3500; break;
            case 2 : time = 2500; break;
            case 3 : time = 1500; break;
            case 4 : time = 1000; break;
        }

        setTimeout(() => {
            monitoringApi.refetch();
        }, time);

    }, [sec % 5 !== 0])

    const monitoringApi = UseApis({method: 'get', url : apiLists.monitoring, apiName: "monitoring", params : {ward: SearchbarSelect.paramsID[0], room: SearchbarSelect.paramsID[1], bed : SearchbarSelect.paramsID[2]}, time : false, async: true});

    return (
        <div className="monitoring_contents_body">
            {/* {
                !SearchbarSelect.wardsApi.isLoading &&
                <SideSearchbar bar_style='monitoring' 
                    paramsID = {SearchbarSelect.paramsID} setParmsID = {SearchbarSelect.setParamsID} setAsync = {SearchbarSelect.setAsync}
                    wardsData = {SearchbarSelect.wardsApi.data} roomsData = {SearchbarSelect.roomsApi.data} hospitalsData = {SearchbarSelect.hospitalApi}
                    refresh = {monitoringApi.refetch}
                />
            } */}
            {
                (SearchbarSelect.hospitalApi !== null ? !SearchbarSelect.hospitalApi.isLoading : !SearchbarSelect.wardsApi.isLoading) &&
                <SideSearchbar bar_style='monitoring' 
                    paramsID = {SearchbarSelect.paramsID} setParmsID = {SearchbarSelect.setParamsID} setAsync = {SearchbarSelect.setAsync}
                    hospitalsData = {SearchbarSelect.hospitalApi} wardsData = {SearchbarSelect.wardsApi.data} roomsData = {SearchbarSelect.roomsApi.data}
                    refresh = {monitoringApi.refetch}
                />
            }
            {!monitoringApi.isLoading && <Components.Monitoring data={monitoringApi.data.data} refresh = {monitoringApi.refetch} setParmsID = {SearchbarSelect.setParamsID} setAsync = {SearchbarSelect.setAsync}/>}
        </div>
    )
}


