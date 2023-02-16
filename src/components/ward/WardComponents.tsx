import React, { useEffect, useState } from 'react';
import Table from 'components/public/resultTable';
import Button from 'components/public/button';
import UseModal from 'hooks/UseModal';
import { MemoModal, MemoModalFoot, MemoModalHead } from 'components/public/modal';
import InputText from 'components/public/inputText';
import { StringLike } from '@firebase/util';
import { UseMutation } from 'hooks/UseApi';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query';
import { apiListsV2 } from 'apis/ApiLists';

type wardListData = {
    bedCount: number;
    roomID: number;
    roomName: string;
}

type WardData ={
    wardName: string;
    wardID : number;
    roomList : Array<wardListData>;
}

type WardContentsData = {
    data : WardData[];
    refresh: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
    hospitalID :number;
    wardRefresh: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
}

function WardContents({data, refresh,hospitalID,wardRefresh}: WardContentsData) {
    console.log(data);
    
    return (
        <div className="monitoring">
            <div className="user_body">
                {
                    data.map((datas, index) => (
                        <WardBox key = {index} wardName ={datas.wardName} wardID = {datas.wardID} roomLists ={datas.roomList} refresh={refresh} hospitalID={hospitalID} wardRefresh ={wardRefresh}/>
                    ))
                }
            </div>
        </div>
    )
}

export const MemoWardContents = React.memo(WardContents);

type wardRoomListData = {
    bedCount: number;
    roomID: number;
    roomName: string;
}

type WardBoxList ={
    wardName: string;
    wardID : number;
    roomLists: Array<wardRoomListData>;
    refresh: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
    hospitalID: number;
    wardRefresh: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
}

