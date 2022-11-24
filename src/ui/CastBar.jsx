import { useSelector, useDispatch } from 'react-redux';
import reducerMap from './HotBarItems';
import { ICONS } from './HotBar';
import * as styles from './../App.module.css';

const CastBar = () => {
    const {label, duration} = useSelector(state => state.playerState.cast);
    // const label = 'heal';
    // const duration = 2000;
    const ability = reducerMap[label];
    const icon = ability ? ICONS[ability.icon] : null;

    const dispatch = useDispatch();

    const castBarContainerStyles = {
        visibility: duration ? 'visible': 'hidden',
        position: 'absolute',
        left: '70vw',
        bottom: '12vh',
        display: 'flex',
        flexDirection: 'row',
    }

    const castBarStyles = {
        position: 'relative',
        height: '12px',
        width: '196px',
        border:  '4px solid black',
        borderRadius: '12px',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        overflow: 'hidden',
    }

    const barStyles = {
        height: '16px',
        width: (duration > 0) ? '100%' : '0%',
        transition: (duration > 0) ? `width ${ duration / 1000 }s linear` : 'width 0s',
        backgroundColor: 'orange',
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
            <button style={ iconContainerStyles }>
                <img draggable={ false } style={ iconStyle } src={ icon }/>
            </button>
            <div>
                <span> { ability ? ability.label : '' } </span>
                <div style={ castBarStyles }>
                    <div
                        style={ barStyles }
                        className={ styles.ManaBarPrimary }
                    ></div>
                </div>
            </div>
        </div>
    )
}

export default CastBar;
