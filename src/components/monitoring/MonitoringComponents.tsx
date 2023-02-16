import React, { useState, useEffect, ComponentProps, useCallback } from 'react';
import SelectBox from 'components/public/selectBox';
import Button from 'components/public/button';
import dateFormat from 'components/public/dateFormat';
import styled from 'styled-components';
import ImgUrl from 'components/public/alarmImg';

import { MemoModal, MemoModalHead, MemoModalFoot } from 'components/public/modal';
import UseModal from 'hooks/UseModal';

import { useRecoilValue, useRecoilState } from 'recoil';
import { bedIDState, deviceIDState, MonitoringState, patientNameState, popupList, wardIDState, MonitoringPop } from 'recoils/MonitoringRecoil';

import Graph from "components/public/charts";
import { Charts, MemoCharts } from "components/public/newCharts";
import { MemoSmallAlramModal } from 'components/public/smallAlramModal';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query';
import { UseApis, UseMutation } from 'hooks/UseApi';
import { apiLists } from 'apis/ApiLists';
import Comments from 'components/public/alarmComment';
import { Container } from 'react-bootstrap';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';

import ResultTable from 'components/public/resultTable';
import { SearchBar } from 'hooks/UseSearchbar';

type Montior = {
    monitor_idx: number;
    name: string;
    time: string;
    src: Array<string>;
    ringer_short_name: string;
    now_speed: number;
    device_battery: number;
    inject_ml: number;
    remain_ml: number;
    alarm: boolean;
}

type AlarmList = {
    alarmID: number;
    alarmName: string;
    alarmType: boolean;
}

type RingerLog = {
    time: number;
    speed: number;
}

type BedDetailData = {
    alarmList: Array<AlarmList>;
    deviceID: string;
    endTime: string;
    ringerLog: Array<RingerLog>;
    setSpeed: number;
    startTime: string;
}


type MonitoringBedData = {
    alarmList: AlarmList[],
    bedID: number,
    bedName: string,
    patientName: string,
    remainBattery: number,
    remainRinger:number,
    remainTime: string,
    ringerName: string,
    ringerPercent: number,
    ringerSpeed: number
    state: string,
    totalRinger: number,
    roomID : number,
    roomName : string
}

type MonitoringRoomData = {
    roomName: string,
    monitoringBedList: Array<MonitoringBedData>,
    roomID: number
}

type MonitoringData = {
    wardName: string,
    monitoringRoomList: Array<MonitoringRoomData>,
    wardID: number
}

type MonitoringType = {
    data: Array<MonitoringData>;
    refresh:<TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
    setParmsID: React.Dispatch<React.SetStateAction<number[]>>;
    setAsync: React.Dispatch<React.SetStateAction<boolean[]>>;
}

type MonitoringNewData = {
    wardName: string,
    monitoringRoomList: Array<MonitoringBedData>,
    wardID: number
}


export function Monitoring({data, refresh, setParmsID, setAsync}: MonitoringType) {

    console.log(data);
    const monitor_state = useRecoilValue<number>(MonitoringState);
    const [img, setImg] = useState<number>(monitor_state);

    const [cnt, setCnt] = useState<number>(0);
    const [newData, setNewData] = useState<Array<MonitoringNewData>>();

    const refresh_time: Date = new Date();
    const [date, setDate] = useState<Date>(refresh_time);

    let count = 0;
    let monitoringData:MonitoringNewData[] = [];
    
    const memorizedCallback = useCallback(() =>
        data.map(datas => {
            let wardID = datas.wardID;
            let wardName = datas.wardName;
            let monitoringRoomList: any[] = [];
            datas.monitoringRoomList.map(rooms => {
                let roomID = rooms.roomID;
                let roomName = rooms.roomName;
                rooms.monitoringBedList.map(beds => {
                    if(beds.patientName !== undefined){
                        count++;
                        let tempBeds = beds;
                        tempBeds["roomID"] = roomID;
                        tempBeds["roomName"] = roomName;
                        monitoringRoomList.push(tempBeds);
                    }
                })
            })
            monitoringData.push({wardID : wardID, wardName : wardName, monitoringRoomList: monitoringRoomList});
        })
    , [data, count])

    useEffect(() => {
        memorizedCallback();
        setCnt(count);
        setNewData(monitoringData);
        setDate(new Date());
        console.log(newData);
    }, [memorizedCallback, count])

    // 정렬을 해야하는데
    // javascript에서 배열정렬
    // 우선 선택한 정렬이 어떤건지 불러오기
    const [ orderBy, setOrderBy ] = useState(0);

    const [ sortData, setSortData ] = useState(data);

    useEffect(() => {
        console.log(orderBy);
        // 여기서 정렬함수 사용
        // 0: 기본정렬(bedName), 1 2 : 잔여시간높은순 낮은순(remainTime), 3 4 잔여량 높은순 낮은순(remainRinger)

        if(newData !== undefined) {

            console.log(newData[0].monitoringRoomList);
            let test = [...newData];

            if(orderBy === 0) {
                for(var i in test) {
                    test[i].monitoringRoomList.sort(function(a,b) {
                        return a.bedName.toLowerCase() < b.bedName.toLowerCase() ? -1 : a.bedName.toLowerCase() > b.bedName.toLowerCase() ? 1 : 0; 
                    })
                }
            } else if (orderBy === 1) {
                for(var j in test) {
                    test[j].monitoringRoomList.sort(function(a,b) {
                        return a.remainTime.toLowerCase() > b.remainTime.toLowerCase() ? -1 : a.remainTime.toLowerCase() < b.remainTime.toLowerCase() ? 1 : 0; 
                    })
                }
            } else if (orderBy === 2) {
                for(var j in test) {
                    test[j].monitoringRoomList.sort(function(a,b) {
                        return a.remainTime.toLowerCase() < b.remainTime.toLowerCase() ? -1 : a.remainTime.toLowerCase() > b.remainTime.toLowerCase() ? 1 : 0; 
                    })
                }
            } else if (orderBy === 3) {
                for(var j in test) {
                    test[j].monitoringRoomList.sort(function(a,b) {
                        return b.remainRinger - a.remainRinger;
                    })
                }
            } else if (orderBy === 4) {
                for(var j in test) {
                    test[j].monitoringRoomList.sort(function(a,b) {
                        return a.remainRinger - b.remainRinger;
                    })
                }
            }
            setNewData(test);
        }

    },[orderBy])



    return(
        <div className="monitoring">
            <MemoMonitorHead data_count = {cnt} boxSize = {img} setImg = {setImg} refresh = {refresh} setOrderBy = {setOrderBy} date = {date} setDate = {setDate}/>
            <MemoMonitorBody data={sortData} boxSize = {img} newData = {newData} refresh = {refresh} />
        </div>
    )

}


