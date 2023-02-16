export const apiLists = {
    monitoring_detail : "/Iringer/monitoring-detail", // 모니터링 디테일
    monitoring : "/Iringer/v2/monitoring", // 병동보기
    wards : "/Iringer/wards", // 병동 리스트
    rooms : "/Iringer/rooms", // 병실 리스트
    beds : "/Iringer/beds", // 베드 리스트
    device : "/Iringer/devices", // 기기관리, 기기추가, 기기삭제
    pairing : "/Iringer/pairing", // 병동보기 => 기기변경, 투여완료
    login : '/Iringer/login', // 로그인
    alarm: "/Iringer/alarms", // 알람관리
    ringer: "/Iringer/ringers", // 수액관리, 수액추가, 수액삭제
    dashboardDevice: "/Iringer/dashboard/device", // 기기사용현황
    dashboardAlarm: "/Iringer/dashboard/alarm", // 기기사용현황
    events: "/Iringer/events",
    ringerChange: "/Iringer/ringer-change", // 수액변경
    deviceChange: "/Iringer/device-change" // 기기변경
}

export const apiListsV2 = {
    user: "/IringerVer2/users", // 사용자관리 검색, 추가, 수정
    unlock: "/IringerVer2/unlock", // 사용자 계정 잠금
    monitoring: "/IringerVer2/monitoring", // 모니터링, 모니터링 디테일
    login: "/IringerVer2/login", // 로그인
    wardInfo: "/IringerVer2/ward-info", // 병동보기
    hospitals: "/IringerVer2/hospitals", // 병원목록 (super계정만)
    wards: "/IringerVer2/wards", // 병동목록
    pairing: "/IringerVer2/pairing", // 기기연결
    hopitalInfo : "/IringerVer2/hospital-info", //병동관리
    monitoring_detail: "/IringerVer2/monitoring-detail", // 모니터링 디테일
    device : "/IringerVer2/devices", // 기기관리, 기기추가, 기기삭제
    room : "/IringerVer2/rooms", // 병실 추가, 수정, 삭제
    alarm: "/IringerVer2/alarms", // 알람관리
    alarmLog : "/IringerVer2/alarm-log", //로그기록 -> 알람정보, 상세정보 -> 알람정보
    log : "/IringerVer2/pairing-log", //로그기록 -> 알람정보

}