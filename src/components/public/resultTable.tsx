import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { UseCheckbox, UseAllCheckbox } from 'hooks/UseCheckbox';
import ImgUrl from './alarmImg';
import Comments from './alarmComment';
import { SetterOrUpdater, useRecoilState, useRecoilValue } from 'recoil';
import { DeviceDeleteState } from 'recoils/DeviceRecoil';
import { RingerDeleteState } from 'recoils/RingerRecoil';
import Button from './button';
import UseModal from 'hooks/UseModal';
import { MemoModal, MemoModalFoot, MemoModalHead } from './modal';
import InputText from './inputText';
import { LoginState } from 'recoils/LoginRecoil';
import { MonitoringDataV2 } from 'components/monitoring/MonitoringComponents';
import { UserDeleteState } from 'recoils/UserRecoil';
import { UseApis, UseMutation } from 'hooks/UseApi';
import { apiListsV2 } from 'apis/ApiLists';
import { QueryObserverResult, useMutation } from 'react-query';

type AlarmData = {
    alarmID : number;
    alarmType : string;
    alarmName : string;
    wardName : string;
    roomName : string;
    bedName : string;
    patientName : string;
    ringerName : string;
    startTime : string;
}

type RingerData = {
    ringerID: number;
    ringerProductName: string;
    ringerName: string;
    totalList: number[];
    registerTime: string;
}

type DeviceData = {
    deviceID: string;
    ringerName: string;
    wardName: string;
    roomName: string;
    bedName: string;
    patientName: string;
    remainBattery: number;
    isUsing: boolean;
}

type UserData = {
    loginID :string,
    userGrade: number,
    userName: string,
    isLocked : boolean,
    registerDate?: string,
    unregisterDate? : string | null,
}

type LogData ={
    wardName: string,
    roomName: string,
    patientName : string,
    startTime: string,
    endTime: string,
    pairingID : number,
}

type AlarmLogData = {
    alarmName :string;
    alarmID : number;
    startTime : string;
    endTime: string;
}

type Datas = AlarmData | RingerData | DeviceData | UserData | LogData | AlarmLogData | MonitoringDataV2;

type table_data = {
    tableUrl: string;
    name : string[];
    data : Array<Datas>;
    refresh?:<TPageData>(options?: any) => Promise<QueryObserverResult<any, unknown>>;
    setLogId?: Dispatch<SetStateAction<number>>;
}

function ResultTable({tableUrl, name, data, refresh, setLogId}: table_data) {

    // 선택삭제 api 위치

    let deleteState = DeviceDeleteState;

    if (tableUrl === "ringer") {
        deleteState = RingerDeleteState;
    } else if(tableUrl === "users"){
        deleteState = UserDeleteState;
    }

    console.log(tableUrl);

    const [checkedList, setCheckedList] = useRecoilState(deleteState);

    console.log(tableUrl);

    const userGrade = useRecoilValue(LoginState).user_grade;

    return (
        <table className="result_table">
            
            <Head tableUrl = {tableUrl} data = {data} checkedList = {checkedList} name = {name} setCheckedList = {setCheckedList} userGrade = {userGrade}/>
            <MemoBody data = {data} url = {tableUrl} checkedList = {checkedList} setCheckedList = {setCheckedList} refresh={refresh} userGrade = {userGrade} setLogId={setLogId}/>
            
        </table>
    )
}

type head_data = {
    tableUrl: string;
    data: Array<any>;
    name : string[];
    checkedList: any[];
    setCheckedList: SetterOrUpdater<any[]>;
    userGrade: number
}

