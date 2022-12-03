import { useSelector, useDispatch } from 'react-redux';
import * as styles from './../App.module.css';

const TargetInfo = () => {
    const currentHealth = useSelector(state => state.targetInfo.currentHealth);
    const percentHealth = useSelector(state => state.targetInfo.percentHealth);
    const increasing = useSelector(state => state.targetInfo.increasing);
    const dispatch = useDispatch();

    const barStyles = {
        position: 'absolute',
        width: `${ percentHealth * 100 }%`,
        transition: increasing ? `width 0.1s` : `width 0s`,
        transitionDelay: increasing ? `0.2s` : `0s`,
        backgroundColor: 'lightblue',
    }

    const underlayBarStyles = {
        position: 'absolute',
        width: `${ percentHealth * 100 }%`,
        transition: increasing ? `width 0s` : `width 0.1s`,
        transitionDelay: increasing ? `0s` : `0.2s`,
        backgroundColor: 'white',
    }

    const targetInfoContainerStyles = {
        // visibility: target ? 'visible': 'hidden',
        position: 'absolute',
        left: '25vw',
        top: '5vh',
        display: 'flex',
        flexDirection: 'row',
    }

    const healthBarStyles = {
        position: 'relative',
        height: '12px',
        width: '512px',
        border: '4px solid black',
        borderRadius: '12px',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
    }

    const textStyle = {
        marginLeft: '8px',
    }

    return (
        <div style={ targetInfoContainerStyles }>
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
                <span style={ textStyle }> Lamb Seel </span>
            </div>
        </div>
    )
}

export default TargetInfo;
