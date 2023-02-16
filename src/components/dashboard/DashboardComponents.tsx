import React, { useState, ComponentProps }from 'react';
import ResultTable from 'components/public/resultTable';
import Pagination from 'components/public/pagination';
import Button from 'components/public/button';
import { MemoModal, MemoModalHead, MemoModalFoot } from 'components/public/modal';
import UseModal from 'hooks/UseModal';

type DeviceCount = {
    total: number;
    using: number;
    waiting: number;
}

type AlarmCount = {
    fast: number;
    slow: number;
    stop: number;
    battery: number;
}

type InfomationBigType = {
    name: string;
    // device: 기기사용현황, alarm: 경고알람 현황
    infoType : string;
    data: Array<any>;
    deviceCount?: DeviceCount;
    alarmCount? : AlarmCount;
    setStatusType: React.Dispatch<React.SetStateAction<number>>;
    setPageNum: React.Dispatch<React.SetStateAction<number>>;
    statusType: number;
    pageNum: number;
}

function InfomationBig({name, infoType, data, deviceCount, alarmCount, setStatusType, setPageNum, statusType, pageNum}: InfomationBigType) {

    let th_name:string[] = [];
    let totalPage:number = 0;
    const page = 12;

    if(deviceCount && infoType === "device") {
        th_name = ["병동", "병실", "베드", "기기명"];
        if(statusType === 0) {
            totalPage = Math.ceil(deviceCount.total/page);
        } else if (statusType === 1) {
            totalPage = Math.ceil(deviceCount.using/page);
        } else if (statusType === 2) {
            totalPage = Math.ceil(deviceCount.waiting/page);
        }
    } else if (alarmCount && infoType === "alarm") {
        th_name = ["병동", "병실", "베드", "환자명"]
        if(statusType === 0) {
            totalPage = Math.ceil(alarmCount.fast/page);
        } else if (statusType === 1) {
            totalPage = Math.ceil(alarmCount.slow/page);
        } else if (statusType === 2) {
            totalPage = Math.ceil(alarmCount.stop/page);
        } else if (statusType === 3) {
            totalPage = Math.ceil(alarmCount.battery/page);
        }
    }

    console.log("totalPage:" + totalPage);

    // 토탈페이지 계산해서 입력
    // const totalPage:number = Math.floor(data.length/12); 

    //const start_index:number = data[0].data.length === 0 ? 1 : 0;
    // 12개 

    //data[0].data = [...data[1].data, ...data[2].data];

    console.log(data);
    // console.log(page);

    return (
        <div className="info_big">
            <InfoName name = {name}/>
            <div className="info_contents">
                <InfoStatus deviceCount= {deviceCount} alarmCount = {alarmCount} setIndex = {setStatusType} select = {statusType} setPageNum = {setPageNum}/>
                <InfoTabMenu infoType= {infoType} deviceCount = {deviceCount} alarmCount = {alarmCount} setIndex = {setStatusType} setPageNum = {setPageNum} select = {statusType}/>
                <div className="info_table">
                    <ResultTable tableUrl = "dashboard" name = {th_name} data = {data} />
                    <Pagination page = {pageNum} totalPage = {totalPage} setPage = {setPageNum}/>
                </div>
            </div>
        </div>
    )

}

export const MemoInfomationBig = React.memo(InfomationBig);

type InfoNameType = {
    name: string;
}

export function InfoName({name}: InfoNameType) {

    return <div className="info_name">{name}</div>

}

type Infos = {
    status: string;
    name: string;
    count: number;
    alarm: string;
}

type InfoStatusType = {
    deviceCount?: DeviceCount;
    alarmCount?: AlarmCount;
    setIndex: React.Dispatch<React.SetStateAction<number>>;
    select: number;
    setPageNum: React.Dispatch<React.SetStateAction<number>>;
}

