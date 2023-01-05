import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import CharacterMenu from './CharacterMenu';
import InventoryMenu from './InventoryMenu';
import Tooltip from './Tooltip';

const backpackContainer = {
    height: `100vh`,
    right: '12px',
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

const BackpackMenu = () => {
    const ref = useRef();
    const dispatch = useDispatch();
    const shouldDisplay = useSelector(state => state.menuStates.character.visible);

	const backpackContainer = {
		display: shouldDisplay ? 'block' : 'none',
	    height: `100vh`,
	    right: '12px',
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
        		</div>
        	</div>
        </div>
    )
}

export default BackpackMenu;