export const MemoMonitoring = React.memo(Monitoring);

type MonitorHeadData = {
    data_count: number;
    boxSize: number;
    setImg: React.Dispatch<React.SetStateAction<number>>;
    refresh:<TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
    setOrderBy : React.Dispatch<React.SetStateAction<number>>;
    date: Date;
    setDate : React.Dispatch<React.SetStateAction<Date>>;
}

function MonitorHead({ data_count, boxSize, setImg, refresh, setOrderBy, date, setDate }: MonitorHeadData) {

    const 필터 = [
        { categoryName: "잔여시간 높은순", categoryID: 1 }, { categoryName: "잔여시간 낮은순", categoryID: 2 }, { categoryName: "잔여량 높은순", categoryID: 3 }, { categoryName: "잔여량 낮은순", categoryID: 4 }
    ]

    const refreshClick = () => {
        setDate(new Date());
        refresh();
    }

    useEffect(() => {
        setDate(new Date());
    }, [data_count])

    return (
        <div className="monitor_head">
            <div className="monitor_status">
                <div>총 <span>{data_count}</span>대</div>
            </div> 
            <div className="monitor_array">
                <div className="array_box">
                    <SelectBox subject='기본정렬' size='S' options={필터} onChange = {setOrderBy} paramsID = {[0]}/>
                    <ImgClick click = {boxSize} onClick = { setImg }/>
                    <Button onClick = {refreshClick} name='갱신' size='S' image="Refresh" />
                </div>
                <div className="monitor_refresh_time">최근갱신 : <span>{dateFormat(date)}</span></div>
            </div>
        </div>
    )
}

export const MemoMonitorHead = React.memo(MonitorHead);

type ImgClickType = {
    click: number;
    onClick: React.Dispatch<React.SetStateAction<number>>;
}

function ImgClick({click, onClick}: ImgClickType) {

    const [, setState] = useRecoilState(MonitoringState);

    const changeImg: ComponentProps<'img'>['onClick'] = (e) => {
        const class_name = e.currentTarget.className.split(" ")[0];
        /* clicked_img */
        if(class_name === "zoom_in") {
            onClick(0);
            setState(0);
        } else if(class_name === "zoom_out") {
            onClick(1);
            setState(1);
        }
    }

    let in_img_name:string = "zoom_in";
    let out_img_name:string = "zoom_out";

    if(click === 0) {
        in_img_name += " clicked_img";
    } else if (click === 1) {
        out_img_name += " clicked_img";
    }

    return (
        <>
            <img onClick = {changeImg} className={out_img_name} src={`${process.env.PUBLIC_URL}/assets/images/zoomOut.png`} alt= "작게" />
            <img onClick = {changeImg} className={in_img_name} src={`${process.env.PUBLIC_URL}/assets/images/zoomIn.png`} alt= "크게" />
        </>
    )
}

type MonitorBodyData = {
    data: Array<MonitoringData>;
    boxSize: number;
    newData: MonitoringNewData[] | undefined;
    refresh:<TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
}

