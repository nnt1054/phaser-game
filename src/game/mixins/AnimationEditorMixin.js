const AnimationEditorMixin = {
    paused: false,
    currentFrame: 0,

    setAnimState(animState) {
        if (animState.frameIndex != null && animState.frameIndex != this.currentFrame) {
            this.currentFrame = animState.frameIndex;
            this.queueAbility(`frame${animState.frameIndex}`);
        }
        this.character.setActiveCompositeStates(animState.compositeStates);
    }
}

export default AnimationEditorMixin;
