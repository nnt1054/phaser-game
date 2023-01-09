import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import actionMap from './actions';
import {
    setHoverKey,
    startSetting,
    clearSetting,
} from '../store/hotBars';

import CharacterMenu from './CharacterMenu';
import InventoryMenu from './InventoryMenu';
import Tooltip from './Tooltip';

const backpackContainer = {
    height: `100vh`,
    right: '12px',
    zIndex: '10',
}

const flexRowReverse = {
	display: 'flex',
	flexDirection: 'row-reverse',
	columnGap: '12px',
	height: '100vh',
}

const flexColumn = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'stretch',

	padding: '12px 0px',
	rowGap: '12px',

    width: '420px',
};

const buttonStyle = {
	height: '48px',
	width: '128px',
    border:  '4px solid black',
    borderRadius: '12px',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, .5)',
}

const BackpackMenu = () => {
    const ref = useRef();
    const dispatch = useDispatch();

    const activeMenu = useSelector(state => state.menuStates.activeMenu);
    const activeIndex = useSelector(state => state.menuStates.activeIndex);
    const visible = (activeMenu === 'inventory');
    const inventory = useSelector(state => state.inventory.items);
    const item = inventory[activeIndex];
    const abilityKey = item.name;

    const isSetting = useSelector(state => state.hotBars.isSetting);
    const shouldDisplay = visible && !isSetting;

	const backpackContainer = {
		display: shouldDisplay ? 'block' : 'none',
	    height: `100vh`,
	    right: '12px',
	}

    // const abilityKey = useSelector(state => state.hotBars.hoverKey);
    const itemData = actionMap[abilityKey];
    const empty = (abilityKey === 'empty' || !abilityKey);
	const buttonsContainerStyle = {
		visibility: empty ? 'hidden' : 'visible',
		display: 'flex',
		flexDirection: 'column',
		gap: '12px',
		alignItems: 'end',
	}

	const onClickUse = (event) => {
		event.stopPropagation();
		if (itemData.action) itemData.action();
		dispatch(setHoverKey(null));
	}
	const onClickEquip = (event) => {
		event.stopPropagation();
		if (itemData.equip) itemData.equip();
		dispatch(setHoverKey(null));
	}
	const onClickSet = (event) => {
		event.stopPropagation();
		dispatch(startSetting(abilityKey));
	}

	return (
        <div style={ backpackContainer }>
        	<div style={ flexRowReverse }>
        		<div style={ flexColumn }>
        			<CharacterMenu />
        			<InventoryMenu />
        		</div>
        		<div style={ flexColumn }>
	        		<Tooltip />
	        		<div style={ buttonsContainerStyle }>
	        			<button style={ buttonStyle } onClick={ onClickUse }> Use </button>
	        			<button style={ buttonStyle } onClick={ onClickEquip }> Equip </button>
	        			<button style={ buttonStyle }> Discard </button>
	        			<button style={ buttonStyle } onClick={ onClickSet }> Set </button>
	        		</div>
        		</div>
        	</div>
        </div>
    )
}

export default BackpackMenu;
