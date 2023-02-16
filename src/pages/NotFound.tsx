import NotFoundImg from 'assets/images/404not_found.png';

export default function NotFound() {



    return (
        <div className="not_found_body">
            <div className="not_found">
                <div>
                    요청하신 페이지를 찾을 수 없습니다.
                </div>
                <img src = {NotFoundImg} alt = "404_not_found"/>
            </div>
        </div>
    )
}