import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useDrag from '../hooks/useDrag';
import useHover from '../hooks/useHover';
import {
    setMenuPosition,
    incrementZIndex,
    pushToFront,
} from '../store/menuStates';
import { calculatePosition } from './utils.js';
import store from '../store/store';
import actionMap from './actions';
import icons from './icons';
import {
    getNextMessage,
    setCurrentOption,
    submitCurrentOption,
} from '../store/dialogueBox';

import * as styles from './../App.module.css';


const DialogueBox = () => {
    const ref = useRef();
    const dispatch = useDispatch();

    const dialogue = useSelector(state => state.dialogueBox)
    const { display, left, bottom, zIndex } = dialogue;
    const { name, messageIndex, messages } = dialogue;
    const message = messages ? messages[messageIndex] : '';
    const { options, currentOption } = dialogue;

    const width = 720;
    const height = 256;

    const globalZIndex = useSelector(state => state.menuStates.zIndexCounter)
    const dragState = useDrag(ref,
        event => {},
        event => {},
        event => {
            // need to set zIndex on display not on interaction
            // then disable all other menus
            // dispatch(pushToFront('dialogue'));
        }
    );

    const dialogueContainerStyles = {
        display: display ? 'flex' : 'none',
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

    const textContainerStyles = {
        display: 'flex',
        flexDirection: 'column',

        padding: '24px',
    }

    const tempOnClick = (event) => {
        dispatch(getNextMessage());
    }

    return (
        <div
            ref={ ref }
            style={ dialogueContainerStyles }
            onMouseDown={ e => e.stopPropagation() }
            onMouseUp={ e => e.stopPropagation() }
            onClick={ tempOnClick }
        >
            <div style={ textContainerStyles }>
                <span> { name } </span>
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
                            > { currentOption == i ? '> ' : ''} { option.text } </p>
                        })
                    }
                </div> 
            </div>
        </div>
    )
}

export default DialogueBox;
