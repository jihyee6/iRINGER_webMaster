import React, { useState, useRef, useEffect, useCallback }from 'react';
import SearchName from './searchName';
import Button from './button';
import SelectBox from './selectBox';
import InputText from './inputText';

import UseModal from 'hooks/UseModal';
import { MemoModal, MemoModalHead, MemoModalFoot } from 'components/public/modal';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query';
import { useRecoilState, useRecoilValue } from 'recoil';
import { DeviceSearchState, AlarmSearchState, userLockSearchState, userTypeSearchState, hospitalSearchState } from 'recoils/SearchRecoil';
import { UseApis, UseMutation } from 'hooks/UseApi';
import { apiLists, apiListsV2 } from 'apis/ApiLists';
import { LoginState } from 'recoils/LoginRecoil';

type side_searchbar = {
    bar_style: string;
    paramsID?: number[];
    setParmsID?: React.Dispatch<React.SetStateAction<number[]>>;
    setAsync?: React.Dispatch<React.SetStateAction<boolean[]>>;
    wardsData?: any | undefined;
    roomsData?: any | undefined;
    bedsData?: any | undefined;
    hospitalsData? : any | null;
    refresh?:<TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
    wardListData?: any | undefined;
    setSelectWard?: React.Dispatch<React.SetStateAction<number>>;
    selectWard?: number;
}

