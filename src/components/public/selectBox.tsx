import { useRecoilState } from "recoil";
import { hospitalSearchState } from "recoils/SearchRecoil";

type info = {
    subject: string;
    size: string;
    options: Array<any>;
    onChange : React.Dispatch<React.SetStateAction<any>>;
    paramsID?: number[];
    setParmsID?: React.Dispatch<React.SetStateAction<number[]>>;
    setAsync?: React.Dispatch<React.SetStateAction<boolean[]>>;
}

export default function SelectBox({subject, size, options, onChange, paramsID, setParmsID, setAsync}:info) {
    
    const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const categoryID = parseInt(event.target.value);
        //console.log(categoryID);
        if(subject === "전체") {
            onChange(event.target.value);
        } else {
            onChange(categoryID);
        }

        if(subject === "병원" && setAsync && setParmsID && paramsID) {
            setParmsID([categoryID, 0, 0]);
            setAsync([false, true, false]);
        } else if(subject === "병동" && setAsync && setParmsID && paramsID) {
            setParmsID([paramsID[0], categoryID, 0]);
            setAsync([false, false, true]);
        } else if(subject === "병실" && setAsync && setParmsID && paramsID) {
            setParmsID([paramsID[0], paramsID[1], categoryID]);
        } 
        // else if(subject === "베드" && setAsync && setParmsID && paramsID) {
        //     setParmsID([paramsID[0], paramsID[1], categoryID]);
        // } 
    }

    // let nameStyle = {};
    // if(subject === "이름"){
    //     nameStyle = {padding: "0"};
    // }

    console.log(options)
    
    return (
        // <div className= {"select_wrapper_" + size} style={nameStyle}>
        <div className= {"select_wrapper_" + size} >
            <select onChange = {handleSelect} defaultValue={0}>
                {
                    subject === "전체" ?
                    <option value= {""}>{subject}</option>
                    :
                    <option value= {0}>{subject}</option>
                }
                {   
                    options.map(option => {
                        if(paramsID) {
                            if (subject === "병원") {
                                return <option value={option.hospitalID} key = {option.hospitalID}>{option.hospitalName}</option>;
                            } else if (subject === "병동") {
                                if(paramsID[0] === 0) {
                                    return null;
                                } else {
                                    return <option value={option.wardID} key = {option.wardID}>{option.wardName}</option>;
                                }
                            } else if (subject === "병실") {
                                if(paramsID[1] === 0) {
                                    return null;
                                } else {
                                    return <option value={option.categoryID} key = {option.categoryID}>{option.categoryName}</option>;
                                }
                            } else {
                                return <option value={option.categoryID} key = {option.categoryID}>{option.categoryName}</option>;
                            } 
                        } else {
                            return null;
                        }
                    })
                }
                
            </select>
        </div>
    )

}