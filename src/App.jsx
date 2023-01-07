// Phaser
import Phaser from 'phaser';

// React
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Scenes
import defaultScene from './scenes/default';
import animationLoader from './scenes/animationLoader';

// CSS
import * as styles from './App.module.css';

import { FrameAnimator } from './game/plugins';
import HealthBar from './ui/HealthBar';
import ManaBar from './ui/ManaBar';
import HotBar from './ui/HotBar';
import InputManager from './ui/InputManager';
import CastBar from './ui/CastBar';
import TargetInfo from './ui/TargetInfo';
import DialogueBox from './ui/DialogueBox';
import Alert from './ui/Alert';

import BackpackMenu from './ui/BackpackMenu';
import SetPopup from './ui/SetPopup';

var config = {
    type: Phaser.WEBGL,
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
    scene: [defaultScene],
    parent: 'phaser-container',
    plugins: {
        global: [{
            key: 'frameAnimator',
            plugin: FrameAnimator,
            start: true
        }]
    },
};


const App = () => {

    useEffect(() => {
        const game = new Phaser.Game(config);
    }, [])

    const phaserReference = useRef(null);

    const uiContainerStyles = {
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        overflow: 'hidden',
    }

    return (
        <div
            id="game-container"
        >
            <div
                ref={ phaserReference }
                id="phaser-container"
            />
            <div
                id="ui-container"
                style={ uiContainerStyles }
            >
                <InputManager />
                <HotBar index='1' />
                <HotBar index='2' />
                <HotBar index='3' />
                <HotBar index='4' />
                <div className={ styles.PlayerBars }>
                    <HealthBar />
                    <ManaBar />
                </div>

                <DialogueBox />
                <CastBar />
                <TargetInfo />
                <Alert />

                <BackpackMenu />
                <SetPopup />
            </div>
        </div>
    )
}

export default App