function MonitorBody({data, boxSize, newData, refresh}: MonitorBodyData) {

    console.log(newData);
    // const memo_data = useMemo(() => data, [data]);

    const modal = UseModal();

    const [modalData, setModalData] = useState<MonitoringBedData>({
        alarmList: [{alarmID: 0, alarmName: "", alarmType: false}],
        bedID: 0,
        bedName: "",
        patientName: "",
        remainBattery: 0,
        remainRinger: 0,
        remainTime: "",
        ringerName: "",
        ringerPercent: 0,
        ringerSpeed: 0,
        state: "",
        totalRinger: 0,
        roomName: "",
        roomID: 0
    });

    const [ bedID, setBedID ] = useState(0);
    const [ , setWardID ] = useRecoilState(wardIDState);
    const [ async, setAsync ] = useState(false);

    let class_name:string = "monitor_box";

    if(boxSize === 0) {
        class_name = "monitor_box_s"
    }

    const detail_modal = UseModal();
    const [sideModalType, setSideModalType] = useState<string>("");

    const small_alarm_modal = UseModal();

    //console.log(small_alarm_modal.isOpenModal);

    return (
        <>
            {modal.isOpenModal && (
                <MemoModal onClickToggleModal={modal.onClickToggleModal} width = {600} height = {860} 
                    sideModal = {detail_modal.onClickToggleModal} sideIsOpen = {detail_modal.isOpenModal} sideModalType = {sideModalType}
                >
                    <MemoMonitoringModal 
                        data = {modalData} closeModal = {modal.onClickToggleModal} bedID = {bedID} async = {async} setAsync = {setAsync}
                        alarmModal = {detail_modal.onClickToggleModal} alarmModalClose = {detail_modal.setOpenModal} setSideModalType = {setSideModalType} 
                        smallAlarmModal = {small_alarm_modal.onClickToggleModal} smallAlarmModalClose = {small_alarm_modal.setOpenModal} smallAlarmIsOpen = {small_alarm_modal.isOpenModal}
                        refresh = {refresh}
                    />
                </MemoModal>
            )}
            <div className = "monitor_total_body">
                {/* {data.map((datas, index) => (
                    <MemoMonitoringSector 
                        key = {index} class_name= {class_name} boxSize = {boxSize} 
                        onClickToggleModal = {modal.onClickToggleModal} setModalData = {setModalData} data={datas}
                        setBedID = {setBedID} setAsync = {setAsync}
                        newData = {newData}
                    />
                ))} */}
                {
                    newData &&
                    newData.map((datas, index) => (
                        <MonitoringSector 
                            key = {index} class_name= {class_name} boxSize = {boxSize} 
                            onClickToggleModal = {modal.onClickToggleModal} setModalData = {setModalData} data={datas}
                            setBedID = {setBedID} setAsync = {setAsync} setWardID = {setWardID}
                            newData = {datas}
                        />
                    ))
                }
            </div>
        </>
    )
}

export const MemoMonitorBody = React.memo(MonitorBody);

interface _MonitoringSector {
    class_name: string;
    boxSize: number;
    onClickToggleModal: () => void;
    setModalData: React.Dispatch<React.SetStateAction<MonitoringBedData>>;
    data: MonitoringData | MonitoringNewData;
    setBedID: React.Dispatch<React.SetStateAction<number>>;
    setAsync: React.Dispatch<React.SetStateAction<boolean>>;
    setWardID : React.Dispatch<React.SetStateAction<number>>;
    newData: MonitoringNewData | undefined;
}

function MonitoringSector({class_name, boxSize, onClickToggleModal, setModalData, data, setBedID, setAsync, setWardID, newData}:_MonitoringSector) {

    const searchDetailBed = (id:number) => {
        setBedID(id);
        setAsync(true);
    }

    console.log(data);
    const [popup, setPopup] = useRecoilState(popupList);

    const navigate = useNavigate();

    const openPop = (bedID:number, beds:MonitoringBedData) =>{
        
        window.open(`/popup?beds=${bedID}`, 'popUp',"width=870px, height=800px");
        
        console.log(beds);

        const bedData: MonitoringPop = {
            roomName: beds.roomName,
            bedName: beds.bedName,
            patientName: beds.patientName,
            remainTime: beds.remainTime,
            totalRinger: beds.totalRinger,
            ringerName: beds.ringerName,
            remainRinger: beds.remainRinger,
            ringerSpeed: beds.ringerSpeed,
            remainBattery: beds.remainBattery,
            state: beds.state,
        };

        console.log(bedData);
        setPopup(bedData);
    }
    
    // alarmlist 안에 alarmtype true일때만 warning되게 수정해야함
    return (
        <div>
            <div className='monitor_ward_name_box'>
                <div className="monitor_ward_name">{data.wardName}</div>
            </div>
            <div className="monitor_body">
                {/* {
                    data.monitoringRoomList.map((datas, index)=> (
                        datas.monitoringBedList.map(beds => {
                            if(beds.patientName !== undefined){
                                return (
                                    <div className= {class_name + (beds.alarmList.length !== 0 ? " warning ": "")} key = {beds.bedID} onClick = {() => {onClickToggleModal(); setModalData(beds); searchDetailBed(beds.bedID);}}>
                                        <MemoMonitorBoxHead name={datas.roomName + " " + beds.bedName + " " + beds.patientName} time= {beds.remainTime} alarms= {beds.alarmList} boxSize = {boxSize}/>
                                        <MemoMonitorBoxBody ringer_short_name={beds.ringerName} now_speed={beds.ringerSpeed} device_battery = {beds.remainBattery} boxSize = {boxSize} time= {beds.remainTime} />
                                        <MemoMonitorBoxFoot total_ml={beds.totalRinger} remain_ml ={beds.remainRinger} boxSize = {boxSize}/>
                                    </div>
                                )
                            } else {
                                return (
                                    null
                                )
                            }
                        })
                    ))
                } */}
                {/* + (beds.alarmList.length !== 0 ? " warning ": "") */}
                {/* ((class_name === "monitor_box_s" && boxSize === 0 && beds.alarmList.length !== 0 && beds.alarmList[0].alarmName !== "BATTERY") && beds.alarmList[0].alarmName) */}
                {
                    newData &&
                    newData.monitoringRoomList.map(beds => (
                        <div className= {class_name +" "+ ((boxSize === 0 && beds.alarmList.length !== 0 && beds.alarmList[0].alarmName !== "BATTERY")? beds.alarmList[0].alarmName : "")} key = {beds.bedID} onClick = {() => {setModalData(beds); searchDetailBed(beds.bedID); setWardID(newData.wardID); openPop(beds.bedID, beds)}}>
                            <MemoMonitorBoxHead name={beds.roomName + " " + beds.bedName + " " + beds.patientName} time= {beds.remainTime} alarms= {beds.alarmList} boxSize = {boxSize}/>
                            <MemoMonitorBoxBody ringer_short_name={beds.ringerName} now_speed={beds.ringerSpeed} device_battery = {beds.remainBattery} boxSize = {boxSize} time= {beds.remainTime} alarmState ={beds.alarmList} />
                            <MemoMonitorBoxFoot total_ml={beds.totalRinger} remain_ml ={beds.remainRinger} boxSize = {boxSize}/>
                        </div>
                    ))
                }

            </div>
        </div>
    )
}

