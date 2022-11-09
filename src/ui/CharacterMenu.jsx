import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useDrag from '../hooks/useDrag';
import {
    setMenuPosition,
} from '../store/menuStates';
import { calculatePosition } from './utils.js';
import store from '../store/store';

import * as styles from './../App.module.css';

import Phaser from 'phaser';
import { animationPreload, animationCreate } from '../animations';

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

class TextureAnnotator extends Phaser.Plugins.BasePlugin {
    start() {
        var eventEmitter = this.game.events;
        this.game.textures.on(
            Phaser.Textures.Events.ADD,
            this.setCustomData,
        )
    }

    setCustomData(key, texture) {
        var width = texture.source[0].width;
        var height = texture.source[0].height;

        var margin = 0;
        var spacing = 0;
        var frameWidth = 512;
        var frameHeight = 512;

        var rows = Math.floor((height - margin + spacing) / (frameHeight + spacing));
        var columns = Math.floor((width - margin + spacing) / (frameWidth + spacing));

        texture.customData['rows'] = rows;
        texture.customData['columns'] = columns;
    }
}

class StaticCompositeSprite extends Phaser.GameObjects.Container {
    constructor(scene, x, y, textureMap) {
        super(scene, x, y)
        this.scene = scene;
        this.textureMap = textureMap;
        this.composition = {};

        Object.entries(this.textureMap).forEach(([key, texture]) => {
            this.composition[key] = scene.add.sprite(0, 0, texture);
            this.composition[key].setOrigin(0.5, 1);
            this.add(this.composition[key]);
        })
        scene.add.existing(this);
    }

    _getFrameNumber(texture, index, frame) {
        const columns = texture.customData.columns;
        const frameNumber = (index * columns) + frame;
        return frameNumber;
    }

    setState(state) {
        const indexes = state.indexes;
        const frames = state.frames;
        Object.entries(this.composition).forEach(([key, sprite]) => {
            const frame = this._getFrameNumber(
                sprite.texture,
                indexes[key],
                frames[key],
            )
            sprite.setFrame(frame);
        })
    }
}

class characterPreview extends Phaser.Scene {
    preload() {
        this.load.plugin('TextureAnnotator', TextureAnnotator, true);
        animationPreload(this);
    }

    create() {
        let textureMap = {
            hair_back: 'hair',
            legs: 'legs',
            arm_back: 'arms',
            armor_body_back_sleeve: 'armor_body',
            torso: 'torso',
            armor_body: 'armor_body',
            arm_front: 'arms',
            armor_body_front_sleeve: 'armor_body',
            armor_body_collar: 'armor_body',
            head: 'head',
            ears: 'ears',
            face: 'face',
            hair_front: 'hair',
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

    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const releaseDrag = useDrag(ref,
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

    };

    const labelStyle = {
        marginTop: `16px`,
        marginLeft: `16px`,
    }

    return (
        <div
            ref={ ref }
            style={ characterMenuStyles }
            className={ styles.CharacterMenu }>
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
