// Tooltip Class
// A tooltip class can provide context-sensitive information on hover or focus, which is useful for forms, icons, or any element where additional information might be needed.

class Tooltip {
    private targetElement: HTMLElement
    private tooltipElement: HTMLElement

    constructor(targetId: string, tooltipId: string) {
        this.targetElement = document.getElementById(targetId) as HTMLElement
        this.tooltipElement = document.getElementById(tooltipId) as HTMLElement
        this.targetElement.addEventListener('mouseover', this.showTooltip)
        this.targetElement.addEventListener('mouseout', this.hideTooltip)
    }

    private showTooltip = () => {
        this.tooltipElement.style.visibility = 'visible'
        this.tooltipElement.style.opacity = '1'
    }

    private hideTooltip = () => {
        this.tooltipElement.style.visibility = 'hidden'
        this.tooltipElement.style.opacity = '0'
    }
}
