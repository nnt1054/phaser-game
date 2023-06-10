import { useSelector, useDispatch } from 'react-redux';

import * as styles from './../App.module.css';

const HealthBar = () => {
    const currentHealth = useSelector(state => state.playerHealth.currentHealth);
    const percentHealth = useSelector(state => state.playerHealth.percentHealth);
    const increasing = useSelector(state => state.playerHealth.increasing);
    const dispatch = useDispatch();

    const healthBarStyles = {
        position: 'relative',
        height: '16px',
        width: '256px',
        border:  '4px solid black',
        borderRadius: '4px',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        overflow: 'hidden',
    };

    const barStyles = {
        position: 'absolute',
        height: '24px',
        width: `${ percentHealth * 100 }%`,
        transition: increasing ? `width 0.1s` : `width 0s`,
        transitionDelay: increasing ? `0.2s` : `0s`,
        backgroundColor: 'green',
    }

    const underlayBarStyles = {
        position: 'absolute',
        height: '24px',
        width: `${ percentHealth * 100 }%`,
        transition: increasing ? `width 0s` : `width 0.1s`,
        transitionDelay: increasing ? `0s` : `0.2s`,
        backgroundColor: increasing ? 'blue' : 'red',
        opacity: 0.5,
    }

    const textContainerStyles = {
        marginLeft: '4px',
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
    }

    return (
        <div>
            <div style={ healthBarStyles }>
                <div
                    style={ underlayBarStyles }
                />
                <div
                    style={ barStyles }
                />
            </div>
            <div style={ textContainerStyles }>
                <span> Health </span>
                <span> { currentHealth } </span>
            </div>
        </div>
    )
}

export default HealthBar;