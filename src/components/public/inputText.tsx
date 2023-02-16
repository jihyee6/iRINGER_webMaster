import { useRecoilState } from 'recoil';

import { IdState } from 'recoils/LoginRecoil';

import { logSearchState, RingerSearchState, UserSearchState } from 'recoils/SearchRecoil';

type InputInfo = {
    // textType: string or number or email
    // placeholder: placeholder
    textType: string;
    placeholder: string;
    size?: string;
    onKeyPress? : (e: { key: string; }) => void;
    setValue? : React.Dispatch<React.SetStateAction<any>>;
    url?: string;
    inputType?:string;
}

function  InputText({textType, placeholder, size, onKeyPress, setValue, url, inputType}: InputInfo) {

    // 1. useState써서 값을 밖으로 가져와서 밖에서 Recoil
    // 1. inputText에서 어디서 보냈는지 판단해서 useReoilState(?)
    // 물음표를 상황에 따라 다르게 준다.
    let recoilType = IdState;

    if(url === "ringer") {
        recoilType = RingerSearchState;
    } else if(url === "user"){
        recoilType = UserSearchState;
    } else if(url === 'logs'){
        recoilType = logSearchState;
    }


    const [text, setText] = useRecoilState(recoilType);
    
    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(event.target.value);
        setText(event.target.value);
        
        if(setValue) {
            setValue(event.target.value);
        }
        
    };

    return (
        <input className = {"input_text" + (size ? size : "")} placeholder = { placeholder } type = {inputType === "password" ? "password" :"text"}  onChange={onChange} onKeyDown = {onKeyPress}/>
    )

}

export default InputText;
