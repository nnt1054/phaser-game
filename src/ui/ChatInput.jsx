import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import * as styles from './../App.module.css';
import actionMap from './actions';
import { setChatInputIsActive } from '../store/menuStates';

// draft-js
import { Editor, EditorState, getDefaultKeyBinding } from 'draft-js';
import 'draft-js/dist/Draft.css';


const containerStyles = {
    left: '12px',
    bottom: '4vh',
    // bottom: '64px',

    height: '16px',
    width: '256px',
    padding: '16px 12px',

    border:  '4px solid black',
    borderRadius: '12px',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, .5)',

    zIndex: 10,

    overflowY: 'hidden',
    overflowWrap: 'normal',
}

const ChatInput = () => {
    const dispatch = useDispatch();
    const ref = useRef();

    const isActive = useSelector(state => state.menuStates.chatInputIsActive);
    const [editorState, setEditorState] = useState(
      () => EditorState.createEmpty(),
    );

    useEffect(() => {
        if (isActive) {
            ref.current.focus();
        } else {
            ref.current.blur();
        }
    }, [isActive])

    useEffect(() => {
        const clearChatInputHandler = event => {
            const text = editorState.getCurrentContent().getPlainText();
            setEditorState(EditorState.createEmpty());

            const sendChat = actionMap['sendChat'];
            sendChat.action(text);
            dispatch(setChatInputIsActive(false));
        };

        document.addEventListener('clearChatInput', clearChatInputHandler)
        return () => {
          document.removeEventListener('clearChatInput', clearChatInputHandler);
        };
    }, [editorState])

    const onFocus = (e) => {
        dispatch(setChatInputIsActive(true));
    }

    const onBlur = (e) => {
        dispatch(setChatInputIsActive(false));
    }

    const onChange = (editorState) => {
        setEditorState(editorState);
    }

    const handleReturn = (e, editorState) => {
        return 'handled';
    }

    return (
        <div style={ containerStyles }>
            <Editor
                ref={ ref }
                editorState={ editorState }
                onChange={ onChange }
                placeholder={ '[Shift + Enter] To Type' }
                handleReturn={ handleReturn  }
                onFocus={ onFocus }
                onBlur={ onBlur }
            />
        </div>
    )
}

export default ChatInput;
