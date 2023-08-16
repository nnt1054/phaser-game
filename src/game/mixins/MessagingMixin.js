const MessagingMixin = {

	currentMessage: '',
	messageTimer: 0,

    chatBubble: null,

    initializeMessagingMixin() {
        this.chatBubble = this.scene.add.dom(
            0, 0,
            'div',
            '',
            this.currentMessage,
        );
        this.chatBubble.setClassName('chat-bubble-hidden');
        this.chatBubble.setOrigin(0.5, 1);
        this.chatBubble.setPosition(this.state.width / 2, -8); 
    },

    clearMessage() {
        this.currentMessage = '';
        this.chatBubble.setText('');
        this.chatBubble.setClassName('chat-bubble-hidden');
        this.messageTimer = null;
    },

    displayMessage(text) {
        this.chatBubble.setText(`${ this.displayName }: ${ text }`);
        this.chatBubble.setClassName('chat-bubble');
        if (this.messageTimer) {
            this.messageTimer.remove()
        }
        this.messageTimer = this.time.addEvent({
            delay: 3000,
            callback: () => { this.clearMessage(); },
            callbackScope: this, 
        })
    }
}

export default MessagingMixin;
