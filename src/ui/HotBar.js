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
import * as styles from '~/src/App.module.css';

const HotBar = () => {
    const increasing = useSelector(state => state.playerHealth.increasing);
    const dispatch = useDispatch();

    return (
        <div className={ styles.HotBar }>
            <button
                className={ styles.KeyBind }
                onClick={() => dispatch(decrementHealth())}
            > -10 HP </button>
            <button
                className={ styles.KeyBind }
                onClick={() => dispatch(incrementHealth())}
            > +10 HP </button>
            <button
                className={ styles.KeyBind }
                onClick={() => dispatch(setPlayerCurrentHealth(0))}
            > 0% HP </button>
            <button
                className={ styles.KeyBind }
                onClick={() => dispatch(setPlayerCurrentHealth(100))}
            > 100% HP </button>
            <button
                className={ styles.KeyBind }
                onClick={() => dispatch(decrementMana())}
            > -10 MP </button>
            <button
                className={ styles.KeyBind }
                onClick={() => dispatch(incrementMana())}
            > +10 MP </button>
            <button
                className={ styles.KeyBind }
                onClick={() => dispatch(setPlayerCurrentMana(0))}
            > 0% MP </button>
            <button
                className={ styles.KeyBind }
                onClick={() => dispatch(setPlayerCurrentMana(100))}
            > 100% MP </button>
            <button></button>
            <button></button>
            <button></button>
        </div>
    )
}

export default HotBar;