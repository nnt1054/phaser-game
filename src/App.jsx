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

import GameMenu from './ui/GameMenu';
import BackpackMenu from './ui/BackpackMenu';
import SetPopup from './ui/SetPopup';
import SkillsMenu from './ui/SkillsMenu';
import Tooltip from './ui/Tooltip';
import EnemyList from './ui/EnemyList';
import ChatInput from './ui/ChatInput';

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
    dom: {
        createContainer: true,
    }
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

    // tooltip logic
    const activeMenu = useSelector(state => state.menuStates.activeMenu);
    const hoverKey = useSelector(state => state.hotBars.hoverKey);
    const isDefault = (activeMenu === null);
    let abilityKey = 'empty';
    if (isDefault && hoverKey) {
        abilityKey = hoverKey;
    }
    const tooltipContainerStyles = {
        top: '12px',
        right: '12px',
        zIndex: '1000',
        width: '420px',
        pointerEvents: 'none',
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
                <GameMenu />
                <SkillsMenu />
                <div style={ tooltipContainerStyles }>
                    <Tooltip abilityKey={ abilityKey } />
                </div>
                <EnemyList />
                <ChatInput />
            </div>
        </div>
    )
}

export default App
