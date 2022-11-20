import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';


const useDrag = (ref, onDrag, onRelease) => {
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
            element.style.zIndex = 2;

            // stop propogation for stacked draggable elements
            // might remove depending on design
            // event.stopPropagation()
        };

        const upHandler = event => {
            if (dragState.isPointerDown) {
                onRelease(event);
                setDragState({
                    isDragging: false,
                    isPointerDown: false,
                });
            };
            element.style.zIndex = 1;
            // event.stopPropagation()
        };

        const moveHandler = event => {
            if (dragState.isPointerDown) {
                onDrag(event);
                if (!dragState.isDragging) {
                    setDragState({
                        isDragging: true,
                        isPointerDown: true,
                    });
                }
            };
            // event.stopPropagation()
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
