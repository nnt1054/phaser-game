import { useSelector, useDispatch } from 'react-redux';
import * as styles from './../App.module.css';

const TargetInfo = () => {
    const dispatch = useDispatch();

    const display = useSelector(state => state.targetInfo.display);
    const targetName = useSelector(state => state.targetInfo.targetName);
    const currentHealth = useSelector(state => state.targetInfo.currentHealth);
    const percentHealth = useSelector(state => state.targetInfo.percentHealth);
    const increasing = useSelector(state => state.targetInfo.increasing);

    const cotargetDisplay = useSelector(state => state.targetInfo.cotargetDisplay);
    const cotargetName = useSelector(state => state.targetInfo.cotargetName);
    const cotargetCurrentHealth = useSelector(state => state.targetInfo.cotargetCurrentHealth);
    const cotargetPercentHealth = useSelector(state => state.targetInfo.cotargetPercentHealth);
    const cotargetIncreasing = useSelector(state => state.targetInfo.cotargetIncreasing);

    const barStyles = {
        position: 'absolute',
        width: `${ percentHealth * 100 }%`,
        transition: (increasing == null) ? `width 0s` : increasing ? `width 0.1s` : `width 0s`,
        transitionDelay: (increasing == null) ? `0s` : increasing ? `0.2s` : `0s`,
        backgroundColor: 'lightblue',
    };

    const underlayBarStyles = {
        position: 'absolute',
        width: `${ percentHealth * 100 }%`,
        transition: (increasing == null) ? `width 0s` : increasing ? `width 0s` : `width 0.1s`,
        transitionDelay: (increasing == null) ? `0s` : increasing ? `0s` : `0.2s`,
        backgroundColor: 'white',
    };

    const targetInfoContainerStyles = {
        visibility: display ? 'visible': 'hidden',
        position: 'absolute',
        left: '25vw',
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
        borderRadius: '12px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
    };

    const cotargetHealthBarStyle = {
        display: (cotargetCurrentHealth == null) ? 'none' : 'block',
        position: 'relative',
        height: '12px',
        width: '256px',
        border: '4px solid black',
        borderRadius: '12px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
    };

    const cotargetBarStyles = {
        position: 'absolute',
        width: `${ cotargetPercentHealth * 100 }%`,
        transition: (cotargetIncreasing == null) ? `width 0s` : cotargetIncreasing ? `width 0.1s` : `width 0s`,
        transitionDelay: (cotargetIncreasing == null) ? `0s` : cotargetIncreasing ? `0.2s` : `0s`,
        backgroundColor: 'lightblue',
    };

    const cotargetUnderlayBarStyles = {
        position: 'absolute',
        width: `${ cotargetPercentHealth * 100 }%`,
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

    const arrowStyle = {
        display: cotargetDisplay ? 'block' : 'none',
        margin: '0px 8px',
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
        borderRadius: '12px',
        backgroundColor: 'gray',
    };

    const cotargetGreenLine = {
        display: (cotargetCurrentHealth == null) ? 'block' : 'none',
        position: 'relative',
        height: '12px',
        width: '256px',
        border: '4px solid black',
        borderRadius: '12px',
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

    return (
        <div
            style={ targetInfoContainerStyles }
            onMouseDown={ e => e.stopPropagation() }
            onMouseUp={ e => e.stopPropagation() }
        >
            <div style={ targetContainerStyles }>
                <div style={ targetTextStyles }>
                    <span style={ percentHealthStyle }> { currentHealth }% </span>
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
            </div>

            {/* cotarget display */}
            <span style={ arrowStyle }> → </span>

            <div style={ cotargetContainerStyles }>
                <div style={ targetTextStyles }>
                    <span style={ percentHealthStyle }> { currentHealth }% </span>
                    <span style={ textStyle }> { targetName } </span>
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
            </div>
        </div>
    )
}

export default TargetInfo;
