// Controls and interactions for the Cosmic Countdown

// Extend the ShadowKiroClock class with control methods
Object.assign(ShadowKiroClock.prototype, {
    
    zoomIn() {
        if (this.zoomLevel < this.maxZoom) {
            this.zoomLevel = Math.min(this.maxZoom, this.zoomLevel + this.zoomStep);
            this.applyZoom();
            this.showNotification(`Zoom: ${Math.round(this.zoomLevel * 100)}%`, 'success');
        }
    },
    
    zoomOut() {
        if (this.zoomLevel > this.minZoom) {
            this.zoomLevel = Math.max(this.minZoom, this.zoomLevel - this.zoomStep);
            this.applyZoom();
            this.showNotification(`Zoom: ${Math.round(this.zoomLevel * 100)}%`, 'success');
        }
    },
    
    resetZoom() {
        this.zoomLevel = 1;
        this.applyZoom();
        this.showNotification('Zoom Reset', 'success');
    },
    
    applyZoom() {
        this.clockContainer.style.transform = `scale(${this.zoomLevel})`;
        
        // Add zoom animation class
        this.clockContainer.classList.add('zooming');
        setTimeout(() => {
            this.clockContainer.classList.remove('zooming');
        }, 300);
        
        // Add zoom animation CSS if not already added
        if (!document.getElementById('zoomStyles')) {
            const style = document.createElement('style');
            style.id = 'zoomStyles';
            style.textContent = `
                .zooming {
                    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    setTheme(theme) {
        // Remove existing theme classes
        document.body.classList.remove('shadow-theme', 'kiro-theme', 'void-theme');
        
        // Add new theme class
        if (theme !== 'shadow') {
            document.body.classList.add(`${theme}-theme`);
        }
        
        // Update active button
        document.querySelectorAll('.theme-btn').forEach(btn => btn.classList.remove('active'));
        document.getElementById(`${theme}Theme`).classList.add('active');
        
        this.currentTheme = theme;
        this.showNotification(`${theme.toUpperCase()} Shadow Activated`, 'success');
    },
    
    toggleFullscreen() {
        if (!this.isFullscreen) {
            document.documentElement.requestFullscreen().catch(() => {
                this.showNotification('Fullscreen not supported', 'error');
            });
        } else {
            document.exitFullscreen();
        }
    },
    
    updateFullscreenButton() {
        const btn = document.getElementById('fullscreenBtn');
        const icon = btn.querySelector('.button-icon');
        const text = btn.querySelector('span:last-child');
        
        if (this.isFullscreen) {
            icon.textContent = '⛶';
            text.textContent = 'EXIT FULLSCREEN';
        } else {
            icon.textContent = '⛶';
            text.textContent = 'FULLSCREEN';
        }
    },
    
    shareCountdown() {
        const currentTime = `${this.hoursElement.textContent}:${this.minutesElement.textContent}:${this.secondsElement.textContent}`;
        const shareText = `🌙 Shadow Kiro Clock: ${currentTime} until Kiro's Midnight! ⚡`;
        const shareUrl = window.location.href;
        
        if (navigator.share) {
            navigator.share({
                title: 'Shadow Kiro Clock',
                text: shareText,
                url: shareUrl
            }).catch(() => {
                this.fallbackShare(shareText, shareUrl);
            });
        } else {
            this.fallbackShare(shareText, shareUrl);
        }
    },
    
    fallbackShare(text, url) {
        // Copy to clipboard
        const shareContent = `${text}\n${url}`;
        navigator.clipboard.writeText(shareContent).then(() => {
            this.showNotification('Link copied to clipboard!', 'success');
        }).catch(() => {
            this.showNotification('Share failed', 'error');
        });
    },
    
    showDiscordId() {
        const discordId = '1075533908613021727';
        
        // Copy Discord ID to clipboard
        navigator.clipboard.writeText(discordId).then(() => {
            this.showNotification(`Discord ID copied: ${discordId}`, 'success');
        }).catch(() => {
            // Fallback: show in alert if clipboard fails
            alert(`Shadow's Discord ID: ${discordId}`);
        });
    }
});