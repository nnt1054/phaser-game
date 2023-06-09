import { useSelector, useDispatch } from 'react-redux';

import * as styles from './../App.module.css';

const ExperienceBar = () => {
    const currentLevel = useSelector(state => state.playerState.currentLevel);
    const currentExp = useSelector(state => state.playerState.currentExp);
    const maxExp = useSelector(state => state.playerState.maxExp);
    const expProgress = useSelector(state => state.playerState.expProgress);
    const dispatch = useDispatch();

    const experienceBarContainerStyles = {
        left: 'calc(50vw - 270px)',
        bottom: '1vh',
        width: '532px',
        display: 'flex',
        flexDirection: 'column',
    }

    const experienceBarStyles = {
        height: '8px',
        width: '100%',
        border:  '4px solid black',
        borderRadius: '4px',
        backgroundColor: 'rgba(0, 0, 0, .5)',
        overflow: 'hidden',
    }

    const barStyles = {
        width: `${ expProgress * 100 }%`,
        backgroundColor: 'orange',
        transition: 'width 0.1s',
    }

    const textContainerStyles = {
        marginLeft: '4px',
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
    }

    return (
        <div style={ experienceBarContainerStyles }>
            <div style={ experienceBarStyles }>
                <div
                    style={ barStyles }
                    className={ styles.BarPrimary }
                />
            </div>
            <div style={ textContainerStyles }>
                <span> RDM </span>
                <span> Lvl { currentLevel } </span>
                <span> { currentExp } / { maxExp } </span>
            </div>
        </div>
    )
}

export default ExperienceBar;