import { SetterOrUpdater } from 'recoil';
import { UserState } from 'recoils/LoginRecoil';

export type login_data = {
    id: string;
    pw: string;
    userName: string;
    user_grade: number;
    userToken: string;
    isLogin: boolean
    checked: boolean;
    setCookie: (name: "rememberEmail", value: any, options?: any) => void;
    removeCookie: (name: "rememberEmail", options?: any) => void;
    setIsLoggedIn: SetterOrUpdater<UserState>;
}

export function RequestLogin({id, pw, userName, user_grade, userToken, isLogin, checked, setCookie, removeCookie, setIsLoggedIn}:login_data) {

    //console.log(id);
    //console.log(pw);

    // DB에서 가져와서 보여주므로 여기까지 작업
    // email 형식 체크
    // else {
    //     let regex = new RegExp('@+.');
    //     if(!regex.test(id)) {
    //         return "check_email";
    //     }
    // }

    setIsLoggedIn({user_name: userName, user_grade: user_grade, userToken: userToken, is_login: isLogin});

    if(checked) {
        // 2592000초 === 1달
        setCookie('rememberEmail', id, {maxAge: 2592000});
    } else {
        removeCookie('rememberEmail');
    }

    // if(id === "admin@iringer.com" && pw === "admin") {
    //     /* 시스템관리자 */
    //     /* 로그인 유지 방법 찾아보기 우선은 sesstionStorage사용...*/
    //     setIsLoggedIn({user_name: '시스템관리자', user_grade: '0', is_login: true});

    //     if(checked) {
    //         // 2592000초 === 1달
    //         setCookie('rememberEmail', id, {maxAge: 2592000});
    //     } else {
    //         removeCookie('rememberEmail');
    //     }
        
    //     return "admin";
    // } else if (id === "hospital@iringer.com" && pw === "hospital") {
    //     /* 병원관리자 */
    //     setIsLoggedIn({user_name: '병원관리자', user_grade: '1', is_login: true});

    //     if(checked) {
    //         // 2592000초 === 1달
    //         setCookie('rememberEmail', id, {maxAge: 2592000});
    //     } else {
    //         removeCookie('rememberEmail');
    //     }
    //     return "hospital";
    // } else if (id === "user@iringer.com" && pw === "user") {
    //     /* 일반사용자 */
    //     setIsLoggedIn({user_name: '일반사용자', user_grade: '2', is_login: true});

    //     if(checked) {
    //         // 2592000초 === 1달
    //         setCookie('rememberEmail', id, {maxAge: 2592000});
    //     } else {
    //         removeCookie('rememberEmail');
    //     }
    //     return "user";
    // } else {
    //     /* 로그인 실패 */
    //     return "failed";
    // }


}