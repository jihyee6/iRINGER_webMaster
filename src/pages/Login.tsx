import 'css/Login.scss';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import { useRecoilValue } from 'recoil';
import { PwState, LoginState, UserState } from 'recoils/LoginRecoil';
import { RequestLogin } from 'apis/Login';

import { useRecoilState } from 'recoil';

import Logo from "assets/images/logo.png";
import Password from "components/login/password";
import GuestLogin from 'lib/GuestLogin';

import { UseApis } from 'hooks/UseApi';
import { apiListsV2 } from 'apis/ApiLists';

type UserData = {
  userName: string;
  userGrade: number;
  userToken: string;
  isLogin: boolean;
}

function Login() {
  
  const [comment, setComment] = useState<string>("*계정이 잠겼을 경우 병원 관리자에게 문의해주세요.");

  const navigate = useNavigate();

  const [checked, setChecked]  = useState<boolean>(false);
 
  const onCheck =(e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
  }

  const pw = useRecoilValue<string>(PwState);

  const onKeyLogin = (e: { key: string; }) => {
    if(e.key === "Enter") {
      NavigateToMain();
    }
  }
  
  const passwordInput = useRef<HTMLInputElement>(null);

  const onKeyPassword = (e: { key: string; }) => {
    if(e.key === "Enter") {
      passwordInput.current?.focus();
    }
  }

  const [text, setText] = useState<string>("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setText(event.target.value);
  };

  const [cookies, setCookie, removeCookie] = useCookies(['rememberEmail']);

  useEffect(() => {
    if(cookies.rememberEmail !== undefined) {
      setText(cookies.rememberEmail);
      setChecked(true);
    }
  }, [cookies]);

  const FCMToken = sessionStorage.getItem("FCMToken");

  const [loggedIn, setIsLoggedIn] = useRecoilState<UserState>(LoginState);
  const loginApis = UseApis({method: 'post', url : apiListsV2.login, apiName: "login", body : {loginID: text, password: pw, FCMToken: FCMToken}, time : false, async: false});

  const [ userData, setUserData ] = useState<UserData>({
    userName: "",
    userGrade: -2,
    userToken: "",
    isLogin: false
  });

  useEffect(() => {

    if(!loginApis.isLoading && loginApis.data) {

      console.log(loginApis.data);
      const result = loginApis.data.message;

      if(result === "Success") { 
        setUserData({userName: loginApis.data.userName, userGrade: loginApis.data.userGrade, userToken: loginApis.data.userToken, isLogin: true});
      } else if (result === "Not Matched"){
        const count = loginApis.data.count;
        setComment("이메일 또는 비밀번호를 확인해주세요. " + count + "번 실패 하였습니다.")
      } else if (result === "Locked"){
        setComment("5회 연속 불일치로 잠긴 계정입니다. 병원 관리자에게 문의해주세요.");
      } else if (result === "Exited") {
        setComment("탈퇴한 계정입니다. 병원 관리자에게 문의해주세요.");
      } else if (result === "Not User") {
        setComment("존재하지 않는 계정입니다. 병원 관리자에게 문의해주세요.");
      }
    }
  },[loginApis])

  // user_grade: 0: 슈퍼계정, 1: 병원관리자, 2: 일반사용자
  // 여기서 고정값으로 변경해주면 user_grade 테스트 가능
  const memorizedCallback = useCallback(() => 
    RequestLogin({id : text, pw: pw, userName: userData.userName, user_grade: userData.userGrade, userToken: userData.userToken, isLogin: userData.isLogin, checked: checked, setCookie: setCookie, removeCookie: removeCookie, setIsLoggedIn: setIsLoggedIn})
  ,[userData])


  useEffect(() => {
    if(userData.isLogin){
      memorizedCallback();
      navigate("/monitoring");
      loginApis.remove();
    }
  },[userData])

  const NavigateToMain = () => {

        
    if(text === "") {
      setComment("아이디를 입력해 주세요.")
    } 
    // else if (result === "check_email") {
    //   setComment("이메일 주소를 확인해주세요.")
    // } 
    else if (pw === "") {
      setComment("비밀번호를 입력해 주세요.")
    } else {
      loginApis.refetch();
    }
  };

  const NavigateToGuest = () => {
    GuestLogin({setIsLoggedIn: setIsLoggedIn});
    navigate("/dashboard")
  }

  return (
    <div className = "login_box">
      <div className = "login">
        <div className = "logo_img_wrap">
          <img className = "logo_img_big" src = {Logo} alt = "iringer_logo"/>
        </div>
        <div className = "login_title">로그인</div>
        <div className = "input_parent">
          <input className = "input_text" placeholder = '아이디' type = "text" value = {text} onChange={onChange} onKeyDown = {onKeyPassword} />
        </div>
        <div className = "input_parent">
          <Password placeholder = "비밀번호" onKeyPress = {onKeyLogin} passwordInput = {passwordInput}/>
        </div>
        <div>
          <div className = "login_comment">{comment}</div>
        </div>
        <div className = "cb_wrapper">
          <input type = 'checkbox' checked = {checked} onChange = {onCheck}/><span className = "save_comment">아이디 저장</span>
        </div>
        <div>
          <button className = "submit_btn" onClick = {() => NavigateToMain() }>로그인</button>
        </div>
        <div className = "url_wrapper">
          <div className='url_comment' onClick = { NavigateToGuest }>둘러보기</div>
          <div className='url_comment'>비밀번호 찾기</div>
        </div>
      </div>
    </div>
  );
}

export default Login;