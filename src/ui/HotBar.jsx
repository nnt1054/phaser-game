import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import actionMap from './actions';
import HotBarItem from './HotBarItem';

import * as styles from '../App.module.css';


const HotBar = (props) => {
    const ref = useRef();
    const dispatch = useDispatch();

    const position = useSelector(state => state.hotBars[props.index]);
    const dialogueDisplay = useSelector(state => state.dialogueBox.display);

    const isVisible = (position.visible && !dialogueDisplay);
    const num_slots = position.slots.length;
    const width = props.vertical ? 48: 52 * num_slots;
    const height = props.vertical ? 540 : 48;
    const hotBarStyles = {
        display: isVisible ? 'flex' : 'none',
        width: `${ width }px`,
        height: `${ height }px`,
        left: `calc(${ position.left }vw - ${ width / 2 }px)`,
        bottom: `${ position.bottom }vh`,
        flexDirection: props.vertical ? `column` : `row`,
    };

    return (
        <div
            ref={ ref }
            style={ hotBarStyles }
            className={ styles.HotBar }
        >
            {
                position.slots.map((slot, i) => {
                    return <HotBarItem
                        key={ i }
                        slot={ slot }
                        hotbar={ props.index }
                        index={ i }
                    />
                })
            }
        </div>
    )
}

export default HotBar;
