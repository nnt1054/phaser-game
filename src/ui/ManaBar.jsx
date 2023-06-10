import { useSelector, useDispatch } from 'react-redux';
import * as styles from './../App.module.css';

const ManaBar = () => {
    const currentMana = useSelector(state => state.playerMana.currentMana);
    const percentMana = useSelector(state => state.playerMana.percentMana);
    const dispatch = useDispatch();

    const barStyles = {
        height: '24px',
        width: `${ percentMana * 100 }%`,
        transition: 'width 0.2s',
        backgroundColor: 'blue',
    }

    const textContainerStyles = {
        marginLeft: '4px',
        display: 'flex',
        flexDirection: 'row',
        gap: '16px',
    }

    return (
        <div>
            <div className={ styles.ManaBar }>
                <div
                    style={ barStyles }
                ></div>
            </div>
            <div style={ textContainerStyles }>
                <span> Mana </span>
                <span> { currentMana } </span>
            </div>
        </div>
    )
}

export default ManaBar;
