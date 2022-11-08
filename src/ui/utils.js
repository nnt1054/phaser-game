
export function calculatePosition(key, ref) {
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
        key: key,
        x: newLeft,
        y: newBottom,
    }
};
