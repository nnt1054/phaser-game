import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import CharacterMenu from './CharacterMenu';
import InventoryMenu from './InventoryMenu';
import Tooltip from './Tooltip';
import actionMap from './actions';
import {
	closeActionsMenu,
	activeStates,
	setInventoryActiveActionsIndex,
} from '../store/inventory';


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


const ItemActionOption = (props) => {
    const dispatch = useDispatch();
    const activeIndex = useSelector(state => state.inventory.activeActionsIndex);
    const isActive = (activeIndex === props.index);

    const option = actionMap[props.option];

	const buttonStyle = {
		height: '48px',
		width: '128px',
	    border:  '4px solid black',
	    borderRadius: '12px',
	    color: 'white',
	    backgroundColor: isActive ? 'rgba(100, 100, 100, .5)' : 'rgba(0, 0, 0, .5)',
	}

    const onClick = (event) => {
        dispatch(setInventoryActiveActionsIndex(props.index));
        option.action();
        dispatch(closeActionsMenu());
    }

    return (
        <button onClick={ onClick } style={ buttonStyle }> { option.label } </button>
    )
}


const BackpackMenu = () => {
    const ref = useRef();
    const dispatch = useDispatch();

    const activeMenu = useSelector(state => state.menuStates.activeMenu);
    const activeIndex = useSelector(state => state.inventory.activeIndex);
    const visible = (activeMenu === 'inventory');
    const inventory = useSelector(state => state.inventory.items);
    const item = inventory[activeIndex];
    const abilityKey = item.name;

    const itemData = actionMap[abilityKey];
    const empty = (abilityKey === 'empty' || !abilityKey);

    const inventoryState = useSelector(state => state.inventory.state);
    const shouldDisplayButtons = (inventoryState === activeStates.actions && !empty);

    const isSetting = (inventoryState === activeStates.setting);
    const shouldDisplay = visible && !isSetting;

    const options = useSelector(state => state.inventory.actionOptions);

	const backpackContainer = {
		display: shouldDisplay ? 'block' : 'none',
	    height: `100vh`,
	    right: '12px',
	    zIndex: 10,
	}

	const buttonsContainerStyle = {
		visibility: shouldDisplayButtons ? 'visible' : 'hidden',
		display: 'flex',
		flexDirection: 'column',
		gap: '12px',
		alignItems: 'end',
	}

	return (
        <div style={ backpackContainer }>
        	<div style={ flexRowReverse }>
        		<div style={ flexColumn }>
        			<CharacterMenu />
        			<InventoryMenu />
        		</div>
        		<div style={ flexColumn }>
	        		<Tooltip abilityKey={ abilityKey }/>
	        		<div style={ buttonsContainerStyle }>
		                {
		                    options.map((option, i) => {
		                        return <ItemActionOption
		                            key={ i }
		                            index={ i }
		                            option={ option }
		                        />
		                    })
		                }
	        		</div>
        		</div>
        	</div>
        </div>
    )
}

export default BackpackMenu;
