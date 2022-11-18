import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import reducerMap from './HotBarItems';
import useDrag from '../hooks/useDrag';
import useHover from '../hooks/useHover';
import {
    setPosition,
} from '../store/hotBars';
import { calculatePosition } from './utils.js';

import * as styles from '../App.module.css';
import CONSTANTS from '../constants';

const HotBarItem = (props) => {
    const ref = useRef();
    const dispatch = useDispatch();

    const cooldowns = useSelector(state => state.playerState.cooldowns)

    const compositeStates = useSelector(state => state.aniEditor.compositeStates);
    const slot = props.slot;
    const tile = reducerMap[slot.name];

    const isHovering = useHover(ref);

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

    const timer = cooldowns[slot.name] ? (cooldowns[slot.name] / 1000).toFixed(1) : 0;

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
        display: slot.charges ?? 'none',
        color: slot.active ? 'white' : 'black',
    }

    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const isDragging = useDrag(ref,
        event => {
            setTranslate({
                x: translate.x + event.movementX,
                y: translate.y + event.movementY,
            });
        },
        event => {
            setTranslate({ x: 0, y: 0 });
        }
    );
    useStyle.transform = `translateX(${ translate.x }px) translateY(${ translate.y }px)`;
    useStyle.zIndex = isDragging ? 100 : 0;

    return (
        <button
            ref={ ref }
            style={ useStyle }
            className={ styles.KeyBind }
            onClick={() => dispatch(tile.action)}
        >
            {/*<span style={ keybindStyle }> { slot.keybind } </span>*/}
            {/*<span style={ chargesStyle }> { slot.charges } </span>*/}
            <span style={ timerStyle }> { timer ? `${ timer }s` : '' } </span>
        </button>
        // > { !tile.icon ?? tile.label } </button>
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
                        active={ slot.name == frameIndexString }
                    />
                })
            }
        </div>
    )
}

export default HotBar;
