import { useSelector, useDispatch } from 'react-redux';
import * as styles from './../App.module.css';

const ManaBar = () => {
    const currentMana = useSelector(state => state.playerMana.currentMana);
    const percentMana = useSelector(state => state.playerMana.percentMana);
    const dispatch = useDispatch();

    const barStyles = {
        width: `${ percentMana * 100 }%`,
    }

    return (
        <div>
            <div className={ styles.ManaBar }>
                <div
                    style={ barStyles }
                    className={ styles.ManaBarPrimary }
                ></div>
            </div>
            <div className={ styles.BarText }>
                <span> Mana </span>
                <span className={ styles.BarValue }> { currentMana } </span>
            </div>
        </div>
    )
}

export default ManaBar;