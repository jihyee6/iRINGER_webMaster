import 'css/Device.scss';

import SideSearchbar from 'components/public/sideSearchbar';
import * as Components from 'components/device/DeviceComponents';
import DeviceData from 'apis/DeviceData';
import { SearchBar } from 'hooks/UseSearchbar';
import { UseApis } from 'hooks/UseApi';
import { apiLists, apiListsV2 } from 'apis/ApiLists';
import { useRecoilValue } from 'recoil';
import { DeviceSearchState } from 'recoils/SearchRecoil';
import { useEffect } from 'react';

export default function Device() {

    const SearchbarSelect = SearchBar();
    const deviceStatus = useRecoilValue(DeviceSearchState);
    console.log(deviceStatus);

    //const deviceApi = UseApis({method: "get", url : apiLists.device, apiName: "device",params : {ward: SearchbarSelect.paramsID[0], room: SearchbarSelect.paramsID[1], bed : SearchbarSelect.paramsID[2], isUsing : deviceStatus}, time : false, async: true});
    const deviceApi = UseApis({method: "get", url : apiListsV2.device, apiName: "device",params : {hospital: SearchbarSelect.paramsID[0], ward: SearchbarSelect.paramsID[1], room: SearchbarSelect.paramsID[2], isUsing : deviceStatus}, time : false, async: true});

    // console.log({ward: SearchbarSelect.paramsID[0], room: SearchbarSelect.paramsID[1], bed : SearchbarSelect.paramsID[2], isUsing: deviceStatus});

    // recoil값 불러올때는 useRecoilValue
    // ()괄호안은 미리 만들어 놓은 recoil 가져오면 됨
    // console.log(deviceStatus);

    return (
        <div className="device_contents_body">
            {
                (SearchbarSelect.hospitalApi !== null ? !SearchbarSelect.hospitalApi.isLoading : !SearchbarSelect.wardsApi.isLoading) &&
                <SideSearchbar bar_style='device'
                    paramsID = {SearchbarSelect.paramsID} setParmsID = {SearchbarSelect.setParamsID} setAsync = {SearchbarSelect.setAsync}
                    hospitalsData = {SearchbarSelect.hospitalApi} wardsData = {SearchbarSelect.wardsApi.data} roomsData = {SearchbarSelect.roomsApi.data}
                    refresh = {deviceApi.refetch}
                />
            }
            {!deviceApi.isLoading && <Components.MemoDeviceContents data = {deviceApi.data.data} refresh = {deviceApi.refetch}/>}
        </div>
    )
}