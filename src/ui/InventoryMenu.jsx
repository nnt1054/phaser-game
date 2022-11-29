import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useDrag from '../hooks/useDrag';
import useHover from '../hooks/useHover';
import {
    setMenuPosition,
    incrementZIndex,
    pushToFront,
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
import {
    moveItem,
    setDraggingIndex,
} from '../store/inventory';

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
    const dragging = useSelector(state => state.hotBars.dragging);
    const draggingSource = useSelector(state => state.hotBars.draggingSource);

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
                type: 'inventory',
                hotbar: null,
                index: null,
            }));
            dispatch(setDraggingIndex(props.index));
            document.body.style.cursor = "grabbing";
        },
        event => {
            setTranslate({ x: 0, y: 0 });
            dispatch(clearDragging());
            dispatch(setDraggingIndex(null));
            document.body.style.cursor = "unset";
        },
        event => {
            dispatch(pushToFront('inventory'));
        }
    );
    const isDragging = dragState.isDragging;
    const isPointerDown = dragState.isPointerDown;
    const dragStarted = (isDragging && (translate.x || translate.y));
    const droppable = (dragging && draggingSource.type === 'inventory' && isHovering);

    useEffect(() => {
        const element = ref.current;

        const handlePointerUp = event => {
            dispatch(moveItem({
                name: dragging,
                index: props.index,
            }));
        }
        element.addEventListener('pointerup', handlePointerUp);

        return () => {
            element.removeEventListener('pointerup', handlePointerUp);
        }
    }, [])

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
    }

    const iconStyle = {
        display: empty ? 'none' : 'block',
        width: `48px`,
        height: `48px`,
        position: `absolute`,
        pointerEvents: `none`,
        transform: `translateX(${ translate.x }px) translateY(${ translate.y }px)`,
    }

    const itemCountStyles = {
        display: item.count > 0 ? 'block' : 'none',
        visibility: dragStarted ? 'hidden' : 'visible',
        position: `absolute`,
        fontSize: `10pt`,
        fontWeight: 'bold',
        borderRadius: '2px',
        zIndex: 4,
        pointerEvents: 'none',
        bottom: 0,
        right: 0,
    }

    const itemContainerStyles = {
        position: 'relative',
        width: `48px`,
        height: `48px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    return (
        <div style={ itemContainerStyles }>
            <span style={ itemCountStyles }> { item.count } </span>
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

const InventoryMenu = () => {
    const ref = useRef();

    const position = useSelector(state => state.menuStates.inventory);
    const dispatch = useDispatch();

    // const width = 512;
    const width = 5 * 60;
    const height = 512;

    const slotCount = 35;

    const inventory = useSelector(state => state.inventory.items);
    const globalZIndex = useSelector(state => state.menuStates.zIndexCounter)

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
        },
        event => {
            dispatch(pushToFront('inventory'));
        }
    );

    const inventoryMenuStyles = {
        display: position.visible ? 'block' : 'none',
        width: `${ width }px`,
        height: `${ height }px`,
        left: `calc(${ position.left }vw - ${ width / 2 }px)`,
        bottom: `${ position.bottom }vh`,
        transform: `translateX(${ translate.x }px) translateY(${ translate.y }px)`,
        flexDirection: `column`,
        zIndex: position.zIndex,
    };

    const inventoryStyles = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxWidth: `512px`,
        justifyContent: 'space-around',
        gap: '4px',
        padding: '0px 8px',
    };

    return (
        <div
            ref={ ref }
            style={ inventoryMenuStyles }
            className={ styles.CharacterMenu }>
            <h3 style={ labelStyle }> Inventory </h3>
            <div style={ inventoryStyles }>
                {
                    inventory.map((item, i) => {
                        return <InventoryItem
                            key={ i }
                            index={ i }
                            item={ item }
                        />
                    })
                }
            </div>
        </div>
    )
}

export default InventoryMenu;
