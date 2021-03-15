import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GrapBar from './GrapBar'

const Graph = () => {

    useEffect(() => {
        const timeOut = setInterval(() => {
            getMsg();
        }, 3000)

        getMsg();

        return () => {
            clearInterval(timeOut);
        }
    }, [])

    const getMsg = () => {
        axios.get('http://localhost:80/raw').
            then(data => {
                const result = [];
                data.data.forEach(item => {
                    const key = item.name.charAt(0);
                    if (!result[key]) {
                        result[key] = 0
                    }
                    result[key]++;
                })

                const newPuntos = Object.keys(result).map(k => ({
                    label: k, y: result[k]
                }))

                setPoints(newPuntos);
            })
    }

    const [points, setPoints] = useState([]);

    return (
        <div>
            <GrapBar puntos={points} />
        </div>
    )
}

export default Graph;