export const MemoMonitoringSector = React.memo(MonitoringSector);

type Modal = {
    data : MonitoringBedData;
    closeModal: () => void;
    bedID: number;
    async: boolean;
    setAsync: React.Dispatch<React.SetStateAction<boolean>>;
    alarmModal: () => void;
    alarmModalClose: React.Dispatch<React.SetStateAction<boolean>>;
    setSideModalType: React.Dispatch<React.SetStateAction<string>>;
    smallAlarmModal: () => void;
    smallAlarmModalClose: React.Dispatch<React.SetStateAction<boolean>>;
    smallAlarmIsOpen: boolean;
    refresh:<TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
}

type bedDetail = {
    alarmList: Array<any>;
    deviceID: string;
    endTime: string;
    ringerLog: Array<any>;
    setSpeed: number;
    startTime: string;
}

function MonitoringModal({data, closeModal, bedID, async, setAsync, alarmModal, alarmModalClose, setSideModalType, smallAlarmModal, smallAlarmModalClose, smallAlarmIsOpen, refresh}: Modal) {
    
    console.log(data);

    const [bedIDstate, setBedIDstate] = useRecoilState(bedIDState);
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

    const bedDetailApi = UseApis({method: 'get', url : apiLists.monitoring_detail, apiName: "monitoring_details", params : {bed: bedID}, time : false, async: async});
    const alarmDetailApi = UseApis({method: 'get', url : apiLists.events, apiName: "alarms_details", params : {bed: bedID}, time : false, async: true});


    console.log("bedID:" + bedID);
    
    const pairingApi = UseMutation({method: "delete", url : apiLists.pairing, 
        params:{deviceID  : deviceIDstate},
        apiName: "pairingApi"}); 

    const onClickAlarm = () => {
        alarmDetailApi.refetch();
        console.log(alarmDetailApi.data.data);
    }

    useEffect(() => {
        setAsync(false);
    },[async])

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
        setPatientNamestate(data.patientName);
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
            refresh();
            closeModal();
            // **monitoring refetch 가져오기
        } else {

        }
    }

    
    // const removeDom:Element = document.getElementById("modal_body") as HTMLElement;

    // const removeModal = () => {

    //     console.log(removeDom);
    //     unmountComponentAtNode(removeDom);

    // }

    const removeData = () => {

        setBedDetailData({
            alarmList: [],
            deviceID: "",
            endTime: "",
            ringerLog: [],
            setSpeed: 0,
            startTime: ""
        })

        console.log(bedDetailData);
    }
    
    return (
        <>
            <MemoModalHead name='측정 상세정보' closeModal={() => {closeModal(); alarmModalClose(false); smallAlarmModalClose(false); removeData();}} closeType = "x"/>
            <div className = "modal_body" id = "modal_body">
                <div className = "modal_contents">
                    <div className = "monitoring_info">
                        <div>{data.roomName + " " + data.bedName + " " + data.patientName}</div>
                        <div>{data.remainTime}</div>
                    </div>
                    <div>
                        <div className = "monitoring_info_time">측정시작: {bedDetailData.startTime} | 종료예정: {bedDetailData.endTime}</div>
                    </div>
                </div>
                <div className = "modal_contents">
                    <div className = "monitoring_title">
                        <div>알림정보</div>
                        <div><Button name='전체보기' size='M_S' onClick = {() => {alarmModal(); setSideModalType("alarm"); onClickAlarm()}} /></div>
                    </div>
                    <div className = "monitoring_contents">
                        <div className = "down">
                            <div>
                                {
                                    bedDetailData.alarmList.length === 0 ?
                                    <>
                                        <img  className = "warining_imgs" src = {ImgUrl("BASIC")} alt = "알람_이미지"/>
                                        <span>{Comments("BASIC")}</span>
                                    </>
                                    :
                                    <>
                                        <img  className = "warining_imgs" src = {ImgUrl(bedDetailData.alarmList[0].alarmName)} alt = "알람_이미지"/>
                                        <span>{Comments(bedDetailData.alarmList[0].alarmName)}</span>
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
                        { smallAlarmIsOpen && (
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
                                                index !== bedDetailData.alarmList.length-1 && <div className = "monitoring_contetns_line" key={alarm.alarmID}></div>
                                            }
                                        </div>
                                    ))
                                }
                            </MemoSmallAlramModal>
                        )}
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
                                잔여 수액량: <span>{data.remainRinger}</span> ml
                            </div>
                            <MemoProgressbar total_ml={data.totalRinger} remain_ml = {data.remainRinger} boxSize = {-1}/>
                            <div className="monitor_ringer_ml">
                                <div><span>0</span> ml</div>
                                <div><span>{data.totalRinger}</span> ml</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className = "modal_contents">
                    <div className = "monitoring_title">
                        <div>수액정보</div>
                        <div><Button name='수액교체' size='M_S' onClick = {() => {alarmModal(); setSideModalType("ringer")}}/></div>
                    </div>
                    <div className = "monitoring_ringer">
                        <div className = "monitoring_align"><div>수액명:</div> <div><span>{data.ringerName}</span></div> </div>
                        <div className = "monitoring_align"><div>설정속도:</div> <div><span>{bedDetailData.setSpeed}</span> gtt</div> </div>
                        <div className = "monitoring_align"><div>현재속도:</div> <div><span>{data.ringerSpeed}</span> gtt</div> </div>
                        <div className = "monitoring_align"><div>잔여량:</div> <div><span>{data.remainRinger}</span> ml</div> </div>
                        <div className = "monitoring_align"><div>주입량:</div> <div><span>{data.totalRinger - data.remainRinger}</span> ml</div> </div>
                        <div className = "monitoring_align"><div>총용량:</div> <div><span>{data.totalRinger}</span> ml</div> </div>
                    </div>
                </div>
                <div>
                    <div className = "monitoring_title">
                        <div>기기정보</div>
                        <div><Button name='기기교체' size='M_S' onClick = {() => {alarmModal(); setSideModalType("device")}}/></div>
                    </div>
                    <div className = "monitoring_device">
                        <div className = "monitoring_align"><span>시리얼넘버:</span><span>{bedDetailData.deviceID}</span></div>
                        <div className = "monitoring_align"><span>배터리:</span><span>{data.remainBattery}</span> </div>
                        <div className = "monitoring_align"><span>상태:</span><span>{deviceState(data.state)}</span> </div>
                    </div>
                </div>
                <MemoModalFoot name='투여완료' btn_size='M_M' closeModal= {() => {pairing()}}/>
            </div>
            
        </>
    ) 
}

