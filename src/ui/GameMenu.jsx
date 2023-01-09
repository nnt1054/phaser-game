import { useSelector, useDispatch } from 'react-redux';
import * as styles from './../App.module.css';
import { clearSetting } from '../store/hotBars';

import {
    openMenu,
} from './../store/menuStates';

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

const containerStyles = {
    top: '12px',
    right: '12px',

    width: '256px',
    padding: '12px 12px',

    border:  '4px solid black',
    borderRadius: '12px',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, .5)',
}

const labelStyle = {
}

const buttonsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
}

const buttonStyle = {
    color: 'white',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    padding: '4px 0px',
}

const GameMenu = () => {
    const dispatch = useDispatch();

    const activeMenu = useSelector(state => state.menuStates.activeMenu);
    const activeIndex = useSelector(state => state.menuStates.activeIndex);
    const options = useSelector(state => state.menuStates.gameMenuOptions);
    const isActive = (activeMenu === 'gameMenu');

    const containerStyles = {
        visibility: isActive ? 'visible' : 'hidden',
        top: '12px',
        right: '12px',

        width: '256px',
        padding: '12px 12px',

        border:  '4px solid black',
        borderRadius: '12px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, .5)',
    }

    const onClickInventory = (event) => {
        dispatch(openMenu('inventory'));
    }

    return (
        <div style={ containerStyles }>
            <h3 style={ labelStyle }> Main Menu </h3>
            <div style={ buttonsContainerStyle }>
                {
                    options.map((option, i) => {
                        return <GameMenuOption
                            key={ i }
                            index={ i }
                            text={ option.label }
                        />
                    })
                }
            </div>
        </div>
    )
}

const GameMenuOption = (props) => {
    const activeIndex = useSelector(state => state.menuStates.activeIndex);
    const isActive = (activeIndex === props.index);

    const buttonStyle = {
        fontSize: '12pt',
        fontWeight: isActive ? 'bold' : 'normal',
        color: 'white',
        border: 'none',
        background: 'none',
        textAlign: 'left',
        padding: '4px 0px',
    }

    const text = isActive ? `> ${ props.text}` : props.text
    return (
        <button style={ buttonStyle }> { text } </button>
    )
}

export default GameMenu;