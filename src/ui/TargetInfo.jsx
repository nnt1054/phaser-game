import { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as styles from './../App.module.css';

import actionMap from './actions';
import icons from './icons';


// TODO: move and fix/deduplicate from StatusInfoBar.jsx
const StatusInfo = (props) => {
    const status = props.status;
    const duration = status.duration;
    const icon = status.icon ? icons[status.icon] : icons['vercure'];

    const [timer, setTimer] = useState(duration);

    useEffect(() => {

        const timerInterval = setInterval(() => {
            const next = Math.max(0, timer - 1000);
            setTimer(next);
        }, 1000)

        return () => {
            clearInterval(timerInterval);
        };

    }, [timer]);

    useEffect(() => {
        setTimer(duration)
    }, [duration])

    const statusInfoStyles = {
        position: 'relative',
        width: `36px`,
        height: `48px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        padding: '4px 0px',
    }

    const hotbarIconStyle = {
        display: icon ? `block` : `none`,
        width: `32px`,
        height: `32px`,
        borderRadius: `12px`,
        pointerEvents: `auto`,
    }

    return (
        <div
            style={ statusInfoStyles }
        >
            <img draggable={ false } style={ hotbarIconStyle } src={ icon }/>
            <span> { Math.floor(timer / 1000) } </span>
        </div>
    )
}

const StatusInfoBar = () => {
    const dispatch = useDispatch();

    const statuses = useSelector(state => state.targetInfo.statuses);
    const activeMenu = useSelector(state => state.menuStates.activeMenu)
    const dialogueActive = (activeMenu === 'dialogue');
    const isVisible = (!dialogueActive);

    const width = 255;
    const height = 255;

    const statusInfoBarContainerStyles = {
        display: isVisible ? 'flex' : 'none',
        maxWidth: '255px',
        left: '12px',
        top: '12px',
        flexWrap: 'wrap',
    };

    return (
        <div
            style={ statusInfoBarContainerStyles }
        >
            {
                statuses.map((status, i) => {
                    return <StatusInfo
                        key={ i }
                        status={ status }
                    />
                })
            }
        </div>
    )
}



const CastBar = () => {
    const dispatch = useDispatch();

    const label = useSelector(state => state.targetInfo.castLabel);
    const castProgress = useSelector(state => state.targetInfo.castProgress);
    const duration = useSelector(state => state.targetInfo.castDuration);

    const [, updateState] = useState();
    const forceUpdate = useCallback(() => updateState({}), [ label, castProgress, duration ]);

    const iconContainerStyles = {
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

    const castBarContainerStyles = {
        visibility: duration ? 'visible': 'hidden',
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

        animationName: styles.progress,
        animationDuration: (duration > 0) ? `${ duration / 1000 }s` : '0s',
        animationTimingFunction: 'linear',
        animationDelay: (duration > 0) ? `-${ (duration - castProgress) / 1000 }s` : '0s',

        backgroundColor: 'orange',
    }

    return (
        <div style={ castBarContainerStyles }>
            <div>
                <span> { label } </span>
                <div style={ castBarStyles }>
                    <div
                        key={ label }
                        style={ barStyles }
                    ></div>
                </div>
            </div>
        </div>
    )
}


const TargetInfo = () => {
    const dispatch = useDispatch();

    const display = useSelector(state => state.targetInfo.display);
    const targetName = useSelector(state => state.targetInfo.targetName);
    const currentHealth = useSelector(state => state.targetInfo.currentHealth);
    const percentHealth = useSelector(state => state.targetInfo.percentHealth);
    const increasing = useSelector(state => state.targetInfo.increasing);
    const color = useSelector(state => state.targetInfo.color)

    const cotargetDisplay = useSelector(state => state.targetInfo.cotargetDisplay);
    const cotargetName = useSelector(state => state.targetInfo.cotargetName);
    const cotargetCurrentHealth = useSelector(state => state.targetInfo.cotargetCurrentHealth);
    const cotargetPercentHealth = useSelector(state => state.targetInfo.cotargetPercentHealth);
    const cotargetIncreasing = useSelector(state => state.targetInfo.cotargetIncreasing);
    const cotargetColor = useSelector(state => state.targetInfo.cotargetColor)

    const barStyles = {
        position: 'absolute',
        width: `${ percentHealth }%`,
        transition: (increasing == null) ? `width 0s` : increasing ? `width 0.1s` : `width 0s`,
        transitionDelay: (increasing == null) ? `0s` : increasing ? `0.2s` : `0s`,
        backgroundColor: color,
    };

    const underlayBarStyles = {
        position: 'absolute',
        width: `${ percentHealth }%`,
        transition: (increasing == null) ? `width 0s` : increasing ? `width 0s` : `width 0.1s`,
        transitionDelay: (increasing == null) ? `0s` : increasing ? `0s` : `0.2s`,
        backgroundColor: 'white',
    };

    const targetInfoContainerStyles = {
        visibility: display ? 'visible': 'hidden',
        position: 'absolute',
        left: `calc(50vw - ${ 512 / 2 }px)`,
        top: '5vh',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    };

    const healthBarStyles = {
        display: (currentHealth == null) ? 'none' : 'block',
        position: 'relative',
        height: '12px',
        width: '512px',
        border: '4px solid black',
        borderRadius: '4px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
    };

    const cotargetHealthBarStyle = {
        display: (cotargetCurrentHealth == null) ? 'none' : 'block',
        position: 'relative',
        height: '12px',
        width: '256px',
        border: '4px solid black',
        borderRadius: '4px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
    };

    const cotargetBarStyles = {
        position: 'absolute',
        width: `${ cotargetPercentHealth }%`,
        transition: (cotargetIncreasing == null) ? `width 0s` : cotargetIncreasing ? `width 0.1s` : `width 0s`,
        transitionDelay: (cotargetIncreasing == null) ? `0s` : cotargetIncreasing ? `0.2s` : `0s`,
        backgroundColor: cotargetColor,
    };

    const cotargetUnderlayBarStyles = {
        position: 'absolute',
        width: `${ cotargetPercentHealth }%`,
        transition: (cotargetIncreasing == null) ? `width 0s` : cotargetIncreasing ? `width 0s` : `width 0.1s`,
        transitionDelay: (cotargetIncreasing == null) ? `0s` : cotargetIncreasing ? `0s` : `0.2s`,
        backgroundColor: 'white',
    };

    const percentHealthStyle = {
        display: (currentHealth == null) ? 'none' : 'block',
        marginRight: '8px',
    }

    const textStyle = {
        // marginLeft: '8px',
    };

    const targetContainerStyles = {
        display: 'flex',
        flexDirection: 'column',
    };

    const cotargetContainerStyles = {
        display: cotargetDisplay ? 'flex' : 'none',
        flexDirection: 'column',
    };

    const greenLine = {
        display: (currentHealth == null) ? 'block' : 'none',
        position: 'relative',
        height: '12px',
        width: '512px',
        border: '4px solid black',
        borderRadius: '4px',
        backgroundColor: 'gray',
    };

    const cotargetGreenLine = {
        display: (cotargetCurrentHealth == null) ? 'block' : 'none',
        position: 'relative',
        height: '12px',
        width: '256px',
        border: '4px solid black',
        borderRadius: '4px',
        backgroundColor: 'gray',
    };

    const targetTextStyles = {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: '4px',
        fontSize: '12pt',
        fontFamily: 'Comfortaa',
        fontWeight: 'bold',
    }

    const targetSecondaryInfoStyles = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '64px',
    }

    const arrowStyle = {
        display: cotargetDisplay ? 'block' : 'none',
        margin: '0px 8px',
    };

    return (
        <div
            style={ targetInfoContainerStyles }
            onMouseDown={ e => e.stopPropagation() }
            onMouseUp={ e => e.stopPropagation() }
        >
            <div style={ targetContainerStyles }>
                <div style={ targetTextStyles }>
                    <span style={ percentHealthStyle }> { percentHealth }% </span>
                    <span style={ textStyle }> { targetName } </span>
                </div>
                <div style={ greenLine } />
                <div style={ healthBarStyles }>
                    <div
                        style={ underlayBarStyles }
                        className={ styles.BarPrimary }
                    />
                    <div
                        style={ barStyles }
                        className={ styles.BarPrimary }
                    />
                </div>
                <div style={ targetSecondaryInfoStyles }>
                    <StatusInfoBar />
                    <CastBar />
                </div>
            </div>

            {/* cotarget display */}
            <div style={ targetContainerStyles }>
                <div style={ targetTextStyles }> 
                    <span> &nbsp; </span>
                </div>
                <span style={ arrowStyle }> → </span>
                <div style={ targetSecondaryInfoStyles } />
            </div>

            <div style={ cotargetContainerStyles }>
                <div style={ targetTextStyles }>
                    <span style={ percentHealthStyle }> { cotargetPercentHealth }% </span>
                    <span style={ textStyle }> { cotargetName } </span>
                </div>
                <div style={ cotargetGreenLine }/>
                <div style={ cotargetHealthBarStyle }>
                    <div
                        style={ cotargetUnderlayBarStyles }
                        className={ styles.BarPrimary }
                    />
                    <div
                        style={ cotargetBarStyles }
                        className={ styles.BarPrimary }
                    />
                </div>
                <div style={ targetSecondaryInfoStyles } />
            </div>
        </div>
    )
}

export default TargetInfo;
