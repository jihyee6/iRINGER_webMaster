export const monitoringData =[
    {
        ward_name: "A병동",
        data : [
            {
                monitor_idx: 1,
                name: "101호 #1 이상O",
                time: "00:38",
                src: ["fast", "bettery"],
                ringer_short_name: "ND",
                now_speed: 100,
                device_battery: 80,
                inject_ml: 800,
                remain_ml: 200,
                alarm: true
            },
            {
                monitor_idx: 2,
                name: "101호 #2 김지O",
                time: "00:50",
                src: ["basic"],
                ringer_short_name: "DS 5",
                now_speed: 80,
                device_battery: 56,
                inject_ml: 400,
                remain_ml: 200,
                alarm: false
            },
            {
                monitor_idx: 3,
                name: "101호 #3 강지O",
                time: "00:30",
                src: ["basic"],
                ringer_short_name: "DW 5",
                now_speed: 80,
                device_battery: 40,
                inject_ml: 300,
                remain_ml: 700,
                alarm: false
            },
            {
                monitor_idx: 4,
                name: "101호 #4 이상O",
                time: "00:15",
                src: ["limit"],
                ringer_short_name: "DW 15",
                now_speed: 60,
                device_battery: 42,
                inject_ml: 500,
                remain_ml: 100,
                alarm: true
            }
        ]
    },
    {
        ward_name: "B병동",
        data : [
            {
                monitor_idx: 5,
                name: "101호 #1 김상O",
                time: "00:38",
                src: ["basic"],
                ringer_short_name: "ND",
                now_speed: 100,
                device_battery: 80,
                inject_ml: 800,
                remain_ml: 200,
                alarm: false
            },
            {
                monitor_idx: 6,
                name: "101호 #2 최상O",
                time: "00:50",
                src: ["remain"],
                ringer_short_name: "DS 5",
                now_speed: 80,
                device_battery: 56,
                inject_ml: 400,
                remain_ml: 200,
                alarm: true
            }
        ]
    },
    {
        ward_name: "C병동",
        data : [
            {
                monitor_idx: 7,
                name: "101호 #1 박상O",
                time: "00:38",
                src: ["basic"],
                ringer_short_name: "ND",
                now_speed: 100,
                device_battery: 80,
                inject_ml: 800,
                remain_ml: 200,
                alarm: false
            },
            {
                monitor_idx: 8,
                name: "101호 #2 정상O",
                time: "00:50",
                src: ["bettery", "slow", "fast"],
                ringer_short_name: "DS 5",
                now_speed: 80,
                device_battery: 56,
                inject_ml: 400,
                remain_ml: 200,
                alarm: true
            },
            {
                monitor_idx: 9,
                name: "101호 #3 이지O",
                time: "00:38",
                src: ["fast"],
                ringer_short_name: "ND",
                now_speed: 100,
                device_battery: 80,
                inject_ml: 800,
                remain_ml: 200,
                alarm: true
            },
            {
                monitor_idx: 10,
                name: "101호 #4 박지O",
                time: "00:50",
                src: ["basic"],
                ringer_short_name: "DS 5",
                now_speed: 80,
                device_battery: 56,
                inject_ml: 400,
                remain_ml: 200,
                alarm: false
            },
            
        ]
    }
]