export const MemoMonitoringModal = React.memo(MonitoringModal);

const FillGraph = styled.div<{percent: number, height:number}> `
        width: ${(props) => props.percent > 100 ? "100" :(props) => (props.percent)}%;
        background-color: #6089F3;
        height: ${(props) => (props.height)}px;
        z-index: 1;
        border-radius: 2px;
        position: absolute;
        top: 0;
    `;

function Progressbar({total_ml, remain_ml, boxSize}: monitor_foot) {

    const percent: number = Math.round(100 - (remain_ml/(total_ml))*100);

    const [percents, setPercent] = useState<number>(percent);

    useEffect(() => {
        setPercent(percent);
    }, [percent])

    let class_name:string = "monitor_progressbar";
    let class_name_graph:string = "progress_body"
    let height:number = 18;

    if(boxSize === 0) {
        class_name = "monitor_progressbar_s";
        class_name_graph = "progress_body_s"
        height = 12;
    } else if(boxSize === -1) {
        class_name = "monitor_progressbar_up";
    }

    return (
        <div className={class_name}>
            <div className = {class_name_graph}>
                <div className = "progress_percent">
                    {boxSize !== 0 && <span>{total_ml - remain_ml} ml ({percents}%)</span>}
                </div>
                <FillGraph percent = {percents} height = {height}/>
            </div>
        </div>
    )
}

export const MemoProgressbar = React.memo(Progressbar);

type monitor_head = {
    alarms: AlarmList[];
    name: string;
    time: string;
    boxSize: number;
}

function MonitorBoxHead({alarms, name, time, boxSize}: monitor_head) {

    let class_name:string = "monitor_box_head"
    if(boxSize === 0) {
        class_name = "monitor_box_head_s"
    }

    // console.log(alarms);

    return (
        <div className={class_name}>
            <div>
                {
                    alarms.length === 0 ? 
                    <img className = "warining_imgs background" src = {ImgUrl("BASIC")} alt = "알람_이미지"/>
                    :
                    alarms.map((alarm, index) => (
                        <img key = {index} className = "warining_imgs background" src = {ImgUrl(alarm.alarmName)} alt = "알람_이미지"/>
                    ))
                }
            </div>
            <div className = "monitor_infomations">
                <div className = "monitor_name">{name}</div>
                {boxSize === 1 && <div className = "monitor_time">{time}</div>}
            </div>
        </div>
    )

}

export const MemoMonitorBoxHead = React.memo(MonitorBoxHead);


type monitor_body = {
    ringer_short_name: string;
    now_speed: number;
    device_battery: number;
    boxSize: number;
    time: string;
    alarmState: AlarmList[];
}


