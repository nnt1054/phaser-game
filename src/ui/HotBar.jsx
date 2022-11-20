import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import reducerMap from './HotBarItems';
import useDrag from '../hooks/useDrag';
import useHover from '../hooks/useHover';
import usePointerDown from '../hooks/usePointerDown';
import {
    setPosition,
    setSlot,
    setDragging,
    clearDragging,
} from '../store/hotBars';
import { calculatePosition } from './utils.js';

import * as styles from '../App.module.css';
import CONSTANTS from '../constants';

// import acceleration_icon from '../assets/icons/acceleration.png';
// import jolt_icon from '../assets/icons/jolt.png';
import vercure_icon from '../assets/icons/vercure.png';

const ICONS = {
    acceleration: vercure_icon,
    jolt: vercure_icon,
    vercure: vercure_icon,
}


const HotBarItem = (props) => {
    const ref = useRef();
    const imageRef = useRef();
    const dispatch = useDispatch();

    const gcd = useSelector(state => state.playerState.gcd);
    const dragging = useSelector(state => state.hotBars.dragging)
    const compositeStates = useSelector(state => state.aniEditor.compositeStates);
    const slot = props.slot;
    const tile = reducerMap[slot.name];
    const empty = (slot.name === 'empty');

    let timer, current, cooldown, duration;
    let useCooldown = false;
    const cooldowns = useSelector(state => state.playerState.cooldowns)
    if (cooldowns[slot.name]) {
        [current, duration] = cooldowns[slot.name];
        if (current > 0) useCooldown = true;
        let cooldown = current / 1000
        timer = cooldown.toFixed(0);
    }

    // Animation Editor Styles
    const frameIndex = useSelector(state => state.aniEditor.frameIndex);
    const frameIndexString = `frameIndex${frameIndex}`;
    const frameActive = (slot.name === frameIndexString);


    const isHovering = useHover(ref);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const dragState = useDrag(imageRef,
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
        },
    );
    const isDragging = dragState.isDragging;
    const isPointerDown = dragState.isPointerDown;

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


    const icon = ICONS[tile.icon];
    // const animationActiveToggle = CONSTANTS.animationToggle && (compositeStates[slot.name] || frameActive)
    const animationActiveToggle = (compositeStates[slot.name] || frameActive);
    const dragStarted = (isDragging && (translate.x || translate.y));
    const droppable = (dragging && !icon && isHovering);

    const buttonStyle = {
        color: 'black',
        backgroundColor: (animationActiveToggle || droppable) ? 'white' : 'rgba(0, 0, 0, 0.8)',
        opacity: dragStarted ? '0.9': '1',
        pointerEvents: dragStarted ? 'none': 'auto',
        overflow: dragStarted ? 'visible': 'hidden',
        zIndex: isDragging ? 10 : 1,
        border: (slot.active || (isHovering && dragging)) ? `4px solid white` : `4px solid black`,
    }

    const hotbarIconStyle = {
        display: icon ? `block` : `none`,
        width: `48px`,
        height: `48px`,
        borderRadius: `12px`,
        position: `absolute`,
        filter: (isPointerDown) ? `brightness(50%)` : (isHovering || timer > 0) ? `brightness(75%)` : `brightness(100%)`,
        transform: `translateX(${ translate.x }px) translateY(${ translate.y }px)`,
        pointerEvents: dragStarted ? `none` : `auto`,
        zIndex: 2,
    }

    const timerStyle = {
        position: `absolute`,
        fontSize: `14pt`,
        display: (timer > 0 && !dragStarted) ? 'block' : 'none',
        color: 'white',
        zIndex: 4,
        pointerEvents: 'none',
    }

    const cooldownOverlay = {
        position: 'absolute',
        width: `48px`,
        height: `48px`,
        backgroundColor: 'rgba(0, 0, 0, .8)',
        zIndex: 3,
        pointerEvents: 'none',
        display: timer > 0 ? 'block' : 'none',
        animation: timer > 0 ? `${ styles.roll } ${ duration / 1000 }s infinite linear` : 'none',
    }
    const gcdOverlay = {
        position: 'absolute',
        width: `48px`,
        height: `48px`,
        backgroundColor: 'rgba(0, 0, 0, .8)',
        zIndex: 3,
        pointerEvents: 'none',
        display: gcd ? 'block' : 'none',
        animation: gcd ? `${ styles.roll } ${ gcd / 1000 }s infinite linear` : 'none',
    }

    // TODO: deprecate old styles once all abilities have an icon
    const labelStyle = {
        position: 'absolute',
        display: !tile.icon ? 'block' : 'none',
        color: animationActiveToggle ? 'black': 'white',
        zIndex: 3,
    }
    const labelButtonStyle = {
        backgroundColor: animationActiveToggle ? 'white' : 'rgba(0, 0, 0, .8)',
        opacity: dragStarted ? '0.9': '1',
        pointerEvents: dragStarted ? 'none': 'auto',
        overflow: dragStarted ? 'visible': 'hidden',
        zIndex: isDragging ? 10 : 1,
        border: (slot.active || isHovering) ? `4px solid white` : `4px solid black`,
    }

    return (
        <button
            ref={ ref }
            style={ tile.icon ? buttonStyle : labelButtonStyle }
            className={ styles.KeyBind }
            onClick={() => dispatch(tile.action)}
        >
            <span style={ labelStyle }> { tile.label ?? 'none' } </span>
            <span style={ timerStyle }> { timer ? `${ timer }` : '' } </span>
            <div className={ styles.SlotOverlay } style={ cooldownOverlay }/>
            <div key={ gcd } className={ styles.SlotOverlay } style={ gcdOverlay }/>
            <img ref={ imageRef } draggable={ false } style={ hotbarIconStyle } src={ icon }/>
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
