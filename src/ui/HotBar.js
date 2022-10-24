import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    incrementMana,
    decrementMana,
    setPlayerCurrentMana,
    setPlayerMaxMana,
    setPlayerMana,
} from '~/src/store/playerMana';

import {
    incrementHealth,
    decrementHealth,
    setPlayerCurrentHealth,
    setPlayerMaxHealth,
    setPlayerHealth,
} from '~/src/store/playerHealth';

import {
    setQueuedAbility,
    setCursorState,
    setJump,
} from '~/src/store/playerState';

import {
    doNothing
} from '~/src/store/hotBars';

import {
    setFrameIndex,
    toggleCompositeState,
    clearCompositeStates,
} from '~/src/store/aniEditor';

import * as styles from '~/src/App.module.css';

var reducerMap = {
    'jump': {
        label: 'jump',
        action: setJump(),
    },
    'jumpCursor': {
        label: 'jump',
        action: setCursorState({
            cursor: 'jump',
            value: 1,
        }),
        upAction: setCursorState({
            cursor: 'jump',
            value: 0,
        }),
    },
    'left': {
        label: 'left',
        action: setCursorState({
            cursor: 'left',
            value: 1,
        }),
        upAction: setCursorState({
            cursor: 'left',
            value: 0,
        }),
    },
    'right': {
        label: 'right',
        action: setCursorState({
            cursor: 'right',
            value: 1,
        }),
        upAction: setCursorState({
            cursor: 'right',
            value: 0,
        }),
    },
    'up': {
        label: 'up',
        action: setCursorState({
            cursor: 'up',
            value: 1,
        }),
        upAction: setCursorState({
            cursor: 'up',
            value: 0,
        }),
    },
    'down': {
        label: 'down',
        action: setCursorState({
            cursor: 'down',
            value: 1,
        }),
        upAction: setCursorState({
            cursor: 'down',
            value: 0,
        }),
    },
    'decrementHP10': {
        label: '-10 HP',
        action: decrementHealth(),
    },
    'incrementHP10': {
        label: '+10 HP',
        action: incrementHealth(),
    },
    'HP0': {
        label: '0% HP',
        action: setPlayerCurrentHealth(0),
    },
    'HP100': {
        label: '100% HP',
        action: setPlayerCurrentHealth(100),
    },
    'decrementMP10': {
        label: '-10 MP',
        action: decrementMana(),
    },
    'incrementMP10': {
        label: '+10 MP',
        action: incrementMana(),
    },
    'MP0': {
        label: '0% MP',
        action: setPlayerCurrentMana(0),
    },
    'MP100': {
        label: '100% MP',
        action: setPlayerCurrentMana(100),
    },
    'empty': {
        label: '',
        action: doNothing(),
    },
    'pause': {
        label: 'Stop',
        action: setQueuedAbility('pause'),
    },
    'resume': {
        label: 'Play',
        action: setQueuedAbility('resume'),
    },
    'select_all_composite_state': {
        label: 'All',
        action: clearCompositeStates(true),
    },
    'unselect_all_composite_state': {
        label: 'Rst',
        action: clearCompositeStates(false),
    },
    'copy_anim_to_clipboard': {
        label: 'Cpy',
        action: setQueuedAbility('copyAnim'),
    },
    'incrementTranslateX': {
        label: '→',
        action: setQueuedAbility('incrementTranslateX'),
    },
    'decrementTranslateX': {
        label: '←',
        action: setQueuedAbility('decrementTranslateX'),
    },
    'incrementTranslateY': {
        label: '↑',
        action: setQueuedAbility('incrementTranslateY'),
    },
    'decrementTranslateY': {
        label: '↓',
        action: setQueuedAbility('decrementTranslateY'),
    },
    'incrementRotate': {
        label: '↷',
        action: setQueuedAbility('incrementRotate'),
    },
    'decrementRotate': {
        label: '↶',
        action: setQueuedAbility('decrementRotate'),
    },
    'incrementFrameKey': {
        label: '↟',
        action: setQueuedAbility('incrementFrameKey'),
    },
    'decrementFrameKey': {
        label: '↡',
        action: setQueuedAbility('decrementFrameKey'),
    }
}
for (var i = 0; i <= 12; i++) {
    reducerMap[`frameIndex${i}`] = {
        label: i,
        action: setFrameIndex(i),
    }
}
const compositeKeys = {
      'hair_back': 'a',
      'legs': 'b',
      'arm_back': 'c',
      'armor_body_back_sleeve': 'd',
      'torso': 'e',
      'armor_body': 'f',
      'arm_front': 'g',
      'armor_body_front_sleeve': 'h',
      'armor_body_collar': 'i',
      'head': 'j',
      'ears': 'k',
      'face': 'l',
      'hair_front': 'm',
};
for (const [key, value] of Object.entries(compositeKeys)) {
    reducerMap[`composite_${key}`] = {
        label: value,
        action: toggleCompositeState(`composite_${key}`),
    }
}


const HotBar = (props) => {
    const position = useSelector(state => state.hotBars[props.index]);
    const compositeStates = useSelector(state => state.aniEditor.compositeStates);
    const frameIndex = useSelector(state => state.aniEditor.frameIndex);
    const frameIndexString = `frameIndex${frameIndex}`;

    const dispatch = useDispatch();

    const num_slots = position.slots.length;
    const width = props.vertical ? 48: 52 * num_slots;
    // const width = props.vertical ? 48 : 540;
    const height = props.vertical ? 540 : 48;
    const hotBarStyles = {
        width: `${ width }px`,
        height: `${ height }px`,
        left: `calc(${ position.left }vw - ${ width / 2 }px)`,
        bottom: `${ position.bottom }vh`,
        flexDirection: props.vertical ? `column` : `row`,
    }

    const activeButtonStyle = {
        color: 'black',
        backgroundColor: 'white',
    }

    const buttonStyle = {}

    return (
        <div
            style={ hotBarStyles }
            className={ styles.HotBar }
        >
            {
                position.slots.map((slot, i) => {
                    return <button
                        key={ i }
                        style= { compositeStates[slot] || slot == frameIndexString ? activeButtonStyle : buttonStyle }
                        className={ styles.KeyBind }
                        onClick={() => dispatch(reducerMap[slot].action)}
                    > { reducerMap[slot].label } </button>
                })
            }
        </div>
    )
}

export { reducerMap };
export default HotBar;
