// Phaser
import Phaser from 'phaser';

// React
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Scenes
import defaultScene from './scenes/default'

// CSS
import * as styles from './App.module.css';

import FrameAnimator from './game/plugins';
import HealthBar from './ui/HealthBar';
import ManaBar from './ui/ManaBar';
import HotBar from './ui/HotBar';

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
            key: 'frameAnimator',
            plugin: FrameAnimator,
            start: true
        }]
    }
};

const App = () => {
    useEffect(() => {
        const game = new Phaser.Game(config)
    }, [])

    return (
        <div id="game-container">
            <div id="phaser-container" />
            <div id="ui-container">
                <HotBar />
                <div className={ styles.PlayerBars }>
                    <HealthBar />
                    <ManaBar />
                </div>
            </div>
        </div>
    )
}

export default App