function Head({tableUrl, data, name, checkedList, setCheckedList, userGrade}: head_data) {

    // 체크박스 전체 선택
    const handleAllCheck = useCallback(
        (checked: boolean) => {
        if(checked) {
        // 전체 선택 클릭 시 데이터의 모든 아이템(id)를 담은 배열로 checkItems 상태 업데이트
            const idArray:Array<any> = [];
            if(tableUrl === "device") {
                data.forEach((el) => idArray.push(el.deviceID));
            } else if (tableUrl === "ringer") {
                data.forEach((el) => idArray.push(el.ringerID));
            } else if (tableUrl === "users"){
                data.forEach((el) => idArray.push(el.loginID));
            }
            setCheckedList(idArray);
        } else {
            // 전체 선택 해제 시 checkItems 를 빈 배열로 상태 업데이트
            setCheckedList([]);
        }}, [data, checkedList]
    )

    return (
        <thead>
            <tr>
                {name.map((names, index) => {
                    if(names === "check_box") {
                        if( userGrade !== 2) {
                            return (
                                <th key = {index}>
                                    <UseAllCheckbox onChange = {handleAllCheck} checked = {checkedList.length === data.length ? true : false}/>
                                </th>
                            )
                        } else  {
                            return null
                        }
                    } else {
                        return (
                            <th key = {index}>{names}</th>
                        )
                    }
                })}
            </tr>
        </thead>
    )
}

/* type device_data = {
    serial_no: string,
    ringerName: string,
    ward_name: string,
    room_name: number,
    bed_name: string,
    patient_name: string,
    remainBattery: number,
    device_state: boolean
} */

type body_data = {
    url: string;
    data: Array<any>;
    checkedList: any[];
    setCheckedList: SetterOrUpdater<any[]>;
    refresh?:<TPageData>(options?: any) => Promise<QueryObserverResult<any, unknown>>;
    userGrade: number;
    setLogId?: Dispatch<SetStateAction<number>>;
}