function MonitorBoxBody({ringer_short_name, now_speed, device_battery, boxSize, time, alarmState}: monitor_body) {
    
    console.log(alarmState);
    
    // let colorState ="";
    // let ZeroState = "";
    // let batteryAlarm = "";
    // let batteryZero = "";

    // if(alarmState.length !== 0){
    //     if(alarmState[0].alarmName === "FAST"){
    //         colorState = "#FF9F7F";
    //         ZeroState = "rgba(255,159,127,0.3)";
    //     } else if(alarmState[0].alarmName === "SLOW"){
    //         colorState = "#CA96FF";
    //         ZeroState = "rgba(202,150,255,0.3)";
    //     } else if(alarmState[0].alarmName === "STOP"){
    //         colorState = "#FFCB00";
    //         ZeroState = "rgba(255,203,0,0.3)";
    //     } else if(alarmState[0].alarmName === "BATTERY"){
    //         batteryAlarm = "#AED53E"
    //         batteryZero = "rgba(174,213,62,0.3)"
    //     } 
    // }

    // const SpeedState = styled.div`
    //     height: 100%;
    //     display: flex;
    //     align-items: center;
    //     @keyframes blink {
    //         0% {outline: 2px solid ${ZeroState}}
    //         100% {outline: 3px solid ${colorState}}
    //     }
    //     animation: blink 0.5s ease-in-out infinite alternate;
    // `
    // const BatteryState = styled.div`
    //     height: 100%;
    //     display: flex;
    //     align-items: center;
    //     @keyframes betteryBlink {
    //         0% {outline: 2px solid ${batteryZero}}
    //         100% {outline: 3px solid ${batteryAlarm}}
    //     }
    //     animation: betteryBlink 0.5s ease-in-out infinite alternate;
    // `
    return (
        <>
        { boxSize === 1 ?
            <div className="monitor_box_body">
                <div className="monitor_small_status">
                    {/* <div className='monitor_small_status_box'>
                        <div>수액</div>
                        <div>{ringer_short_name}</div>
                    </div> */}
                    <div className = {`alarm_blink ${alarmState.length !== 0 ? alarmState[0].alarmName !== "BATTERY" ? alarmState[0].alarmName : "" : ""}`}>
                        <div className= 'monitor_small_status_box'>
                            <div>속도</div>
                            <div>{now_speed} gtt</div>
                        </div>
                    </div>  
                    <div className = {`battery_blink ${alarmState.length !== 0 ? alarmState[0].alarmName === "BATTERY" ? alarmState[0].alarmName : "" : ""}`}>
                        <div className='monitor_small_status_box'>
                            <div>배터리</div>
                            <div>{device_battery}%</div>
                        </div>
                    </div>
                </div>
            </div>
            :
            <div className="monitor_box_body_s">
                <div>{time}</div>
            </div>
        }
        </>
    )
}

export const MemoMonitorBoxBody = React.memo(MonitorBoxBody);

type monitor_foot = {
    total_ml : number;
    remain_ml : number;
    boxSize : number;
}

function MonitorBoxFoot({total_ml, remain_ml, boxSize}: monitor_foot) {

    const percent:number = Math.round(100 - (remain_ml/(total_ml))*100);

    return (
        <div className="monitor_box_foot">
            { boxSize === 1 && 
                <div>
                    잔여 수액량: <span>{remain_ml}</span> ml
                </div> 
            }
            <MemoProgressbar total_ml={total_ml} remain_ml={remain_ml} boxSize = {boxSize}/>
            { boxSize === 1 ? 
                <div className="monitor_ringer_ml">
                    <div><span>0</span> ml</div>
                    <div><span>{total_ml}</span> ml</div>
                </div>
                :
                <div className = "monitor_box_foot_s">{percent}% 투여완료</div>
            }
        </div>
    )
}

export const MemoMonitorBoxFoot = React.memo(MonitorBoxFoot);

type MonitoringTypeV2 = {
    data: Array<MonitoringDataV2>;
    refresh:<TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
    setHospitals: React.Dispatch<React.SetStateAction<number>>;
    hospitals: number;
    date: Date;
    setDate : React.Dispatch<React.SetStateAction<Date>>;
}

export function MonitoringV2({data, refresh, setHospitals, hospitals, date, setDate}: MonitoringTypeV2) {

    console.log(data);
    const monitor_state = useRecoilValue<number>(MonitoringState);
    const [img, setImg] = useState<number>(monitor_state);

    return(
        <div className="monitoring">
            <MemoMonitorHeadV2 data_count = { data ? data.length : 0 } boxSize = {img} setImg = {setImg} refresh = {refresh} date = {date} setDate = {setDate} setHospitals = {setHospitals}/>
            <MemoMonitorBodyV2 data={data} boxSize = {img} refresh = {refresh} hospitals = {hospitals}/>
        </div>
    )

}

export const MemoMonitoringV2 = React.memo(MonitoringV2);

type MonitorHeadDataV2 = {
    data_count: number;
    boxSize: number;
    setImg: React.Dispatch<React.SetStateAction<number>>;
    refresh:<TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
    date: Date;
    setDate : React.Dispatch<React.SetStateAction<Date>>;
    setHospitals: React.Dispatch<React.SetStateAction<number>>;
}

function MonitorHeadV2({ data_count, boxSize, setImg, refresh, date, setDate, setHospitals }: MonitorHeadDataV2) {

    const 필터 = [
        { categoryName: "잔여시간 높은순", categoryID: 1 }, { categoryName: "잔여시간 낮은순", categoryID: 2 }, { categoryName: "잔여량 높은순", categoryID: 3 }, { categoryName: "잔여량 낮은순", categoryID: 4 }
    ]

    const refreshClick = () => {
        setDate(new Date());
        refresh();
    }

    const selectBar = SearchBar();

    return (
        <div className="monitor_head">
            <div className="monitor_status">
                {(selectBar.hospitalApi !== null && !selectBar.hospitalApi.isLoading) && <SelectBox subject='병원' size='L' options={selectBar.hospitalApi.data.data} onChange = {setHospitals} paramsID = {selectBar.paramsID} setParmsID = {selectBar.setParamsID} setAsync = {selectBar.setAsync}/> }
                <div>총 <span>{data_count}</span>대</div>
            </div> 
            <div className="monitor_array">
                <div className="array_box">
                    <ImgClick click = {boxSize} onClick = { setImg }/>
                    <Button onClick = {refreshClick} name='갱신' size='S' image="Refresh" />
                </div>
                <div className="monitor_refresh_time">최근갱신 : <span>{dateFormat(date)}</span></div>
            </div>
        </div>
    )
}

export const MemoMonitorHeadV2 = React.memo(MonitorHeadV2);

export type MonitoringDataV2 = {
    alarmList: AlarmList[],
    bedName: string,
    injectRinger: number,
    pairingID: number,
    patientName: string,
    remainBattery: number,
    ringerName: string,
    ringerSpeed: number,
    totalRinger: number
}


