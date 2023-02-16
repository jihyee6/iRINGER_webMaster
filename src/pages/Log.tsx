import SideSearchbar from 'components/public/sideSearchbar';
import * as Components from 'components/log/LogComponents';
import 'css/Log.scss';

import { SearchBar } from 'hooks/UseSearchbar';
import { UseApis } from 'hooks/UseApi';
import { apiLists, apiListsV2 } from 'apis/ApiLists';
import { useRecoilValue } from 'recoil';
import { LoginState } from 'recoils/LoginRecoil';
import { AlarmSearchState, logSearchState } from 'recoils/SearchRecoil';


export default function Log() {

    const SearchbarSelect = SearchBar();
    
    const alarmStatus = useRecoilValue(AlarmSearchState);
    const patientStatus = useRecoilValue(logSearchState);

    console.log(alarmStatus);

    const logApi = UseApis({method: 'get', url: apiListsV2.log, apiName : "log", params:{hospital: SearchbarSelect.paramsID[0], ward: SearchbarSelect.paramsID[1],
        room: SearchbarSelect.paramsID[2], startDate: alarmStatus.startDate , endDate: alarmStatus.endDate , patientName: patientStatus},time: false, async :true});
    
    if(!logApi.isLoading){
        console.log(logApi.data.data);
    }


    return (
        <div className="device_contents_body">

            {
                (SearchbarSelect.hospitalApi !== null ? !SearchbarSelect.hospitalApi.isLoading : !SearchbarSelect.wardsApi.isLoading) &&
                <SideSearchbar bar_style='logs'
                    paramsID = {SearchbarSelect.paramsID} setParmsID = {SearchbarSelect.setParamsID} setAsync = {SearchbarSelect.setAsync}
                    hospitalsData = {SearchbarSelect.hospitalApi} wardsData = {SearchbarSelect.wardsApi.data} roomsData = {SearchbarSelect.roomsApi.data}
                    refresh={logApi.refetch}
                    />
            }
            {!logApi.isLoading && <Components.MemoLogContents data={logApi.data.data}/>}
        
        </div>
    )
}