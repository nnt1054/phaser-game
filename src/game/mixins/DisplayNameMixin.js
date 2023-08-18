import { CompositeSprite } from '../utils';

const DisplayNameMixin = {

    name: null,
    displayName: '',

    initializeDisplayName() {
        this.displayName = this.state.displayName;
        this.name = this.scene.add.text(
            this.state.width / 2,
            this.state.height,
            this.displayName,
            {
                fontFamily: 'Comic Sans MS',
                fontSize: '16px',
                fill: '#FFF',
                stroke: '#000',
                strokeThickness: 8,
            }
        );
        if (this.isPlayer) {
            this.name.setOrigin(0.5, 0);
        } else {
            this.name.setOrigin(0.5, 1);
            this.name.setY(0);
        }
        this.name.setInteractive();
        this.name.on('clicked', (object) => {
            this.handleClick();
        });
    },

    setDisplayName(displayName) {
        this.displayName = displayName;
        if (this.isTargeted) {
            this.name.setText(`> ${ this.displayName } <`);
        } else {
            this.name.setText(this.displayName);
        }
    },
}

export default DisplayNameMixin;
