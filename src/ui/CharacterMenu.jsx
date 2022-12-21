import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useDrag from '../hooks/useDrag';
import {
    setMenuPosition,
    incrementZIndex,
    pushToFront,
} from '../store/menuStates';
import { calculatePosition } from './utils.js';
import store from '../store/store';

import * as styles from './../App.module.css';

import Phaser from 'phaser';
import { animationPreload, animationCreate } from '../animations';
import { StaticCompositeSprite } from '../game/utils.js';
import { TextureAnnotator } from '../game/plugins.js';

function observeStore(store, select, onChange) {
  let currentState;

  function handleChange() {
    let nextState = select(store.getState());
    if (nextState !== currentState) {
      currentState = nextState;
      onChange(currentState);
    }
  }

  let unsubscribe = store.subscribe(handleChange);
  handleChange();
  return unsubscribe;
}


class characterPreview extends Phaser.Scene {
    preload() {
        this.load.plugin('TextureAnnotator', TextureAnnotator, true);
        animationPreload(this);
    }

    create() {

        const textureMap = {
            'hair_back': 'hair',
            'legs': 'legs',
            'pants': 'pants',
            'arm_back': 'arms',
            'armor_body_back_sleeve': 'armor_body',
            'torso': 'torso',
            'armor_body': 'armor_body',
            'arm_front': 'arms',
            'armor_body_front_sleeve': 'armor_body',
            'armor_body_collar': 'armor_body',
            'head': 'head',
            'ears': 'ears',
            'face': 'face',
            'headband': 'headband',
            'hair_front': 'hair',
        };

        this.character = new StaticCompositeSprite(this, 150, 430, textureMap);
        this.character.setScale(0.9);
        const getCharacterPreviewState = state => state.characterPreview;
        this.observer = observeStore(store, getCharacterPreviewState, (state) => {
            this.character.setState(state);
        });
    }
}

const CharacterMenu = () => {
    const ref = useRef();
    const characterPreviewRef = useRef();

    var config = {
        type: Phaser.AUTO,
        scale: {
          width: 300,
          height: 440,
        },
        physics: {
            default: 'arcade',
            arcade: {
              debug: false,
            }
        },
        scene: [characterPreview],
        parent: 'character-preview-container',
    };

    useEffect(() => {
        const game = new Phaser.Game(config)
    }, [])

    const position = useSelector(state => state.menuStates.character);
    const dispatch = useDispatch();

    const width = 512;
    const height = 512;

    const globalZIndex = useSelector(state => state.menuStates.zIndexCounter)

    const [zIndex, setZIndex] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const dragState = useDrag(ref,
        event => {
            setTranslate({
                x: translate.x + event.movementX,
                y: translate.y + event.movementY,
            });
        },
        event => {
            const data = calculatePosition('character', ref);
            dispatch(setMenuPosition(data));
            setTranslate({ x: 0, y: 0 });
        },
        event => {
            dispatch(pushToFront('character'));
        }
    );

    const characterMenuStyles = {
        display: position.visible ? 'block' : 'none',
        width: `${ width }px`,
        height: `${ height }px`,
        left: `calc(${ position.left }vw - ${ width / 2 }px)`,
        bottom: `${ position.bottom }vh`,
        transform: `translateX(${ translate.x }px) translateY(${ translate.y }px)`,
        flexDirection: `column`,
        zIndex: position.zIndex,
    };

    const labelStyle = {
        marginTop: `16px`,
        marginLeft: `16px`,
    }

    return (
        <div
            ref={ ref }
            style={ characterMenuStyles }
            className={ styles.CharacterMenu }
            onMouseDown={ e => e.stopPropagation() }
            onMouseUp={ e => e.stopPropagation() }
        >
            <h3 style={ labelStyle }> Character </h3>

            <div
                ref={ characterPreviewRef }
                id="character-preview-container"
                style={ labelStyle }
            >
            </div>
        </div>
    )
}

export default CharacterMenu;
