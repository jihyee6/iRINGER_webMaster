import { SetterOrUpdater } from 'recoil';
import { UserState } from 'recoils/LoginRecoil';

type login_data = {
    setIsLoggedIn: SetterOrUpdater<UserState>;
}

export default function GuestLogin({setIsLoggedIn}: login_data) {
    
    setIsLoggedIn({user_name: '게스트', user_grade: -1, userToken: "guesttoken", is_login: true});
    // sessionStorage.setItem('user_name', "게스트");
    // sessionStorage.setItem('user_grade', "-1");
}