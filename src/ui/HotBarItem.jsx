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

import icons from './icons';

const TARGET_CONSTANTS = {
    CURRENT_TARGET: 'CURRENT_TARGET',
}

const HotBarItem = (props) => {
    const ref = useRef();
    const imageRef = useRef();
    const dispatch = useDispatch();
    const globalZIndex = useSelector(state => state.menuStates.zIndexCounter)

    const gcd = useSelector(state => state.playerState.gcd);
    const dragging = useSelector(state => state.hotBars.dragging)
    const compositeStates = useSelector(state => state.aniEditor.compositeStates);
    const slot = props.slot;
    const tile = actionMap[slot.name];
    const empty = (slot.name === 'empty');

    const isItem = (tile.type === 'item');
    const items = useSelector(state => state.inventory.items);
    const itemCount = items.filter(item => item.name === slot.name).reduce((sum, item) => {
        return sum + item.count;
    }, 0)

    let timer, current, cooldown, duration;
    let useCooldown = false;
    const cooldowns = useSelector(state => state.playerState.cooldowns)
    if (cooldowns[slot.name]) {
        [current, duration] = cooldowns[slot.name];
        if (current > 0) useCooldown = true;
        let cooldown = current / 1000
        timer = cooldown.toFixed(0);
    }

    const targetName = useSelector(state => state.targetInfo.targetName);

    // Animation Editor Styles
    const frameIndex = useSelector(state => state.aniEditor.frameIndex);
    const frameIndexString = `frameIndex${frameIndex}`;
    const frameActive = (slot.name === frameIndexString);

    const isHovering = useHover(ref,
        event => {
            dispatch(setHoverKey(slot.name));
        },
        event => {
            dispatch(setHoverKey(null));
        }
    );
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
        event => {
            props.setZIndex(globalZIndex);
            dispatch(incrementZIndex());
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

    const icon = icons[tile.icon];
    const animationActiveToggle = CONSTANTS.animationToggle && (compositeStates[slot.name] || frameActive)
    const dragStarted = (isDragging && (translate.x || translate.y));
    const droppable = (dragging && !icon && isHovering);

    const buttonStyle = {
        position: 'absolute',
        color: 'black',
        backgroundColor: (animationActiveToggle || droppable) ? 'white' : 'rgba(0, 0, 0, 0.8)',
        opacity: dragStarted ? '0.9': '1',
        pointerEvents: dragStarted ? 'none': 'auto',
        overflow: dragStarted ? 'visible': 'hidden',
        zIndex: isDragging ? 10 : 1,
        border: '4px solid black',
        visibility: (dragging || !empty) ? 'visible' : 'hidden',
    }

    const hotbarIconStyle = {
        display: icon ? `block` : `none`,
        width: `48px`,
        height: `48px`,
        borderRadius: `12px`,
        position: `absolute`,
        filter: (slot.active || isPointerDown) ? `brightness(50%)` : (isHovering || timer > 0 || (isItem && itemCount === 0)) ? `brightness(75%)` : `brightness(100%)`,
        transform: `translateX(${ translate.x }px) translateY(${ translate.y }px)`,
        pointerEvents: dragStarted ? `none` : `auto`,
        zIndex: isDragging ? 10 : 1,
    }

    const timerStyle = {
        position: `absolute`,
        fontSize: `14pt`,
        display: (timer > 0 && !dragStarted) ? 'block' : 'none',
        color: 'white',
        zIndex: 4,
        pointerEvents: 'none',
    }

    const keybindStyle = {
        position: `absolute`,
        fontSize: `10pt`,
        fontWeight: 'bold',
        borderRadius: '2px',
        color: 'white',
        zIndex: 11,
        pointerEvents: 'none',
        visibility: (dragging || !empty) ? 'visible' : 'hidden',
        left: 0,
        bottom: 0,
    }

    const itemCountStyle = {
        display: (isItem && !dragStarted) ? 'block' : 'none',
        position: `absolute`,
        fontSize: `10pt`,
        fontWeight: 'bold',
        borderRadius: '2px',
        color: itemCount > 0 ? 'white' : 'red',
        zIndex: 11,
        pointerEvents: 'none',
        visibility: (dragging || !empty) ? 'visible' : 'hidden',
        right: 0,
        bottom: 0,
    }

    // TODO: fix bug where overlay animation resets on dragging to another hotbar slot
    const cooldownOverlay = {
        position: 'absolute',
        width: `48px`,
        height: `48px`,
        borderRadius: `12px`,
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
        borderRadius: `12px`,
        backgroundColor: 'rgba(0, 0, 0, .8)',
        zIndex: 3,
        pointerEvents: 'none',
        display: (tile.gcd && gcd) ? 'block' : 'none',
        animation: gcd ? `${ styles.roll } ${ (gcd) / 1000 }s infinite linear` : 'none',
    }

    // TODO: deprecate old styles once all abilities have an icon
    const labelStyle = {
        position: 'absolute',
        display: !tile.icon ? 'block' : 'none',
        color: animationActiveToggle ? 'black': 'white',
        zIndex: 3,
    }
    const labelButtonStyle = {
        position: 'absolute',
        backgroundColor: animationActiveToggle ? 'white' : 'rgba(0, 0, 0, .8)',
        opacity: dragStarted ? '0.9': '1',
        pointerEvents: dragStarted ? 'none': 'auto',
        overflow: dragStarted ? 'visible': 'hidden',
        zIndex: isDragging ? 4 : 1,
        border: (slot.active || isHovering) ? `4px solid white` : `4px solid black`,
        visibility: (dragging || !empty) ? 'visible' : 'hidden',
    }

    const slotContainerStyle = {
        position: 'relative',
        width: `48px`,
        height: `48px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: isDragging ? 4 : 1,
    }

    const onClick = (event) => {
        if (targetName) {
            tile.action(TARGET_CONSTANTS.CURRENT_TARGET);
        } else {
            tile.action();
        }
    }

    return (
        <div
            style={ slotContainerStyle }
            onMouseDown={ e => e.stopPropagation() }
            onMouseUp={ e => e.stopPropagation() }
        >
            <span style={ keybindStyle }> { slot.keybind } </span>
            <span style={ itemCountStyle }> x{ itemCount } </span>
            <button
                ref={ ref }
                style={ tile.icon ? buttonStyle : labelButtonStyle }
                className={ styles.HotbarSlot }
                onClick={ onClick }
            >
                <span style={ labelStyle }> { tile.label ?? 'none' } </span>
                <span style={ timerStyle }> { timer ? `${ timer }` : '' } </span>
                <div style={ cooldownOverlay }/>
                <div key={ gcd } style={ gcdOverlay }/>
                <img ref={ imageRef } draggable={ false } style={ hotbarIconStyle } src={ icon }/>
            </button>

        </div>
    )
}

export default HotBarItem;
