import React, { useState, useEffect, useCallback } from 'react';
import Button from 'components/public/button';
import SelectBox from 'components/public/selectBox';
import dateFormat from 'components/public/dateFormat';
import { apiLists, apiListsV2 } from 'apis/ApiLists';

import UseModal from 'hooks/UseModal';
import { MemoModal, MemoModalHead, MemoModalFoot } from 'components/public/modal';

import InputText from 'components/public/inputText';
import { UseApis, UseMutation } from 'hooks/UseApi';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { DeviceSelectState, HospitalSelectState, RingerSelectState } from 'recoils/StationRecoil';

import { LoginState } from 'recoils/LoginRecoil';
import { SearchBar } from 'hooks/UseSearchbar';

type SearchParam = {
    ward: number,
    room: number,
    bed: number
}

type SearchParamV2 = {
    hospital: number,
    ward: number
}

type StationHeadData = {
    data : Array<any>;
    setParam : React.Dispatch<React.SetStateAction<SearchParam>>;
    refresh:<TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
    cntData: Array<MonitoringData>;
    isLoading: boolean;
}

export function StationHead({data, setParam, refresh, cntData, isLoading}: StationHeadData) {

    const refresh_time: Date = new Date();

    let dataCnt = 0;

    useEffect(() => {
        
        console.log("loading");
        setDate(new Date());

    }, [cntData])

    console.log(cntData);
    


    console.log(dataCnt);

    useEffect(() => {
        console.log("date");
        setDate(new Date());
    }, [dataCnt])

    useEffect(() => {
        console.log("datacnt");
        setDate(new Date());
    }, [dataCnt])

    const [date, setDate] = useState<Date>(refresh_time);
    const [cnt, setCnt] = useState<number[]>(
        () => {
            let totalCnt = 0;
            let usingCnt = 0;
            let beforeTen = 0;
            let waitingCnt = 0;
            cntData.map(datas => { 
                datas.monitoringRoomList.map((rooms, i) => {
                    rooms.monitoringBedList.map((beds, j) => {
                        if(beds.state === "USING") {
                            usingCnt++;
                        } else if (beds.state === "TEN") {
                            beforeTen++;
                        } else if (beds.state === "WAIT") {
                            waitingCnt++;
                        }
                        totalCnt++;
                    })

                })
            })
            return [totalCnt, usingCnt, beforeTen, waitingCnt];
        }
    );
    useEffect(() => {
        setCnt(() => {
            let totalCnt = 0;
            let usingCnt = 0;
            let beforeTen = 0;
            let waitingCnt = 0;
            cntData.map(datas => { 
                datas.monitoringRoomList.map((rooms, i) => {
                    rooms.monitoringBedList.map((beds, j) => {
                        if(beds.state === "USING") {
                            usingCnt++;
                        } else if (beds.state === "TEN") {
                            beforeTen++;
                        } else if (beds.state === "WAIT") {
                            waitingCnt++;
                        }
                        totalCnt++;
                    })

                })
            })
            return [totalCnt, usingCnt, beforeTen, waitingCnt];
        })

        setDate(new Date());

    }, [cntData])

    const refreshClick = () => {
        setDate(new Date());
        refresh();
    }

    // const 필터 = [
    //     { name: "A병동" }, { name: "B병동" }, { name: "C병동" }, { name: "D병동" }, { name: "E병동" }, { name: "F병동" }
    // ]

    const [station, setStation] = useState(0);

    useEffect(() => {
         setParam({ward: station, room: 0, bed: 0})
    }, [station])

    return (
        <div className="station_head">
            <div className="station_status">
            <SelectBox subject='병동' size='L' options={data} onChange = {setStation} paramsID = {[0,0,0]}/>
                <div className = "station_status_box">
                    <div className = "station_subject">스테이션</div>
                    <div className = "station_counts"> {/* 총 <span className = "total_device">{cnt[0]}</span>대 | 스테이션 대기 : <span className = "station_waiting_device">0</span>대 |  */}측정중 : <span className = "useing_device">{cnt[1]}</span>대 {/* | 완료 10분 전 : <span className = "completed_device">{cnt[2]}</span>대 | 베드 대기 : <span className = "bed_waiting_device">{cnt[3]}</span>대 */}</div>
                </div>
            </div>
            <div className="monitor_array">
                <div className="array_box">
                    <Button name='갱신' onClick = {refreshClick} size='S' image="Refresh" />
                </div>
                <div className="monitor_refresh_time">최근갱신 : <span>{dateFormat(date)}</span></div>
            </div>
        </div>

    )
}

