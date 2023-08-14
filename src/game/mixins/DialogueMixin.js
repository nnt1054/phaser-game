import store from '../../store/store';

import {
    setDialogue,
    clearDialogue,
} from '../../store/dialogueBox';

import {
    menus,
    openMenu,
    closeMenu,
} from '../../store/menuStates';

import {
    setAlert,
} from '../../store/alert';


const DialogueMixin = {

    hasDialogue: true,
    messages: {},
    currentMessage: null,
    interactionRect: null,

    dialogueTarget: null,
    dialogueComplete: true,
    dialogueOption: null,

    isPlayerInRange: function(player) {
        return Phaser.Geom.Rectangle.Overlaps(
            player.hitboxRect.getBounds(),
            this.interactionRect.getBounds(),
        )
    },

    startDialogue: function(player) {
        if (player.dialogueTarget) {
            // do nothing if already in dialogue
        } else if (this.isPlayerInRange(player) && player.body.onFloor()) {
            player.dialogueTarget = this;
            this.displayMessage(player, this.messages['001']);
        } else {
            store.dispatch(setAlert('Target is not in range.'));
        }
    },

    displayMessage: function(player, message) {
        this.currentMessage = message;
        if (this.currentMessage.type == 'simple') {
            store.dispatch(openMenu(menus.dialogue));
            store.dispatch(setDialogue({
                name: this.displayName,
                messages: message.messages,
            }));
            player.dialogueComplete = false;
        } else if (this.currentMessage.type == 'question') {
            store.dispatch(openMenu(menus.dialogue));
            store.dispatch(setDialogue({
                name: this.displayName,
                messages: [message.message],
                options: message.options,
            }));
            player.dialogueComplete = false;
        } else {
            this.endDialogue(player);
        }
    },

    completeDialogue: function(player, optionIndex) {
        if (this.currentMessage) {
            if (this.currentMessage.type == 'simple') {
                if (this.currentMessage.next) {
                    const nextMessage = this.messages[this.currentMessage.next];
                    this.displayMessage(player, nextMessage);
                } else {
                    this.endDialogue(player);
                }
            } else if (this.currentMessage.type == 'question') {
                const option = this.currentMessage.options[optionIndex];
                const nextMessage = this.messages[option.next];
                this.displayMessage(player, nextMessage);
            } else {
                this.endDialogue(player);
            }
        } else {
            this.endDialogue(player);
        }
    },

    endDialogue: function(player) {
        player.dialogueTarget = null;
        player.dialogueComplete = true;
        store.dispatch(clearDialogue());
        store.dispatch(closeMenu());
    },

    // Following is used for Player (everything else used for NPC)
    updateDialogue(delta) {
        if (this.dialogueTarget) {
            if (!this.dialogueTarget.isPlayerInRange(this)) {
                this.dialogueTarget.endDialogue(this);
            } else if (this.dialogueComplete) {
                this.dialogueTarget.completeDialogue(this, this.dialogueOption);
            }
        }
    },

    setDialogueInput(input) {
        this.dialogueComplete = input.dialogueComplete;
        this.dialogueOption = input.dialogueOption;
    }
}

export default DialogueMixin;
