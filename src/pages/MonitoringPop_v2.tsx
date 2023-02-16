
import { apiLists, apiListsV2 } from 'apis/ApiLists';
import 'css/PopUp.scss';

import { MemoProgressbar } from 'components/monitoring/MonitoringComponents';
import Comments from 'components/public/alarmComment';
import { MemoModalHead, MemoModalFoot } from 'components/public/modal';
import { MemoCharts } from 'components/public/newCharts';
import { UseApis, UseMutation } from 'hooks/UseApi';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bedIDState, deviceIDState, patientNameState, popupList, wardIDState } from 'recoils/MonitoringRecoil';
import styled from 'styled-components';
import ImgUrl from 'components/public/alarmImg';
import { DeviceSelectState, RingerSelectState } from 'recoils/StationRecoil';
import InputText from 'components/public/inputText';
import Button from 'components/public/button';
import { MemoProgressbarV2, MemoProgressBarText } from 'components/monitoring/MonitoringComponents';

type alarmLists = {
    alarmName: string;
}

type modalData = {
    roomName: string;
    bedName: string;
    patientName: string;
    startTime: string;
    endTime: string;
    alarmList:Array<string>;
    ringerLog: number;
    remainRinger: number;
    totalRinger: number;
    ringerName: string;
    setSpeed: number;
    ringerSpeed: number;
    deviceID: string;
    remainBattery : number;
    state: string;
};

type bedDetail = {
    alarmList: Array<any>;
    deviceID: string;
    endTime: string;
    ringerLog: Array<any>;
    setSpeed: number;
    startTime: string;
}

type AlarmDataType = {
    alarmID: number;
    alarmName: string;
    endTime: string;
    startTime: string;
}

