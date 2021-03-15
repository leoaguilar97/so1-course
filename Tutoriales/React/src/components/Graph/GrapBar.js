import React from 'react';
import CanvasJSReact from './canvasjs.react';
const CanvasJSChart = CanvasJSReact.CanvasJSChart;


const GrapBar = ({ puntos }) => {

    const options = {
        AnimationEnabled: true,
        title: {
            text: "Grafica de baras"
        },
        axisX: {
            title: "Nombre"
        },
        axisY: {
            title: "Cantidad de mensajes"
        },
        data: [
            {
                type: "column",
                dataPoints: puntos
            }
        ]
    }

    return (
        <CanvasJSChart options={options} />
    );
}


export default GrapBar;