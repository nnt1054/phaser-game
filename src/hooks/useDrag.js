import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';


const useDrag = (ref, onDrag, onRelease) => {
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const element = ref.current;

        const downHandler = event => {
            setIsDragging(true);
            element.style.zIndex = 10;
        };

        const upHandler = event => {
            if (isDragging) {
                onRelease(event);
                setIsDragging(false);
            }
            element.style.zIndex = 1;
        };

        const moveHandler = event => {
            if (isDragging) {
                onDrag(event);
            };
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

    return isDragging;
}

export default useDrag;