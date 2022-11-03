import { useSelector, useDispatch } from 'react-redux';
import * as styles from './../App.module.css';

const HealthBar = () => {
    const currentHealth = useSelector(state => state.playerHealth.currentHealth);
    const percentHealth = useSelector(state => state.playerHealth.percentHealth);
    const increasing = useSelector(state => state.playerHealth.increasing);
    const dispatch = useDispatch();

    const barStyles = {
        width: `${ percentHealth * 100 }%`,
        transition: increasing ? `width 0.1s` : `width 0s`,
        transitionDelay: increasing ? `0.2s` : `0s`,
        backgroundColor: 'green',
    }

    const underlayBarStyles = {
        width: `${ percentHealth * 100 }%`,
        transition: increasing ? `width 0s` : `width 0.1s`,
        transitionDelay: increasing ? `0s` : `0.2s`,
        backgroundColor: increasing ? 'blue' : 'red',
        opacity: 0.5,
    }

    return (
        <div>
            <div className={ styles.HealthBar }>
                <div
                    style={ underlayBarStyles }
                    className={ styles.BarPrimary }
                />
                <div
                    style={ barStyles }
                    className={ styles.BarPrimary }
                />
            </div>
            <div className={ styles.BarText }>
                <span> Health </span>
                <span className={ styles.BarValue }> { currentHealth } </span>
            </div>
        </div>
    )
}

export default HealthBar;