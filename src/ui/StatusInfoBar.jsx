import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import actionMap from './actions';
import HotBarItem from './HotBarItem';
import icons from './icons';

import * as styles from '../App.module.css';


const StatusInfo = (props) => {
    const status = props.status;
    const duration = status.duration;
    const icon = status.icon ? icons[status.icon] : icons['vercure'];

    const [timer, setTimer] = useState(duration);

    useEffect(() => {

        const timerInterval = setInterval(() => {
            const next = Math.max(0, timer - 100);
            setTimer(next);
        }, 100)

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
        gap: '2px',
    }

    const hotbarIconStyle = {
        display: icon ? `block` : `none`,
        width: `32px`,
        height: `32px`,
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

    const statuses = useSelector(state => state.statusInfo.statuses);
    const activeMenu = useSelector(state => state.menuStates.activeMenu)
    const dialogueActive = (activeMenu === 'dialogue');
    const isVisible = (!dialogueActive);

    const width = 255;
    const height = 255;

    const statusInfoBarContainerStyles = {
        display: isVisible ? 'flex' : 'none',
        height: '64px',
        right: '12px',
        bottom: '12px',
        padding: '8px',
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

export default StatusInfoBar;
