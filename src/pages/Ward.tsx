import SideSearchbar from 'components/public/sideSearchbar';
import { SearchBar } from 'hooks/UseSearchbar';
import * as Components from 'components/ward/WardComponents';
import 'css/Ward.scss';
import React, { useEffect, useState } from 'react';
import { UseApis } from 'hooks/UseApi';
import { apiListsV2 } from 'apis/ApiLists';

function Ward() {
    const SearchbarSelect = SearchBar();
    const [selectWard, setSelectWard] = useState(-1);

    console.log(selectWard);

    const hospitalInfoApi = UseApis({method: 'get', url: apiListsV2.hopitalInfo, apiName: "hospitalName", params: {hospital: SearchbarSelect.paramsID[0], ward: selectWard}, time: false, async :true})
    
    if(!hospitalInfoApi.isLoading){
        console.log(hospitalInfoApi.data.data);
    }

    useEffect(() => {
        hospitalInfoApi.refetch();
    },[selectWard])

    useEffect(() => {
        SearchbarSelect.wardsApi.refetch();
    }, [hospitalInfoApi])


    return (
        <div className="device_contents_body">
            {(SearchbarSelect.hospitalApi !== null ? !SearchbarSelect.hospitalApi.isLoading : !SearchbarSelect.wardsApi.isLoading) &&
            <SideSearchbar bar_style='ward' 
            paramsID = {SearchbarSelect.paramsID} setParmsID = {SearchbarSelect.setParamsID} setAsync = {SearchbarSelect.setAsync} hospitalsData = {SearchbarSelect.hospitalApi}
            setSelectWard ={setSelectWard} selectWard={selectWard} wardListData = {SearchbarSelect.wardsApi.data} refresh={SearchbarSelect.wardsApi.refetch}
            />}
            {!hospitalInfoApi.isLoading && <Components.MemoWardContents data = {hospitalInfoApi.data.data} refresh ={hospitalInfoApi.refetch} 
            hospitalID ={SearchbarSelect.paramsID[0]} wardRefresh={SearchbarSelect.wardsApi.refetch}
            />}
            
            
        </div>
    );
}

export default Ward;