import React from 'react';
import Refresh from 'assets/images/refresh.png';
import Search from 'assets/images/search.png';

type info = {
    name: string;
    size: string;
    image?: string;
    onClick? : () => void;
}

function Button({name, size, image, onClick}:info) {

    let image_src = "";
    if(image === "Refresh") {
        image_src = Refresh;
    } else if (image === "Search") {
        image_src = Search;
    }

    return (
        <div className= {'btn_wrapper' + size}>
            <button className= {"btn" + size} onClick = {onClick}>
                {name}{image && <img className = "refresh" src = {image_src} alt = "갱신"/>}
            </button>
        </div>
    )
}
export default React.memo(Button);