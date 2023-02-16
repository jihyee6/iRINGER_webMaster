import React, { useEffect } from 'react';
import { useState } from 'react';
import ApexCharts from 'react-apexcharts';

type LingerLog = {
    time: number,
    speed: number
}

type LingerData = {
    apiData: LingerLog[];
    all: boolean;
    url?:string;
}

export function Charts({apiData, all, url}: LingerData) {

    useEffect(() => {
        if(all) {
            console.log(apiData[apiData.length-1].time);
            // 1/5만 보여줌
            const range = Math.floor(apiData.length/5);
            setMin(apiData[range === 0 ? 1 : apiData.length - range].time);
        } else {
            setMin(0)
        }
    },[all])

    const [min, setMin] = useState(0);

    console.log(apiData);

    const newData:Array<any> = [];

    apiData.map((data) => {
      let chartDataType = {'x': 0, 'y':0};
      chartDataType['x'] = data['time'];
      chartDataType['y'] = data['speed'];
      newData.push(chartDataType);
    })

    let logBackground = "transparent";
    let chartWidth = 0; 

    if(url === "log"){
        logBackground = "#232D37";
        chartWidth = 576;
    } else {
        chartWidth = 520;
    }

    return (
        <ApexCharts 
        type="line" 
        width= {chartWidth}
        height ={200}
        series={ [
            { 
                data: newData
            }
        ]}
        options={{
            theme: {
              mode: 'dark'  
            },
            colors: [ 'black' ],
            chart : {
                // height: '100%',
                // width: '100%',
                zoom: {
                    type: 'x',
                    enabled: false,
                    autoScaleYaxis: true
                },
                toolbar: {
                    show: false,
                    autoSelected: 'zoom'
                },    
                background : logBackground,
            },
            yaxis: {
                
                title: {
                text: '속도',
                rotate: 0,
                style: {
                    color: 'rgba(255, 255, 255, 0.8)'
                }
                },
                labels: {
                    style : {
                        colors: 'rgba(255, 255, 255, 0.8)'
                    }
                },
                min: 0,
                max: 140,
                tickAmount: 7,
                
                
            },
            xaxis: {
                // axisBorder: { show: false },
                // axisTicks: { show: false },
                labels: {
                    formatter: function (val) {
                        const minute = String(Math.floor((parseInt(val) / 60))).padStart(2, '0');
                        const seconds = String(parseInt(val) % 60).padStart(2, '0');
                        
                        return minute + ":" + seconds;
                    },
                    style : {
                        colors: 'rgba(255, 255, 255, 0.8)'
                    },
                    showDuplicates: false,
                },
                min: min,
                //타이틀이 그래프 내에 생성됨..
              title: {
                text: '',
              },
              tickAmount: 10,
              axisTicks : {
                show: true
              }

            },
            
            markers: {
                size: 0,
            },
            stroke: {
                curve: 'straight',
                colors: ['rgba(96, 137, 243, 1)'],
                width: 2
            },
            grid: {
                show: true,
                borderColor: '#5E646A',
                strokeDashArray: 4,
                yaxis: {
                    lines: {
                        show: true,

                    }
                },
                xaxis: {
                    lines: {
                        show: true,
                        
                    }
                }
            }
            }}>
            </ApexCharts>      

    )
}

export const MemoCharts = React.memo(Charts);