function SideSearchbar({bar_style, paramsID, setParmsID, setAsync, wardsData, roomsData, bedsData, hospitalsData, refresh, wardListData,setSelectWard,selectWard}: side_searchbar) {

    // console.log("rendering_sidebar");

    console.log(hospitalsData);

    const 병동 = [
        {categoryName : "전체"}, {categoryName : "A병동"}, {categoryName : "B병동"}, {categoryName : "C병동"},
    ]

    const 병실 = [
        {categoryName : "전체"}, {categoryName : "101호"}, {categoryName : "102호"}, {categoryName : "103호"}, {categoryName : "104호"}, {categoryName : "105호"}, {categoryName : "106호"}, {categoryName : "107호"}
    ]

    const 베드 = [
        {categoryName : "전체"}, {categoryName : "#1"}, {categoryName : "#2"}, {categoryName : "#3"}, {categoryName : "#4"}
    ]

    const 알람 = [
        {categoryName : "속도빠름", categoryID: "FAST" }, {categoryName : "속도느림", categoryID : "SLOW"}, {categoryName : "투여중단", categoryID : "STOP"}, {categoryName : "배터리 부족", categoryID : "BATTERY"}, {categoryName : "측정시작", categoryID : "START" }, {categoryName : "측정종료", categoryID : "END" }, {categoryName : "잔여수액", categoryID : "REMAIN"}, {categoryName : "잔여시간", categoryID : "LIMIT"}
    ]

    const 병원 = [
        {categoryName : "에이디오트"}
    ]

    const modal = UseModal();

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(ward);
        console.log(room);
        console.log(bed);
        console.log(alarm);
    }

    const [ward, setWard] = useState(0);
    const [room, setRoom] = useState(0);
    const [bed, setBed] = useState(0);
    const [hospital, setHospital] = useState(0);

    const [alarm, setAlarm] = useState("");

    const onClick = () => {
        if(refresh) {
            refresh();
        }
    }

    const [, setalarmSearch] = useRecoilState(AlarmSearchState);

    const alarmStatus = useRecoilValue(AlarmSearchState);

    const userGrade = useRecoilValue(LoginState).user_grade;

    const onStartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setalarmSearch({
            startDate: e.target.value,
            endDate : alarmStatus.endDate,
            alarmName: alarm
        })
    }
    const onEndChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setalarmSearch({
            startDate: alarmStatus.startDate,
            endDate : e.target.value,
            alarmName: alarm
        })
    }

    useEffect(() => {
        setalarmSearch({
            startDate: alarmStatus.startDate,
            endDate : alarmStatus.endDate,
            alarmName: alarm
        })
    },[alarm])

    // const hospitalApi = UseApis({method: "get", apiName:"hospitalList", url: apiListsV2.hospitals, time: false, async: true});
    // let hospitalData = [];
    // if(!hospitalApi.isLoading){
    //     hospitalData = hospitalApi.data.data;
    //     console.log(hospitalData);
    // }
    console.log(wardListData);
    
    const wardClick = (id:number) => {
        if(setSelectWard){
            setSelectWard(id);
        }
    }

    return (
        <>
            {modal.isOpenModal && 
                <MemoModal onClickToggleModal={modal.onClickToggleModal} width = {600} sideModal = {modal.onClickToggleModal}>
                    <MemoPlusModal closeModal = {modal.onClickToggleModal} bar_style = {bar_style} refresh = {refresh} hospitalID = {paramsID ? paramsID[0] : -1}/>
                </MemoModal>
            }
            <div className="side_searchbar">
                <form onSubmit={onSubmit}>
                {((bar_style === 'device' || bar_style === 'alarm' || bar_style === "user" || bar_style === "logs" || bar_style === "ward" ) && hospitalsData !== null) && 
                    <>
                        <SearchName name ="병원" />
                        <SelectBox subject='병원' size='M' options={hospitalsData.data.data} onChange ={setHospital} paramsID = {paramsID} setParmsID = {setParmsID} setAsync = {setAsync}/>
                    </>
                }
                {(bar_style === 'device' || bar_style === 'monitoring' || bar_style === 'alarm' || bar_style === "logs") &&
                    <>
                        <SearchName name ="위치" />
                        <SelectBox subject='병동' size='M' options={wardsData ? wardsData.data : 병동} onChange = {setWard} paramsID = {paramsID} setParmsID = {setParmsID} setAsync = {setAsync}/>
                        <SelectBox subject='병실' size='M' options={roomsData ? roomsData.data : 병실} onChange = {setRoom} paramsID = {paramsID} setParmsID = {setParmsID} setAsync = {setAsync}/>
                        {/* {bar_style !== "logs" && <SelectBox subject='베드' size='M' options={bedsData ? bedsData.data : 베드} onChange = {setBed} paramsID = {paramsID} setParmsID = {setParmsID} setAsync = {setAsync}/>} */}
                    </>
                }
                {(bar_style === 'ringer' || bar_style === "user") &&
                    <>
                        <SearchName name ="검색" />
                        <div className='search_wrapper'>
                            <InputText textType='string' placeholder={bar_style !== "user" ?'검색어를 입력해 주세요.': "이름을 입력해주세요."} size = " M" url={bar_style !== "user" ? 'ringer' : 'user'}/>
                        </div>
                    </>
                }
                { (bar_style === 'alarm' || bar_style === "logs") && 
                    <>
                        <SearchName name ="기간" />
                        <div className = "date_wrapper">
                            <div>
                                <input type = "date" onChange={onStartChange} data-placeholder="시작일" />
                                <div></div>
                            </div>
                            <div>
                                <input type = "date" onChange={onEndChange}data-placeholder="종료일" />
                            </div>
                        </div>
                        {bar_style !== "logs" && 
                        <>
                            <SearchName name ="구분" />
                            <SelectBox subject='전체' size='M' options={알람} onChange = {setAlarm} paramsID = {[0]}/>
                        </>
                        }
                        
                    </> 
                }
                {bar_style === 'user' && <MemoRadio url ="user"/>}
                {bar_style === 'device' && <MemoRadio url ="device"/>}
                {bar_style === "logs" &&
                    <>
                    <SearchName name ="환자명" />
                    <div className='search_wrapper'>
                        <InputText textType='string' placeholder="환자명을 입력해주세요." size = " M" url='logs'/>
                    </div>
                </>
                }
                {(bar_style === "ward" && setSelectWard ) && (
                    <div className='wardSearchBox'>
                    <InputText textType='string' placeholder="Search" size = " M" url='ward'/>
                    <div className='wardSearchList'>
                        <ul>
                            <li id="0" className={selectWard === 0 ? 'wardClick' : ""} onClick={()=> wardClick(0)}>전체</li>
                        {wardListData && wardListData.data.map((ward:any, index:number) => (
                            <li key = {index} id={ward.wardID} className={selectWard === ward.wardID ? 'wardClick':""} onClick={() => wardClick(ward.wardID)}>{ward.wardName}</li>
                        ))}
                        </ul>
                    </div>
                    </div>
                )}
                {bar_style !== "ward" && <Button name='검색' size='M' onClick = {onClick}/>}
                </form>
                { (bar_style === 'device' || bar_style === 'ringer' || bar_style === "user" || bar_style === "ward") && 
                    <div className = "bottom_btn">
                        {userGrade !== 2 && <Button name={bar_style === "device" ? '기기 추가 + ' : bar_style === "ringer" ? '수액 추가 + ' : bar_style === "user"? "사용자 추가 + ": "병동 추가 + "} size='L' onClick = {modal.onClickToggleModal} /> }
                    </div>
                }
            </div>
        </>
    )

}

