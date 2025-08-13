// Main application initialization

// Initialize Shadow Kiro Clock when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Create the main countdown instance
    window.shadowKiroClock = new ShadowKiroClock();

    // Add some additional interactive features
    initializeAdvancedFeatures();
});

function initializeAdvancedFeatures() {
    // Add smooth scrolling for any internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add keyboard shortcuts info
    document.addEventListener('keydown', (e) => {
        if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
            showKeyboardShortcuts();
        }
    });

    // Performance monitoring
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log(`Page loaded in ${Math.round(perfData.loadEventEnd - perfData.fetchStart)}ms`);
            }, 0);
        });
    }

    // Add visibility change handling
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            console.log('Countdown paused (tab hidden)');
        } else {
            console.log('Countdown resumed (tab visible)');
            // Force update when tab becomes visible again
            if (window.shadowKiroClock && window.shadowKiroClock.timeCalculator) {
                // Force an immediate update through the time calculator
                window.shadowKiroClock.timeCalculator.notifyCallbacks();
            }
        }
    });
}

function showKeyboardShortcuts() {
    const shortcuts = [
        '+ or = : Zoom In',
        '- : Zoom Out',
        '0 : Reset Zoom',
        'Ctrl+S : Take Screenshot',
        'Ctrl+F : Toggle Fullscreen',
        'Escape : Exit Fullscreen',
        '? : Show this help'
    ];

    if (window.shadowKiroClock) {
        window.shadowKiroClock.showNotification(
            'Shadow Commands:\n' + shortcuts.join('\n'),
            'success'
        );
    }
}

// Global error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    if (window.shadowKiroClock) {
        window.shadowKiroClock.showNotification('Shadow Error Detected', 'error');
    }
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}