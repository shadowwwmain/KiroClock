// Visual effects and animations for Shadow Kiro Clock

// Notification system
Object.assign(ShadowKiroClock.prototype, {
    
    showNotification(message, type = 'success') {
        const container = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        container.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (container.contains(notification)) {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (container.contains(notification)) {
                        container.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }
});

// Click particle effects
function createClickParticle(x, y) {
    const colors = ['#00ffff', '#ff00ff', '#ffff00'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x + (Math.random() - 0.5) * 20}px;
            top: ${y + (Math.random() - 0.5) * 20}px;
            width: ${Math.random() * 6 + 2}px;
            height: ${Math.random() * 6 + 2}px;
            background: ${color};
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            animation: particleExplosion ${Math.random() * 0.5 + 0.5}s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        setTimeout(() => {
            if (document.body.contains(particle)) {
                document.body.removeChild(particle);
            }
        }, 1000);
    }
}

// Add particle animation styles
function addParticleStyles() {
    if (!document.getElementById('particleStyles')) {
        const style = document.createElement('style');
        style.id = 'particleStyles';
        style.textContent = `
            @keyframes particleExplosion {
                0% {
                    transform: scale(1) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: scale(0) rotate(360deg) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
                    opacity: 0;
                }
            }
            
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addParticleStyles();
    
    // Add click particle effects
    document.addEventListener('click', (e) => {
        // Skip if clicking on buttons or interactive elements
        if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return;
        
        createClickParticle(e.clientX, e.clientY);
    });
    
    // Add hover effects to buttons
    document.querySelectorAll('.neon-button').forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
    });
});