import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import reducerMap from './HotBarItems';
import useDrag from '../hooks/useDrag';
import {
    setPosition,
} from '../store/hotBars';

import * as styles from '../App.module.css';


const _calculatePosition = (index, ref) => {
    const element = ref.current;
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const style = window.getComputedStyle(element);
    const temp = window.getComputedStyle(element).transform;
    const numberPattern = /-?\d+\.?\d+|\d+/g;
    const values = style.transform.match( numberPattern );
    const translateX = parseFloat(values[4]);
    const translateY = parseFloat(values[5]);
    const width = parseFloat(style.width);
    const left = parseFloat(style.left);
    const bottom = parseFloat(style.bottom);

    const newLeft = ((left + width/2 + translateX) / vw) * 100;
    const newBottom = ((bottom - translateY) / vh) * 100;

    return {
        index: index,
        x: newLeft,
        y: newBottom,
    }
};

const HotBar = (props) => {
    const ref = useRef();

    const position = useSelector(state => state.hotBars[props.index]);
    const compositeStates = useSelector(state => state.aniEditor.compositeStates);
    const frameIndex = useSelector(state => state.aniEditor.frameIndex);
    const frameIndexString = `frameIndex${frameIndex}`;

    const dispatch = useDispatch();

    const [translate, setTranslate] = useState({ x: 0, y: 0 });
    const releaseDrag = useDrag(ref,
        event => {
            setTranslate({
                x: translate.x + event.movementX,
                y: translate.y + event.movementY,
            });
        },
        event => {
            const data = _calculatePosition(props.index, ref);
            dispatch(setPosition(data));
            setTranslate({ x: 0, y: 0 });
        }
    );

    const num_slots = position.slots.length;
    const width = props.vertical ? 48: 52 * num_slots;
    const height = props.vertical ? 540 : 48;
    const hotBarStyles = {
        display: position.visible ? 'flex' : 'none',
        width: `${ width }px`,
        height: `${ height }px`,
        left: `calc(${ position.left }vw - ${ width / 2 }px)`,
        bottom: `${ position.bottom }vh`,
        flexDirection: props.vertical ? `column` : `row`,
        transform: `translateX(${ translate.x }px) translateY(${ translate.y }px)`,
    }

    const activeButtonStyle = {
        color: 'black',
        backgroundColor: 'white',
    };
    const buttonStyle = {};

    return (
        <div
            ref={ ref }
            style={ hotBarStyles }
            className={ styles.HotBar }
        >
            {
                position.slots.map((slot, i) => {
                    return <button
                        key={ i }
                        style= { compositeStates[slot] || slot == frameIndexString ? activeButtonStyle : buttonStyle }
                        className={ styles.KeyBind }
                        onClick={() => dispatch(reducerMap[slot].action)}
                    > { reducerMap[slot].label } </button>
                })
            }
        </div>
    )
}

export default HotBar;
