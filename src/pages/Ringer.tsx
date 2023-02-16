import SideSearchbar from 'components/public/sideSearchbar';
import * as Components from 'components/ringer/RingerComponents';
import RingerData from 'apis/RingerData';
import { UseApis } from 'hooks/UseApi';
import { apiLists } from 'apis/ApiLists';
import { RingerSearchState } from 'recoils/SearchRecoil';
import { useRecoilValue } from 'recoil';

export default function Device() {

    const ringerStatus = useRecoilValue(RingerSearchState);
    
    const ringersApi = UseApis({method: "get", url : apiLists.ringer, params:{searchText: ringerStatus}, apiName: "ringer", time : false, async: true}); 
    // params:{searchText: ringerStatus},
    console.log(ringerStatus);

    return (
        <div className="device_contents_body">
            <SideSearchbar bar_style='ringer' refresh = {ringersApi.refetch} />
           {!ringersApi.isLoading && <Components.MemoRingerContents data = {ringersApi.data.data} refresh={ringersApi.refetch}/>} 
        </div>
    )
}