import styled from "styled-components";
import {  MemoModalHead } from 'components/public/modal';
import UseModal from 'hooks/UseModal';
import ImgUrl from 'components/public/alarmImg';
import { useEffect, useState } from "react";
import { StringLiteral } from "typescript";
import { MemoAlarmContents } from "components/alarm/AlarmComponents";
import Comments from "./alarmComment";
import { useRecoilValue } from "recoil";
import { LoginState } from "recoils/LoginRecoil";

type notification = {
    data: {
        alarm_index: number;
        view: boolean;
        title: string;
        alarmName: string;
        startTime: string;
        bedName: string;
    }[],
    effect: boolean,
}


export default function Notification({data, effect}: notification) {

    const userGrade = useRecoilValue(LoginState).user_grade;

    console.log(data);
    console.log(effect);
    
    const [ modalView, setModalView ] = useState<Array<boolean>>(data.map(data => data.view));

    useEffect(() => {
        setModalView(data.map(data => data.view));
    }, [effect])
    
    console.log(modalView);

    const handleCloseBtn = (index:number) => {
        setModalView((arr: boolean[]) => {

            let newArr: boolean[] = [];
            arr.map((item) => newArr.push(item));
            let likeCnt = [...modalView];

            likeCnt[index] = true;
            setModalView(likeCnt);

            return newArr;
        })
    }

    return (
        <>
            { 
                userGrade !== 0 && <ModalContainer>
                    { 
                        data.map((data, index) => (
                            !modalView[index] &&
                            <div className = "notification" key = {data.alarm_index}>
                                <MemoModalHead name='경고알림' closeModal={() => handleCloseBtn(index)} closeType = 'x'/>
                                <div className = "notification_body">
                                    <div><img className = "warining_imgs" src = {ImgUrl(data.alarmName)} alt = "알람_이미지"/></div>
                                    <div className = "_location">{data.bedName}</div>
                                    {/* <div className = "_location">{data.bedName}</div> */}
                                    <div className = "_status">{Comments(data.alarmName)}</div>
                                </div>
                                <div className = "notification_foot">
                                    <div>발생일시 : {data.startTime}</div>
                                </div>
                            </div>
                        ))
                    }
                </ModalContainer>
            }
        </>
    );
}

const ModalContainer = styled.div`
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    position: absolute;
    bottom: 0;
    right: 0;
    flex-direction: column-reverse;
    overflow-y:auto;
    max-height: 89vh;
`;