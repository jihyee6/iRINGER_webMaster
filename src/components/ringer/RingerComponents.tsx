import React from 'react';

import Button from 'components/public/button';
import Table from 'components/public/resultTable';
import { UseMutation } from 'hooks/UseApi';
import { apiLists } from 'apis/ApiLists';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { RingerDeleteState } from 'recoils/RingerRecoil';
import { RefetchOptions, RefetchQueryFilters, QueryObserverResult } from 'react-query';


type RingerData = {
    ringerID: number;
    ringerProductName: string;
    ringerName: string;
    totalList: number[];
    registerTime: string;
}

type ringer_contetns = {
    data: Array<RingerData>;
    refresh?: (<TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>) | undefined;
}

function RingerContents({data, refresh}: ringer_contetns) {

    const th_name:string[] = ["check_box", "제품명", "관리명", "용량(ml)", "등록일시"];
    console.log(data);
    return (
        <div className="monitoring">
            <RingerContentHead count = {data.length} refresh={refresh}/>
            <div className="device_body">
                <Table tableUrl='ringer' name={th_name} data = {data}/>
            </div>
        </div>
    )
}

export const MemoRingerContents = React.memo(RingerContents);

type ringer_contetns_head ={
    count: number;
    refresh?: (<TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>) | undefined;
}

function RingerContentHead({count,refresh}: ringer_contetns_head) {
    
    const ringerNum = useRecoilValue(RingerDeleteState);
    const deleteData = UseMutation({method: "delete", url: apiLists.ringer, apiName: "deleteRinger", body: {"ringerID": ringerNum}, refresh:refresh})
    const resetRecoil = useResetRecoilState(RingerDeleteState);
    
    const onClick = () =>{
        deleteData.mutate();
        resetRecoil();
    }

    return (
        <div className="monitor_head">
            <div className="monitor_status">
                <div>총 <span>{count}</span>개</div>
            </div>
            <div className="monitor_array">
                <div className="array_box">
                    <Button name='선택삭제' size='S' onClick={onClick} />
                </div>
            </div>
        </div>
    )
}

export const MemoRingerContentHead = React.memo(RingerContentHead);