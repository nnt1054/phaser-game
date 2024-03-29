import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import actionMap from './actions';
import { TARGET_CONSTANTS } from '../constants';
import icons from './icons';
import store from '../store/store';
import useHover from '../hooks/useHover';
import {
    setSlot,
    setHoverKey,
} from '../store/hotBars';
import {
    activeStates,
    setInventoryState,
} from '../store/inventory';
import {
    getActiveItemKey,
} from './utils';
import { menus } from '../store/menuStates';
import {
    activeStates as activeSkillStates,
    setActiveState as setSkillsActiveState,
} from '../store/skillsMenu';
import {
    checkIsSetting,
    getSettingName,
} from './utils';
import {
    setRefreshCooldown,
} from '../store/playerState';

import * as styles from '../App.module.css';

import { useState, useEffect } from 'react';


const HotBarItem = (props) => {
    const ref = useRef();
    const imageRef = useRef();
    const dispatch = useDispatch();

    // used to set global cooldown timer
    const gcd = useSelector(state => state.playerState.gcd);

    const slot = props.slot;
    const empty = (slot.name === 'empty');

    let actionName = slot.name;
    let action = actionMap[actionName];

    if (action.override) {
        const actionNameOverride = action.override();
        if (actionNameOverride) {
            actionName = actionNameOverride;
            action = actionMap[actionName];
        }
    }

    const isItem = (action.type === 'item');
    const items = useSelector(state => state.inventory.items);
    const itemCount = items.filter(item => item.name === actionName).reduce((sum, item) => {
        return sum + item.count;
    }, 0)

    const isDisabled = action.isDisabled ? action.isDisabled() : false;

    const activeMenu = useSelector(state => state.menuStates.activeMenu);
    const inventoryState = useSelector(state => state.inventory.state);
    const skillsState = useSelector(state => state.skills.state);

    const isSettingItem = (activeMenu === menus.inventory && inventoryState === activeStates.setting);
    const isSettingSkill = (activeMenu === menus.skills && skillsState === activeSkillStates.setting);
    const isSetting = isSettingItem || isSettingSkill;

    const cooldowns = useSelector(state => state.playerState.cooldowns[actionName]);
    const [current, duration] = cooldowns ? cooldowns : [0, 0];

    const [progress, setProgress] = useState(0);
    const timeLeft = duration - current;

    // force refresh on new comboAction
    const comboAction = useSelector(state => state.playerState.comboAction);

    useEffect(() => {
        setProgress(current);
    }, [current]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (duration) {
                const updatedProgress = Math.max(0, progress - 100);
                setProgress(updatedProgress);
            }
        }, 100)

        return () => {
          clearInterval(interval)
        };

    }, [progress]);

    let useCooldown = false;
    let timer = progress / 1000;
    if (timer) {
        useCooldown = true;
        timer = (timer >= 10) ? timer.toFixed(0) : timer.toFixed(1);
    }


    // might be good to replace useHover with css classes
    // slot.active should already handle the third tier press
    const isHovering = useHover(ref,
        () => dispatch(setHoverKey(actionName)),
        () => dispatch(setHoverKey(null)),
    );

    const icon = icons[action.icon];

    const isVisible = (!empty || isSetting);

    const isHighlighted = action.isHighlighted ? action.isHighlighted() : false;


    const buttonStyle = {
        position: 'absolute',
        color: 'black',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        pointerEvents: 'auto',
        overflow:'hidden',
        zIndex: 1,
        border: (isHovering && isSetting) ? '4px solid white' : '4px solid black',
        visibility: isVisible ? 'visible' : 'hidden',
        boxShadow: isHighlighted ? '0 0 12px 2px yellow' : 'none',
    }

    const hotbarIconStyle = {
        display: icon ? `block` : `none`,
        width: `48px`,
        height: `48px`,
        borderRadius: `12px`,
        position: `absolute`,
        filter:
            isDisabled ? `brightness(50%)`
            : props.active ? `brightness(50%)`
            : (isHovering || timer > 0 || (isItem && itemCount === 0)) ? `brightness(75%)`
            : `brightness(100%)`,
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

    const cooldownOverlay = {
        position: 'absolute',
        width: `48px`,
        height: `48px`,
        borderRadius: `12px`,
        backgroundColor: 'rgba(0, 0, 0, .8)',
        pointerEvents: 'none',
        display: timer > 0 ? 'block' : 'none',

        animationName: (timer > 0) ? styles.roll : 'none',
        animationDuration: (timer > 0) ? `${ duration }ms` : '0s',
        animationDelay: (timer > 0) ? `-${ timeLeft }ms` : '0s',
        animationTimingFunction: 'linear',

        zIndex: 5,
    }

    const gcdOverlay = {
        position: 'absolute',
        width: `48px`,
        height: `48px`,
        borderRadius: `12px`,
        backgroundColor: 'rgba(0, 0, 0, .8)',
        pointerEvents: 'none',
        display: (action.gcd && gcd) ? 'block' : 'none',
        animation: gcd ? `${ styles.roll } ${ (gcd) / 1000 }s infinite linear` : 'none',
        zIndex: 5
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
        const targetName = state.targetInfo.targetName;

        const activeMenu = state.menuStates.activeMenu;
        const inventoryState = state.inventory.state;
        const skillsState = state.skills.state

        const isSetting = checkIsSetting(state);

        if (isSetting) {
            const name = getSettingName(state);
            dispatch(setSlot({
                hotbar: props.hotbar,
                slot: props.index,
                name: name,
            }))
            dispatch(setInventoryState(activeStates.actions));
            dispatch(setSkillsActiveState(activeSkillStates.actions));
            dispatch(setRefreshCooldown(true));
        } else {
            if (action.action) {
                if (targetName) {
                    action.action(TARGET_CONSTANTS.CURRENT_TARGET);
                } else {
                    action.action();
                }
            }
        }
    }

    return (
        <div
            style={ slotContainerStyle }
            onMouseDown={ e => e.stopPropagation() }
            onMouseUp={ e => e.stopPropagation() }
            onTouchStart= { e => e.stopPropagation() }
            onTouchEnd= { e => e.stopPropagation() }
        >
            <span style={ keybindStyle }> { props.keybind } </span>
            <span style={ itemCountStyle }> x{ itemCount } </span>
            <button
                ref={ ref }
                style={ buttonStyle }
                className={ styles.HotbarSlot }
                onClick={ onClick }
            >
                <span style={ timerStyle }> { timer ? `${ timer }` : '' } </span>
                <div key= { `cooldown_${ timeLeft }`} style={ cooldownOverlay }/>
                <div key={ `gcd_${ gcd }` } style={ gcdOverlay }/>
                <img ref={ imageRef } draggable={ false } style={ hotbarIconStyle } src={ icon }/>
            </button>
        </div>
    )
}

export default HotBarItem;
