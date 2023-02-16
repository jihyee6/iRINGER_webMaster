export default function ImgaeUrl(img: string) {

    let img_src:string = "";

    switch(img) {
        case "BASIC": img_src = `${process.env.PUBLIC_URL}/assets/images/alarms/alarm_basic.png`; break;
        case "BATTERY": img_src = `${process.env.PUBLIC_URL}/assets/images/alarms/alarm_battery.png`; break;
        case "CONNECT": img_src = `${process.env.PUBLIC_URL}/assets/images/alarms/alarm_connect.png`; break;
        case "END": img_src = `${process.env.PUBLIC_URL}/assets/images/alarms/alarm_end.png`; break;
        case "FAST": img_src = `${process.env.PUBLIC_URL}/assets/images/alarms/alarm_fast.png`; break;
        case "TEN": img_src = `${process.env.PUBLIC_URL}/assets/images/alarms/alarm_limit.png`; break;
        case "REMAIN": img_src = `${process.env.PUBLIC_URL}/assets/images/alarms/alarm_remain.png`; break;
        case "SLOW": img_src = `${process.env.PUBLIC_URL}/assets/images/alarms/alarm_slow.png`; break;
        case "START": img_src = `${process.env.PUBLIC_URL}/assets/images/alarms/alarm_start.png`; break;
        case "STOP": img_src = `${process.env.PUBLIC_URL}/assets/images/alarms/alarm_stop.png`; break;
        default: break;
    }

    return img_src;

}