function WardBox({wardName,wardID,roomLists, refresh, hospitalID, wardRefresh}:WardBoxList) {
    
    const modal = UseModal();
    const room_modal = UseModal();

    const [ModalType, setModalType] = useState<string>("");
    const [roomID, setRoomID] = useState(0);
    const [deleteRoomID, setDeleteRoomID] = useState(0);

    const deleteWards = UseMutation({method:'delete', apiName:"deleteWard", url: apiListsV2.wards, body: {hospital : hospitalID, wardID: wardID}, refresh:refresh});
    const deleteRoom = UseMutation({method:'delete', apiName:"deleteRoom", url: apiListsV2.room, body: {roomID : deleteRoomID}, refresh:refresh});

    const deleteWardClick = () => {
        if(window.confirm("선택하신 병동을 삭제하시겠습니까?")){
            deleteWards.mutate();
        } else {
            return;
        }
    }

    const deleteRoomClick = (id:number) => {
        console.log(id);
        setDeleteRoomID(id);
        // console.log(deleteRoomID);
        // if(window.confirm("선택하신 병실을 삭제하시겠습니까?")){
        //     deleteRoom.mutate();
        // } else {
        //     return;
        // }
    }

    useEffect(() => {
        if(deleteRoomID !== 0) {
            if(window.confirm("선택하신 병실을 삭제하시겠습니까?")){
                deleteRoom.mutate();
            } else {
                setDeleteRoomID(0);
            }
        }
    }, [deleteRoomID])

    return(
        <>
        {modal.isOpenModal && (
            <MemoModal onClickToggleModal={modal.onClickToggleModal} width = {600} sideModal = {modal.onClickToggleModal}>
            <MemoWardModal closeModal = {modal.onClickToggleModal} ModalType ={ModalType} refresh={refresh} changeWardID ={wardID} hospitalID ={hospitalID} 
            changeRoomID = {roomID} wardRefresh={wardRefresh}/> 
            </MemoModal>
        )}
        <div>
            <div className='wardTitle'>
                <p className='wardName'>{wardName}</p>
                <div className='wardBtn'>
                    <button type='button' className='wardChange' onClick={() => {modal.onClickToggleModal(); setModalType("wardChange")}}>이름수정</button>
                    <button type='button' className='wardDelete' onClick={deleteWardClick}>병동삭제</button>
                </div>
            </div>
            <div className='roomList'>
                {roomLists.map((room, index) => (
                    <div key = {index} className='roomBox'>
                        <p>{room.roomName}</p>
                        <div className='roomInfo'>
                            <p>베드 수 : {room.bedCount} </p>
                            <div>
                                <img src={`${process.env.PUBLIC_URL}/assets/images/modifyBtn.png`} alt="modify" onClick={() => {modal.onClickToggleModal(); setModalType("roomChange"); setRoomID(room.roomID)}} />
                                <img src={`${process.env.PUBLIC_URL}/assets/images/deleteBtn.png`} alt="delete" onClick={() => deleteRoomClick(room.roomID)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='addBtn'>
                <button type='button' onClick={() => {modal.onClickToggleModal(); setModalType("roomAdd")}}>병실추가</button>
            </div>
        </div>
        </>
    )
}

export const MemoWardBox = React.memo(WardBox);

type modal = {
    closeModal: () => void;
    ModalType :string;
    refresh: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
    changeWardID?: number;
    hospitalID:number;
    changeRoomID?: number;
    wardRefresh: <TPageData>(options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined) => Promise<QueryObserverResult<any, unknown>>;
}


function WardModal({closeModal, ModalType, refresh, changeWardID, hospitalID, changeRoomID, wardRefresh}: modal) {

    const [ changeWardName, setChangeWardName] = useState("");
    const [changeRoomName, setChangeRoomName] = useState("");
    const [bedNum, setBedNum] = useState(0);

    const changeWards = UseMutation({method: 'put', apiName:"changeWards", url: apiListsV2.wards, body: {hospital: hospitalID, wardID: changeWardID, wardName: changeWardName}, refresh :refresh});
    const addRooms = UseMutation({method: 'post', apiName: "addRooms", url: apiListsV2.room, body:{wardID: changeWardID, roomName: changeRoomName, bedCount: bedNum}, refresh: refresh});
    const changeRooms = UseMutation({method: 'put', apiName: "changeRooms", url: apiListsV2.room, body:{roomID: changeRoomID, roomName: changeRoomName, bedCount: bedNum}, refresh: refresh});
    

    const onClick = () => {
        if(ModalType === "wardChange"){
            if(changeWardName === ""){
                alert("수정하실 병동 명을 입력해 주세요.");
            } else{
                changeWards.mutate();
                closeModal();
            }
        } else if( ModalType === "roomAdd"){
            if(changeRoomName === ""){
                alert("추가하실 병실 명을 입력해 주세요.");
            } else if(bedNum === 0){
                alert("추가하실 베드 수를 입력해주세요.");
            } else {
                addRooms.mutate();
                closeModal();
            }
        } else if(ModalType === "roomChange"){
            if(changeRoomName === ""){
                alert("수정하실 병실 명을 입력해 주세요.");
            } else if(bedNum === 0){
                alert("수정하실 베드 수를 입력해주세요.");
            } else {
                changeRooms.mutate();
                closeModal();
            }
        }
    }

   
    const resetRecoil = () => {
        // deviceReset();
        // ringerReset();
        console.log("recoil");
    }
    const plusCnt = (bedNum:number) => {
        setBedNum(bedNum + 1)
    }
    const minusCnt = (bedNum:number) => {
        if(bedNum <= 0){
            setBedNum(0);
        } else{
            setBedNum(bedNum-1)
        }
    }

    console.log(bedNum);

    let okBtn ="";

    if(ModalType === "roomChange" || ModalType === "wardChange") {
        okBtn = "수정완료";
    } else{
        okBtn ="추가완료";
    }

    return (
        <>
            <MemoModalHead name={ModalType === "wardChange"?'병동 이름수정' : ModalType === "roomChange" ? '병실 수정' : "병실 추가"} closeModal={() => {closeModal(); resetRecoil();}} closeType = "x"/>
            <div className = "modal_body">
                <table className = "station_modal_table">
                    <tbody>
                        {ModalType === "wardChange" && (
                            <tr>
                                <td>병동 명</td>
                                <td className='not_padding'><InputText textType='input' placeholder='수정하실 병동명을 입력해주세요.' size=' XS_M' setValue={setChangeWardName}/></td>
                            </tr>
                        )}
                        {(ModalType === "roomChange" || ModalType === "roomAdd") && (
                            <>
                            <tr>
                                <td>병실 명</td>
                                <td className='not_padding'><InputText textType='input' placeholder={ModalType === "roomChange" ? '수정하실 병실 명을 입력해 주세요.': "추가하실 병실 명을 입력해 주세요."} size=' XS_M' setValue={setChangeRoomName}/></td>
                            </tr>
                            <tr>
                                <td>베드 수</td>
                                <td>
                                    <div className='countBox'>
                                        <div>{bedNum}</div>
                                        {/* <InputText textType='input' size=' XXS_M' placeholder='0' setValue={setBedNum}/> */}
                                        <button type='button' className='countBtn' onClick={() => {minusCnt(bedNum)}}>-</button>
                                        <button type='button' className='countBtn' onClick={()=> {plusCnt(bedNum)}}>+</button>
                                    </div>
                                </td>
                            </tr>
                            </>
                        )}
                    </tbody>
                </table>
                <div className = "station_modal_btn">
                    
                    <MemoModalFoot name={okBtn} btn_size='M_M' closeModal= {() => {closeModal(); resetRecoil();}} onClick = {onClick}/>
                    <MemoModalFoot name='취소' btn_size='M_M clear' closeModal= {() => {closeModal(); resetRecoil();}}/>
                </div>
            </div>
            
        </>
    )

}

export const MemoWardModal = React.memo(WardModal);
