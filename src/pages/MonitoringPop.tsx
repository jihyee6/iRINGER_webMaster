import { type } from '@testing-library/user-event/dist/type';
import { apiLists } from 'apis/ApiLists';
import { all } from 'axios';
import { MemoMonitoringModal, MemoProgressbar } from 'components/monitoring/MonitoringComponents';
import Comments from 'components/public/alarmComment';
import { MemoModalHead, MemoModalFoot } from 'components/public/modal';
import { MemoCharts } from 'components/public/newCharts';
import { MemoSmallAlramModal } from 'components/public/smallAlramModal';
import { UseApis, UseMutation } from 'hooks/UseApi';
import React, { useEffect, useState } from 'react';
import { RefetchOptions, RefetchQueryFilters, QueryObserverResult } from 'react-query';
import { useLocation } from 'react-router-dom';
import { useRecoilState, useRecoilValue } from 'recoil';
import { bedIDState, deviceIDState, patientNameState, popupList, wardIDState } from 'recoils/MonitoringRecoil';
import styled from 'styled-components';
import ImgUrl from 'components/public/alarmImg';
import { DeviceSelectState, RingerSelectState } from 'recoils/StationRecoil';
import InputText from 'components/public/inputText';
import Button from 'components/public/button';

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

function MonitoringPop() {
    const location = useLocation();
    //bedID 받아오기
    const bedID = location.search.split("=")[1];
    console.log(bedID);

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
    
    const bedDetailApi = UseApis({method: 'get', url : apiLists.monitoring_detail, apiName: "monitoring_details", params : {bed: bedID}, time : false, async: true});
    const alarmDetailApi = UseApis({method: 'get', url : apiLists.events, apiName: "alarms_details", params : {bed: bedID}, time : false, async: true});

    const pairingApi = UseMutation({method: "delete", url : apiLists.pairing, 
        params:{deviceID  : deviceIDstate},
        apiName: "pairingApi"}); 

    const onClickAlarm = () => {
        alarmDetailApi.refetch();
        console.log(alarmDetailApi.data.data);
    }

    // useEffect(() => {
    //     setAsync(false);
    // },[async])

    useEffect(() => {
        if(!alarmDetailApi.isLoading) {
            console.log("!!!!");
            console.log(alarmDetailApi.data.data);
            setBedIDstate(alarmDetailApi.data.data);
        }
    },[alarmDetailApi])

    useEffect(() => {
        if(!bedDetailApi.isLoading) {
            setDeviceIDstate(bedDetailApi.data.data.deviceID);
            console.log(bedDetailApi.data.data);
            setBedDetailData(bedDetailApi.data.data);
        }
    },[bedDetailApi])

    useEffect(() => {
        setBedDetailData({
            alarmList: [],
            deviceID: "",
            endTime: "",
            ringerLog: [],
            setSpeed: 0,
            startTime: ""
        })
        bedDetailApi.refetch();
        //setPatientNamestate(data.patientName);
    }, [])


    const [all, setAll] = useState<boolean>(false);

    const onClick = (view:boolean) => {
      if(view) {
          setAll(false);
      } else {
        setAll(true);      
      }
    }

    function deviceState(state:string) {
        if(state === "USING") {
            return "측정중"
        } else if(state === "TEN") {
            return "완료 10분 전"
        } else if(state === "WAIT") {
            return "베드 대기"
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
    
    const PopTitle = styled.p`
        font-size: 20px;
        font-weight: 500;
        padding: 12px 16px;
        color: rgba(255, 255, 255, 0.8);
        margin: 0;
    `;

    const AlarmTxt = styled.span`
        color: rgba(255, 255, 255, 0.8);
    `
    const popData = useRecoilValue(popupList);
    console.log(popData);

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
        isUsing : boolean;
        remainBattery : string;
        roomName : string;
        wardName : string;
    }

    const [text, setText] = useState("");
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

    const ringersApi = UseApis({method: "get", url : apiLists.ringer, params:{searchText: text}, apiName: "searchRinger", time : false, async: true}); 

    const wardIDValue = useRecoilValue(wardIDState);
    // wardID 필요시 사용
    const deviceApi = UseApis({method: "get", url : apiLists.device, apiName: "device",params : {ward: 0, room: 0, bed : 0, isUsing : 2}, time : false, async: true});

    const ringerChangeApi = UseMutation({method: "post", url : apiLists.ringerChange, 
        body:{deviceID: deviceIDValue, ringerName: ringerName, ringerSpeed: ringerSpeed, ringerTotal: Selected, patientName: patientNameValue}, 
        apiName: "ringerChangeApi"}); 

    const deviceChangeApi = UseMutation({method: "post", url : apiLists.deviceChange, 
        body:{oldDeviceID : deviceIDValue, newDeviceID : newDeviceID}, 
        apiName: "deviceChangeApi"}); 

    const requestRinger = () => {

        if(sideModalType === "ringer" || sideModalType === "ringer_s") {
            setText("");
            ringersApi.refetch();
        } else if (sideModalType === 'device' || sideModalType === "device_s") {
            deviceApi.refetch();
        }
    }

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

    const onSideClick = (id: number, ringerName:string, ringerPDname:string, totalList: number[]) => {

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
            }
        } else if (sideModalType === "device") {
            if(newDeviceID === "-") {
                alert("교체할 기기를 선택해주세요.");
            } else {
                deviceChangeApi.mutate();
            }
        } else if (sideModalType === "ringer_s") {

            if(ringerName === "-") {
                alert("교체할 수액을 선택해주세요.");
            } else {
                setRingerSelect({ringerName: ringerName, ringerSpeed: ringerSpeed, ringerTotal: Selected});
            }
        } else if (sideModalType === "device_s") {
            if(newDeviceID === "-") {
                alert("교체할 기기를 선택해주세요.");
            } else {
                setDeviceSelect(newDeviceID)
            }
        }
    }




 
    return (
    <div style={{display: 'flex'}}>
        <div style={{width: '600px', height: '860px'}}>
            <PopTitle>측정 상세정보</PopTitle>
            {/* <MemoModalHead name='측정 상세정보' closeModal={() => {closeModal(); alarmModalClose(false); smallAlarmModalClose(false); removeData();}} closeType = "x"/> */}
            <div className = "modal_body" id = "modal_body" style={{background: '#34424F'}}>
                <div className = "modal_contents">
                    <div className = "monitoring_info">
                        <div>{popData.roomName + " " + popData.bedName + " " + popData.patientName}</div>
                        <div>{popData.remainTime}</div>
                    </div>
                    <div>
                        <div className = "monitoring_info_time">측정시작: {bedDetailData.startTime} | 종료예정: {bedDetailData.endTime}</div>
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
                                    bedDetailData.alarmList.length === 0 ?
                                    <>
                                        <img  className = "warining_imgs" src = {ImgUrl("BASIC")} alt = "알람_이미지"/>
                                        <AlarmTxt>{Comments("BASIC")}</AlarmTxt>
                                    </>
                                    :
                                    <>
                                        <img  className = "warining_imgs" src = {ImgUrl(bedDetailData.alarmList[0].alarmName)} alt = "알람_이미지"/>
                                        <AlarmTxt>{Comments(bedDetailData.alarmList[0].alarmName)}</AlarmTxt>
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
                            <MemoCharts apiData={bedDetailData.ringerLog} all = {all}/>
                            {/* <Graph apiData={bedDetailApi.data.data.ringerLog}/> */}
                        </div>
                        <div className = "monitoring_modal_progressbar">
                            <div>
                                잔여 수액량:  <span>{popData.remainRinger}</span>ml
                                
                            </div>
                            <MemoProgressbar total_ml={popData.totalRinger} remain_ml = {popData.remainRinger} boxSize = {-1}/>
                            <div className="monitor_ringer_ml">
                                <div><span>0</span> ml</div>
                                <div><span>{popData.totalRinger}</span> ml</div>
                                
                            </div>
                        </div>
                    </div>
                </div>
                <div className = "modal_contents">
                    <div className = "monitoring_title">
                        <div>수액정보</div>
                        <div><Button name='수액교체' size='M_S' onClick = {() => {setSideModalType("ringer")}}/></div>
                    </div>
                    <div className = "monitoring_ringer">
                        <div className = "monitoring_align"><div>수액명:</div> <div><span>{popData.ringerName}</span></div> </div>
                        <div className = "monitoring_align"><div>설정속도:</div> <div><span>{bedDetailData.setSpeed}</span> gtt</div> </div>
                        <div className = "monitoring_align"><div>현재속도:</div> <div><span>{popData.ringerSpeed}</span> gtt</div> </div>
                        <div className = "monitoring_align"><div>잔여량:</div> <div><span>{popData.remainRinger}</span> ml</div> </div>
                        <div className = "monitoring_align"><div>주입량:</div> <div><span>{popData.totalRinger - popData.remainRinger}</span> ml</div> </div>
                        <div className = "monitoring_align"><div>총용량:</div> <div><span>{popData.totalRinger}</span> ml</div> </div>
                    </div>
                </div>
                <div>
                    <div className = "monitoring_title">
                        <div>기기정보</div>
                        <div><Button name='기기교체' size='M_S' onClick = {() => {setSideModalType("device")}}/></div>
                    </div>
                    <div className = "monitoring_device">
                        <div className = "monitoring_align"><span>시리얼넘버:</span><span>{bedDetailData.deviceID}</span></div>
                        <div className = "monitoring_align"><span>배터리:</span><span>{popData.remainBattery}</span> </div>
                        <div className = "monitoring_align"><span>상태:</span><span>{deviceState(popData.state)}</span> </div>
                    </div>
                </div>
                <MemoModalFoot name='투여완료' btn_size='M_M' closeModal= {() => {pairing()}}/>
            </div>
        </div>
        <div style={{width: '360px', height: '860px', color: 'rgba(255, 255, 255, 0.8)'}}>
            <MemoModalHead name= {sideModalName} closeType = "c"/>
            
            { sideModalType !== "alarm" &&
                <div className = "side_modal_searchbox">
                    <div>
                        <InputText textType='search' size = " S_M" placeholder= {placeHolder} setValue = {setText}/>
                        <Button name='' size='M br' image='Search' onClick = {searchRinger}/>
                    </div>
                    <Button name='전체보기' size='SM_M' onClick={requestRinger}/>
                </div>
            }
            <div className = {sideModalType !== "alarm" ? "side_modal_body_wrapper" : "side_Alarm_body_wrapper"}>
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
                            <div onClick = {() => onSideClick(datas.ringerID, datas.ringerName, datas.ringerProductName, datas.totalList)}>
                                {datas.ringerName} ({datas.ringerProductName})
                            </div>
                        ))
                    }
                    {
                        (sideModalType === "device" || sideModalType === "device_s") && deviceData &&
                        deviceData.map(datas => (
                            <div onClick = {() => deviceOnClick(datas.deviceID)}>{datas.deviceID}</div>
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
                                            placeholder='용량을 입력해주세요.'/>}
                                        
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                    <Button name={sideModalName} size='SM_L' onClick = {change}/>
                </div>
            }
        </div>
    </div>
    );
}

export default MonitoringPop;

