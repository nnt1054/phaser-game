import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';


const usePointerDown = (ref) => {
    const [isPointerDown, setIsPointerDown] = useState(false);

    useEffect(() => {
        const element = ref.current;

        const downHandler = event => {
            setIsPointerDown(true);
        };

        const upHandler = event => {
            if (isPointerDown) {
                setIsPointerDown(false);
            }
        };

        element.addEventListener('pointerdown', downHandler);
        document.addEventListener('pointerup', upHandler);

        return () => {
            element.removeEventListener('pointerdown', downHandler);
            document.removeEventListener('pointerup', upHandler);
        };
    });

    return isPointerDown;
}

export default usePointerDown;