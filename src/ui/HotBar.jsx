import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actionMap from './actions';
import useDrag from '../hooks/useDrag';
import useHover from '../hooks/useHover';
import usePointerDown from '../hooks/usePointerDown';
import {
    incrementZIndex
} from '../store/menuStates';
import {
    setPosition,
    setSlot,
    setDragging,
    clearDragging,
    setHoverKey,
} from '../store/hotBars';
import { calculatePosition } from './utils.js';

import * as styles from '../App.module.css';
import CONSTANTS from '../constants';

import HotBarItem from './HotBarItem';


const HotBar = (props) => {
    const ref = useRef();
    const dispatch = useDispatch();

    const position = useSelector(state => state.hotBars[props.index]);
    const frameIndex = useSelector(state => state.aniEditor.frameIndex);
    const frameIndexString = `frameIndex${frameIndex}`;

    const dialogueDisplay = useSelector(state => state.dialogueBox.display);

    const dragEnabled = CONSTANTS.dragEnabled;
    const globalZIndex = useSelector(state => state.menuStates.zIndexCounter)

    const [zIndex, setZIndex] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const dragState = useDrag(ref,
        event => {
            if (!dragEnabled) return;
            setTranslate({
                x: translate.x + event.movementX,
                y: translate.y + event.movementY,
            });
        },
        event => {
            if (!dragEnabled) return;
            const data = calculatePosition(props.index, ref);
            dispatch(setPosition(data));
            setTranslate({ x: 0, y: 0 });
        },
        event => {
            setZIndex(globalZIndex);
            dispatch(incrementZIndex());
        },
    );

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
        transform: `translateX(${ translate.x }px) translateY(${ translate.y }px)`,
        zIndex: zIndex,
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
                        active={ slot.name == frameIndexString }
                        setZIndex={ setZIndex }
                    />
                })
            }
        </div>
    )
}

export default HotBar;
