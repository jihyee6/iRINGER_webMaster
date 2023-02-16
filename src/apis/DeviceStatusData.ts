const deviceStatusInfo =
    [
        {
            id: 0,
            status: "device_total",
            name: "전체",
            count: 72,
            data: [],
        },
        {
            id: 1,
            status: "device_using",
            name: "측정중",
            count: 40,
            data: [
                {
                    ward_name: "A병동",
                    room_name: "101",
                    bed_name: "#1",
                    patient_name: "이상O",
                },
                {
                    ward_name: "A병동",
                    room_name: "101",
                    bed_name: "#2",
                    patient_name: "이현O",
                },
                {
                    ward_name: "A병동",
                    room_name: "101",
                    bed_name: "#3",
                    patient_name: "김지O",
                },
                {
                    ward_name: "A병동",
                    room_name: "101",
                    bed_name: "#4",
                    patient_name: "이상O",
                }
            ],
        },
        {
            id: 2,
            status: "wait_bed",
            name: "대기중",
            count: 32,
            data: [
                {
                    ward_name: "B병동",
                    room_name: "101",
                    bed_name: "#1",
                    patient_name: "이상O",
                },
                {
                    ward_name: "B병동",
                    room_name: "101",
                    bed_name: "#2",
                    patient_name: "이현O",
                },
                {
                    ward_name: "B병동",
                    room_name: "101",
                    bed_name: "#3",
                    patient_name: "김지O",
                }
            ],
        }
    ]

export default deviceStatusInfo;