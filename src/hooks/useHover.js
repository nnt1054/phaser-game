import { useState, useEffect } from 'react';


const useHover = (ref) => {
    const [isHovering, setIsHovering] = useState(false);

    useEffect(() => {
        const element = ref.current;

        const mouseOverHandler = event => {
            setIsHovering(true);
        };

        const mouseOutHandler = event => {
            setIsHovering(false);
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
