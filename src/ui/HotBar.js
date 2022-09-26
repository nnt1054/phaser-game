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
    setQueuedAbility
} from '~/src/store/playerState';

import {
    doNothing
} from '~/src/store/hotBars';

import {
    setFrameIndex
} from '~/src/store/aniEditor';

import * as styles from '~/src/App.module.css';

const reducerMap = {
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
    'frameIndex00': {
        label: 0,
        action: setQueuedAbility('frame00'),
    },
    'frameIndex01': {
        label: 1,
        action: setQueuedAbility('frame01'),
    },
    'frameIndex02': {
        label: 2,
        action: setQueuedAbility('frame02'),
    },
    'pause': {
        label: 'PAUSE',
        action: setQueuedAbility('pause'),
    },
    'resume': {
        label: 'PLAY',
        action: setQueuedAbility('resume'),
    },
}

const HotBar = (props) => {
    // const increasing = useSelector(state => state.playerHealth.increasing);
    const position = useSelector(state => state.hotBars[props.index])
    const dispatch = useDispatch();

    const width = props.vertical ? 48 : 540;
    const height = props.vertical ? 540 : 48;
    const hotBarStyles = {
        width: `${ width }px`,
        height: `${ height }px`,
        left: `calc(${ position.left }vw - ${ width / 2 }px)`,
        bottom: `${ position.bottom }vh`,
        flexDirection: props.vertical ? `column` : `row`,
    }

    return (
        <div
            style={ hotBarStyles }
            className={ styles.HotBar }
        >
            {
                position.slots.map((slot, i) => {
                    return <button
                        key={ i }
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
