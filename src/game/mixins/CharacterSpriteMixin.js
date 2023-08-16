import { CompositeSprite } from '../utils';

const CharacterSpriteMixin = {

    character: null,

    initializeCompositeSprite() {
        this.character = new CompositeSprite(
            this.scene, 
            this.state.width / 2,
            this.state.height + 2,
            this.state.character.config,
            this.state.character.indexes,
        );
    },

    playAnimation(anim) {
        this.character.play(anim, true);
    },
}

export default CharacterSpriteMixin;
