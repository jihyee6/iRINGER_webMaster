import SideSearchbar from 'components/public/sideSearchbar';
import * as Components from 'components/alarm/AlarmComponents';

import AlarmData from 'apis/AlarmData';
import { SearchBar } from 'hooks/UseSearchbar';
import { UseApis } from 'hooks/UseApi';
import { apiLists, apiListsV2 } from 'apis/ApiLists';
import { useRecoilValue } from 'recoil';
import { AlarmSearchState } from 'recoils/SearchRecoil';

export default function Device() {

    const SearchbarSelect = SearchBar();
    const alarmStatus = useRecoilValue(AlarmSearchState);
    console.log(alarmStatus);

    // const alarmsApi = UseApis({method: "get", url : apiLists.alarm, 
    //                 params: {ward: SearchbarSelect.paramsID[0], room: SearchbarSelect.paramsID[1], bed : SearchbarSelect.paramsID[2], alarmName: alarmStatus.alarmName}, 
    //                 apiName: "alarm", time : false, async: true});
    const alarmsApi = UseApis({method: "get", url : apiListsV2.alarm, 
                    params: {hospital: SearchbarSelect.paramsID[0], ward: SearchbarSelect.paramsID[1], room: SearchbarSelect.paramsID[2], startDate: alarmStatus.startDate, endDate: alarmStatus.endDate, alarmName: alarmStatus.alarmName}, 
                    apiName: "alarm", time : false, async: true});

    return (
        <div className="device_contents_body">
            {
                (SearchbarSelect.hospitalApi !== null ? !SearchbarSelect.hospitalApi.isLoading : !SearchbarSelect.wardsApi.isLoading) &&
                <SideSearchbar bar_style='alarm'
                    paramsID = {SearchbarSelect.paramsID} setParmsID = {SearchbarSelect.setParamsID} setAsync = {SearchbarSelect.setAsync}
                    hospitalsData = {SearchbarSelect.hospitalApi} wardsData = {SearchbarSelect.wardsApi.data} roomsData = {SearchbarSelect.roomsApi.data}
                    refresh = {alarmsApi.refetch}
                />
            }
            {!alarmsApi.isLoading && <Components.MemoAlarmContents data = {alarmsApi.data.data}/>}
            
        </div>
    )
}