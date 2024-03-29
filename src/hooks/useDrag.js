import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';


const useDrag = (ref, onDrag, onRelease, onDown) => {
    const [dragState, setDragState] = useState({
        isDragging: false,
        isPointerDown: false,
    });

    useEffect(() => {
        const element = ref.current;

        const downHandler = event => {
            setDragState({
                isDragging: false,
                isPointerDown: true,
            });
            if (onDown) onDown(event);
            // stop propogation for stacked draggable elements
            event.stopPropagation()
        };

        const upHandler = event => {
            if (dragState.isPointerDown) {
                onRelease(event);
                setDragState({
                    isDragging: false,
                    isPointerDown: false,
                });
            };
            event.stopPropagation()
        };

        const moveHandler = event => {
            if (dragState.isPointerDown) {
                const zoom = window.outerWidth / window.innerWidth;
                const pseudoEvent = {
                    movementX: event.movementX / zoom,
                    movementY: event.movementY / zoom,
                };
                onDrag(pseudoEvent);
                if (!dragState.isDragging) {
                    setDragState({
                        isDragging: true,
                        isPointerDown: true,
                    });
                }
            };
            event.stopPropagation()
        };

        element.addEventListener('pointerdown', downHandler);
        document.addEventListener('pointerup', upHandler);
        document.addEventListener('pointermove', moveHandler);

        return () => {
            element.removeEventListener('pointerdown', downHandler);
            document.removeEventListener('pointerup', upHandler);
            document.removeEventListener('pointermove', moveHandler);
        };
    });

    return dragState;
}

export default useDrag;
