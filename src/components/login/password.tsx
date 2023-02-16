import {
    useRecoilState
  } from 'recoil';

import { PwState } from 'recoils/LoginRecoil';

type InputInfo = {
    placeholder: string;
    onKeyPress: (e: { key: string; }) => void;
    passwordInput: React.RefObject<HTMLInputElement>;
}

function Password({placeholder, onKeyPress, passwordInput}: InputInfo) {

    const [, setText] = useRecoilState(PwState);

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setText(event.target.value);
    };

    return <input className = "password" placeholder = { placeholder } type = "password" onChange ={onChange} onKeyDown = {onKeyPress} ref = {passwordInput}/>

}

export default Password;