import 'css/Station.scss';
import * as Component from "components/station/StationComponents";
import StationData from 'apis/StationData';

import { UseApis } from 'hooks/UseApi';
import { apiLists, apiListsV2 } from 'apis/ApiLists';
import { useEffect, useState } from 'react';
import { UseInterval } from 'hooks/UseInterval';

type SearchParam = {
    hospital: number,
    ward: number
}

export default function Station() {
    
    const [ param, setParam ] = useState<SearchParam>({hospital:0, ward: 0});
    const [ async, setAsync ] = useState(true);
    
    const useApi = UseApis({method: 'get', url : apiListsV2.wardInfo, apiName: "wardInfo", params : param, time : false, async: true});
    // const useApiWards = UseApis({method: 'get', url : apiLists.wards, apiName: "wards", time : false, async: async});

    const refresh_time: Date = new Date();
    const [date, setDate] = useState<Date>(refresh_time);

    useEffect(() => {
        setAsync(false)
    }, [setAsync])

    useEffect(() => {
        useApi.refetch();
    }, [param])

    // useEffect(() => {
    //     useApi.refetch();
    // }, [])

    // const today = new Date();
    // const sec = today.getSeconds();

    // useEffect(() => {
    //     console.log("time");
    //     let time:number = 0;
      
    //     switch(sec % 5){
    //         case 1 : time = 3500; break;
    //         case 2 : time = 2500; break;
    //         case 3 : time = 2000; break;
    //         case 4 : time = 1000; break;
    //     }

    //     setTimeout(() => {
    //         useApi.refetch();
    //     }, time);

    // }, [sec % 5 !== 0])

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
            useApi.refetch();
            setDate(refresh_time);
            console.log("10");
        }
    },[count])

    return (
        <div className="station_contents_body">
            {!useApi.isLoading && <Component.MemoStationHeadV2 setParam = {setParam} refresh = {useApi.refetch} cntData={useApi.data.data} isLoading = {useApi.isLoading} date = {date} setDate = {setDate}/>}
            {!useApi.isLoading && <Component.MemoStationBodyV2 data={useApi.data.data} refresh = {useApi.refetch}/>}
        </div>
    )
}