export default React.memo(SideSearchbar);


type modal = {
    closeModal: () => void;
    bar_style: string;
    refresh?:<TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
    hospitalID: number;
}

type returnData = {
    code: string;
    message: string;
}

function PlusModal({closeModal, bar_style, refresh, hospitalID }: modal) {

    const [ process, setProcess ] = useState(false);

    const [count, setCount] = useState<number>(1);
    const [deviceNum, setDeviceNum] = useState("");
    // 아직 컬럼이름을 몰라서 nickName으로 명명
    const [deviceNickName, setDeviceNickName] = useState("");

    const [productName, setProductName] = useState("");
    const [ringerName, setRingerName] = useState("");

    const [addUserId, setAddUserId] = useState("");
    const [addUserName, setAddUserName] = useState("");
    const [addUserPw, setAddUserPw] = useState("");
    const [addUserType, setAddUserType] = useState(0);

    const [ addWardName, setAddWardName] = useState("");
    

    const [ ml, setMl ] = useState<Array<number>>([-1]);

    let modal_head_name:string = "";

    let url = "";
    let body:any = "";

    if(bar_style === "device") {
        modal_head_name = "기기추가";
        url = apiLists.device;
        // api수정되면 후에 body에 nickName 추가
        body = { "deviceNum": deviceNum };
    } else if (bar_style === "ringer") {
        modal_head_name = "수액추가";
        url = apiLists.ringer;
        body = { "productName" : productName, "ringerName" : ringerName, "ml": ml};
    } else if (bar_style === "user") {
        modal_head_name = "사용자 추가";
        url = apiListsV2.user;
        body = { "hospital" : hospitalID, "loginID" : addUserId, "password": addUserPw, "name" : addUserName, "grade" : addUserType};
    }  else if (bar_style === "ward") {
        modal_head_name = "병동 추가";
        url = apiListsV2.wards;
        body = {hospital: hospitalID, "wardName" : addWardName};
    }

    // api 추가되는 장소
    const addData = UseMutation({method: "post", url: url, apiName: "addData", body: body, refresh: refresh});

    // string[] => string배열
    // Array<string> => 제너릭 방식
    const [type, setType] = useState("");
    
    if(count === 0) {
        setCount(1)
    }

    useEffect(() => {
        console.log(addData.data?.data);
        
        if(addData.data) {
            if(bar_style === "device"){
                if(addData.data.data.message === "Success") {
                    closeModal();
                } else if (addData.data.data.message === "Fail") {
                    alert("기기를 추가하지 못하였습니다. 에러가 계속되면 문의 주시기 바랍니다.")
                } else {
                    alert(addData.data.data.code + " 에러. 본사 문의 바랍니다.")
                }
            } else if (bar_style === "user"){
                if(addData.data.data.message === "Success"){
                    closeModal();
                } else if(addData.data.data.message === "Duplicate"){
                    alert("중복된 아이디 입니다. 다른 아이디를 사용하세요.")
                } else if( addData.data.data.message === "Retry"){
                    alert("시간이 소요되니 잠시만 기다려주십시오.");
                    closeModal();
                }
            }
        }
    },[addData.data?.data])

    const plus = () => {
        if(bar_style === "device") {
            if(deviceNum === ""){
                alert("시리얼 넘버를 입력해주세요.");
            } else if (deviceNickName == "") {
                alert("기기 이름을 입력해주세요.");
            } else {
                console.log(deviceNum);
                addData.mutate();
            }
        } else if (bar_style === "ringer") {
            if(productName === ""){
                alert("제품명을 입력해주세요.");
            } else if(ringerName === ""){
                alert("관리명을 입력해주세요.");
            } else {
                // console.log(productName);
                // console.log(ringerName);
                console.log(ml);

                let start = true;
                let index = 0;

                while (start) {
                    if(ml[index] === -1) {
                        alert("용량을 입력해 주세요.");
                        break;
                    }

                    index++;

                    if(index === ml.length) {
                        start = false;
                    }
                }
                if(start === false) {
                    addData.mutate();
                    closeModal();
                }
            }
        } else if(bar_style === "user"){
            if(hospitalID === 0) {
                alert("병원을 먼저 선택해 주세요.")
            } else {
                if( addUserId === ""){
                    alert("사용자의 아이디를 입력해주세요.");
                } else if(addUserPw === ""){
                    alert("사용자의 비밀번호를 입력해주세요.");
                } else if(addUserName === ""){
                    alert("사용자의 이름을 입력해주세요.");
                } else if(addUserType === 0){
                    alert("사용자의 계정 유형을 선택해주세요.");
                } else {
                    addData.mutate();
                }
            }
        } else if(bar_style === 'ward'){
            if(hospitalID === 0) {
                alert("병원을 먼저 선택해 주세요.")
            } else {
                if(addWardName === ""){
                    alert("추가할 병동 명을 입력해주세요.")
                } else{
                    addData.mutate();
                    closeModal();
                }
            }
        }
    }

    const minusml = () => {
        if(count > 1) {
            setMl(ml.filter((mls,index) => index !== count-1))
        }
    }

    const changeUserType = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const userTypeId = parseInt(event.target.value);
        
        setAddUserType(userTypeId);
    }
    
    if(hospitalID === 0) {
        alert("병원을 먼저 선택해 주세요.");
        closeModal();
    }

    return (
        <>
            <MemoModalHead name= {modal_head_name} closeModal={closeModal} closeType = "x"/>
            <div className = "modal_body">
                { bar_style === "device" ?
                    <table className = "station_modal_table">
                        <tbody>
                            <tr>
                                <td>시리얼 넘버</td>
                                <td className = "not_padding">
                                    <InputText textType='input' placeholder='시리얼 넘버를 입력해주세요.' size=' XS_M' url='device' setValue={setDeviceNum}/>
                                </td>
                            </tr>
                            <tr>
                                <td>기기 이름</td>
                                <td className = "not_padding">
                                    <InputText textType='input' placeholder='기기 이름을 입력해 주세요.' size=' XS_M' url='device' setValue={setDeviceNickName}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    : bar_style === "ringer" ?
                    <table className = "station_modal_table">
                        <tbody>
                            <tr>
                                <td>제품명</td>
                                <td className = "sidebar_top_modal"><InputText textType='input' placeholder='제품명을 입력해주세요.' size=' XS_M' setValue={setProductName}/></td>
                            </tr>
                            <tr>
                                <td>관리명</td>
                                <td className = "not_padding"><InputText textType='input' placeholder='관리명을 입력해주세요.' size=' XS_M' setValue={setRingerName}/></td>
                            </tr>
                            <tr>
                                <td>용량(ml)</td>
                                <td className = "sidebar_modal">
                                    <div className = "ml_wrapper">
                                        {InputBox(count, ml)}
                                        {/* <InputText textType='input' placeholder='ml' size=' XXS_M'/> */}
                                        <div className = "calc_wrapper">
                                            <Button name='+' size='Calc' onClick = {() => {setCount(count + 1); setMl([...ml, -1]);}}/>
                                            <Button name='-' size='Calc' onClick = {() => {setCount(count - 1); minusml();}}/>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                : bar_style === "user" ?
                <table className = "station_modal_table">
                    <tbody>
                        <tr>
                            <td>아이디</td>
                            <td className = "sidebar_top_modal">
                                <InputText textType='input' placeholder='아이디를 입력해주세요.' size=' XS_M' setValue={setAddUserId}/>
                                </td>
                        </tr>
                        <tr>
                            <td>비밀번호</td>
                            <td className = "not_padding">
                                <InputText textType='input' inputType="password" placeholder='비밀번호를 입력해주세요.' size=' XS_M' setValue={setAddUserPw}/>
                            </td>
                        </tr>
                        <tr>
                            <td>이름</td>
                            <td className = "not_padding">
                                <InputText textType='input' placeholder='이름을 입력해주세요.' size=' XS_M' setValue={setAddUserName}/>
                            </td>
                        </tr>
                        <tr>
                            <td>계정유형</td>
                            <td className = "not_padding">
                                <select name="userType" id="userType" onChange={changeUserType} defaultValue={0} className='userSelect'>
                                    <option value="0">선택</option>
                                    <option value="1">관리자</option>
                                    <option value="2">사용자</option>
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            : 
            <table className = "station_modal_table">
                <tbody>
                    <tr>
                        <td>병동 명</td>
                        <td className = "sidebar_top_modal">
                            <InputText textType='input' placeholder='추가하실 병동 명을 입력해주세요.' size=' XS_M' setValue={setAddWardName}/>
                            </td>
                    </tr>
                </tbody>
            </table>
        }
                <div className = "station_modal_btn">
                    <MemoModalFoot name={modal_head_name} plus={plus} onClick = {setProcess} btn_size='M_M' />
                    <MemoModalFoot name='취소' btn_size='M_M clear' closeModal= {closeModal}/>
                </div>
            </div>
        </>
    )
}

