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
    };

    const healthBarStyles = {
        position: 'relative',
        height: '12px',
        width: '512px',
        border: '4px solid black',
        borderRadius: '12px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
    };

    const cotargetHealthBarStyle = {
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

    const textStyle = {
        marginLeft: '8px',
    };

    const arrowStyle = {
        display: cotargetDisplay ? 'block' : 'none',
        margin: '0px 8px',
    };

    const targetContainerStyles = {
        display: 'flex',
    };

    const cotargetContainerStyles = {
        display: cotargetDisplay ? 'flex' : 'none',
    };


    return (
        <div
            style={ targetInfoContainerStyles }
        >
            <div style={ targetContainerStyles }>
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
                <div className={ styles.TargetText }>
                    <span> { currentHealth }% </span>
                    <span style={ textStyle }> { targetName } </span>
                </div>
            </div>

            {/* cotarget display */}
            <span style={ arrowStyle }> → </span>
            <div style={ cotargetContainerStyles }>
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
                <div className={ styles.TargetText }>
                    <span> { cotargetCurrentHealth }% </span>
                    <span style={ textStyle }> { cotargetName } </span>
                </div>
            </div>
        </div>
    )
}

export default TargetInfo;
