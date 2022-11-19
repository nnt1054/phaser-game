import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import reducerMap from './HotBarItems';
import useDrag from '../hooks/useDrag';
import useHover from '../hooks/useHover';
import {
    setPosition,
    setSlot,
    setDragging,
    clearDragging,
} from '../store/hotBars';
import { calculatePosition } from './utils.js';

import * as styles from '../App.module.css';
import CONSTANTS from '../constants';

const HotBarItem = (props) => {
    const ref = useRef();
    const dispatch = useDispatch();

    const dragging = useSelector(state => state.hotBars.dragging)
    const cooldowns = useSelector(state => state.playerState.cooldowns)
    const compositeStates = useSelector(state => state.aniEditor.compositeStates);
    const slot = props.slot;
    const tile = reducerMap[slot.name];
    const empty = (slot.name === 'empty');

    const isHovering = useHover(ref);

    useEffect(() => {
        const element = ref.current;

        const handlePointerUp = event => {
            dispatch(setSlot({
                key: props.hotbar,
                index: props.index,
                name: dragging,
            }))
        }
        element.addEventListener('pointerup', handlePointerUp);

        return () => {
            element.removeEventListener('pointerup', handlePointerUp);
        }
    }, [])

    // anieditor styles
    const activeButtonStyle = {
        color: 'black',
        backgroundColor: 'white',
    };

    // button styles
    const onHoverStyle = {
        color: 'black',
        background: 'white',
    };
    const defaultStyle = {
        color: 'white',
        background: 'rgba(0, 0, 0, .8)',
    };

    let useStyle = defaultStyle;
    if (isHovering) {
        useStyle = onHoverStyle;
    } else if (CONSTANTS.animationToggle && (compositeStates[slot.name] || props.active)) {
        useStyle = activeButtonStyle;
    }

    let timer = 0;
    if (cooldowns[slot.name]) {
        let cooldown = cooldowns[slot.name] / 1000
        timer = (cooldown > 10) ? cooldown.toFixed(0) : cooldown.toFixed(1);
    }

    if (tile.icon) {
        if (isHovering || timer > 0) {
            useStyle.background = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('../assets/icons/${ tile.icon }') center`;
        } else {
            useStyle.background = `url('../assets/icons/${ tile.icon }') center`;
        }
    }

    if (slot.active) {
        useStyle.border = `4px solid white`;
    } else {
        useStyle.border = `4px solid black`;
    }

    const keybindStyle = {
        display: slot.keybind ?? 'none',
        color: slot.active ? 'white' : 'black',
        position: 'absolute',
        left: 2,
        top: 2,
    };

    const chargesStyle = {
        display: slot.charges ?? 'none',
        color: slot.active ? 'white' : 'black',
        position: 'absolute',
        right: 2,
        bottom: 2, 
    }

    const timerStyle = {
        fontSize: `14pt`,
        display: timer ?? 'none',
        color: 'white',
    }

    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const isDragging = useDrag(ref,
        event => {
            if (empty) return;
            setTranslate({
                x: translate.x + event.movementX,
                y: translate.y + event.movementY,
            });
            dispatch(setDragging({
                name: slot.name,
                hotbar: props.hotbar,
                index: props.index,
            }));
            document.body.style.cursor = "grabbing";
        },
        event => {
            setTranslate({ x: 0, y: 0 });
            dispatch(clearDragging());
            document.body.style.cursor = "unset";
        }
    );
    useStyle.transform = `translateX(${ translate.x }px) translateY(${ translate.y }px)`;
    useStyle.zIndex = isDragging ? 10 : 0;

    if (isDragging && (translate.x || translate.y)) {
        useStyle.opacity = '0.9';
        useStyle.pointerEvents = 'none';
    } else {
        useStyle.opacity = '1';
        useStyle.pointerEvents = 'auto';
    }

    return (
        <button
            ref={ ref }
            style={ useStyle }
            className={ styles.KeyBind }
            onClick={() => dispatch(tile.action)}
        >
            <span style={ timerStyle }> { timer ? `${ timer }s` : '' } </span>
        </button>
    )
}

const HotBar = (props) => {
    const ref = useRef();
    const dispatch = useDispatch();

    const position = useSelector(state => state.hotBars[props.index]);
    const frameIndex = useSelector(state => state.aniEditor.frameIndex);
    const frameIndexString = `frameIndex${frameIndex}`;

    const dragEnabled = CONSTANTS.dragEnabled;
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const releaseDrag = useDrag(ref,
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
        }
    );

    const num_slots = position.slots.length;
    const width = props.vertical ? 48: 52 * num_slots;
    const height = props.vertical ? 540 : 48;
    const hotBarStyles = {
        display: position.visible ? 'flex' : 'none',
        width: `${ width }px`,
        height: `${ height }px`,
        left: `calc(${ position.left }vw - ${ width / 2 }px)`,
        bottom: `${ position.bottom }vh`,
        flexDirection: props.vertical ? `column` : `row`,
        transform: `translateX(${ translate.x }px) translateY(${ translate.y }px)`,
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
                    />
                })
            }
        </div>
    )
}

export default HotBar;
