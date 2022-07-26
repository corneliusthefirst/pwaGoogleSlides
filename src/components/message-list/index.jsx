import React from 'react';
import { useMessages } from '../../hooks/useMessages';
import './styles.css';

function MessageList({ roomId, styles, user }) {
    const containerRef = React.useRef(null);
    const messages = useMessages(roomId);
    React.useLayoutEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    });

    return (
        <div className="message-list-container" ref={containerRef}>
            <ul className="message-list">
                {messages.map((x) => (
                    <Message
                        key={x.id}
                        message={x}
                        isOwnMessage={x.uid === user.uid}
                        styles={styles}
                    />
                ))}
            </ul>
        </div>
    );
}

function Message({ message, isOwnMessage, styles }) {
    const { displayName, text } = message;

    return (
        <li className={['message', isOwnMessage && 'own-message', `${styles.primary}`].join(' ')}>
            <h4 className="sender">{isOwnMessage ? 'You' : displayName}</h4>
            <div className={`${isOwnMessage ? 'bg-teal-300': 'bg-gray-300'} px-4 py-2 rounded-3xl `}>{text}</div>
        </li>
    );
}

export { MessageList };