// export const MemoStationHead = React.memo(StationHead);

type BedRowInfo = {
    bed_id: number,
    bed_name: string,
    patient_name: string,
    state: string,
    ward_id: number,
    ward_name: string,
    room_id: number,
    room_name: string
}

type MonitoringBedData = {
    alaramList: Array<any>,
    bedID: number,
    bedName: string,
    patientName: string,
    remainBattery: number,
    remainTime: string,
    ringerName: string,
    ringerPercent: number,
    ringerSpeed: number
    state: string,
    totalRinger: number
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

type station_data = {
    data: Array<MonitoringData>,
}

// type CountType = {
//     usingCnt: number;
//     beforeTen: number;
//     waitingCnt: number;
    
// }

export function StationBody({data}: station_data) {

    console.log(data);

    // const [ viewData, setViewData ] = useState<Array<MonitoringData>>(data);

    // const [ tempCount, setTempCount] = useState<CountType[][]>(
    //     data.map(datas => { 
    //         let roosmArray:CountType[] = [];
    //         datas.monitoringRoomList.map((rooms, i) => {
    //             let usingCnt = 0;
    //             let beforeTen = 0;
    //             let waitingCnt = 0;
    //             rooms.monitoringBedList.map(beds => {
    //                 if(beds.state === "USING") {
    //                     usingCnt++;
    //                 } else if (beds.state === "TEN") {
    //                     beforeTen++;
    //                 } else if (beds.state === "WAIT") {
    //                     waitingCnt++;
    //                 }
    //             })
    //             roosmArray.push({"usingCnt": usingCnt, "beforeTen": beforeTen, "waitingCnt": waitingCnt})
    //         })
    //         return roosmArray
    //     })
    // );

    // useEffect(() => {
    //     setViewData(data);

    //     setTempCount(() =>
    //         data.map(datas => { 
    //             let roosmArray:CountType[] = [];
    //             datas.monitoringRoomList.map((rooms, i) => {
    //                 let usingCnt = 0;
    //                 let beforeTen = 0;
    //                 let waitingCnt = 0;
    //                 rooms.monitoringBedList.map(beds => {
    //                     if(beds.state === "USING") {
    //                         usingCnt++;
    //                     } else if (beds.state === "TEN") {
    //                         beforeTen++;
    //                     } else if (beds.state === "WAIT") {
    //                         waitingCnt++;
    //                     }
    //                 })
    //                 roosmArray.push({"usingCnt": usingCnt, "beforeTen": beforeTen, "waitingCnt": waitingCnt})
    //             })
    //             return roosmArray
    //         })
    //     )
        
    // },[data])

    // console.log(viewData);
    // console.log(tempCount);

    return (
         <div className = "station_body">
            {
                data.map((datas, index) => (
                    <>
                    {
                        datas.monitoringRoomList.map((rooms, roomsindex) => (
                            <div className = "station_box" key = {rooms.roomID}>
                                {/* <StationBoxHead room_name={rooms.roomName} using_count={tempCount[index][roomsindex].usingCnt} before_10_count={tempCount[index][roomsindex].beforeTen} bed_waiting_count={tempCount[index][roomsindex].waitingCnt} rooms = {rooms}/> */}
                                <StationBoxHead room_name={rooms.roomName} rooms = {rooms}/>
                                <div className = "station_box_body">
                                    <div className = "station_box_body_head">
                                        <div>베드</div>
                                        <div>환자명</div>
                                        <div>상태</div>
                                    </div>
                                    <div className = "station_box_body_body">
                                        { 
                                            rooms.monitoringBedList.map(beds => (
                                                <StationBoxBodyRow key = {beds.bedID} bed_id = {beds.bedID} bed_name= {beds.bedName} patient_name={beds.patientName} state={beds.state}
                                                    ward_id = {datas.wardID} ward_name = {datas.wardName} room_id = {rooms.roomID} room_name = {rooms.roomName}
                                                />
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    </>                        
                ))
            }
        </div>
    )
}

// export const MemoStationBody = React.memo(StationBody);

type station_box_head = {
    room_name: string;
    using_count?: number;
    before_10_count?: number;
    bed_waiting_count?: number;
    rooms: MonitoringRoomData;
}

export function StationBoxHead({room_name, using_count, before_10_count, bed_waiting_count}: station_box_head) {

    return (
        <div className = "station_box_head">
            <div className = "station_room_name">{room_name}</div>
            {/* <div className = "station_state">
                <StationStateBox name='측정중' class_name='useing_device' count={using_count}/>
                <StationStateBox name='완료 10분 전' class_name='before_10_device' count={before_10_count}/>
                <StationStateBox name='베드 대기' class_name='bed_waiting_device' count={bed_waiting_count}/>
            </div> */}
        </div>
    )
}

type station_state_box = {
    name:string;
    class_name:string;
    count:number;
}

function StationStateBox({name, class_name, count}:station_state_box) {
    return (
        <div className = "station_state_box">
            <div>{name}</div>
            <div className = {class_name + " state_box_font"}>{count}</div>
        </div>
    )
}

// export const MemoStationStateBox = React.memo(StationStateBox);

function StationBoxBodyRow({bed_id, bed_name, patient_name, state, ward_id, ward_name, room_id, room_name}: BedRowInfo) {

    let class_name:string = "";
    let _empty:string = ""
    if(state === "USING") {
        class_name = "using_circle";
    } else if (state === "TEN") {
        class_name = "before_circle";
    } else if (state === "WAIT") {
        class_name = "waiting_circle";
    } else {
        _empty = "-";
    }

    // 기기연결 모달창
    const modal = UseModal();
    // 기기연결 모달창 > 기기교체, 수액교체 모달창
    const detail_modal = UseModal();

    const [sideModalType, setSideModalType] = useState<string>("");

    return (
        <>
            {modal.isOpenModal && (
                <MemoModal onClickToggleModal={modal.onClickToggleModal} width = {600} sideModal = {detail_modal.onClickToggleModal} sideIsOpen = {detail_modal.isOpenModal} sideModalType = {sideModalType}>
                    <MemoStationModal closeModal = {modal.onClickToggleModal} alarmModal = {detail_modal.onClickToggleModal} alarmModalClose = {detail_modal.setOpenModal} setSideModalType = {setSideModalType}
                        ward_id = {ward_id} ward_name = {ward_name} room_id = {room_id} room_name = {room_name} bed_id = {bed_id} bed_name = {bed_name}
                    />
                </MemoModal>
            )}
            <div className = "station_box_body_row">
                <div>{bed_name}</div>
                <div>{patient_name ? patient_name : "-"}</div>
                {/* <div className = {class_name}>{_empty}</div> */}
                <div className = {class_name}>
                    { patient_name ? 
                        "" 
                        : 
                        <Button name='기기연결' size='XS' onClick = {modal.onClickToggleModal}/>
                    }
                </div>
            </div>
        </>
    )
}

// export const MemoStationBoxBodyRow = React.memo(StationBoxBodyRow);

type modal = {
    closeModal: () => void;
    alarmModal: () => void;
    alarmModalClose: React.Dispatch<React.SetStateAction<boolean>>;
    setSideModalType: React.Dispatch<React.SetStateAction<string>>;
    ward_id: number;
    ward_name: string;
    room_id: number;
    room_name: string;
    bed_id: number;
    bed_name: string;
}


function StationModal({closeModal, alarmModal, alarmModalClose, setSideModalType, ward_id, ward_name, room_id, room_name, bed_id, bed_name}: modal) {

    const [ process, setProcess ] = useState(false);
    const [ patientName, setPatientName ] = useState("");

    // api 변경되면 사용
    const [ ringerName, setRingerName ] = useState("");
    const [ ringerTotal, setRingerTotal ] = useState("");

    const deviceID = useRecoilValue(DeviceSelectState);
    const selectRinger = useRecoilValue(RingerSelectState);

    // ward_id 필요하면 ward_id 사용
    const useApi = UseApis({method: 'post', url : apiLists.pairing, apiName: "pairing", body : {deviceID : deviceID, bedID : bed_id, ringerName : selectRinger.ringerName, ringerSpeed : selectRinger.ringerSpeed, ringerTotal : selectRinger.ringerTotal, patientName : patientName}, time : false, async: process});

    // const connectDevice = () => {
    //     setProcess(true);
    // }

    useEffect(() => {
        if(process) {
            closeModal();
        }
        setProcess(false);
        if(!useApi.isLoading) {
            console.log(useApi);
        }
        resetRecoil();
    }, [process])

    const onClick = () => {
        
    }

    const deviceReset = useResetRecoilState(DeviceSelectState);
    const ringerReset = useResetRecoilState(RingerSelectState);

   console.log(process);
    
    const resetRecoil = () => {
        deviceReset();
        ringerReset();
        console.log("recoil");
    }


    return (
        <>
            <MemoModalHead name='기기 배치' closeModal={() => {closeModal(); alarmModalClose(false); resetRecoil();}} closeType = "x"/>
            <div className = "modal_body">
                <table className = "station_modal_table">
                    <tbody>
                        <tr>
                            <td>병동</td>
                            <td>{ward_name}</td>
                        </tr>
                        <tr>
                            <td>병실</td>
                            <td>{room_name}</td>
                        </tr>
                        <tr>
                            <td>베드</td>
                            <td>{bed_name}</td>
                        </tr>
                        <tr>
                            <td>환자명</td>
                            <td className = "not_padding">
                                <InputText textType='input' placeholder='환자명을 입력해주세요.' size=' XS_M' setValue={setPatientName}/>
                            </td>
                        </tr>
                        <tr>
                            <td>시리얼 넘버</td>
                            <td className = "not_padding add_btn">
                                <div>{deviceID}</div>
                                <Button name='기기선택' size='M_S' onClick = {() => {alarmModal(); setSideModalType("device_s")}}/>
                            </td>
                        </tr>
                        {/* <tr>
                            <td>수액</td>
                            <td className = "not_padding add_btn">
                                <div>{selectRinger.ringerName}{selectRinger.ringerName && ", " + selectRinger.ringerTotal}</div>
                                <Button name='수액선택' size='M_S' onClick = {() => {alarmModal(); setSideModalType("ringer_s")}}/>
                                
                            </td>
                        </tr> */}
                        <tr>
                            <td>수액 이름</td>
                            <td className = "not_padding">
                                <InputText textType='input' placeholder='수액 이름' size=' S_S' setValue={setRingerName}/>
                            </td>
                        </tr>
                        <tr>
                            <td>수액 용량</td>
                            <td className = "not_padding">
                                <InputText textType='input' placeholder='수액 용량' size=' S_S' setValue={setRingerTotal}/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className = "station_modal_btn">
                    {/* <button onClick = {connectDevice}>테스트용</button> 
                        resetRecoil() 설정완료에서 실행 안됨, onclick에 넣어서 시도 했는데 빈값을 보내짐
                    */}
                    <MemoModalFoot name='설정완료' btn_size='M_M' closeModal= {() => {closeModal(); resetRecoil();}} onClick = {setProcess}/>
                    <MemoModalFoot name='취소' btn_size='M_M clear' closeModal= {() => {closeModal(); resetRecoil();}}/>
                </div>
            </div>
            
        </>
    )

}

export const MemoStationModal = React.memo(StationModal);

///////////////////////////////////////////////////////  V2  ///////////////////////////////////////////////////// 

type StationHeadDataV2 = {
    setParam : React.Dispatch<React.SetStateAction<SearchParamV2>>;
    refresh:<TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
    cntData: Array<StationDataV2>;
    isLoading: boolean;
    date: Date;
    setDate : React.Dispatch<React.SetStateAction<Date>>;
}

export function StationHeadV2({setParam, refresh, cntData, isLoading, date, setDate}: StationHeadDataV2) {

    let dataCnt = 0;

    useEffect(() => {
        
        console.log("loading");
        setDate(new Date());

    }, [cntData])

    console.log(cntData);
    console.log(dataCnt);

    useEffect(() => {
        console.log("datacnt");
        setDate(new Date());
    }, [dataCnt])

    const [cnt, setCnt] = useState<number>(
        () => {
            let usingCnt = 0;
            cntData.map(datas => { 
                datas.pairingList.map((rooms, i) => {
                    
                        if(rooms.state) {
                            usingCnt++;
                        }
                })
            })
            return usingCnt;
        }
    );
    useEffect(() => {
        setCnt(() => {
            let usingCnt = 0;
            cntData.map(datas => { 
                datas.pairingList.map((rooms, i) => {
                    
                        if(rooms.state) {
                            usingCnt++;
                        }
                })
            })
            return usingCnt;
        })

        setDate(new Date());

    }, [cntData])

    const refreshClick = () => {
        setDate(new Date());
        refresh();
    }

    const [hospital, setHospitals] = useState(0)

    const [, setHospital] = useRecoilState(HospitalSelectState);

    const [ward, setWard] = useState(0);

    useEffect(() => {
         setParam({hospital: hospital, ward: 0})
         setHospital(hospital);
    }, [hospital])

    useEffect(() => {
         setParam({hospital: hospital, ward: ward})
    }, [ward])

    const selectBar = SearchBar();

    return (
        <div className="station_head">
            <div className="station_status">
                {(selectBar.hospitalApi !== null && !selectBar.hospitalApi.isLoading) && <SelectBox subject='병원' size='L' options={selectBar.hospitalApi.data.data} onChange = {setHospitals} paramsID = {selectBar.paramsID} setParmsID = {selectBar.setParamsID} setAsync = {selectBar.setAsync}/> }
                {<SelectBox subject='병동' size='L' options={selectBar.wardsApi.data ? selectBar.wardsApi.data.data : [{wardName: "", wardID: -1}]} onChange = {setWard} paramsID = {selectBar.paramsID} setParmsID = {selectBar.setParamsID} setAsync = {selectBar.setAsync}/>}
                <div className = "station_status_box">
                    <div className = "station_subject">스테이션</div>
                    <div className = "station_counts"> {/* 총 <span className = "total_device">{cnt[0]}</span>대 | 스테이션 대기 : <span className = "station_waiting_device">0</span>대 |  */}측정중 : <span className = "useing_device">{cnt}</span>대 {/* | 완료 10분 전 : <span className = "completed_device">{cnt[2]}</span>대 | 베드 대기 : <span className = "bed_waiting_device">{cnt[3]}</span>대 */}</div>
                </div>
            </div>
            <div className="monitor_array">
                <div className="array_box">
                    <Button name='갱신' onClick = {refreshClick} size='S' image="Refresh" />
                </div>
                <div className="monitor_refresh_time">최근갱신 : <span>{dateFormat(date)}</span></div>
            </div>
        </div>

    )
}

export const MemoStationHeadV2 = React.memo(StationHeadV2);

type PairingLists = {
    bedName: string;
    patientName: string;
    state: boolean;
}

type StationDataV2 = {
    nextPairing: string;
    pairingList: PairingLists[];
    roomID: number;
    roomName: string;
}

type StationV2Array = {
    data: StationDataV2[];
    refresh:<TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
}

export function StationBodyV2({data, refresh}: StationV2Array) {

    console.log(data);

    // 기기연결 모달창
    const modal = UseModal();

    // 기기연결 모달창 > 기기교체, 수액교체 모달창
    const detail_modal = UseModal();

    const [sideModalType, setSideModalType] = useState<string>("");

    const [ connectData, setConnectData ] = useState({
        roomID : 0,
        bedName: ""
    })

    return (
         <div className = "station_body">
            { modal.isOpenModal && (
                <MemoModal onClickToggleModal={modal.onClickToggleModal} width = {600} sideModal = {detail_modal.onClickToggleModal} sideIsOpen = {detail_modal.isOpenModal} sideModalType = {sideModalType}>
                    <MemoStationModalV2 closeModal = {modal.onClickToggleModal} alarmModal = {detail_modal.onClickToggleModal} alarmModalClose = {detail_modal.setOpenModal} setSideModalType = {setSideModalType}
                        room_id = {connectData.roomID} bed_name = {connectData.bedName} refresh = {refresh}
                    />
                </MemoModal>
            )}
            {
                data.length > 0 ? data.map((datas, index) => (
                    <>
                    {
                        <div className = "station_box" key = {datas.roomID}>
                            <MemoStationBoxHeadV2 room_name={datas.roomName} />
                            <div className = "station_box_body">
                                <div className = "station_box_body_head">
                                    <div>베드</div>
                                    <div>환자명</div>
                                    <div>상태</div>
                                </div>
                                
                                <div className = "station_box_body_body">
                                    { 
                                        datas.pairingList.map((pairing, index) => (
                                            <StationBoxBodyRowV2 key = {index} bed_name= {pairing.bedName} patient_name={pairing.patientName} state={pairing.state}
                                                room_id = {datas.roomID} room_name = {datas.roomName} nextPairing = {datas.nextPairing}
                                            />
                                        ))
                                    }
                                    {
                                        datas.nextPairing !== null &&
                                        <div className = "station_box_body_row">
                                            <div>{datas.nextPairing}</div>
                                            <div>{"-"}</div>
                                            <div>
                                                <Button name='기기연결' size='XS' onClick = {() => {modal.onClickToggleModal(); setConnectData({roomID: datas.roomID, bedName: datas.nextPairing})}}/>
                                            </div>
                                        </div> 
                                    }
                                </div>
                            </div>
                        </div>
                    }
                    </>                        
                ))
                :
                <div>병원과 병실을 선택해 주세요.</div>
            }
        </div>
    )
}

export const MemoStationBodyV2 = React.memo(StationBodyV2);

type station_box_head_v2 = {
    room_name: string;
}

function StationBoxHeadV2({room_name}: station_box_head_v2) {

    return (
        <div className = "station_box_head">
            <div className = "station_room_name">{room_name}</div>
        </div>
    )
}

export const MemoStationBoxHeadV2 = React.memo(StationBoxHeadV2);

type PairingRowInfo = {
    bed_name: string,
    patient_name: string,
    state: boolean,
    room_id: number,
    room_name: string,
    nextPairing : string,
}

function StationBoxBodyRowV2({ bed_name, patient_name, state, room_id, room_name, nextPairing}: PairingRowInfo) {

    let class_name:string = "";

    if(state) {
        class_name = "using_circle";
    } 

    return (
        <>
            
            <div className = "station_box_body_row">
                <div>{bed_name}</div>
                <div>{patient_name ? patient_name : "-"}</div>
                {/* <div className = {class_name}>{_empty}</div> */}
                <div className = {class_name}>
                    { state ? 
                        "" 
                        :
                        "측정대기중"
                    }
                </div>
            </div>
        </>
    )
}

// export const MemoStationBoxBodyRow = React.memo(StationBoxBodyRow);

type ModalDataV2 = {
    closeModal: () => void;
    alarmModal: () => void;
    alarmModalClose: React.Dispatch<React.SetStateAction<boolean>>;
    setSideModalType: React.Dispatch<React.SetStateAction<string>>;
    room_id: number;
    bed_name: string;
    refresh: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
}

function StationModalV2({closeModal, alarmModal, alarmModalClose, setSideModalType, room_id, bed_name, refresh}: ModalDataV2) {

    const [ patientName, setPatientName ] = useState("");

    // api 변경되면 사용
    const [ ringerName, setRingerName ] = useState("");
    const [ ringerTotal, setRingerTotal ] = useState("");

    const deviceID = useRecoilValue(DeviceSelectState);

    const handleWriteTotalRinger = (e:React.ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value;
        let number = value.replace(/[^0-9]/g, '');

        if(value === "") {
            number = "";
        }
        
        setRingerTotal(number);

    }

    // ward_id 필요하면 ward_id 사용
    const connectDeviceApi = UseMutation({method: 'post', url : apiListsV2.pairing, apiName: "pairing", body : {deviceID : deviceID, roomID : room_id, ringerName : ringerName, ringerTotal : ringerTotal, patientName : patientName}});

    const connectDevice = () => {
        if(deviceID === "") {
            alert("연결할 기기를 선택해 주세요");
            alarmModal(); 
            setSideModalType("device_s");
        } else {
            connectDeviceApi.mutate();
        }
    }

    useEffect(() => {
        console.log(connectDeviceApi.data?.data);
        console.log(deviceID);
        console.log(room_id);
        console.log(ringerName);
        console.log(ringerTotal);
        console.log(patientName);

        if(connectDeviceApi.data) {
            if(connectDeviceApi.data.data.message === "Success"){
                closeModal();
                refresh();
            } else if(connectDeviceApi.data.data.message === "Using Device"){
                alert("이미 사용중인 기기 입니다. 사용중이 아닌 기기를 선택해주세요.")
            } else if( connectDeviceApi.data.data.message === "Full bed"){
                alert("병실이 가득 찼습니다. 확인 후 다시 시도해 주세요.");
                closeModal();
            } else if( connectDeviceApi.data.data.message === "Invalid"){
                alert("유효하지 않은 정보입니다. 확인 후 다시 시도해 주세요.");
            } else {
                alert("페어링 에러. 본사 관리자에 문의 부탁드립니다.")
            }

            resetRecoil();
        }
    },[connectDeviceApi.data?.data])

    const deviceReset = useResetRecoilState(DeviceSelectState);
    const ringerReset = useResetRecoilState(RingerSelectState);

    const resetRecoil = () => {
        deviceReset();
        ringerReset();
        console.log("recoil");
    }


    return (
        <>
            <MemoModalHead name='기기 배치' closeModal={() => {closeModal(); alarmModalClose(false); resetRecoil();}} closeType = "x"/>
            <div className = "modal_body">
                <table className = "station_modal_table">
                    <tbody>
                        <tr>
                            <td>베드</td>
                            <td>{bed_name}</td>
                        </tr>
                        <tr>
                            <td>환자명</td>
                            <td className = "not_padding">
                                <InputText textType='input' placeholder='환자명을 입력해주세요.' size=' XS_M' setValue={setPatientName}/>
                            </td>
                        </tr>
                        <tr>
                            <td>시리얼 넘버</td>
                            <td className = "not_padding add_btn">
                                <div>{deviceID}</div>
                                <Button name='기기선택' size='M_S' onClick = {() => {alarmModal(); setSideModalType("device_s")}}/>
                            </td>
                        </tr>
                        {/* <tr>
                            <td>수액</td>
                            <td className = "not_padding add_btn">
                                <div>{selectRinger.ringerName}{selectRinger.ringerName && ", " + selectRinger.ringerTotal}</div>
                                <Button name='수액선택' size='M_S' onClick = {() => {alarmModal(); setSideModalType("ringer_s")}}/>
                                
                            </td>
                        </tr> */}
                        <tr>
                            <td>수액 이름</td>
                            <td className = "not_padding">
                                <InputText textType='input' placeholder='수액 이름' size=' S_S' setValue={setRingerName}/>
                            </td>
                        </tr>
                        <tr>
                            <td>수액 용량</td>
                            <td className = "not_padding">
                                <input className='input_text S_S' 
                                            onChange={(e) => handleWriteTotalRinger(e)}
                                            type="text"
                                            value = {ringerTotal}
                                            placeholder='수액 용량'/>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className = "station_modal_btn">
                    <MemoModalFoot name='설정완료' btn_size='M_M' closeModal= {() => {closeModal(); resetRecoil();}} onClick = {connectDevice}/>
                    <MemoModalFoot name='취소' btn_size='M_M clear' closeModal= {() => {closeModal(); resetRecoil();}}/>
                </div>
            </div>
            
        </>
    )

}

export const MemoStationModalV2 = React.memo(StationModalV2);
