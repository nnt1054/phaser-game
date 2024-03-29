import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import ChatInput from './ChatInput';

import * as styles from './../App.module.css';


const ChatBox = () => {
	const dispatch = useDispatch();
    const messages = useSelector(state => state.chatBox.messages);

    const activeMenu = useSelector(state => state.menuStates.activeMenu)
    const dialogueActive = (activeMenu === 'dialogue');

	const chatBoxContainerStyles = {
		visibility: dialogueActive ? 'hidden' : 'visible',

	    left: '12px',
	    bottom: '4vh',

	    display: 'flex',
	    flexDirection: 'column',
	    gap: '8px',

		pointerEvents: 'auto',
		userSelect: 'text',
	    zIndex: 100,
	};

	const messagesContainerStyles = {
		visibility: 'hidden',
		overflow: 'auto',
		overflowWrap: 'break-word',
		display: 'flex',
		flexDirection: 'column-reverse',

	    height: '256px',
	    width: '256px',
	    padding: '4px 12px',

	    border:  '4px solid black',
	    borderRadius: '12px',
	    color: 'white',
	    backgroundColor: 'rgba(0, 0, 0, .5)',
	}

	const messageStyles = {
		pointerEvents: 'auto',
		userSelect: 'auto',
	}

	return (
		<div
			style={ chatBoxContainerStyles }
		>
			<div style={ messagesContainerStyles }>
				<div style={{ display: 'flex', flexDirection: 'column', padding: '4px 0px'}}>
	            {
		            messages.map((message, i) => {
		                return <span key={ i } style={ messageStyles }> { message } </span>
		            })
	            }
	            </div>
			</div>
			<ChatInput />
		</div>
	)
}

export default ChatBox;
