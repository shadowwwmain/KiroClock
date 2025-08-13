// Screenshot functionality for Shadow Kiro Clock

Object.assign(ShadowKiroClock.prototype, {
    
    async takeScreenshot() {
        try {
            this.showNotification('Preparing screenshot...', 'success');
            
            // Create a temporary container for screenshot
            const screenshotContainer = document.createElement('div');
            screenshotContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 1920px;
                height: 1080px;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a0a2e 50%, #0a0a0a 100%);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-family: 'Orbitron', monospace;
                color: white;
                overflow: hidden;
            `;
            
            // Add cosmic background
            const cosmicBg = document.createElement('div');
            cosmicBg.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: 
                    radial-gradient(ellipse at 20% 50%, rgba(120, 0, 255, 0.15) 0%, transparent 70%),
                    radial-gradient(ellipse at 80% 20%, rgba(255, 0, 150, 0.12) 0%, transparent 70%),
                    radial-gradient(ellipse at 40% 80%, rgba(0, 150, 255, 0.1) 0%, transparent 70%);
            `;
            screenshotContainer.appendChild(cosmicBg);
            
            // Add stars
            for (let i = 0; i < 100; i++) {
                const star = document.createElement('div');
                star.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 3 + 1}px;
                    height: ${Math.random() * 3 + 1}px;
                    background: white;
                    border-radius: 50%;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    opacity: ${Math.random() * 0.8 + 0.2};
                `;
                screenshotContainer.appendChild(star);
            }
            
            // Add title
            const title = document.createElement('h1');
            title.textContent = 'SHADOW KIRO CLOCK';
            title.style.cssText = `
                font-size: 4rem;
                font-weight: 900;
                color: #8a2be2;
                text-shadow: 0 0 30px rgba(138, 43, 226, 0.8);
                margin-bottom: 2rem;
                letter-spacing: 0.3em;
                z-index: 10;
                position: relative;
            `;
            screenshotContainer.appendChild(title);
            
            // Add countdown display
            const countdownDisplay = document.createElement('div');
            const currentTime = `${this.hoursElement.textContent}:${this.minutesElement.textContent}:${this.secondsElement.textContent}`;
            countdownDisplay.textContent = currentTime;
            countdownDisplay.style.cssText = `
                font-size: 8rem;
                font-weight: 900;
                color: #00ffff;
                text-shadow: 0 0 40px rgba(0, 255, 255, 0.8);
                margin-bottom: 1rem;
                z-index: 10;
                position: relative;
            `;
            screenshotContainer.appendChild(countdownDisplay);
            
            // Add labels
            const labels = document.createElement('div');
            labels.textContent = 'HOURS : MINUTES : SECONDS';
            labels.style.cssText = `
                font-size: 1.5rem;
                color: rgba(255, 255, 255, 0.7);
                letter-spacing: 0.3em;
                margin-bottom: 3rem;
                z-index: 10;
                position: relative;
            `;
            screenshotContainer.appendChild(labels);
            
            // Add subtitle
            const subtitle = document.createElement('p');
            subtitle.textContent = 'Countdown to Kiro\'s Midnight Zone';
            subtitle.style.cssText = `
                font-size: 1.8rem;
                color: rgba(255, 255, 255, 0.8);
                letter-spacing: 0.2em;
                margin-bottom: 2rem;
                z-index: 10;
                position: relative;
            `;
            screenshotContainer.appendChild(subtitle);
            
            // Add timestamp
            const timestamp = document.createElement('div');
            timestamp.style.cssText = `
                position: absolute;
                bottom: 40px;
                right: 40px;
                font-size: 1.2rem;
                color: rgba(255, 255, 255, 0.6);
                z-index: 10;
            `;
            timestamp.textContent = `Screenshot: ${new Date().toLocaleString()}`;
            screenshotContainer.appendChild(timestamp);
            
            // Add URL
            const urlDisplay = document.createElement('div');
            urlDisplay.style.cssText = `
                position: absolute;
                bottom: 40px;
                left: 40px;
                font-size: 1rem;
                color: rgba(0, 255, 255, 0.8);
                z-index: 10;
            `;
            urlDisplay.textContent = window.location.href;
            screenshotContainer.appendChild(urlDisplay);
            
            document.body.appendChild(screenshotContainer);
            
            // Use html2canvas if available, otherwise use canvas API
            if (typeof html2canvas !== 'undefined') {
                const canvas = await html2canvas(screenshotContainer, {
                    backgroundColor: '#0a0a0a',
                    width: 1920,
                    height: 1080,
                    scale: 1
                });
                this.downloadCanvas(canvas, 'shadow-kiro-clock-screenshot.png');
            } else {
                // Fallback: create canvas manually
                this.createCanvasScreenshot();
            }
            
            // Remove temporary container
            document.body.removeChild(screenshotContainer);
            
            // Show success feedback
            this.showNotification('Screenshot saved successfully!', 'success');
            
        } catch (error) {
            console.error('Screenshot failed:', error);
            this.showNotification('Screenshot failed', 'error');
        }
    },
    
    createCanvasScreenshot() {
        const canvas = this.screenshotCanvas;
        const ctx = canvas.getContext('2d');
        
        canvas.width = 1920;
        canvas.height = 1080;
        
        // Fill background with gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.5, '#1a0a2e');
        gradient.addColorStop(1, '#0a0a0a');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Add stars pattern
        ctx.fillStyle = 'white';
        for (let i = 0; i < 200; i++) {
            const x = Math.random() * canvas.width;
            const y = Math.random() * canvas.height;
            const size = Math.random() * 3 + 1;
            ctx.globalAlpha = Math.random() * 0.8 + 0.2;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
        
        // Add title
        ctx.fillStyle = '#8a2be2';
        ctx.font = 'bold 64px Orbitron, monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(138, 43, 226, 0.8)';
        ctx.shadowBlur = 30;
        ctx.fillText('SHADOW KIRO CLOCK', canvas.width / 2, 200);
        
        // Add countdown values
        const hours = this.hoursElement.textContent;
        const minutes = this.minutesElement.textContent;
        const seconds = this.secondsElement.textContent;
        
        ctx.font = 'bold 128px Orbitron, monospace';
        ctx.fillStyle = '#00ffff';
        ctx.shadowBlur = 40;
        
        const timeText = `${hours}:${minutes}:${seconds}`;
        ctx.fillText(timeText, canvas.width / 2, canvas.height / 2);
        
        // Add labels
        ctx.font = '24px Orbitron, monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.shadowBlur = 0;
        ctx.fillText('HOURS : MINUTES : SECONDS', canvas.width / 2, canvas.height / 2 + 80);
        
        // Add subtitle
        ctx.font = '28px Orbitron, monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillText('Countdown to Kiro\'s Midnight Zone', canvas.width / 2, canvas.height / 2 + 150);
        
        // Add timestamp
        ctx.font = '20px Orbitron, monospace';
        ctx.textAlign = 'right';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.fillText(`Screenshot: ${new Date().toLocaleString()}`, canvas.width - 40, canvas.height - 40);
        
        // Add URL
        ctx.textAlign = 'left';
        ctx.fillStyle = 'rgba(0, 255, 255, 0.8)';
        ctx.fillText(window.location.href, 40, canvas.height - 40);
        
        this.downloadCanvas(canvas, 'shadow-kiro-clock-screenshot.png');
    },
    
    downloadCanvas(canvas, filename) {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }
});