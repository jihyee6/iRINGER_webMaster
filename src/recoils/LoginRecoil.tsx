import { atom, } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

export const IdState = atom({
    key: "id", // unique ID (with respect to other atoms/selectors)
    default: "", // default value (aka initial value)
});

export const PwState = atom({
    key: "pw", 
    default: "",
});

export type UserState = {
    user_name: string,
    user_grade: number,
    userToken: string,
    is_login: boolean
}

export const LoginState = atom<UserState>({
    key: "loginState",
    default: {user_name:"", user_grade: -2, userToken: "", is_login: false},
    effects_UNSTABLE: [persistAtom],
})