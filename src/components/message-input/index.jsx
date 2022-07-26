import React from 'react';
import {  sendMessage } from '../../services/firebase';
import './styles.css';
import SendIcon from '@mui/icons-material/Send';
import { Input } from '@mui/material';

function MessageInput({ roomId , styles , user}) {
    const [value, setValue] = React.useState('');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        sendMessage(roomId, user, value);
        setValue('');
    };

    return (
        <form onSubmit={handleSubmit} className="message-input-container">
            <Input
                type="text"
                placeholder="Enter a message"
                value={value}
                onChange={handleChange}
               sx={{color: styles?.isLight ? '#DDDDDD' : '#424242'}}
                className={`${styles?.primary} message-input mx-4`}
                required
                minLength={1}
            />
            <button type="submit" disabled={value < 1} className={`${styles?.primary} send-message`}>
                <SendIcon  />
            </button>
        </form>
    );
}

export { MessageInput };
