import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

// const data = [
//     {
//         name: "Page A",
//         pv: 2400
//     },
//     {
//         name: "Page B",
//         pv: 1398
//     },
//     {
//         name: "Page C",
//         pv: 3800
//     },
//     {
//         name: "Page D",
//         pv: 3908
//     },
//     {
//         name: "Page E",
//         pv: 4800
//     },
//     {
//         name: "Page F",
//         pv: 3800
//     }
// ];

type LingerLog = {
    time: number,
    speed: number
}

type LingerData = {
    data: LingerLog[];
}

export default function App({data}:LingerData) {

    console.log(data);

    // String.format("%02d:%02d", (value / 60).toInt(), (value % 60).toInt())
    // 데이터 분/초로 받아야 함..
    return (
        <LineChart
            width={520}
            height={210}
            data={data}
            margin={{
                top: 16,
                right: -0,
                left: 0,
                bottom: 0
            }}
        >
            <CartesianGrid stroke="#97999B" strokeDasharray="3 3"/>
            <XAxis dataKey="time" stroke="rgba(255,255,255,0.8)"/>
            <YAxis stroke="rgba(255,255,255,0.8)" />
            <Tooltip />
            <Line dataKey="speed" stroke="#8884d8" isAnimationActive={false} />
        </LineChart>
    );
}