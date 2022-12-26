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

import actionMap from './actions';
import icons from './icons';
import useHover from '../hooks/useHover';

import {
    setDragging,
    clearDragging,
    setHoverKey,
} from '../store/hotBars';
import {
    moveItem,
    setDraggingIndex,
    setEquipment,
} from '../store/inventory';
import {
    setSystemActionAndTarget
} from '../store/playerState';

import { equipment } from './actions';

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

    const width = 412;
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

    const equipmentContainerStyles = {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
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
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: '0px 16px',
                }}
            >
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

    const dragging = useSelector(state => state.hotBars.dragging);
    const draggingSource = useSelector(state => state.hotBars.draggingSource);

    const isHovering = useHover(ref,
        event => {
            dispatch(setHoverKey(itemName));
        },
        event => {
            dispatch(setHoverKey(null));
        }
    );

    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const dragState = useDrag(ref,
        event => {
            if (!itemData) return;
            setTranslate({
                x: translate.x + event.movementX,
                y: translate.y + event.movementY,
            });
            dispatch(setDragging({
                name: itemData.label,
                type: itemData.type,
                hotbar: null,
                index: null,
            }));
            document.body.style.cursor = "grabbing";
        },
        event => {
            setTranslate({ x: 0, y: 0 });
            dispatch(clearDragging());
            document.body.style.cursor = "unset";
        },
        event => {
            dispatch(pushToFront('character'));
        }
    );

    const isDragging = dragState.isDragging;
    const isPointerDown = dragState.isPointerDown;
    const dragStarted = (isDragging && (translate.x || translate.y));
    const droppable = (dragging && draggingSource.type === 'item' && isHovering);

    useEffect(() => {
        const element = ref.current;

        const handlePointerUp = event => {
            const item = equipment[dragging];
            if (!item) return;
            let action;
            switch(type) {
                case 'helmet':
                    action = 'equipHelmet';
                    break;
            }
            if (!action) return;
            dispatch(setSystemActionAndTarget({
                action: 'equipHelmet',
                target: item.itemId,
            }))
        }
        element.addEventListener('pointerup', handlePointerUp);

        return () => {
            element.removeEventListener('pointerup', handlePointerUp);
        }
    }, [dragging])

    const itemContainerStyles = {
        position: 'relative',
        // width: `48px`,
        // height: `48px`,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center',
    }

    const iconStyle = {
        display: !itemData ? 'none' : 'block',
        width: `48px`,
        height: `48px`,
        position: `absolute`,
        pointerEvents: `none`,
        transform: `translateX(${ translate.x }px) translateY(${ translate.y }px)`,
    }

    const iconContainerStyles = {
        width: '48px',
        height: '48px',
        borderRadius: `12px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: dragStarted ? 'visible': 'hidden',
        border: (droppable && !dragStarted) ? '4px solid white' : '4px solid black',
        position: 'relative',
        marginRight: '4px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: isDragging ? 10 : 1,
    }

    const labelStyle = {
        top: '0px',
        // position: 'absolute',
    };

    return (
        <div style={ itemContainerStyles }>
            <span style={ labelStyle }> { type } </span>
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
