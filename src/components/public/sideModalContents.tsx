import React, { useState, useEffect } from 'react';
import SelectBox from 'components/public/selectBox';
import InputText from "components/public/inputText";
import Button from 'components/public/button';
import { MemoModalHead } from 'components/public/modal';
import ImgUrl from 'components/public/alarmImg';

import AlaramData from 'apis/AlarmData';
import { apiLists, apiListsV2 } from 'apis/ApiLists';
import { UseApis, UseMutation } from 'hooks/UseApi';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bedIDState, deviceIDState, patientNameState, wardIDState } from 'recoils/MonitoringRecoil';
import Comments from './alarmComment';
import { DeviceSelectState, HospitalSelectState, RingerSelectState } from 'recoils/StationRecoil';

type side_modal_contents = {
    closeModal: () => void | undefined;
    sideModalType: string | undefined;
}

type RingerData = {
    ringerID: number;
    ringerProductName: string;
    ringerName: string;
    totalList: number[];
    registerTime: string;
}

type DeviceData = {
    bedName : string;
    deviceID : string;
    deviceName : string;
    isUsing : boolean;
    remainBattery : string;
    roomName : string;
    wardName : string;
}

function SideModalContents({closeModal, sideModalType}: side_modal_contents) {

    const [text, setText] = useState("");
    const [allSearch, setAllSearch] = useState(true);

    const [ringerData, setRingerData] = useState<Array<RingerData>>();
    const [deviceData, setDeviceData] = useState<Array<DeviceData>>();

    const [ringerName, setRingerName] = useState("-");
    const [ringerList, setRingerList] = useState<Array<number>>();

    const [deviceSelect, setDeviceSelect] = useRecoilState(DeviceSelectState);
    const [ringerSelect, setRingerSelect] = useRecoilState(RingerSelectState);

    const [newDeviceID, setNewDeviceID] = useState("-");

    const [Selected, setSelected] = useState(0);
    const [ringerSpeed, setRingerSpeed] = useState(0);

    const [write, setWrite] = useState(false);
    
    const handleWriteCapacity = (e:React.ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value;
        let number = value.replace(/[^0-9]/g, '');

        if(value === "") {
            number = "0";
        }

        setSelected(parseInt(number));

    }

    const handleWriteRingerSpeed = (e:React.ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value;
        let number = value.replace(/[^0-9]/g, '');

        if(value === "") {
            number = "0";
        }

        setRingerSpeed(parseInt(number));

    }

    const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if(parseInt(e.target.value) === -1){
            setWrite(true); 
        } else {
            setSelected(parseInt(e.target.value));
            setWrite(false);
        }
    }

    const alarmValue = useRecoilValue(bedIDState);
    const deviceIDValue = useRecoilValue(deviceIDState);
    const patientNameValue = useRecoilValue(patientNameState);

    const hospitalState = useRecoilValue(HospitalSelectState);

    const ringersApi = UseApis({method: "get", url : apiLists.ringer, params:{searchText: text}, apiName: "searchRinger", time : false, async: true}); 

    const wardIDValue = useRecoilValue(wardIDState);
    // wardID 필요시 사용

    // const deviceApi = UseApis({method: "get", url : apiLists.device, apiName: "device",params : {ward: 0, room: 0, bed : 0, isUsing : 2}, time : false, async: true});

    const deviceApi = UseApis({method: "get", url : apiListsV2.device, apiName: "device",params : {hospital: hospitalState, ward: 0, room: 0, isUsing : false, name: text}, time : false, async: true});

    const ringerChangeApi = UseMutation({method: "post", url : apiLists.ringerChange, 
        body:{deviceID: deviceIDValue, ringerName: ringerName, ringerSpeed: ringerSpeed, ringerTotal: Selected, patientName: patientNameValue}, 
        apiName: "ringerChangeApi"}); 

    const deviceChangeApi = UseMutation({method: "post", url : apiLists.deviceChange, 
        body:{oldDeviceID : deviceIDValue, newDeviceID : newDeviceID}, 
        apiName: "deviceChangeApi"}); 

    const requestRinger = () => {

        if(sideModalType === "ringer" || sideModalType === "ringer_s") {
            setText("");
            setAllSearch(!allSearch);
            ringersApi.refetch();
        } else if (sideModalType === 'device' || sideModalType === "device_s") {
            setText("");
            setAllSearch(!allSearch);
            // deviceApi.refetch();
        }
    }

    useEffect(() => {
        deviceApi.refetch();
    }, [allSearch])

    const searchRinger = () => {
        
        if(sideModalType === "ringer" || sideModalType === "ringer_s") {
            ringersApi.refetch();
        } else if (sideModalType === "device" || sideModalType === "device_s") {
            deviceApi.refetch();
        }
    }

    useEffect(() => {
        if(!ringersApi.isLoading) {
            setRingerData(ringersApi.data.data);
        }
    }, [ringersApi])

    useEffect(() => {
        if(!deviceApi.isLoading) {
            setDeviceData(deviceApi.data.data);
        }
    },[deviceApi])

    // console.log(sideModalType);

    let sideModalName = "";
    let placeHolder = "";
    let data_status_name = "";

    if(sideModalType === "alarm") {
        sideModalName = "알림정보 전체보기";
    } else if (sideModalType === "ringer" ) {
        sideModalName = "수액교체";
        placeHolder = "검색하실 수액을 입력해주세요.";
        data_status_name = "수액명"
    } else if (sideModalType === "device") {
        sideModalName = "기기교체";
        placeHolder = "검색하실 기기를 입력해주세요.";
        data_status_name = "기기명"
    } else if (sideModalType === "ringer_s") {
        sideModalName = "수액선택";
        placeHolder = "검색하실 수액을 입력해주세요.";
        data_status_name = "수액명"
    } else if (sideModalType === "device_s") {
        sideModalName = "기기선택";
        placeHolder = "검색하실 기기를 입력해주세요.";
        data_status_name = "기기명"
    }

    const onClick = (id: number, ringerName:string, ringerPDname:string, totalList: number[]) => {

        setRingerName(ringerName);
        setRingerList(totalList);

    }

    const deviceOnClick = (newDeviceID: string) => {

        setNewDeviceID(newDeviceID);

    }

    const change = () => {
        
        if(sideModalType === "ringer") {
            if(ringerName === "-") {
                alert("교체할 수액을 선택해주세요.");
            } else {
                ringerChangeApi.mutate();
                closeModal();
            }
        } else if (sideModalType === "device") {
            if(newDeviceID === "-") {
                alert("교체할 기기를 선택해주세요.");
            } else {
                deviceChangeApi.mutate();
                closeModal();
            }
        } else if (sideModalType === "ringer_s") {

            if(ringerName === "-") {
                alert("교체할 수액을 선택해주세요.");
            } else {
                setRingerSelect({ringerName: ringerName, ringerSpeed: ringerSpeed, ringerTotal: Selected});
                closeModal();
            }
        } else if (sideModalType === "device_s") {
            if(newDeviceID === "-") {
                alert("교체할 기기를 선택해주세요.");
            } else {
                setDeviceSelect(newDeviceID)
                closeModal();
            }
        }
    }
    
    return (
        <>
            <MemoModalHead name= {sideModalName} closeModal={closeModal} closeType = "c"/>
            { sideModalType !== "alarm" &&
                <div className = "side_modal_searchbox">
                    <div>
                        <InputText textType='search' size = " S_M" placeholder= {placeHolder} setValue = {setText}/>
                        <Button name='' size='M br' image='Search' onClick = {searchRinger}/>
                    </div>
                    <Button name='전체보기' size='SM_M' onClick={requestRinger}/>
                </div>
            }
            <div className = "side_modal_body_wrapper">
                <div className = "side_modal_body">
                    {
                        sideModalType === "alarm" &&
                        alarmValue.map(datas => (
                            <div className = "side_modal_alarm_data" key = {datas.alarmID}>
                                <div>
                                    <div>{Comments(datas.alarmName)}</div>
                                    <div>{datas.startTime}</div>
                                </div>
                                <div className = "side_modal_alarm_img_wrapper">
                                    <img className = "warining_imgs" alt = "알람_이미지" src = {ImgUrl(datas.alarmName)} />
                                </div>
                            </div>
                        ))
                    }
                    
                </div>
                <div className = "side_modal_info_body">
                    {
                        (sideModalType === "ringer" || sideModalType === "ringer_s") && ringerData &&
                        ringerData.map(datas => (
                            <div onClick = {() => onClick(datas.ringerID, datas.ringerName, datas.ringerProductName, datas.totalList)}>
                                {datas.ringerName} ({datas.ringerProductName})
                            </div>
                        ))
                    }
                    {
                        (sideModalType === "device" || sideModalType === "device_s") && deviceData &&
                        deviceData.map(datas => (
                            <div onClick = {() => deviceOnClick(datas.deviceID)}>{datas.deviceName}</div>
                        ))
                    }
                </div>
            </div>
            { sideModalType !== "alarm" &&
                <div className = "side_modal_foot">
                    <div className = "side_modal_select_data">
                        <div className = "data_status">
                            <div>{data_status_name}</div>
                            <div>{(sideModalType === "ringer" || sideModalType === "ringer_s") ? ringerName : newDeviceID}</div>
                        </div>
                        { (sideModalType === "ringer" || sideModalType === "ringer_s") &&
                            <>
                                <div className = "data_status margin_t">
                                    <div className='statusTitle'>수액속도</div>
                                    <div className= "select_wrapper_SM_M capacityBox">
                                        <input className='capacityWrite' 
                                            onChange={(e) => handleWriteRingerSpeed(e)}
                                            type="text"
                                            value = {ringerSpeed}
                                            //onKeyUp="this.value=this.value.replace(/[^0-9]/g,'');"
                                            placeholder='수액 속도를 입력해주세요.'/>
                                    </div>
                                </div>
                                <div className = "data_status margin_t">
                                    <div className='statusTitle'>수액용량</div>
                                    <div className= "select_wrapper_SM_M capacityBox">
                                        <select onChange = {handleSelect} defaultValue={0} >
                                            <option value= {0}>용량선택</option>
                                            {
                                                ringerList &&
                                                ringerList.map((list, index) => (
                                                    <option value={list} key = {index}>{list}</option>
                                                ))
                                            }  
                                            <option value={-1}>직접입력</option>                                 
                                        </select>
                                        {write && <input className='capacityWrite' 
                                            onChange={(e) => handleWriteCapacity(e)}
                                            type="text"
                                            value = {Selected}
                                            //onKeyUp="this.value=this.value.replace(/[^0-9]/g,'');"
                                            placeholder='용량을 입력해주세요.'/>}
                                        
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                    <Button name={sideModalName} size='SM_L' onClick = {change}/>
                </div>
            }
        </>
    )
}

export const MemoSideModalContents = React.memo(SideModalContents);