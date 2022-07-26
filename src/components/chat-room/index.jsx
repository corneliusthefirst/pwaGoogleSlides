import { useLocation } from 'react-router-dom';
import { MessageInput } from '../message-input';
import { MessageList } from '../message-list';
import useWindowDimensions from '../useWindowDimentions';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const  ChatRoom = ({user}) => {
    const location = useLocation();
    const dimensions = useWindowDimensions();
    const { presentation, presentation_background, styles } = location.state;

    const goBack = () => {
        window.history.back();
    }

    return (
        <div className='w-full flex items-center justify-center'>
        <div style={{
            backgroundImage: `url(${presentation_background})`,
            width: dimensions.width < 600 ? dimensions.width - 20 : 398,
            height: 0.8 * dimensions.height,
          }}>
           <div className={`${styles?.primary} flex flex-row py-4 ml-4`}>
           <div onClick={goBack}>
           <ArrowBackIcon />
           </div>
           <h2 className={`${styles?.primary} ml-4`}>{presentation.title}</h2>
           </div>
            <div className="flex flex-col flex-1 w-full">
                <MessageList user={user} roomId={presentation.id} styles={styles} />
                <div className={`fixed ${dimensions.width < 600 ? 'bottom-16' :'bottom-8'}`} style={{ width: dimensions.width < 600 ? dimensions.width - 20 : 398}}>
                 <MessageInput  user={user} roomId={presentation.id} styles={styles} />
                </div>
            </div>
        </div>
        </div>
    );
}

export { ChatRoom };
