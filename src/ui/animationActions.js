import {
    incrementMana,
    decrementMana,
    setPlayerCurrentMana,
} from '../store/playerMana';

import {
    incrementHealth,
    decrementHealth,
    setPlayerCurrentHealth,
} from '../store/playerHealth';

import {
    setQueuedAbility,
    setCursorState,
    setJump,
} from '../store/playerState';

import {
    doNothing,
    setPosition,
} from '../store/hotBars';

import {
    setFrameIndex,
    toggleCompositeState,
    clearCompositeStates,
} from '../store/aniEditor';

import {
    toggleMenuVisible,
} from '../store/menuStates';

import * as styles from '../App.module.css';


const reducerMap = {
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
    },
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

export default reducerMap;
