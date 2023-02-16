// 리액트 라이브러리
import React, { ReactElement } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { LoginState } from 'recoils/LoginRecoil';

interface PrivateRouteProps {
    children?: ReactElement; // Router.tsx에서 PrivateRoute가 감싸고 있는 Componet Element
    authentication: boolean; // true :인증을 반드시 해야하만 접속가능, false : 인증을 반디스 안해야만 접속 가능
}

export function PrivateRoute({ authentication }: PrivateRouteProps): React.ReactElement | null {

    /**
     * 로그인 했는지 여부
     * 로그인 했을 경우 : true 라는 텍스트 반환
     * 로그인 안했을 경우 : null or false(로그아웃 버튼 눌렀을경우 false로 설정) 반환
     */

    // const isAuthenticated = sessionStorage.getItem("user_grade");
    const isAuthenticated = useRecoilValue(LoginState).is_login;

    if (authentication) {
        // 인증이 반드시 필요한 페이지
        // 인증을 안했을 경우 로그인 페이지로, 했을 경우 해당 페이지로
        return (isAuthenticated === null || isAuthenticated === false) ? <Navigate to="/" /> : <Outlet />;

    } else {
        // 인증이 반드시 필요 없는 페이지
        // 인증을 안햇을 경우 해당 페이지로 인증을 한 상태일 경우 main페이지로
        return (isAuthenticated === null || isAuthenticated === false) ? <Outlet /> : <Navigate to='/' />;
    }
}

export function ProtectRoute(): React.ReactElement | null {

    // 현재 Url정보를 갖고 오기 위해서 useLocation Hooks사용
    const location = useLocation();

    let path:string = location.pathname.substring(1).split("/")[0];
    // console.log(path);

    /**
     * 필요정보2. 로그인한 사용자의 정보
     * 로그인을 했고 무조건 데이터가 있다는 가정하에 as 키워드를 붙였다.(as 키워드는 정말 진짜 확실할때만 사용하는걸로 알고 있다.)
     */
    // const user_grade = sessionStorage.getItem("user_grade");
    const user_grade = useRecoilValue(LoginState).user_grade;

    if(path === "device" || path === "ringer" || path === "alarm") {
        if(user_grade === -1) {
            return <Navigate to="/monitoring" />;
        } 
    }

    if (user_grade === 2) {
        /* alert('해당 페이지 접근 권한이 없습니다! 관리자 메인페이지로 이동합니다.'); */
        return <Navigate to="/monitoring" />;
    }

    // 접근 가능한 페이지일 경우 해당 페이지를 보여준다.
    return <Outlet />
}