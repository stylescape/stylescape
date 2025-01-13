// Manages the display and removal of notifications or alerts in the UI.

export default class NotificationManager {
    private container: HTMLElement

    constructor(containerId: string) {
        this.container = document.getElementById(containerId) as HTMLElement
    }

    showNotification(message: string, type: 'success' | 'error' | 'info'): void {
        const notification = document.createElement('div')
        notification.className = `notification ${type}`
        notification.innerText = message
        this.container.appendChild(notification)

        setTimeout(() => this.container.removeChild(notification), 3000)
    }
}

// Usage
const notificationManager = new NotificationManager('notification-container')
// notificationManager.showNotification('Your action was successful', 'success');
