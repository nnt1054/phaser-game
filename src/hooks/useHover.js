import { useState, useEffect } from 'react';


const useHover = (ref, onHoverOver, onHoverOut) => {
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const element = ref.current;

        const mouseOverHandler = event => {
            setIsHovering(true);
            if (onHoverOver) onHoverOver(event);
        };

        const mouseOutHandler = event => {
            setIsHovering(false);
            if (onHoverOut) onHoverOut(event);
        };

        element.addEventListener('mouseover', mouseOverHandler);
        element.addEventListener('mouseout', mouseOutHandler);

        return () => {
          element.removeEventListener('mouseover', mouseOverHandler);
          element.removeEventListener('mouseout', mouseOutHandler);
        };
    });

  return isHovering;
}

export default useHover;
