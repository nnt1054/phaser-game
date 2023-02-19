import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import actionMap from './actions';
import HotBarItem from './HotBarItem';

import * as styles from '../App.module.css';


const StatusInfo = (props) => {
    const status = props.status;
    const duration = status.duration;

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
        width: `48px`,
        height: `48px`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    }

    return (
        <div
            style={ statusInfoStyles }
        >
            {/*<img ref={ imageRef } draggable={ false } style={ hotbarIconStyle } src={ icon }/>*/}
            <span> { status.key } </span>
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
        minWidth: '255px',
        height: '64px',
        left: '12px',
        top: '12px',

        border: '4px solid black',
        borderRadius: '12px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, .5)',
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
