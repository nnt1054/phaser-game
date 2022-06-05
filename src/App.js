// Phaser
import Phaser from 'phaser';

// React
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Redux
import { createSlice, configureStore } from '@reduxjs/toolkit'

// Scenes
import defaultScene from './scenes/default.js'

// CSS
import * as styles from './App.module.css';

class FBFPlugin extends Phaser.Plugins.BasePlugin {

    constructor(pluginManager) {
        super(pluginManager);
    }

    start() {
        var eventEmitter = this.game.events;
        eventEmitter.on('destroy', this.destroy, this);
    }

    handler(animation, animationFrame, gameObject) {
        let index = animationFrame.index;
        let ref_x = gameObject.parentContainer.ref_x;
        let ref_y = gameObject.parentContainer.ref_y;
        if (animationFrame.fbfconfig) {
            let config = animationFrame.fbfconfig;
            gameObject.setPosition(config.translateX, config.translateY);
            gameObject.setAngle(config.rotate);
        } else {
            gameObject.setPosition(0, 0);
            gameObject.setAngle(0);
        }
    }

    add(gameObject) {
        // include ANIMATION_START for single frame animations
        gameObject.on(Phaser.Animations.Events.ANIMATION_START, this.handler, this);
        gameObject.on(Phaser.Animations.Events.ANIMATION_UPDATE, this.handler, this);
    }
}


var config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.ScaleModes.RESIZE,
      width: window.innerWidth,
      height: window.innerHeight,
    },
    physics: {
        default: 'arcade',
        arcade: {
          debug: false,
        }
    },
    scene: defaultScene,
    parent: 'phaser-container',
    plugins: {
        global: [{
            key: 'fbfplugin',
            plugin: FBFPlugin,
            start: true
        }]
    }
};

const _calculatePercentHealth = (currentHealth, maxHealth) => {
    if (currentHealth <= 0) {
        return 0.0;
    } else if (maxHealth <= 0) {
        return 0.0;
    } else if (currentHealth >= maxHealth) {
        return 1.0;
    } else {
        return currentHealth / maxHealth;
    }
}

const _calculatePlayerHealthState = (state) => {
    state.currentHealth = Math.max(state.currentHealth, 0);
    state.maxHealth = Math.max(state.maxHealth, 1);
    state.currentHealth = Math.min(state.currentHealth, state.maxHealth);

    const previousPercentHealth = state.percentHealth;
    state.percentHealth = state.currentHealth / state.maxHealth;
    state.increasing = (previousPercentHealth <= state.percentHealth);
}

const _calculatePlayerManaState = (state) => {
    state.currentMana = Math.max(state.currentMana, 0);
    state.maxMana = Math.max(state.maxMana, 1);
    state.currentMana = Math.min(state.currentMana, state.maxMana);
    state.percentMana = state.currentMana / state.maxMana;
}

export const playerHealthSlice = createSlice({
  name: 'playerHealth',
  initialState: {
    currentHealth: 50,
    maxHealth: 100,
    percentHealth: 0.5,
    increasing: false,
  },
  reducers: {
    incrementHealth: (state) => {
        state.currentHealth += 10;
        _calculatePlayerHealthState(state);
    },
    decrementHealth: (state) => {
        state.currentHealth -= 10;
        _calculatePlayerHealthState(state);
    },
    setPlayerCurrentHealth: (state, action) => {
        state.currentHealth = action.payload;
        _calculatePlayerHealthState(state);
    },
    setPlayerMaxHealth: (state, action) => {
        state.maxHealth = action.payload;
        _calculatePlayerHealthState(state);
    },
    setPlayerHealth: (state, action) => {
        state.currentHealth = action.payload.currentHealth;
        state.maxHealth = action.payload.maxHealth;
        _calculatePlayerHealthState(state);
    },
  }
})

export const playerManaSlice = createSlice({
  name: 'playerMana',
  initialState: {
    currentMana: 50,
    maxMana: 100,
    percentMana: 0.5,
  },
  reducers: {
    incrementMana: (state) => {
        state.currentMana += 10;
        _calculatePlayerManaState(state);
    },
    decrementMana: (state) => {
        state.currentMana -= 10;
        _calculatePlayerManaState(state);
    },
    setPlayerCurrentMana: (state, action) => {
        state.currentMana = action.payload;
        _calculatePlayerManaState(state);
    },
    setPlayerMaxMana: (state, action) => {
        state.maxMana = action.payload;
        _calculatePlayerManaState(state);
    },
    setPlayerMana: (state, action) => {
        state.currentMana = action.payload.currentMana;
        state.maxMana = action.payload.maxMana;
        _calculatePlayerManaState(state);
    },
  }
})

const {
    incrementHealth,
    decrementHealth,
    setPlayerCurrentHealth,
    setPlayerMaxHealth,
    setPlayerHealth,
} = playerHealthSlice.actions;

const {
    incrementMana,
    decrementMana,
    setPlayerCurrentMana,
    setPlayerMaxMana,
    setPlayerMana,
} = playerManaSlice.actions;

export const store = configureStore({
    reducer: {
        playerHealth: playerHealthSlice.reducer,
        playerMana: playerManaSlice.reducer,
    }
})

const HealthBar = () => {
    const currentHealth = useSelector(state => state.playerHealth.currentHealth);
    const percentHealth = useSelector(state => state.playerHealth.percentHealth);
    const increasing = useSelector(state => state.playerHealth.increasing);
    const dispatch = useDispatch();

    const barStyles = {
        width: `${ percentHealth * 100 }%`,
        transition: increasing ? `width 0.1s` : `width 0s`,
        transitionDelay: increasing ? `0.2s` : `0s`,
        backgroundColor: 'green',
    }

    const underlayBarStyles = {
        width: `${ percentHealth * 100 }%`,
        transition: increasing ? `width 0s` : `width 0.1s`,
        transitionDelay: increasing ? `0s` : `0.2s`,
        backgroundColor: increasing ? 'blue' : 'red',
        opacity: 0.5,
    }

    return (
        <div>
            <div className={ styles.HealthBar }>
                <div
                    style={ underlayBarStyles }
                    className={ styles.BarPrimary }
                ></div>
                <div
                    style={ barStyles }
                    className={ styles.BarPrimary }
                ></div>
            </div>
            <div className={ styles.BarText }>
                <span> Health </span>
                <span className={ styles.BarValue }> { currentHealth } </span>
            </div>
        </div>
    )
}

const ManaBar = () => {
    const currentMana = useSelector(state => state.playerMana.currentMana);
    const percentMana = useSelector(state => state.playerMana.percentMana);
    const dispatch = useDispatch();

    const barStyles = {
        width: `${ percentMana * 100 }%`,
    }

    return (
        <div>
            <div className={ styles.ManaBar }>
                <div
                    style={ barStyles }
                    className={ styles.ManaBarPrimary }
                ></div>
            </div>
            <div className={ styles.BarText }>
                <span> Mana </span>
                <span className={ styles.BarValue }> { currentMana } </span>
            </div>
        </div>
    )
}

const HotBar1 = () => {
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

const App = () => {
    useEffect(() => {
        const game = new Phaser.Game(config)
    }, [])

    return (
        <div id="game-container">
            <div id="phaser-container" />
            <div id="ui-container">
                <HotBar1 />

                <div className={ styles.PlayerBars }>
                    <HealthBar />
                    <ManaBar />
                </div>
            </div>
        </div>
    )
}

export default App