type MonitorBodyDataV2 = {
    data: Array<MonitoringDataV2>;
    boxSize: number;
    refresh:<TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
    hospitals: number;
}

function MonitorBodyV2({data, boxSize, refresh, hospitals}: MonitorBodyDataV2) {

    console.log(data);

    const [ bedID, setBedID ] = useState(0);
    const [ , setWardID ] = useRecoilState(wardIDState);
    const [ async, setAsync ] = useState(false);

    let class_name:string = "monitor_box";

    if(boxSize === 0) {
        class_name = "monitor_box_s_V2"
    }

    const detail_modal = UseModal();
    const [sideModalType, setSideModalType] = useState<string>("");

    const small_alarm_modal = UseModal();

    //console.log(small_alarm_modal.isOpenModal);

    const searchDetailBed = (id:number) => {
        setBedID(id);
        setAsync(true);
    }

    console.log(data);
    const [popup, setPopup] = useRecoilState(popupList);

    const navigate = useNavigate();

    const openPop = (pairingID:number) =>{

        window.open(`/popupV2?pairing=${pairingID}&hospital=${hospitals === 0 ? "" : hospitals}`, 'popUp',"width=972, height=692px");

    }

    return (
        <div className = "monitor_total_body">
            <div className = "monitor_body">
            {
                data &&
                data.length > 0 ?
                data.map(beds => (
                    <div className= {class_name +" "+ ((boxSize === 0 && beds.alarmList.length !== 0 && beds.alarmList[0].alarmName !== "BATTERY")? beds.alarmList[0].alarmName : "")} key = {beds.pairingID} onClick = {() => {searchDetailBed(beds.pairingID); setWardID(beds.pairingID); openPop(beds.pairingID)}}>
                        <MemoMonitorBoxHeadV2 key = {"head" + beds.pairingID} name={beds.bedName + " " + beds.patientName} alarms= {beds.alarmList} boxSize = {boxSize}/>
                        <MemoMonitorBoxBodyV2 key = {"body" + beds.pairingID} name={beds.bedName + " " + beds.patientName} ringer_short_name={beds.ringerName} now_speed={beds.ringerSpeed} device_battery = {beds.remainBattery} boxSize = {boxSize} alarmState ={beds.alarmList} />
                        <MemoMonitorBoxFootV2 key = {"foot" + beds.pairingID} total_ml={beds.totalRinger} injectRinger ={beds.injectRinger} boxSize = {boxSize}/>
                    </div>
                ))
                :
                <div>먼저 병원을 선택해주세요.</div>
            }
            </div>
        </div>
    )
}

export const MemoMonitorBodyV2 = React.memo(MonitorBodyV2);

type monitor_headV2 = {
    alarms: AlarmList[];
    name: string;
    boxSize: number;
}

function MonitorBoxHeadV2({alarms, name, boxSize}: monitor_headV2) {

    let class_name:string = "monitor_box_head"
    if(boxSize === 0) {
        class_name = "monitor_box_head_s_V2"
    }

    return (
        <div className={class_name}>

            {
                alarms.length === 0 ? 
                <img className = "warining_imgs" src = {ImgUrl("BASIC")} alt = "알람_이미지"/>
                :
                alarms.map((alarm, index) => (
                    <img key = {index} className = "warining_imgs background" src = {ImgUrl(alarm.alarmName)} alt = "알람_이미지"/>
                ))
            }

            { boxSize === 1 && 
                <div className = "monitor_infomations">
                    <div className = "monitor_name">{name}</div>
                </div>
            }
        </div>
    )

}

export const MemoMonitorBoxHeadV2 = React.memo(MonitorBoxHeadV2);

type monitor_bodyV2 = {
    name: string;
    ringer_short_name: string;
    now_speed: number;
    device_battery: number;
    boxSize: number;
    alarmState: AlarmList[];
}

function MonitorBoxBodyV2({name, ringer_short_name, now_speed, device_battery, boxSize, alarmState}: monitor_bodyV2) {
    
    console.log(alarmState);
    
    return (
        <>
        { boxSize === 1 ?
            <div className="monitor_box_body">
                <div className="monitor_small_status">
                    {/* <div className='monitor_small_status_box'>
                        <div>수액</div>
                        <div>{ringer_short_name}</div>
                    </div> */}
                    <div className = {`alarm_blink ${alarmState.length !== 0 ? alarmState[0].alarmName !== "BATTERY" ? alarmState[0].alarmName : "" : ""}`}>
                        <div className= 'monitor_small_status_box'>
                            <div>속도</div>
                            <div>{now_speed} gtt</div>
                        </div>
                    </div>  
                    <div className = {`battery_blink ${alarmState.length !== 0 ? alarmState[0].alarmName === "BATTERY" ? alarmState[0].alarmName : "" : ""}`}>
                        <div className='monitor_small_status_box'>
                            <div>배터리</div>
                            <div>{device_battery}%</div>
                        </div>
                    </div>
                </div>
            </div>
            :
            <div className="monitor_box_body_s_V2">
                <div className = "monitor_name">{name}</div>
            </div>
        }
        </>
    )
}

export const MemoMonitorBoxBodyV2 = React.memo(MonitorBoxBodyV2);

type monitor_footV2 = {
    total_ml : number;
    injectRinger : number;
    boxSize : number;
}

