import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useDrag from '../hooks/useDrag';
import useHover from '../hooks/useHover';
import {
    setMenuPosition,
} from '../store/menuStates';
import { calculatePosition } from './utils.js';
import store from '../store/store';
import actionMap from './actions';
import icons from './icons';
import {
    setDragging,
    clearDragging,
    setHoverKey,
} from '../store/hotBars';

import * as styles from './../App.module.css';


const labelStyle = {
    marginTop: `16px`,
    marginLeft: `16px`,
}


const InventoryItem = (props) => {
    const ref = useRef();
    const dispatch = useDispatch();

    // const abilityKey = useSelector(state => state.playerState.castKey);
    const item = props.item;
    const itemData = actionMap[item.name];
    const icon = icons[itemData.icon];
    const empty = (item.name === 'empty');

    const isHovering = useHover(ref,
        event => {
            dispatch(setHoverKey(item.name));
        },
        event => {
            dispatch(setHoverKey(null));
        }
    );
    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const dragState = useDrag(ref,
        event => {
            if (empty) return;
            setTranslate({
                x: translate.x + event.movementX,
                y: translate.y + event.movementY,
            });
            dispatch(setDragging({
                name: item.name,
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
    );
    const isDragging = dragState.isDragging;
    const isPointerDown = dragState.isPointerDown;
    const dragStarted = (isDragging && (translate.x || translate.y));

    const iconContainerStyles = {
        width: '48px',
        height: '48px',
        borderRadius: `12px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: dragStarted ? 'visible': 'hidden',
        border: '4px solid black',
        position: 'relative',
        marginRight: '4px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    }

    const iconStyle = {
        width: `48px`,
        height: `48px`,
        display: 'block',
        position: `absolute`,
        pointerEvents: `none`,
        transform: `translateX(${ translate.x }px) translateY(${ translate.y }px)`,
    }

    return (
        <button
            ref={ ref }
            className={ styles.ItemSlot }
            style={ iconContainerStyles }
        >
            <img draggable={ false } style={ iconStyle } src={ icon }/>
        </button>
    )
}

const InventoryMenu = () => {
    const ref = useRef();
    const characterPreviewRef = useRef();

    const position = useSelector(state => state.menuStates.inventory);
    const dispatch = useDispatch();

    const width = 512;
    const height = 512;

    const slotCount = 35;

    const inventory = useSelector(state => state.inventory.items);

    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const dragState = useDrag(ref,
        event => {
            setTranslate({
                x: translate.x + event.movementX,
                y: translate.y + event.movementY,
            });
        },
        event => {
            const data = calculatePosition('inventory', ref);
            dispatch(setMenuPosition(data));
            setTranslate({ x: 0, y: 0 });
        }
    );

    const characterMenuStyles = {
        display: position.visible ? 'block' : 'none',
        width: `${ 5 * 60 }px`,
        height: `${ height }px`,
        left: `calc(${ position.left }vw - ${ width / 2 }px)`,
        bottom: `${ position.bottom }vh`,
        transform: `translateX(${ translate.x }px) translateY(${ translate.y }px)`,
        flexDirection: `column`,
    };

    const inventoryStyles = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxWidth: `512px`,
        justifyContent: 'space-around',
        gap: '4px',
        padding: '0px 8px',
    }

    return (
        <div
            ref={ ref }
            style={ characterMenuStyles }
            className={ styles.CharacterMenu }>
            <h3 style={ labelStyle }> Inventory </h3>
            <div style={ inventoryStyles }>
                {
                    inventory.map((item, i) => {
                        return <InventoryItem
                            key={ i }
                            item={ item }
                        />
                    })
                }
            </div>
        </div>
    )
}

export default InventoryMenu;
