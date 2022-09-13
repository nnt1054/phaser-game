// Phaser
import Phaser from 'phaser';

// React
import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Scenes
import defaultScene from './scenes/default';
import { LoadingScene } from './scenes/default';
import animationLoader from './scenes/animationLoader';

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
    scene: [animationLoader, defaultScene],
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

    const phaserReference = useRef(null);

    return (
        <div id="game-container">
            <div
                ref={ phaserReference }
                id="phaser-container"
            />
            <div id="ui-container">
                <HotBar index='1' />
                <HotBar index='2' />
                <div className={ styles.PlayerBars }>
                    <HealthBar />
                    <ManaBar />
                </div>
            </div>
        </div>
    )
}

export default App