export const MemoPlusModal = React.memo(PlusModal);

function InputBox(count: number, ml : number[]) {
    let inputArray = [];
    console.log(ml);

    const mlValue =
        (value: number, i: number) => {
            ml[i] = value;
        };

    for (let i = 0; i < count; i++) {
        inputArray.push(<input type = "text" className = "input_text XXS_M"  placeholder='ml' onChange={(e) => mlValue(parseInt(e.target.value), i)}/>);
    }

    return inputArray;
}

type radioData ={
    url : string;
}

function Radio({url}: radioData) {

    // useState랑 사용방법 똑같음
    // ()안의 값만 미리 만들어 놓은 recoil atom을 불러와서 넣어줌
    const [, setDeviceStatus] = useRecoilState(DeviceSearchState);
    const [, setUserLockStatus] = useRecoilState(userLockSearchState);
    const [, setUserTypeStatus] = useRecoilState(userTypeSearchState);

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);

        const searchValue = e.target.value;
        let searchType: null | boolean = null;
        let searchUserType : boolean = false;

        if(searchValue === "0") {
            searchType = null;
            searchUserType = false;
        } else if (searchValue === "1") {
            searchType = true;
            searchUserType = true;
        } else if (searchValue === "2") {
            searchType = false;
            searchUserType = false;
        }

        if(url === "device"){
            setDeviceStatus(searchType);
        } else if(url === "user"){
            setUserLockStatus(searchUserType);
        }
    }

    const userTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);

        const searchValue = parseInt(e.target.value);
        if(url === 'user'){
            setUserTypeStatus(searchValue);
        }
    }

    return (
        <>
        {url === "device" ? <>
        <SearchName name='상태' />
            <div className='radio_wrapper'>
                <div>
                    <input type = "radio" name = "status" value= "0" defaultChecked={true} onChange={onChange}/><span>전체</span>
                    <input type = "radio" name = "status" value= "1"  onChange={onChange}/><span>측정중</span>
                    <input type = "radio" name = "status" value= "2"  onChange={onChange}/><span>대기중</span>
                </div>
            </div>
        </>: url === 'user' ? 
            <>
                <SearchName name ="잠금" />
                <div className='radio_wrapper'>
                    <div>
                        <input type = "radio" name = "userLock" value= "0" defaultChecked={true} onChange={onChange} /><span>전체</span>
                        <input type = "radio" name = "userLock" value= "1" onChange={onChange}  /><span>잠금</span>
                    </div>
                </div>
                
                <SearchName name ="계정" />
                <div className='radio_wrapper'>
                    <div>
                        <input type = "radio" name = "userType" value= "0" defaultChecked={true} onChange={userTypeChange} /><span>전체</span>
                        <input type = "radio" name = "userType" value= "1" onChange={userTypeChange} /><span>관리자</span>
                        <input type = "radio" name = "userType" value= "2" onChange={userTypeChange} /><span>사용자</span>
                    </div>
                </div>
            </>
        :""}
            
        </>
    )
}

export const MemoRadio = React.memo(Radio);