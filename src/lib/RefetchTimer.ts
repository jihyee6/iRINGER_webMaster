import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from 'react-query';
import { useLocation } from 'react-router-dom';

type TimerData = {
    url: string;
    useUrl: string;
}

export default function Timer() {

    // 1. 현재 초를 받아옴
    let today = new Date();
    // 2. 10초인지 아닌지 판단
    if(today.getSeconds() % 10 === 0) {
        return true;
    } else {
        return null;
    }
};
