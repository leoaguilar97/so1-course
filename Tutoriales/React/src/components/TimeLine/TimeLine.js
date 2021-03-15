import React, { useEffect, useState } from 'react';
import Timeline from '@material-ui/lab/Timeline';
import axios from 'axios'
import Item from './Item'

export default function CustomizedTimeline() {
    const [msg, setMsg] = useState([]);

    const getMsg = async () => {
        try {
            const { data } = await axios.get('http://localhost:80/raw');
            setMsg(data.map(Item => ({ text: Item.msg, name: Item.name, hour: Item.timeStamp })))
        }
        catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const timeOut = setInterval(() => {
            getMsg();
        }, 3000)
        getMsg();
        return () => clearInterval(timeOut);
    }, [])

    return (
        <Timeline align="alternate">
            {
                msg.map(message => {
                    return (
                        <Item
                            text={message.text}
                            name={message.name}
                            hour={message.hour}
                        />
                    )
                })
            }
        </Timeline>
    );
}
