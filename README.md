# 프로젝트에 사용중인 라이브러리

|라이브러리|내용|설치일|비고
|:---|:---|:---:|:---|
| typescript | 타입스크립트 | 2022.11.08 | - |
| react-router-dom | 페이지 이동을 위한 라우터 | 2022.11.08 | - |
| recoil | 상태 관리 라이브러리  | 2022.11.08 | - |
| node-sass | scss를 사용하기 위한 라이브러리  | 2022.11.08 | - |
| react-bootstrap | 리액트 부트스트랩 | 2022.11.17 | css충돌 나서 사용 안함 |
| styled-components | css를 동적으로 사용하기 위한 라이브러리 | 2022.11.17 | 프로그레스 바 및 모달창에 사용 |
| firebase | notification을 위한 firebase 라이브러리  | 2022.11.21 | - |
| recharts | 차트 라이브러리  | 2022.11.21 | 모니터링 차트에 사용 |
| react-cookie | 리액트에서 쿠키를 사용하기 위한 라이브러리  | 2022.11.22 | 로그인시 아이디 저장에 사용 |
| recoil-persist | recoil의 추가 라이브러리  | 2022.11.22 | 새로고침하면 recoil이 사라지는데 이를 막기위해 사용 |
| axios | api호출 라이브러리 | 2022.12.23 | - |
| react-query | api호출 관련 라이브러리 | 2022.12.23 | 비동기 과정을 보다 효율적으로 사용할수 있게 도와주는 라이브러리 |
| react-hook-form | formData관련 라이브러리 | 2022.12.23 | - |
| react-apexchart | 차트 라이브러리 교체 | 2023.01.09 | - |


# iRINGER 웹 진행상황

> #### 2022.11.08 (프로젝트 시작)
> * login 페이지 퍼블리싱(완료)   
> * dashboard 페이지 퍼블리싱
   
> #### 2022.11.09
> * dashboard 페이지 퍼블리싱
   
> #### 2022.11.10
> * dashboard 페이지 퍼블리싱(완료)   
> * monitoring 페이지 퍼블리싱
   
> #### 2022.11.11
> * monitoring 페이지 퍼블리싱(완료)
   
> #### 2022.11.14
> * station 페이지 퍼블리싱(완료)
   
> #### 2022.11.15
> * device 페이지 퍼블리싱(완료)   
> * ringer 페이지 퍼블리싱(완료)   
> * alarm 페이지 퍼블리싱(완료)
   
> #### 2022.11.16
> * login 페이지 임시 아이디 로그인 기능 (완료)   
> * dashboard 페이지 탭 메뉴 기능 (완료)
   
> #### 2022.11.17
> * dashboard 페이지 공지사항 모달창 (완료)
> * monitoring 페이지 확대, 축소 뷰 (완료)
> * monitoring 페이지 상세보기 모달창

> #### 2022.11.18
> * monitoring 페이지 상세보기 모달창 (완료)
> * station 페이지 기기연결 모달창 (완료)
> * device 페이지 기기추가 모달창 (완료)
> * ringer 페이지 수액추가 모달창 (완료)

> #### 2022.11.21
> * device 페이지 전체 체크박스 선택 (완료)
> * ringer 페이지 전체 체크박스 선택 (완료)
> * firebase, service-worker 추가 (완료)
> * header 웹페이지 하단에 알람창 추가

> #### 2022.11.22
> *  header 웹페이지 하단에 알람창 추가 (완료)
> * 아이디 저장 체크 후 로그인시 아이디 저장-쿠키사용 (완료)

> #### 2022.11.23
> * login 페이지 둘러보기 (완료)

> #### 2022.11.24
> * login 페이지 id에서 enter키 입력시 password로 focus (완료)
> * 전체적인 페이지 타입 정리 (완료)
> * Ringer.scss 파일 삭제

> #### 2022.11.25
> * css 수정   
> flex에서 간격조절 gap으로 변경   
> pagination 드래그 안되게 변경   
> * type 수정   
> type 첫글자 명 대문자로 변경   
> * 404 페이지 제작 (완료)

> #### 2022.12.09
> * 로그인 정보 sessionstroage에서 recoil-persist로 변경
> * 모니터링 페이지 변경 (완료)   
> 전부 보여주던 방식에서 병동별로 보여주는걸로 변경

> #### 2022.12.14
> * 모니터링에서 상세보기 알람 내용 2개일시 펼쳐보기 (완료)

> #### 2022.12.23
> * api사용을 위한 라이브러리 설치(axios, react-query, react-hook-form)
> * ApiLists.ts에서 api관련 주소 관리
> * 병동보기 페이지 api 연결 (v2/monitoring)
> * 병동보기 기기연결 api 연결 (pairing)

> #### 2022.12.30
> * 모니터링 페이지 api연결 (v2/monitoring)
> * 사이드바 검색 api연결 (ward, room, bed)
> * 병동보기 갱신 개수세기, 모니터링 상세보기 개수 세기
