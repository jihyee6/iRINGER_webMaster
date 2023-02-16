import { apiLists, apiListsV2 } from "apis/ApiLists";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { LoginState } from "recoils/LoginRecoil";
import { UseApis  } from "./UseApi";

export function SearchBar() {

    const userGrade = useRecoilValue(LoginState).user_grade;

    const [ paramsID, setParamsID ] = useState<number[]>(
        () => {
            if(userGrade === 0) {
                return [0, 0, 0];
            } else {
                return [-1, 0, 0];
            }
        }
    );

    // userGrade === 0일때는 hospital만 true, 아닐경우 wards만 true
    const [ async, setAsync ] = useState<boolean[]>(
        () => {
            if(userGrade === 0) {
                return [true, false, false];
            } else {
                return [false, true, false];
            }
        }
    );

    let hospitalApi = null;

    if(userGrade === 0) {
        hospitalApi = UseApis({method: "get", url: apiListsV2.hospitals, apiName:"hospitals",  time: false, async: async[0]});
    }
    const wardsApi = UseApis({method: 'get', url : apiListsV2.wards, apiName: "wards", params : {hospital: paramsID[0]}, time : false, async: async[1]});
    const roomsApi = UseApis({method: 'get', url : apiLists.rooms, apiName: "rooms", params : {ward: paramsID[1]}, time : false, async : async[2]});
    // const bedsApi = UseApis({method: 'get', url : apiLists.beds, apiName: "beds", params : {room: paramsID[1]}, time : false, async : async[2]});

    useEffect(()=> {
        setAsync([false, false, false]);
    }, [setAsync, paramsID])

    return {hospitalApi,  wardsApi, roomsApi, paramsID, setParamsID, async, setAsync }

}