function InfoStatus({ deviceCount, alarmCount, setIndex, select, setPageNum }: InfoStatusType) {
    console.log(deviceCount);
    console.log(alarmCount);

    let status:any[] = [];
    let name:any[] = [];
    let alarm:any[] = [];
    let countNumber: any[] = []

    if(deviceCount) {
        status = ["device_total", "device_using", "wait_bed"];
        name = ["전체", "측정중", "대기중"];
        alarm = ["", "", ""];
        countNumber = [ deviceCount.total, deviceCount.using, deviceCount.waiting ];
    } else if (alarmCount) {
        status = ["fast_alarm", "slow_alarm", "stop_alarm", "charge_alarm"];
        name = ["속도빠름", "속도느림", "기기중단", "배터리부족"];
        alarm = ["FAST", "SLOW", "STOP", "CHARGE"];
        countNumber = [ alarmCount.fast, alarmCount.slow, alarmCount.stop, alarmCount.battery ];
    }

    return (
        <div className="info_status">
            {status.map((data, index) => (
                <InfoStatusBox key={index} status={status[index]} name={name[index]} count={countNumber[index]} alarm={alarm[index]} index={index} setIndex={setIndex} select={select} setPageNum ={setPageNum}/>
            ))}
        </div>
    )
}

type InfoStatusBoxType = {
    name: string;
    status: string;
    count: number;
    index: number;
    alarm?: string;
    setIndex: React.Dispatch<React.SetStateAction<number>>;
    select: number;
    setPageNum: React.Dispatch<React.SetStateAction<number>>;
}

function InfoStatusBox({name, status, count, alarm, select, setIndex, setPageNum, index}: InfoStatusBoxType) {

    console.log(alarm);
    
    const chagneState: ComponentProps<'div'>['onClick'] = (e) => {
        setPageNum(1);
        setIndex(Number(e.currentTarget.id));
    }

    let alamrs;

    if(alarm !== "") {
        alamrs = 
        <div className="alarm_box">
            <div className="alarm">
            <div>{alarm}</div>
            </div>
        </div>;
    }

    return (
        <div className="info_status_box">
            {alamrs}
            <span className={status}>{name}</span>
            <div id={`${index}`} className={alarm ? "font_B" : "font_B_margin"} onClick={chagneState}>{count}</div>
        </div>
    )
}

type Tabs = {
    id: number;
    name: string;
    count: number;
}

type InfoTabMenuType = {
    // device: 기기사용현황, alarm: 경고알람 현황
    infoType: string;
    deviceCount?: DeviceCount;
    alarmCount?: AlarmCount;
    setIndex: React.Dispatch<React.SetStateAction<number>>;
    select: number;
    setPageNum: React.Dispatch<React.SetStateAction<number>>;
}

function InfoTabMenu({ infoType, deviceCount, alarmCount, setIndex, select, setPageNum }: InfoTabMenuType) {

    let name:any[] = [];
    let countNumber: any[] = []

    if(deviceCount) {
        name = ["전체", "측정중", "대기중"];
        countNumber = [ deviceCount.total, deviceCount.using, deviceCount.waiting ];
    } else if (alarmCount) {
        name = ["속도빠름", "속도느림", "기기중단", "배터리부족"];
        countNumber = [ alarmCount.fast, alarmCount.slow, alarmCount.stop, alarmCount.battery ];
    }

    const chagneState: ComponentProps<'div'>['onClick'] = (e) => {
        setPageNum(1);
        setIndex(Number(e.currentTarget.id));
    }

    return (
        <div className="info_tab_menu">
            {
                name.map((datas, index) => {
                    if (index === select) {
                        return <div className="info_tab select_tab" id = {`${index}`} key={index} onClick = {chagneState}>{name[index]} ({countNumber[index]})</div>
                    } else {
                        /* if(infoType === "device" && index === 0) {
                            return null;
                        } */
                        return <div className="info_tab" id = {`${index}`} key={index} onClick = {chagneState}>{name[index]} ({countNumber[index]})</div>
                    }
                }
                )
            }
        </div>
    )

}

type NoticeData = {
    notice_subject: string;
    notice_writer: string;
    notice_date: string;
    notice_contents?: string;
    notice_file_url?: string | null;
}

