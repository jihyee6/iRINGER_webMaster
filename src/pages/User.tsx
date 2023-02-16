import SideSearchbar from 'components/public/sideSearchbar';
import * as Components from 'components/user/UserComponents';
import 'css/User.scss';

import { SearchBar } from 'hooks/UseSearchbar';
import { UseApis } from 'hooks/UseApi';
import { apiLists, apiListsV2 } from 'apis/ApiLists';
import { useRecoilValue } from 'recoil';
import { LoginState } from 'recoils/LoginRecoil';
import { hospitalSearchState, userLockSearchState, UserSearchState, userTypeSearchState } from 'recoils/SearchRecoil';


export default function User() {

    const SearchbarSelect = SearchBar();
    
    const userStatus = useRecoilValue(UserSearchState);
    const userTypeStatus = useRecoilValue(userTypeSearchState);
    const userLockStatus = useRecoilValue(userLockSearchState);

    const useApi = UseApis({method: 'get', url: apiListsV2.user, apiName: "user", params : {hospital : SearchbarSelect.paramsID[0], name: userStatus, grade : userTypeStatus , locked : userLockStatus}, time : false, async: true})
    
    return (
        <div className="device_contents_body">

            {   
                (SearchbarSelect.hospitalApi !== null ? !SearchbarSelect.hospitalApi.isLoading : !SearchbarSelect.wardsApi.isLoading) &&
                <SideSearchbar bar_style='user'
                    paramsID = {SearchbarSelect.paramsID} setParmsID = {SearchbarSelect.setParamsID} setAsync = {SearchbarSelect.setAsync}
                    hospitalsData = {SearchbarSelect.hospitalApi} wardsData = {SearchbarSelect.wardsApi.data} roomsData = {SearchbarSelect.roomsApi.data}
                    refresh = {useApi.refetch}
                    />
            }

            {!useApi.isLoading && <Components.MemoUserContents data = {useApi.data.data} refresh ={useApi.refetch}/>}
        </div>
    )
}