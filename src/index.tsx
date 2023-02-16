// 리액트 라이브러리
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { PrivateRoute, ProtectRoute } from 'lib/RouteSetting';

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools"
// 공용 css
import 'css/index.scss';
// 페이지 import
import Login from 'pages/Login';
import Header from 'components/headers/Header';
import Dashboard from 'pages/Dashboard';
import Monitoring from 'pages/Monitoring';
import MonitoringV2 from 'pages/Monitoring_v2';
import Station from 'pages/Station';
import Device from 'pages/Device';
import NotFound from 'pages/NotFound';
// import Ringer from 'pages/Ringer';
import Alarm from 'pages/Alarm';
import MonitoringPop from 'pages/MonitoringPop';
import MonitoringPop2 from 'pages/MonitoringPop_v2';

// 웹 성능 확인
// import reportWebVitals from 'reportWebVitals';
import 'lib/Firebase';
import User from 'pages/User';
import Ward from 'pages/Ward';
import Log from 'pages/Log';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <RecoilRoot>
      <Router>
        <QueryClientProvider client={ queryClient }> {/* react-query 설치 */}
        <ReactQueryDevtools initialIsOpen={false}/> 
        <Header />
        <Routes>
          <Route path="/" element={<Login />}></Route>
          {/* 인증을 반드시 해야지만 접속 가능한 페이지 정의 */}
          <Route element={<PrivateRoute authentication={true}/>}>
            {/* <Route path="/dashboard" element={<Dashboard />}></Route> */}
            <Route path="/monitoring" element={<MonitoringV2 />}></Route>
            {/* <Route path="/monitoringV2" element={<MonitoringV2 />}></Route> */}
            <Route path="/station" element={<Station />}></Route>
            <Route path="/popup" element={<MonitoringPop />}></Route>
            <Route path="/popupV2" element={<MonitoringPop2 />}></Route>
            <Route path="/device" element={<Device />}></Route>
            <Route path="/alarm" element={<Alarm />}></Route>
            <Route element={<ProtectRoute />}>
              {/* <Route path="/ringer" element={<Ringer />}></Route> */}
              <Route path="/user" element={<User />}></Route>
              <Route path="/ward" element={<Ward />}></Route>
              <Route path="/log" element={<Log />}></Route>
            </Route>
            {/* 404 page */}
            <Route path="*" element={<NotFound />}></Route>
          </Route>
        </Routes>
        </QueryClientProvider>
      </Router>
    </RecoilRoot>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
