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
    setSetting,
} from '../store/hotBars';
import { calculatePosition } from './utils.js';
import store from '../store/store';

import * as styles from '../App.module.css';
import CONSTANTS from '../constants';
import { TARGET_CONSTANTS } from '../constants';

import icons from './icons';


const HotBarItem = (props) => {
    const ref = useRef();
    const imageRef = useRef();
    const dispatch = useDispatch();

    const gcd = useSelector(state => state.playerState.gcd);
    const compositeStates = useSelector(state => state.aniEditor.compositeStates);
    const slot = props.slot;
    const tile = actionMap[slot.name];
    const empty = (slot.name === 'empty');

    const isItem = (tile.type === 'item');
    const items = useSelector(state => state.inventory.items);
    const itemCount = items.filter(item => item.name === slot.name).reduce((sum, item) => {
        return sum + item.count;
    }, 0)

    const isSetting = useSelector(state => state.hotBars.isSetting);

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

    // might be good to replace useHover with css classes
    // slot.active should already handle the third tier press
    const isHovering = useHover(ref);

    const icon = icons[tile.icon];
    const animationActiveToggle = CONSTANTS.animationToggle && (compositeStates[slot.name] || frameActive)

    const isVisible = (!empty || isSetting);

    const buttonStyle = {
        position: 'absolute',
        color: 'black',
        backgroundColor: (animationActiveToggle) ? 'white' : 'rgba(0, 0, 0, 0.8)',
        pointerEvents: 'auto',
        overflow:'hidden',
        zIndex: 1,
        border: (isHovering && isSetting) ? '4px solid white' : '4px solid black',
        visibility: isVisible ? 'visible' : 'hidden',
    }

    const hotbarIconStyle = {
        display: icon ? `block` : `none`,
        width: `48px`,
        height: `48px`,
        borderRadius: `12px`,
        position: `absolute`,
        filter: (slot.active) ?
            `brightness(50%)` :
            (isHovering || timer > 0 || (isItem && itemCount === 0)) ? `brightness(75%)` : `brightness(100%)`,
        pointerEvents: `auto`,
    }

    const timerStyle = {
        position: `absolute`,
        fontSize: `14pt`,
        display: (timer > 0) ? 'block' : 'none',
        color: 'white',
        pointerEvents: 'none',
        zIndex: 10,
    }

    const keybindStyle = {
        position: `absolute`,
        fontSize: `10pt`,
        fontWeight: 'bold',
        borderRadius: '2px',
        color: 'white',
        pointerEvents: 'none',
        visibility: isVisible ? 'visible' : 'hidden',
        left: 0,
        bottom: 0,
        zIndex: 10,
    }

    const itemCountStyle = {
        display: (isItem) ? 'block' : 'none',
        position: `absolute`,
        fontSize: `10pt`,
        fontWeight: 'bold',
        borderRadius: '2px',
        color: itemCount > 0 ? 'white' : 'red',
        pointerEvents: 'none',
        visibility: isVisible ? 'visible' : 'hidden',
        right: 0,
        bottom: 0,
        zIndex: 10,
    }

    // TODO: fix bug where overlay animation resets on dragging to another hotbar slot
    const cooldownOverlay = {
        position: 'absolute',
        width: `48px`,
        height: `48px`,
        borderRadius: `12px`,
        backgroundColor: 'rgba(0, 0, 0, .8)',
        pointerEvents: 'none',
        display: timer > 0 ? 'block' : 'none',
        animation: timer > 0 ? `${ styles.roll } ${ duration / 1000 }s infinite linear` : 'none',
        zIndex: 5,
    }

    const gcdOverlay = {
        position: 'absolute',
        width: `48px`,
        height: `48px`,
        borderRadius: `12px`,
        backgroundColor: 'rgba(0, 0, 0, .8)',
        pointerEvents: 'none',
        display: (tile.gcd && gcd) ? 'block' : 'none',
        animation: gcd ? `${ styles.roll } ${ (gcd) / 1000 }s infinite linear` : 'none',
        zIndex: 5
    }

    // TODO: deprecate old styles once all abilities have an icon
    const labelStyle = {
        position: 'absolute',
        display: !tile.icon ? 'block' : 'none',
        color: animationActiveToggle ? 'black': 'white',
        zIndex: 10,
    }

    const labelButtonStyle = {
        position: 'absolute',
        backgroundColor: animationActiveToggle ? 'white' : 'rgba(0, 0, 0, .8)',
        pointerEvents: 'auto',
        overflow: 'hidden',
        border: (slot.active || isHovering) ? `4px solid white` : `4px solid black`,
        visibility: isVisible ? 'visible' : 'hidden',
    }

    const slotContainerStyle = {
        position: 'relative',
        width: `48px`,
        height: `48px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }


    const onClick = (event) => {
        const state = store.getState();
        if (state.hotBars.isSetting) {
            dispatch(setSetting({
                hotbar: props.hotbar,
                slot: props.index,
            }));
        } else {
            if (tile.action) {
                if (targetName) {
                    tile.action(TARGET_CONSTANTS.CURRENT_TARGET);
                } else {
                    tile.action();
                }
            }
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
