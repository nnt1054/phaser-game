import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

// Phaser Imports
import Phaser from 'phaser';
import { animationPreload, animationCreate } from '../animations';
import { StaticCompositeSprite } from '../game/utils.js';
import { TextureAnnotator } from '../game/plugins.js';

import store from '../store/store';
import { equipment } from './actions';
import icons from './icons';

import * as styles from './../App.module.css';


// Phaser Preview Config
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

class characterPreview extends Phaser.Scene {
    preload() {
        this.load.plugin('TextureAnnotator', TextureAnnotator, true);
        animationPreload(this);
    }

    create() {
        this.character = new StaticCompositeSprite(this, 150, 430, textureMap);
        this.character.setScale(0.9);
        const getCharacterPreviewState = state => state.characterPreview;
        this.observer = observeStore(store, getCharacterPreviewState, (state) => {
            this.character.setState(state);
        });
    }
}

const config = {
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

const characterMenuStyles = {
    display: 'flex',
    height: '512px',
    flexDirection: `column`,
    paddingBottom: '12px',
};

const labelStyle = {
    marginTop: `16px`,
    marginLeft: `16px`,
}

const equipmentContainerStyles = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
}

const contentContainer = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: '0px 16px',
}

const itemContainerStyles = {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
}

const iconContainerStyles = {
    width: '48px',
    height: '48px',
    borderRadius: `12px`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    border: '4px solid black',
    position: 'relative',
    marginRight: '4px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
}

const slotLabelStyle = {
    top: '0px',
};

const CharacterMenu = () => {
    const ref = useRef();
    const characterPreviewRef = useRef();
    const dispatch = useDispatch();

    useEffect(() => {
        const game = new Phaser.Game(config)
    }, [])

    return (
        <div
            ref={ ref }
            style={ characterMenuStyles }
            className={ styles.CharacterMenu }
            onMouseDown={ e => e.stopPropagation() }
            onMouseUp={ e => e.stopPropagation() }
        >
            <h3 style={ labelStyle }> Equipment </h3>

            <div style={ contentContainer }>
                <div
                    ref={ characterPreviewRef }
                    id="character-preview-container"
                ></div>

                <div
                    style={ equipmentContainerStyles }
                >
                    <EquipmentSlot type={ 'weapon' } />
                    <EquipmentSlot type={ 'helmet' } />
                    <EquipmentSlot type={ 'armor' } />
                    <EquipmentSlot type={ 'pants' } />
                </div>
            </div>
        </div>
    )
}


const EquipmentSlot = (props) => {
    const ref = useRef();
    const dispatch = useDispatch();

    const type = props.type;
    const itemName = useSelector(state => state.inventory[type]);
    const itemData = equipment[itemName];
    const icon = itemData ? icons[itemData.icon] : '';

    const iconStyle = {
        display: !itemData ? 'none' : 'block',
        width: `48px`,
        height: `48px`,
        position: `absolute`,
        pointerEvents: `none`,
    }

    return (
        <div style={ itemContainerStyles }>
            <span style={ slotLabelStyle }> { type } </span>
            <button
                ref={ ref }
                className={ styles.ItemSlot }
                style={ iconContainerStyles }
            >
                <img draggable={ false } style={ iconStyle } src={ icon }/>
            </button>
        </div>
    )
}


export default CharacterMenu;
