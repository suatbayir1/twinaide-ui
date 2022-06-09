import React from "react";
import Chart from "react-apexcharts";

const AreaChart = props => {
    const options = {
        colors: ["#17ead9", "#f02fc2"],
        chart: {
            type: 'area',
            height: 350,
            zoom: {
                enabled: false
            }
        },
        xaxis: {
            categories: props.xaxis,
            crosshairs: {
                fill: {
                    type: 'gradient',
                    gradient: {
                        colorFrom: '#D8E3F0',
                        colorTo: '#BED1E6',
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                    }
                }
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 10,
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            }
        },
        theme: {
            mode: 'dark',
            palette: 'palette1',
            monochrome: {
                enabled: false,
                color: '#255aee',
                shadeTo: 'dark',
                shadeIntensity: 0.65
            },
        },
        title: {
            text: `${props.field.displayName} Real Time Area Chart`,
            align: 'left'
        },
        noData: {
            text: "There is no data (Please check your data source configuration)",
            align: 'center',
            verticalAlign: 'middle',
            offsetX: 0,
            offsetY: 0,
            style: {
                color: '#17ead9',
                fontSize: '16px',
                fontFamily: undefined
            },
        },
        grid: {
            show: props.dataList.length < 1 ? false : true,      // you can either change hear to disable all grids
        },
    };
    return <Chart
        type={props.graphType}
        options={options}
        series={[{
            name: props.field.displayName,
            data: props.dataList
        }]}
        height={600}
    />;
};

export default AreaChart;