function Body({url, data, checkedList, setCheckedList, refresh, userGrade, setLogId}: body_data) {
    console.log(data);
    
    const onCheckedItem = useCallback(
        
        (checked: boolean, item: any) => {
        console.log(item)
        if (checked) {
            if(url === "device" || url === "users") {
                setCheckedList((prev) => [...prev, item]);
            } else if (url === "ringer") {
                setCheckedList((prev) => [...prev, parseInt(item)]);
            }
        } else if (!checked) {
            if(url === "device" || url === "users") {
                setCheckedList(checkedList.filter((el) => el !== item));
            } else if (url === "ringer") {
                setCheckedList(checkedList.filter((el) => el !== parseInt(item)));
            }
        }
        },
        [checkedList]
    );

    const modal = UseModal();

    const [selectId, setSelectId] = useState("");
    const [selectName, setSelectName] = useState("");
    const [selctGrade, setSelectGrade] = useState("");
    

    const userChangeBtn = (id:string,name:string,grade:string) => {
        modal.onClickToggleModal();
            setSelectId(id);
            setSelectGrade(grade);
            setSelectName(name);
        }
    
    console.log(selectId);
    console.log(checkedList);

    return (
        <tbody className = {url}>
            {modal.isOpenModal && (
                <MemoModal onClickToggleModal={modal.onClickToggleModal} width = {600} sideModal = {modal.onClickToggleModal}>
                <MemoUserModal closeModal = {modal.onClickToggleModal} loginID = {selectId} user_name = {selectName} userGrade = {selctGrade} refresh={refresh}/>
                </MemoModal>
            )}
            {data.map((datas, index) => {
                if(url === "dashboard") {
                    return (
                        <tr key = {index}>
                            <td>{datas.wardName === undefined ? "-" : datas.wardName}</td>
                            <td>{datas.roomName === undefined ? "-" : datas.roomName}</td>
                            <td>{datas.bedName === undefined ? "-" : datas.bedName}</td>
                            <td>{datas.deviceID ? datas.deviceID : datas.patientName}</td>
                        </tr>
                    )
                } else if (url === "device") {
                    return (
                        <tr key = {index}>
                            {
                                userGrade !== 2 && <td><UseCheckbox value={datas.deviceID} onChange = {onCheckedItem} checked = {checkedList.includes(datas.deviceID) ? true : false}/></td>
                            }
                            <td>{datas.deviceName ? datas.deviceName : "-"}</td>
                            <td>{datas.deviceID !== null ? datas.deviceID : "-"}</td>
                            <td>{datas.isUsing ? datas.ringerName : "-"}</td>
                            <td>{datas.isUsing ? datas.wardName : "-"}</td>
                            <td>{datas.isUsing ? datas.roomName : "-"}</td>
                            <td>{datas.isUsing ? datas.bedName : "-"}</td>
                            <td>{datas.isUsing ? datas.patientName : "-"}</td>
                            <td>{datas.remainBattery !== null ? datas.remainBattery: "-"}</td>
                            {datas.isUsing ? <td><span className = "device_using device"> { datas.startTime === null ? "사용대기중" : "사용중"}</span></td> : <td>-</td>} 
                        </tr>
                    )
                } else if (url === "ringer") {
                    
                    return (
                        <tr key = {index}>
                            <td><UseCheckbox value={datas.ringerID} onChange = {onCheckedItem} checked = {checkedList.includes(datas.ringerID) ? true : false}/></td>
                            <td>{datas.ringerProductName}</td>
                            <td>{datas.ringerName}</td>
                            <td>
                                {datas.totalList.map((LingerMl:any, index:number) => (
                                    <>
                                        <span key={index}>{LingerMl}{datas.totalList.length-1 !== index ? ", " : ""}</span>
                                    </>
                                ))}
                            </td>
                            <td>{datas.registerTime}</td>
                        </tr>
                    )
                } else if (url === "alarms") {
                    return (
                        <tr key = {datas.alarmID}>
                            <td><img className = "warining_imgs" src = {ImgUrl(datas.alarmName)} alt = "알람 이미지"/></td>
                            <td>{Comments(datas.alarmName)}</td>
                            <td>{datas.wardName}</td>
                            <td>{datas.roomName}</td>
                            <td>{datas.bedName}</td>
                            <td>{datas.patientName}</td>
                            <td>{datas.ringerName}</td>
                            <td>{datas.startTime}</td>
                        </tr>
                    )
                } else if(url === "users"){
                    return(
                        <tr key={index}>
                            <td><UseCheckbox value={datas.loginID} onChange = {onCheckedItem} checked = {checkedList.includes(datas.loginID) ? true : false}/></td>
                            <td>{datas.loginID}</td>
                            <td>{datas.userName}</td>
                            <td>{datas.userGrade === 1 ? "관리자" : datas.userGrade === 2 ? "사용자" : ""}</td>
                            <td>{datas.isLocked ? "잠금" : "해제"}</td>
                            {userGrade === 0 && 
                            <>
                                <td>{datas.registerDate}</td>
                                <td>{datas.unregisterDate === null ? " - " : datas.unregisterDate}</td>
                            </>
                            }
                            <td>
                                <Button name='정보수정' size='XS' onClick = {() => userChangeBtn(datas.loginID, datas.userName, datas.userGrade)}/>
                            </td>
                        </tr>
                    )
                } else if(url === "logs"){
                    return (
                        setLogId && 
                        <tr key={index} onClick={() => setLogId(datas.pairingID)}>
                            <td>{datas.wardName}</td>
                            <td>{datas.roomName}</td>
                            <td>{datas.patientName ? datas.patientName : " - "}</td>
                            <td>{datas.startTime}</td>
                            <td>{datas.endTime}</td>
                        </tr>
                    )
                } else if( url ==="alarmLog") {
                    return(
                        <tr key={index}>
                            <td><img className = "warining_imgs" src = {ImgUrl(datas.alarmName)} alt = "알람 이미지"/></td>
                            <td>{Comments(datas.alarmName)}</td>
                            <td>{datas.startTime}</td>
                        </tr>
                    )
                } else if (url === "monitoringV2") {
                    return(
                        <tr key={index}>
                            <td>{datas.bedName}</td>
                            <td>{datas.patientName === "" ? "-" : datas.patientName}</td>
                            <td>
                                {
                                    datas.alarmList.length === 0 ?
                                    <>
                                        <img  className = "warining_imgs" src = {ImgUrl("BASIC")} alt = "알람_이미지"/>
                                        
                                    </>
                                    :
                                    <>
                                        <img  className = "warining_imgs" src = {ImgUrl(datas.alarmList[0].alarmName)} alt = "알람_이미지"/>
                                        
                                    </>
                                }
                            </td>
                        </tr>
                    )
                } else {
                    return null;
                }
            })}
        </tbody>
    )
}

