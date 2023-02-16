import React from 'react';

import Table from 'components/public/resultTable';
import Button from 'components/public/button';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { LoginState } from 'recoils/LoginRecoil';
import { UseMutation } from 'hooks/UseApi';
import { apiLists, apiListsV2 } from 'apis/ApiLists';
import { UserDeleteState } from 'recoils/UserRecoil';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query';

type UserData = {
    loginID :string,
    user_ID: number,
    userGrade: number,
    userName: string,
    isLocked : boolean,
    registerDate?: string,
    unregisterDate? : string | null,
}

type UserContentsType = {
    data: Array<UserData>;
    refresh : <TPageData>(options?: any) => Promise<QueryObserverResult<any, unknown>>;
}

function UserContents({data,refresh}: UserContentsType) {

    console.log(data);

    const th_name:string[] = ["check_box","아이디", "이름", "계정유형", "잠금여부","관리"]

    const loginInfo = useRecoilValue(LoginState);

    if(loginInfo.user_grade === 0){
        th_name.splice(5,0,"등록일", "탈퇴일");
    }

    console.log(th_name);
    return (
        <div className="monitoring">
            
            <UserContentHead count = {data.length} refresh={refresh}/>
            <div className="user_body">
                <Table tableUrl='users' name={th_name} data = {data} refresh={refresh}/>
            </div>
        </div>
    )
}

export const MemoUserContents = React.memo(UserContents);

type _UserContentsHead = {
    count: number;
    refresh: <TPageData>(options?: any) => Promise<QueryObserverResult<any, unknown>>;
}

function UserContentHead({count,refresh}: _UserContentsHead) {

    /// 여기서 event 처리
    const userNum = useRecoilValue<string[]>(UserDeleteState);
    const deleteData = UseMutation({method: "delete", url: apiListsV2.user, apiName: "deleteUser", body: {"loginID": userNum }, refresh: refresh});

    const unLockData = UseMutation({method: "put", url: apiListsV2.unlock, apiName: "unLockUser", body: {"loginID": userNum }, refresh: refresh});
    
    const resetRecoil = useResetRecoilState(UserDeleteState);

    const onClick = () => {
        deleteData.mutate();
        resetRecoil();
    }
    const unLock = () => {
        unLockData.mutate();
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
                    <Button name='잠금해제' size='S' onClick={unLock}/>
                    <Button name='선택삭제' size='S' onClick={onClick}/>
                </div>
            </div>
        </div>
    )
}

export const MemoUserContentHead = React.memo(UserContentHead);