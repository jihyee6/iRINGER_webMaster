import {useState,useEffect} from 'react';
type page = {
    page: number;
    totalPage: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function Pagination({page, totalPage, setPage}:page) {

    // prev는 처음에는 null_data
    const [ prev, setPrev] = useState(" null_data");
    const [ next, setNext] = useState("");

    useEffect(() => {
        // next는 처음에 totalPage == 1 인경우 null_data
        if(page === totalPage) {
            setNext(" null_data");
        } else {
            setNext("");
        }

         // prev는 page === 1인 경우 null_data
        if(page === 1) {
            setPrev(" null_data");
        }

        if(totalPage === 0) {
            setNext(" null_data");
        }
        
        console.log(totalPage);

    },[totalPage, page])

   
    const prevPage = () => {
        setPage(page-1);
        setPrev("")
        setNext("")
    }
   
    const nextPage = () => {
        setPage(page+1);
        setNext("")
        setPrev("")
    }

    return (
        <div className="pagination">
            <div><span className={"prev" + prev} onClick = {prevPage}>{'<'}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span className={"next" + next} onClick = {nextPage}>{'>'}</span></div>
        </div>
    )
}