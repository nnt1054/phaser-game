import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
	setAlert,
	clearAlert,
} from './../store/alert';

import * as styles from './../App.module.css';


const Alert = () => {
	const dispatch = useDispatch();
    const message = useSelector(state => state.alert.message);
    const counter = useSelector(state => state.alert.counter);

    useEffect(() => {
    	const clearId = setTimeout(() => {
    		dispatch(clearAlert());
    	}, 1500)

    	return () => {
    		clearTimeout(clearId)
    	}
    }, [message, counter])

	const alertContainerStyles = {
		display: message ? 'flex' : 'none',
		position: 'absolute',
		margin: 'auto',
		top: '25vh',
		color: 'red',
		fontSize: '16pt',
		fontWeight: 'bold',
	};

	return (
		<div
			style={ alertContainerStyles }
		>
			<span> { message } </span>
		</div>
	)
}

export default Alert;