type NoticeContents = {
    data: Array<NoticeData>;
    modalOpen: () => void;
    setData: React.Dispatch<React.SetStateAction<NoticeData>>;
}

type NoticeType = {
    data : Array<NoticeData>;
}

function Notice({data}: NoticeType) {

    console.log(data);
    
    const [page, setPage] = useState<number>(1);
    const totalPage:number = 1;

    const modal = UseModal();

    const [modalData, setModalData] = useState<NoticeData>({
        notice_subject: "",
        notice_writer: "",
        notice_date: ""
    });

    const fileDownload = () => {
        window.open("https://iringer.kr/assets/iRinger_User_Manual.pdf");
        //window.open("/station", "station", "width=600px, height=600px");
    }

    return (
        <>
            {modal.isOpenModal && (
                <MemoModal onClickToggleModal={modal.onClickToggleModal} width = {600} height = {598} sideModal={modal.onClickToggleModal}>
                    <NoticeModal data = {modalData} closeModal = {modal.onClickToggleModal}/>
                </MemoModal>
            )}
            <div>
                <div className="info_medium">
                    <InfoName name='공지사항' />
                    <hr />
                    <MemoNoticeContents data = {data} modalOpen = {modal.onClickToggleModal} setData = { setModalData }/>
                    <hr />
                    <Pagination page={page} setPage ={setPage} totalPage = {totalPage} />
                </div>
                <div className="info_small">
                    <InfoName name='사용자 메뉴얼' />
                    <hr />
                    <Button name='바로가기 >' size='M' onClick = {fileDownload}/>
                </div>
            </div>
        </>
    )
}

type Modal = {
    data : NoticeData;
    closeModal: () => void;
}

function NoticeModal({data, closeModal}: Modal) {
    
    console.log(data);
    return (
        <>
            <MemoModalHead name='공지사항' closeModal={closeModal} closeType = 'x'/>
            <div className = "modal_body">
                <table>
                    <tbody className = "modal_notice">
                        <tr>
                            <td className = "subject">등록일시</td>
                            <td>{data.notice_date}</td>
                        </tr>
                        <tr>
                            <td className = "subject">작성자</td>
                            <td>{data.notice_writer}</td>
                        </tr>
                        <tr>
                            <td className = "subject">제목</td>
                            <td>{data.notice_subject}</td>
                        </tr>
                        <tr className="contents_row">
                            <td className = "subject">내용</td>
                            <td>{data.notice_contents}</td>
                        </tr>
                        <tr>
                            <td className = "subject">파일첨부</td>
                            <td className = {data.notice_file_url ? "file_row" : ""}>{data.notice_file_url}
                                {data.notice_file_url && 
                                    <Button name='다운로드' size='S' />
                                }
                            </td>
                        </tr>
                    </tbody>
                </table>
                <MemoModalFoot name='확인' btn_size='M_M' closeModal= {closeModal}/>
            </div>
        </>
    )

}

export const MemoNotice = React.memo(Notice);


function NoticeContent({data, modalOpen, setData}: NoticeContents) {


    return (

        <div className='notice_contents'>
            <NoticeSubject data={data} modalOpen = {modalOpen} setData = {setData}/>
        </div>

    )

}

export const MemoNoticeContents = React.memo(NoticeContent);

type NoticeModalData = {
    data : Array<NoticeData>;
    modalOpen: () => void;
    setData: React.Dispatch<React.SetStateAction<NoticeData>>;
}

function NoticeSubject({data, modalOpen, setData}: NoticeModalData) {

    return (
        <>
            { data.map((datas, index) => (
                <div className="notice" key = {index} onClick = {() => {setData(datas); modalOpen();}}>
                    <div>{datas.notice_subject}</div>
                    <div className = "notice_status">
                        <span>{datas.notice_writer}</span> | <span>{datas.notice_date}</span>
                    </div>
                    {/* 페이징 할 개수를 적어쥼 */}
                    { index !== 4 ? <hr /> : null}
                </div>
            ))}
        </>

    )

}