function MonitorBoxFootV2({total_ml, injectRinger, boxSize}: monitor_footV2) {

    const percent:number = Math.round((injectRinger/(total_ml))*100);

    return (
        <div className= {boxSize === 1 ? "monitor_box_foot" : "monitor_box_foot_V2"}>
            { boxSize === 1 && 
                <div className = "monitor_ringer_ml">
                    <div>투여현황</div>
                    <div><span>{total_ml}</span> ml</div>
                </div>
            }
            <MemoProgressbarV2 total_ml={total_ml} injectRinger={injectRinger} boxSize = {boxSize}/>
            <MemoProgressBarText total_ml={total_ml} boxSize = {boxSize} percent = {percent}/>
        </div>
    )
}

export const MemoMonitorBoxFootV2 = React.memo(MonitorBoxFootV2);

type MonitoringProgressBarText = {
    total_ml : number;
    boxSize : number;
    percent : number;
}

function ProgressBarText({total_ml, boxSize, percent}: MonitoringProgressBarText) {

    const text:StandardType = {total_ml};

    return (
        boxSize === 1 ?
        <div className = "progress_text_body">
            <div className={total_ml < 1000 ? "monitor_ringer_ml" : "monitor_ringer_ml"}>
                {Standard(text)}
            </div>
        </div>
        :
        <div className = "monitor_box_foot_s">{percent}% 투여완료</div>
        
    )

}

export const MemoProgressBarText = React.memo(ProgressBarText);


const FillGraphV2 = styled.div<{percent: number, height:number}> `
        width: ${(props) => props.percent > 100 ? "100" :(props) => (props.percent)}%;
        background-color: #6089F3;
        height: ${(props) => (props.height)}px;
        z-index: 1;
        border-radius: 2px;
        position: absolute;
        top: 0;
    `;

const ProgressStandard = styled.div<{height:number, width:number}> `
        width: ${(props) => (props.width)}%;
        border-right: 1px solid rgba(255,255,255,0.8);
        height: ${(props) => (props.height)}px;
        position: absolute;
        z-index: 10;
    `;

const ProgressStandardText = styled.div<{width:number, padding:number}> `
        width: ${(props) => (props.width)}%;
        position: absolute;
        text-align: right;
        padding-left: ${(props) => (props.padding)}px;
        z-index: 10;
`;

function ProgressbarV2({total_ml, injectRinger, boxSize}: monitor_footV2) {

    const percent: number = Math.round((injectRinger/(total_ml))*100);

    const [percents, setPercent] = useState<number>(percent);

    useEffect(() => {
        setPercent(percent);
    }, [percent])

    let class_name:string = "monitor_progressbar";
    let class_name_graph:string = "progress_body"
    let height:number = 18;

    if(boxSize === 0) {
        class_name = "monitor_progressbar_s";
        class_name_graph = "progress_body_s"
        height = 12;
    } else if(boxSize === -1) {
        class_name = "monitor_progressbar_up";
    }

    const bar: StandardType = {total_ml, height};
    
    return (
        <div className={class_name}>
            <div className = {class_name_graph}>
                <div className={total_ml < 1000 ? "monitor_ringer_ml" : "monitor_ringer_ml"}>
                    {Standard(bar)}
                </div>
                <FillGraphV2 percent = {percents} height = {height}/>
            </div>
        </div>
    )
}

export const MemoProgressbarV2 = React.memo(ProgressbarV2);

type dashboardData = {
    data: Array<MonitoringDataV2>;
    folding: boolean;
}

function SideDashboard({data, folding}: dashboardData) {

    let th_name:string[] = ["베드", "환자명", "알람"];

    console.log(data)

    return (
        <div className= {"side_dashboard" + (folding ? " folding" : "")}>
            <ResultTable tableUrl = "monitoringV2" name = {th_name} data = {data} />
        </div>
    )
}

export const MemoSideDashboard = React.memo(SideDashboard);

export type StandardType = {
    total_ml: number;
    height? : number;
}

export function Standard({total_ml, height}: StandardType) {

    let standardMl:number[] = [100, 200, 300, 500];

    let standardCnt = 0;

    if(total_ml > 100) {
        standardMl.map((ml, index) => {
            if(total_ml - ml > 0) {
                return standardCnt = index+1;
            } else {
                return null;
            }
        })
    } 

    // console.log(standardCnt);

    const result = [];

    if(height) {
        if(total_ml < 1000) {
            for (let i = 0; i < standardCnt; i++) {
                result.push(<ProgressStandard key = {i} height={height} width = {standardMl[i]/total_ml*100} />);
            }
        } else {
            result.push(<ProgressStandard key = {0} height={height} width = {10}/>);
            result.push(<ProgressStandard key = {1} height={height} width = {20}/>)
            result.push(<ProgressStandard key = {2} height={height} width = {30}/>)
            result.push(<ProgressStandard key = {3} height={height} width = {50}/>)
        }
    } else {
        if(total_ml < 1000) {
            for (let i = 0; i < standardCnt; i++) {
                result.push(<ProgressStandardText key = {i} width = {standardMl[i]/total_ml*100} padding={12}><span>{standardMl[i]}</span></ProgressStandardText>);
            }
        } else {
            result.push(<ProgressStandardText key = {0} width = {10} padding={8}><span>{total_ml*0.1}</span></ProgressStandardText>);
            result.push(<ProgressStandardText key = {1} width = {20} padding={12}><span>{total_ml*0.2}</span></ProgressStandardText>);
            result.push(<ProgressStandardText key = {2} width = {30} padding={16}><span>{total_ml*0.3}</span></ProgressStandardText>);
            result.push(<ProgressStandardText key = {3} width = {50} padding={12}><span>{total_ml*0.5}</span></ProgressStandardText>);
        }
    }

    return result

}