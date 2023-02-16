export default function Comments(alarmType: string) {

    let comments:string = "";

    switch(alarmType) {
        case "BASIC": comments = ""; break;
        case "BATTERY": comments = "배터리가 10% 남았습니다."; break;
        case "CONNECT": comments = "기기가 연결되었습니다."; break;
        case "END": comments = "측정이 완료 되었습니다."; break;
        case "FAST": comments = "투여속도가 빠릅니다."; break;
        case "TEN": comments = "잔여시간이 10분 남았습니다."; break;
        case "REMAIN": comments ="잔여량이 100ml 남았습니다."; break;
        case "SLOW": comments = "투여속도가 느립니다."; break;
        case "START": comments = "측정이 시작되었습니다."; break;
        case "STOP": comments = "투여가 중단되었습니다."; break;
        default: comments = ""; break;
    }

    return comments;

}
