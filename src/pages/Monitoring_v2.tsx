import 'css/Monitoring.scss';
import 'css/Dashboard.scss';

import { UseApis } from 'hooks/UseApi';
import { apiListsV2 } from 'apis/ApiLists';

import * as Components from 'components/monitoring/MonitoringComponents';

import { useCallback, useEffect, useState } from 'react';
import Timer from 'lib/RefetchTimer';
import { useLocation } from 'react-router-dom';
import { UseInterval } from 'hooks/UseInterval';



export default function MonitoringV2() {
    
    const [ hospitals, setHospitals ] = useState(0);

    const monitoringApiV2 = UseApis({method: 'get', url : apiListsV2.monitoring, apiName: "monitoringV2", params : {hospital: hospitals}, time : false, async: true});

    const [folding, setFoliding] = useState(false);

    const refresh_time: Date = new Date();
    const [date, setDate] = useState<Date>(refresh_time);

    const foldingMenu = () =>{
        setFoliding(!folding);
    }

    useEffect(() => {
        monitoringApiV2.refetch();
    }, [hospitals])

    const [count, setCount] = useState(
        () => {
            var now = new Date();
            var seconds = now.getSeconds();
            return seconds;
        }
    );
    // 우선사용하고 나중에 하나로 합치기(UseInterval, setDate);
    UseInterval(() => setCount(count => count + 1), 1000);

    useEffect(() => {
        if(count%10 === 0) {
            monitoringApiV2.refetch();
            setDate(refresh_time);
            console.log("10");
        }
    },[count])

    return (
        <div className= {"monitoring_contents_body_v2" + (folding ? " folding" : "")}>
            {!monitoringApiV2.isLoading && <Components.MemoSideDashboard data={monitoringApiV2.data.data} folding = {folding}/>}
            <div className="monitoring_middle">
                <div className="folding_arrow" onClick = {foldingMenu}>{folding ? '>' : '<' }</div>
            </div>
            {!monitoringApiV2.isLoading && <Components.MemoMonitoringV2 
                data={monitoringApiV2.data.data} refresh = {monitoringApiV2.refetch} setHospitals = {setHospitals} hospitals = {hospitals}
                date={date} setDate={setDate}
            />}
        </div>
    )
}


