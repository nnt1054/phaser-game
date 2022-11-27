import { useSelector, useDispatch } from 'react-redux';
import actionMap from './actions';
import icons from './icons';
import * as styles from './../App.module.css';

const flexRow = {
    display: 'flex',
    flexDirection: 'row',
}

const flexColumn = {
    display: 'flex',
    flexDirection: 'column',
}

const Tooltip = () => {
    const abilityKey = useSelector(state => state.hotBars.hoverKey);
    const ability = actionMap[abilityKey];
    const icon = ability  ? icons[ability.icon] : null;
    const dragging = useSelector(state => state.hotBars.dragging)
    const empty = (abilityKey === 'empty');

    const castBarContainerStyles = {
        visibility: ability ? 'visible' : 'hidden',
        display: (dragging || empty) ? 'none' : 'flex',
        flexDirection: 'column',
        position: 'absolute',
        right: '0vw',
        bottom: '0vh',
        width: '420px',
        minHeight: '256px',
        padding: '4px',
        border:  '4px solid black',
        borderRadius: '12px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        pointerEvents: 'none',
    }

    const iconContainerStyles = {
        width: '48px',
        height: '48px',
        borderRadius: `12px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        pointerEvents: 'none',
        overflow: 'hidden',
        border: '4px solid black',
        position: 'relative',
        marginRight: '4px',
    }

    const iconStyle = {
        width: `48px`,
        height: `48px`,
        display: 'block',
        position: `absolute`,
        pointerEvents: `none`,
    }

    return (
        <div style={ castBarContainerStyles }>
            <div style={ flexRow }>
                <button style={ iconContainerStyles }>
                    <img draggable={ false } style={ iconStyle } src={ icon }/>
                </button>
                <div style={ flexColumn }>
                    <span> { ability ? ability.label : '' } </span>
                    <span> spell </span>
                </div>
            </div>
            <div style={ {...flexRow, marginTop: '12px'} }>
                <span style={ {marginRight: '24px'} }> Cast: 2.00s </span>
                <span style={ {marginRight: '24px'} }> Recast: 2.50s </span>
                <span style={ {marginRight: '24px'} }> MP Cost: 10MP </span>
            </div>
            <p style={ {marginTop: `12px`} }>
                <span style={{ color: 'green' }}> Description </span>: { ability && ability.description ? ability.description : "This is where I'd put my description... IF I HAD ONE."}
            </p>
        </div>
    )
}

export default Tooltip;