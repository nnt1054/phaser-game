import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import actionMap from './actions';
import HotBarItem from './HotBarItem';

import * as styles from '../App.module.css';

const hotbarNameToIndex = {
    'Hotbar 1': 1,
    'Hotbar 2': 2,
};

const HotBar = (props) => {
    const ref = useRef();
    const dispatch = useDispatch();

    const currentJob = useSelector(state => state.playerState.currentJob);
    const position = useSelector(state => state.hotBars[props.name]);
    const activeMenu = useSelector(state => state.menuStates.activeMenu)

    const hotbarLabelMap = useSelector(state => state.inputManager.hotbarLabelMap);
    const hotbarIndex = hotbarNameToIndex[props.name];
    const hotbarLabels = hotbarLabelMap[hotbarIndex];

    const dialogueActive = (activeMenu === 'dialogue');
    const isVisible = (position.visible && !dialogueActive);
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
                position.slotsMap[currentJob].map((slot, i) => {
                    return <HotBarItem
                        key={ i }
                        slot={ slot }
                        hotbar={ props.name }
                        index={ i }
                        keybind={ hotbarLabels[i] }
                    />
                })
            }
        </div>
    )
}

export default HotBar;
