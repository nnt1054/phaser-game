import { useSelector, useDispatch } from 'react-redux';
import * as styles from './../App.module.css';
import { targetingActions } from './actions';

import {
    openMenu,
    setActiveIndex,
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

const labelStyle = {}

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

const stopPropagation = e => e.stopPropagation();

const EnemyList = () => {
    const dispatch = useDispatch();

    const activeMenu = useSelector(state => state.menuStates.activeMenu);
    const options = useSelector(state => state.enemyList.enemies);
    const shouldDisplay = options.length > 0;

    const containerStyles = {
        visibility: shouldDisplay ? 'visible' : 'hidden',
        bottom: '25vh',
        right: '12px',

        padding: '12px 12px',

        border:  '4px solid black',
        borderRadius: '12px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, .5)',
    }

    return (
        <div
            style={ containerStyles}
            onMouseDown={ stopPropagation }
            onMouseUp={ stopPropagation }
        >
            <h3 style={ labelStyle }> Enemy List </h3>
            <div style={ buttonsContainerStyle }>
                {
                    options.map((option, i) => {
                        return <EnemyListOption
                            key={ i }
                            index={ i }
                            option={ option }
                        />
                    })
                }
            </div>
        </div>
    )
}

const EnemyListOption = (props) => {
    const dispatch = useDispatch();

    const option = props.option;
    const isActive =  option.isTarget;

    const buttonStyle = {
        fontSize: '12pt',
        fontWeight: isActive ? 'bold' : 'normal',
        color: 'white',
        border: 'none',
        background: 'none',
        textAlign: 'left',
        padding: '4px 0px',
    }

    const onClick = (event) => {
        const { targetEnemyFromEnemyList } = targetingActions;
        targetEnemyFromEnemyList.action(props.index);
    }

    const text = isActive ? `> ${ option.name }` : option.name
    return (
        <button
            onClick={ onClick }
            style={ buttonStyle }
        >
            { text }
        </button>
    )
}

export default EnemyList;