function MonitoringPop() {

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    //bedID 받아오기
    const pairingID = searchParams.get("pairing");
    const hospitalID = searchParams.get("hospital");
    console.log(pairingID);
    console.log(hospitalID);

    const [sideModalType, setSideModalType] = useState<string>("alarm");

    const [bedIDstate2, setBedIDstate] = useRecoilState(bedIDState);
    const [deviceIDstate, setDeviceIDstate] = useRecoilState(deviceIDState);
    const [patientNamestate, setPatientNamestate] = useRecoilState(patientNameState);

    const [bedDetailData, setBedDetailData] = useState<bedDetail>( {
        alarmList: [],
        deviceID: "",
        endTime: "",
        ringerLog: [],
        setSpeed: 0,
        startTime: ""
    })
    
    const monitoringDetails = UseApis({method: 'get', url : apiListsV2.monitoring_detail, apiName: "monitoring_details", params : {pairing: pairingID}, time : false, async: true});
    const alarmDetailApi = UseApis({method: 'get', url : apiListsV2.alarmLog, apiName: "alarms_details", params : {pairingID: pairingID}, time : false, async: true});

    const pairingApi = UseMutation({method: "delete", url : apiListsV2.pairing, params:{pairingID  : pairingID}, apiName: "deletePairing"}); 

    const onClickAlarm = () => {
        alarmDetailApi.refetch();
        console.log(alarmDetailApi.data.data);
    }

    useEffect(() => {
        if(!alarmDetailApi.isLoading) {
            console.log("!!!!");
            console.log(alarmDetailApi.data.data);
            setBedIDstate(alarmDetailApi.data.data);
        }
    },[alarmDetailApi])

    useEffect(() => {
        if(!monitoringDetails.isLoading) {
            console.log(monitoringDetails.data.data);
        }
    }, [monitoringDetails])

    const [all, setAll] = useState<boolean>(false);

    const onClick = (view:boolean) => {
      if(view) {
        setAll(false);
      } else {
        setAll(true);      
      }
    }

    const pairing = () => {
        if(window.confirm("투여를 완료 하시겠습니까?")) {
            pairingApi.mutate();
            // refresh();
            // closeModal();
            // **monitoring refetch 가져오기
        } else {

        }
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

    const [text, setText] = useState("");
    const [allSearch, setAllSearch] = useState(true);

    const [deviceData, setDeviceData] = useState<Array<DeviceData>>();

    const [newDeviceID, setNewDeviceID] = useState("-");

    const deviceApi = UseApis({method: "get", url : apiListsV2.device, apiName: "device", params : {hospital: hospitalID === "" ? 0 : hospitalID, ward: 0, room : 0, isUsing : false, name: text}, time : false, async: true});
    const deviceChangeApi = UseMutation({method: "post", url : apiLists.deviceChange, 
        body:{oldDeviceID : pairingID, newDeviceID : pairingID}, 
        apiName: "deviceChangeApi"}); 

    const requestRinger = () => {
        setText("");
        setAllSearch(!allSearch);
        // if (sideModalType === 'device') {
        //     deviceApi.refetch();
        // }
    }

    useEffect(() => {
        deviceApi.refetch();
    }, [allSearch])

    const searchRinger = () => {
        
        if (sideModalType === "device") {
            deviceApi.refetch();
        }
    }

    useEffect(() => {
        if(!deviceApi.isLoading) {
            setDeviceData(deviceApi.data.data);
        }
    },[deviceApi])

    useEffect(() => {
        if(!monitoringDetails.isLoading) {
            console.log(monitoringDetails.data);
        }
    },[monitoringDetails])

    // console.log(sideModalType);

    let sideModalName = "";
    let placeHolder = "";
    let data_status_name = "";

    if(sideModalType === "alarm") {
        sideModalName = "알림정보 전체보기";
    } else if (sideModalType === "device") {
        sideModalName = "기기교체";
        placeHolder = "검색하실 기기를 입력해주세요.";
        data_status_name = "기기명"
    }

    const deviceOnClick = (newDeviceID: string) => {

        setNewDeviceID(newDeviceID);

    }

    const change = () => {
        
        if (sideModalType === "device") {
            if(newDeviceID === "-") {
                alert("교체할 기기를 선택해주세요.");
            } else {
                deviceChangeApi.mutate();
            }
        }
    }

    return (
        <>
        {!monitoringDetails.isLoading && !alarmDetailApi.isLoading &&
            <div className = "pop_up_body">
                <div className = "pop_up_contents">
                    <div className = "info_name">측정 상세정보</div>
                    <div className = "modal_body" id = "modal_body">
                        <div className = "modal_contents">
                            <div className = "monitoring_info">
                                <div>{monitoringDetails.data.data.bedName + " " + monitoringDetails.data.data.patientName}</div>
                                <div></div>
                            </div>
                            <div>
                                <div className = "monitoring_info_time">측정시작: {monitoringDetails.data.data.startTime.split(".")[0]}</div>
                            </div>
                        </div>
                        <div className = "modal_contents">
                            <div className = "monitoring_title">
                                <div>알림정보</div>
                                <div>
                                    <Button name='전체보기' size='M_S' onClick = {() => {setSideModalType("alarm"); onClickAlarm()}} />
                                </div>
                                
                            </div>
                            <div className = "monitoring_contents">
                                <div className = "down">
                                    <div>
                                        {
                                            monitoringDetails.data.data.alarmList.length === 0 ?
                                            <>
                                                <img className = "warining_imgs" src = {ImgUrl("BASIC")} alt = "알람_이미지"/>
                                                <div className = "alarm_comment">{Comments("BASIC")}</div>
                                            </>
                                            :
                                            <>
                                                <img className = "warining_imgs" src = {ImgUrl(monitoringDetails.data.data.alarmList[0].alarmName)} alt = "알람_이미지"/>
                                                <div className = "alarm_comment">{Comments(monitoringDetails.data.data.alarmList[0].alarmName)}</div>
                                            </>
                                        }
                                        {/* <span> | </span><span>2022.01.01 01:40</span> */}
                                    </div>
                                    {/* {
                                        bedDetailApi.data.data.alarmList.length > 1 &&
                                        <div>
                                            <span className = "alarm_count">+{bedDetailApi.data.data.alarmList.length-1}</span>
                                            <img onClick = {() => { ()}} className = "arrow_btn" src = {`${process.env.PUBLIC_URL}/assets/images/downArr.png`} alt = "펼치기"></img>
                                        </div>
                                        
                                    } */}
                                </div>
                                {/* { smallAlarmIsOpen && (
                                    <MemoSmallAlramModal onClickToggleModal={smallAlarmModal} width = {568}>
                                        {
                                            bedDetailData.alarmList.length > 1 &&
                                            bedDetailData.alarmList.map((alarm: AlarmList, index: number) => (
                                                <div key = {alarm.alarmID} className = "monitoring_content_box">
                                                    <div className = "monitoring_contents">
                                                        <div className = "down">
                                                            <div>
                                                                <img className = "warining_imgs" src = {ImgUrl(alarm.alarmName)} alt = "알람_이미지"/>
                                                                <span>알람 내용 위치 입니다.</span><span> | </span><span>2022.01.01 01:40</span>
                                                            </div>
                                                            {
                                                                index === 0 &&
                                                                <div>
                                                                    <img onClick = {() => {smallAlarmModal()}} className = "arrow_btn" src = {`${process.env.PUBLIC_URL}/assets/images/upArr.png`} alt = "접기"></img>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        index !== bedDetailData.alarmList.length-1 && <div className = "monitoring_contetns_line"></div>
                                                    }
                                                </div>
                                            ))
                                        }
                                    </MemoSmallAlramModal>
                                )} */}
                            </div>
                        </div>
                        <div className = "modal_contents">
                            <div className = "monitoring_title">
                                <div>수액투여 현황</div>
                                <div>
                                    <button className= {'btnM_S border_left' + (all ? " select_btn" : "")} onClick = {() => onClick(true)}>전체보기</button>
                                    <button className= {'btnM_S border_right' +  (all ? "" : " select_btn")} onClick = {() => onClick(false)}>상세보기</button>
                                </div>
                            </div>
                            <div className = "monitoring_graph">
                                <div className = "graph_wrapper">
                                    <MemoCharts apiData={monitoringDetails.data.data.ringerLog} all = {all}/>
                                </div>
                                <div className = "monitoring_modal_progressbar">
                                    <div className = "monitor_ringer_ml">
                                        <div>투여현황</div>
                                        <div><span>{monitoringDetails.data.data.totalRinger}</span> ml</div>
                                    </div>
                                    <MemoProgressbarV2 total_ml={monitoringDetails.data.data.totalRinger} injectRinger = {monitoringDetails.data.data.injectRinger} boxSize = {-1} />
                                    <MemoProgressBarText total_ml={monitoringDetails.data.data.totalRinger} percent = {Math.round((monitoringDetails.data.data.injectRinger/(monitoringDetails.data.data.totalRinger))*100)}  boxSize = {1}/>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className = "pop_up_last_menu">
                                <div>기기관리</div>
                                <div><Button name='기기검색' size='M_S' onClick = {() => {setSideModalType("device")}}/></div>
                            </div>
                        </div>
                        <MemoModalFoot name='투여완료' btn_size='M_M' closeModal= {() => {pairing()}}/>
                    </div>
                </div>
                <div className = "pop_up_side_contents" >
                    <div className = "pop_up_side_name">{sideModalName}</div>
                    { sideModalType === "device" &&
                        <div className = "side_modal_searchbox">
                            <div>
                                <InputText textType='search' size = " S_M" placeholder= {placeHolder} setValue = {setText}/>
                                <Button name='' size='M br' image='Search' onClick = {searchRinger}/>
                            </div>
                            <Button name='전체보기' size='SM_M' onClick={requestRinger}/>
                        </div>
                    }
                    <div className = "pop_up_side_body_wrapper">
                        <div className = "side_modal_body">
                            {
                                sideModalType === "alarm" &&
                                alarmDetailApi.data.data.map((datas: AlarmDataType, index: number) => (
                                    <div className = "side_modal_alarm_box">
                                        <div className = "side_modal_alarm_data" key = {datas.alarmID}>
                                            <div>
                                                <div>{Comments(datas.alarmName)}</div>
                                            </div>
                                            <div className = "side_modal_alarm_img_wrapper">
                                                <img className = "warining_imgs" alt = "알람_이미지" src = {ImgUrl(datas.alarmName)} />
                                            </div>
                                        </div>
                                        <div className = "alarmTime">{datas.startTime.split(".")[0]}{datas.endTime === null ? "" : ` ~ ${datas.endTime.split(".")[0]}`}</div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className = "side_modal_info_body">
                            {
                                sideModalType === "device"&& deviceData &&
                                deviceData.map((datas, index) => (
                                    <div key = {index} onClick = {() => deviceOnClick(datas.deviceID)}>{datas.deviceName}</div>
                                ))
                            }
                        </div>
                    </div>
                    { sideModalType === "device" &&
                        <div className = "side_modal_foot">
                            <div className = "side_modal_select_data">
                                <div className = "data_status">
                                    <div>{data_status_name}</div>
                                    <div>{newDeviceID}</div>
                                </div>
                            </div>
                            <Button name={sideModalName} size='SM_L' onClick = {change}/>
                        </div>
                    }
                </div>
            </div>
        }
        </>
    );
}

export default MonitoringPop;

