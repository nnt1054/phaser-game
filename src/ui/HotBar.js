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
    }
}

const HotBar = (props) => {
    // const increasing = useSelector(state => state.playerHealth.increasing);
    const position = useSelector(state => state.hotBars[props.index])
    const dispatch = useDispatch();

    const width = 540;
    const hotBarStyles = {
        width: `${ width }px`,
        left: `calc(${ position.left }vw - ${ width / 2 }px)`,
        bottom: `${ position.bottom }vh`,
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

export default HotBar;