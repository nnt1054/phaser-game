import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import store from '../store/store';
import {
    getNextMessage,
    setCurrentOption,
    submitCurrentOption,
} from '../store/dialogueBox';

import * as styles from './../App.module.css';


const textContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    padding: '24px',
}


const DialogueBox = () => {
    const ref = useRef();
    const dispatch = useDispatch();

    const activeMenu = useSelector(state => state.menuStates.activeMenu)
    const isActive = (activeMenu === 'dialogue');

    const dialogue = useSelector(state => state.dialogueBox)
    const { left, bottom, zIndex } = dialogue;
    const { name, messageIndex, messages } = dialogue;
    const message = messages ? messages[messageIndex] : '';
    const { options, currentOption } = dialogue;

    const width = 720;
    const height = 256;

    const dialogueContainerStyles = {
        display: isActive ? 'flex' : 'none',
        flexDirection: `column`,

        border: '4px solid black',
        borderRadius: '12px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, .5)',

        width: `${ width }px`,
        height: `${ height }px`,

        left: `calc(${ left }vw - ${ width / 2 }px)`,
        bottom: `${ bottom }vh`,

        zIndex: zIndex,
    };

    const onClick = (event) => {
        dispatch(getNextMessage());
    }

    return (
        <div
            ref={ ref }
            style={ dialogueContainerStyles }
            onMouseDown={ e => e.stopPropagation() }
            onMouseUp={ e => e.stopPropagation() }
            onClick={ onClick }
        >
            <div style={ textContainerStyles }>
                <span style={{ fontWeight: 'bold' }}> { name } </span>
                <p> { message } </p>
                <div style={ {margin: 'auto'} }>
                    {
                        options.map((option, i) => {
                            return <p
                                key={ i }
                                onMouseOver={ event => {
                                    dispatch(setCurrentOption(i))
                                }}
                                onClick={ event => {
                                    dispatch(submitCurrentOption());
                                }}
                                style={{
                                    fontWeight: (currentOption == i) ? 'bold' : 'normal',
                                }}
                            > { currentOption == i ? '> ' : ''} { option.text } </p>
                        })
                    }
                </div> 
            </div>
        </div>
    )
}


export default DialogueBox;
