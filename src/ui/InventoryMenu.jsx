import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import actionMap from './actions';
import icons from './icons';
import {
    openActionsMenu,
    setInventoryActiveIndex,
} from '../store/inventory';

import * as styles from './../App.module.css';


const labelStyle = {
    marginTop: `16px`,
    marginLeft: `16px`,
}

const itemContainerStyles = {
    position: 'relative',
    width: `48px`,
    height: `48px`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
}

const inventoryStyles = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'space-between',
    padding: '0px 8px',
    overflow: 'auto',
};

const inventoryMenuStyles = {
    display: 'flex',
    flexDirection: `column`,
    flexGrow: 3,
    overflow: 'hidden',
    border: '4px solid black',
    borderRadius: '12px',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, .5)',
};

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


const InventoryItem = (props) => {
    const ref = useRef();
    const dispatch = useDispatch();

    const activeIndex = useSelector(state => state.inventory.activeIndex);
    const isActive = (activeIndex === props.index);

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
        filter: isActive ? 'brightness(100%)' : 'brightness(50%)',
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
        backgroundColor: isActive ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
    }

    const executeScroll = () => {
        ref.current.scrollIntoView({
            // behavior: 'smooth',
            block: 'center',
            inline: 'nearest',
        })
        
        // bug where scrollIntoView shifts whole page
        // prevents smooth behavior due to correction
        document.documentElement.scrollTop = 0;
    }

    useEffect(() => {
        if (isActive) {
            executeScroll();
        }
    }, [isActive])

    const onClick = (event) => {
        if (isActive) {
            dispatch(openActionsMenu());
        } else {
            dispatch(setInventoryActiveIndex(props.index));
        }
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
