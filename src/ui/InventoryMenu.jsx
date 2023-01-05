import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useDrag from '../hooks/useDrag';
import useHover from '../hooks/useHover';
import store from '../store/store';
import actionMap from './actions';
import icons from './icons';
import {
    setHoverKey,
} from '../store/hotBars';

import * as styles from './../App.module.css';


const labelStyle = {
    marginTop: `16px`,
    marginLeft: `16px`,
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

const itemContainerStyles = {
    position: 'relative',
    width: `48px`,
    height: `48px`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

const inventoryMenuStyles = {
    display: 'flex',
    flexDirection: `column`,
    flexGrow: 3,
    overflow: 'hidden',

    border:  '4px solid black',
    borderRadius: '12px',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, .5)',
};

const inventoryStyles = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'space-between',
    padding: '0px 8px',
    overflow: 'auto',
};

const InventoryItem = (props) => {
    const ref = useRef();
    const dispatch = useDispatch();

    const item = props.item;
    const itemData = actionMap[item.name];
    const icon = icons[itemData.icon];
    const empty = (item.name === 'empty');

    const iconStyle = {
        display: empty ? 'none' : 'block',
        width: `48px`,
        height: `48px`,
        position: `absolute`,
        pointerEvents: `none`,
    }

    const itemCountStyles = {
        display: item.count > 0 ? 'block' : 'none',
        visibility: 'visible',
        position: `absolute`,
        fontSize: `10pt`,
        fontWeight: 'bold',
        borderRadius: '2px',
        pointerEvents: 'none',
        bottom: 0,
        right: 0,
        zIndex: 2,
    }

    const onClick = (event) => {
        dispatch(setHoverKey(item.name));
    }

    return (
        <div style={ itemContainerStyles }>
            <span style={ itemCountStyles }> x{ item.count } </span>
            <button
                ref={ ref }
                className={ styles.ItemSlot }
                style={ iconContainerStyles }
                onClick={ onClick }
            >
                <img draggable={ false } style={ iconStyle } src={ icon }/>
            </button>
        </div>
    )
}

const InventoryMenu = () => {
    const ref = useRef();
    const dispatch = useDispatch();
    const inventory = useSelector(state => state.inventory.items);

    return (
        <div
            ref={ ref }
            style={ inventoryMenuStyles }
            onMouseDown={ e => e.stopPropagation() }
            onMouseUp={ e => e.stopPropagation() }
        >
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