const MemoBody = React.memo(Body);

/* function Foot() {
    return (
        <tfoot>
            <tr>
                <td colSpan={4}><span className="prev">{'<'}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span className="next">{'>'}</span></td>
            </tr>
        </tfoot>
    )
} */

export default React.memo(ResultTable);

type modal = {
    closeModal: () => void;
    loginID: string;
    user_name: string;
    userGrade: string;
    refresh?:<TPageData>(options?: any) => Promise<QueryObserverResult<any, unknown>>;
}


function UserModal({closeModal,loginID,user_name,userGrade, refresh}: modal) {

    const [ userName, setUserName] = useState("");
    const [ userPW, setUserPW] = useState("");
    const [ userPWCheck, setUserPWCheck] = useState("");
     
    const useApi = UseMutation({method: 'put', url : apiListsV2.user, apiName: "userChange", body : {"loginID": loginID, "password": userPWCheck, "name": userName, "grade": userGrade}, refresh :refresh});
    
    const onClick = () => {
        if(userPW != userPWCheck){
            alert("비밀번호가 일치하지 않습니다.");
        } else if(userName === ""){
            alert("사용자 이름을 입력해주세요.");
        } else if(userPW === "" || userPWCheck === ""){
            alert("비밀번호를 입력해주세요.");
        } else{
            useApi.mutate();
            closeModal();
        }
    }


    return (
        <>
            <MemoModalHead name='사용자 정보수정' closeModal={() => {closeModal()}} closeType = "x"/>
            <div className = "modal_body">
                <table className = "station_modal_table">
                    <tbody>
                        <tr>
                            <td>아이디</td>
                            <td>{loginID}</td>
                        </tr>
                        <tr>
                            <td>비밀번호 변경</td>
                            <td className = "not_padding"><InputText textType='input' inputType='password' placeholder='비밀번호를 입력해주세요.' size=' XS_M' setValue={setUserPW}/></td>
                        </tr>
                        <tr>
                            <td>비밀번호 확인</td>
                            <td className = "not_padding"><InputText textType='input' inputType='password' placeholder='비밀번호를 확인해주세요.' size=' XS_M' setValue={setUserPWCheck}/></td>
                        </tr>
                        <tr>
                            <td>이름</td>
                            <td className = "not_padding">
                                <InputText textType='input' placeholder='이름 입력해주세요.' size=' XS_M' setValue={setUserName}/>
                            </td>
                        </tr>
                        <tr>
                            <td>계정유형</td>
                            <td className = "not_padding add_btn">
                                <div>{userGrade}</div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div className = "station_modal_btn">
                    {/* <button onClick = {connectDevice}>테스트용</button> 
                        resetRecoil() 설정완료에서 실행 안됨, onclick에 넣어서 시도 했는데 빈값을 보내짐
                    */}
                    <MemoModalFoot name='저장' btn_size='M_M' closeModal= {() => {closeModal()}} onClick = {onClick}/>
                    <MemoModalFoot name='취소' btn_size='M_M clear' closeModal= {() => {closeModal()}}/>
                </div>
            </div>
            
        </>
    )

}

export const MemoUserModal = React.memo(UserModal);