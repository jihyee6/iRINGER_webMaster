const alarmInfo =
    [
        {
            id: 0,
            status: "fast_alarm",
            name: "속도빠름",
            count: 10,
            alarm: "FAST",
            data: [
                {
                    ward_name: "D병동",
                    room_name: "101",
                    bed_name: "#1",
                    patient_name: "이상O",
                },
                {
                    ward_name: "D병동",
                    room_name: "101",
                    bed_name: "#2",
                    patient_name: "이현O",
                },
                {
                    ward_name: "D병동",
                    room_name: "101",
                    bed_name: "#3",
                    patient_name: "김지O",
                },
                {
                    ward_name: "D병동",
                    room_name: "101",
                    bed_name: "#4",
                    patient_name: "이상O",
                }
            ]
        },
        {
            id: 1,
            status: "slow_alarm",
            name: "속도느림",
            count: 15,
            alarm: "SLOW",
            data: [
                {
                    ward_name: "E병동",
                    room_name: "101",
                    bed_name: "#1",
                    patient_name: "이상O",
                },
                {
                    ward_name: "E병동",
                    room_name: "101",
                    bed_name: "#2",
                    patient_name: "이현O",
                },
                {
                    ward_name: "E병동",
                    room_name: "101",
                    bed_name: "#3",
                    patient_name: "김지O",
                },
                {
                    ward_name: "E병동",
                    room_name: "101",
                    bed_name: "#4",
                    patient_name: "이상O",
                }
            ]
        },
        {
            id: 2,
            status: "stop_alarm",
            name: "기기중단",
            count: 11,
            alarm: "STOP",
            data: [
                {
                    ward_name: "F병동",
                    room_name: "101",
                    bed_name: "#1",
                    patient_name: "이상O",
                },
                {
                    ward_name: "F병동",
                    room_name: "101",
                    bed_name: "#2",
                    patient_name: "이현O",
                },
                {
                    ward_name: "F병동",
                    room_name: "101",
                    bed_name: "#3",
                    patient_name: "김지O",
                },
                {
                    ward_name: "F병동",
                    room_name: "101",
                    bed_name: "#4",
                    patient_name: "이상O",
                }
            ]
        },
        {
            id: 3,
            status: "charge_alarm",
            name: "배터리부족",
            count: 12,
            alarm: "CHARGE",
            data: [
                {
                    ward_name: "G병동",
                    room_name: "101",
                    bed_name: "#1",
                    patient_name: "이상O",
                },
                {
                    ward_name: "G병동",
                    room_name: "101",
                    bed_name: "#2",
                    patient_name: "이현O",
                },
                {
                    ward_name: "G병동",
                    room_name: "101",
                    bed_name: "#3",
                    patient_name: "김지O",
                },
                {
                    ward_name: "G병동",
                    room_name: "101",
                    bed_name: "#4",
                    patient_name: "이상O",
                }
            ]
        },
    ]

export default alarmInfo;