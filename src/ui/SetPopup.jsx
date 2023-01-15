import { useSelector, useDispatch } from 'react-redux';
import * as styles from './../App.module.css';
import {
    activeStates,
    setInventoryState,
} from '../store/inventory';

const flexRow = {
    display: 'flex',
    flexDirection: 'row',
}

const flexColumn = {
    display: 'flex',
    flexDirection: 'column',

    alignItems: 'center',
    gap: '24px',
}


const messageStyles = {
    whiteSpace: 'pre-line',
}

const cancelButtonStyles = {
    border:  '4px solid black',
    borderRadius: '12px',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, .5)', 

    width: '128px',
    height: '36px',
}

const message = `
    press a key or
    select a slot to assign…
`


const SetPopup = () => {
    const dispatch = useDispatch();

    const activeMenu = useSelector(state => state.menuStates.activeMenu);
    const inventoryState = useSelector(state => state.inventory.state);
    const isSetting = (activeMenu === 'inventory' && inventoryState === activeStates.setting);

    const onClick = (event) => {
        dispatch(setInventoryState(activeStates.default));
    }

    const containerStyles = {
        visibility: isSetting ? 'visible' : 'hidden',
        border:  '4px solid black',
        borderRadius: '12px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        width: '256px',
        height: '128px',
    }

    return (
        <div style={ containerStyles }>
            <div style={ flexColumn }>
                <span style={ messageStyles }>
                    { message }
                </span>
                <button onClick={ onClick } style={ cancelButtonStyles }>
                    <span> cancel </span>
                </button>
            </div>
        </div>
    )
}

export default SetPopup;