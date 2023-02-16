import React, { useCallback, useEffect, useState } from 'react';
import Logo from "assets/images/logo.png";
import 'css/Header.scss';
import { useNavigate, useLocation } from "react-router-dom";
import  Notification  from 'components/public/notifications';
import NotificationData from 'apis/NotificationData';

import { useRecoilState, useRecoilValue } from 'recoil';
import { PwState, LoginState } from 'recoils/LoginRecoil';

import { MessageType, MessageState } from "recoils/MessageRecoil";
import Comments from 'components/public/alarmComment';
import { UseApis } from 'hooks/UseApi';
import { apiListsV2 } from 'apis/ApiLists';

type NotificationDatas = {
    alarm_index: number;
    view: boolean;
    title: string;
    alarmName: string;
    startTime: string;
    bedName: string;
}

export default function Header() {

    const locationNow = useLocation();

    const [, setText] = useRecoilState(PwState);
    const [state, setState] = useRecoilState(LoginState);

    const loginInfo = useRecoilValue(LoginState);

    const [ effect,  setEffect ] = useState(false);

    const navigate = useNavigate();
    
    const navigateToLogout = () => {
        // sessionStorage.clear();
        // 로그아웃시 recoil 초기화
        setText("");
        navigate("/");
        setState({user_name:"",user_grade:-2, userToken: "", is_login: false})
    };

    // const user_name = sessionStorage.getItem("user_name");
    // const user_grade = sessionStorage.getItem("user_grade");

    const user_name = loginInfo.user_name;
    const user_grade = loginInfo.user_grade;
    console.log(loginInfo);

    // let notify = sessionStorage.getItem("notification");

    // console.log(notify);
    // const [, getTest] = useState(false);
    // const [body, getBody] = useState("");
    // const [title, getTitle] = useState("");
    const [_NotificationData, setNotificationData] = useState<Array<NotificationDatas>>(
    [{
        alarm_index : 0,
        view: false,
        title: "",
        alarmName: "",
        startTime: "",
        bedName: ""
    }]);

    const alarmsApi = UseApis({method: "get", url : apiListsV2.alarm, apiName: "headerAlarm", time : false, async: true});

    useEffect(() => {
        window.addEventListener('focus', function() {
            // 1개오면 sessionstorage 저장
            // 1개 더오면 sessionstorage 불러와서
            console.log('사용자가 웹페이지에 돌아왔습니다.')
        }, false);
    },[])
      
    // 알람이 왔을때 실행되는 부분
    const onClick = () => {
        const audio = new Audio('alarm.mp3');
        audio.play();
        alarmsApi.refetch();
        setEffect(!effect);
        //setNotificationData(testData);
        console.log(testData);
    }

    useEffect(() => {
        if(!alarmsApi.isLoading) {
            console.log(alarmsApi.data.data);
            setNotificationData(alarmsApi.data.data);
        }
    },[alarmsApi])

    useEffect(() => {
        //setNotificationData(testData);
        //console.log(_NotificationData);
    },[effect])

    if (locationNow.pathname === "/" || locationNow.pathname === '/popup' || locationNow.pathname === '/popupV2') return null;
    return (
        <>
            <header>
                <div className = "header_top">
                    <div>
                        <MemoLogoImg />
                        <button className='btn_test' onClick={onClick}>알림</button>
                    </div>
                    <div className = "header_user_info">
                        {/* <button className = "btn_test" onClick = {() => {getTest(true)}} hidden>테스트용</button> */}
                        {/* <div> [<span>oo병원</span>] <span>{user_name}</span>님 반갑습니다.</div> */}
                        <MemoUserInfomation user_name= {user_name}/>
                        
                        <div className = "header_logout" onClick = { navigateToLogout }>로그아웃</div>
                    </div>
                </div>
                <div className = "header_line"></div>
                <div className = "header_bottom">
                    {/* <MemoHeaderNavigate name="메인" url= "dashboard"/> */}
                    <MemoHeaderNavigate name="모니터링" url= "monitoring"/>
                    <MemoHeaderNavigate name="병동보기" url= "station"/>
                    { user_grade !== -1 &&
                        <>
                            <MemoHeaderNavigate name="기기관리" url= "device"/>
                            <MemoHeaderNavigate name="알람관리" url= "alarm"/>
                        </>
                    }
                    {(user_grade === 0 || user_grade === 1) &&
                    <>
                        {/* <MemoHeaderNavigate name="수액관리" url= "ringer"/> */}
                        <MemoHeaderNavigate name="병동관리" url= "ward"/>
                        <MemoHeaderNavigate name="사용자관리" url= "user"/>
                        <MemoHeaderNavigate name="로그기록" url= "log"/>
                    </>
                    }
                </div>
            </header>
            
            <Notification data = {_NotificationData} effect = {effect}/>
        </>
    );

}

type Test = {
    data : string;
}


let testData: NotificationDatas[] = [];

let indexCount = 0;

export function Btn_click({data}:Test) {

    indexCount++;

    const parseData = JSON.parse(data);
    console.log(parseData);
    console.log(parseData.notification);
    console.log(JSON.parse(parseData.notification.body));
    

    testData.push(
        {
            alarm_index: indexCount,
            view: true,
            title: parseData.notification.title,
            alarmName: JSON.parse(parseData.notification.body).alarmName,
            startTime: JSON.parse(parseData.notification.body).startTime,
            bedName: JSON.parse(parseData.notification.body).bedName,
        }
    );

    // const notification = sessionStorage.getItem("notification");

    // let JSONMessage = [];

    // if(notification !== null) {
    //     JSONMessage = JSON.parse(notification);
    // }

    // const [message, setMessage] = useRecoilState<MessageType>(MessageState);
    
    // setMessage({body: "", title: ""});

    // console.log(JSONMessage);

    // console.log("click");
    var btn : HTMLElement = document.getElementsByClassName("btn_test")[0] as HTMLElement;
    btn.click();
}


type iriger_url = {
    name: string;
    url: string;
    /* onClick: () => void; */
}

function HeaderNavigate({name, url}: iriger_url) {

    const navigate = useNavigate();
    
    const path = `/${url}`;

    const navigateToIringer = () => {
        navigate(path);
    };

    const locationNow = useLocation();
    const nowpath = locationNow.pathname;

    let select_page = "";

    if(nowpath === path) {
        select_page = "header_navigate select_navigate"
    } else {
        select_page = "header_navigate"
    } 

    return <div className = {select_page} onClick = {navigateToIringer} >{name}</div>
    
}

export const MemoHeaderNavigate = React.memo(HeaderNavigate);

function LogoImg() {
    const navigate = useNavigate();
    const dashBoardLink = ()=> {
        navigate('/monitoring');
    }
    return  <img className = "header_logo" src = { Logo } onClick={dashBoardLink} alt = "이미지 로고"/>;
}

export const MemoLogoImg = React.memo(LogoImg);

interface _UserInfomation {
    user_name: string | null;
}

function UserInfomation({user_name}: _UserInfomation) {
    return (
        user_name !== "[null] 슈퍼" ?
        <div><span>{user_name}</span>님 반갑습니다.</div>
        :
        <div><span>관리자 계정입니다.</span></div>
    )
}

export const MemoUserInfomation = React.memo(UserInfomation);