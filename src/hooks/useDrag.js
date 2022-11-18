import { useState, useEffect } from 'react';


const useDrag = (ref, onDrag, onRelease) => {
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const element = ref.current;

        const downHandler = event => {
            setIsDragging(true);
        };

        const upHandler = event => {
            if (isDragging) {
                setIsDragging(false);
                onRelease(event);
            }
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