const MessagingMixin = {

	currentMessage: '',
	messageTimer: 0,

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
