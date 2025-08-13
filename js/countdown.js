class ShadowKiroClock {
    constructor() {
        // DOM Elements
        this.clockContainer = document.getElementById('clockContainer');
        this.hoursElement = document.getElementById('hours');
        this.minutesElement = document.getElementById('minutes');
        this.secondsElement = document.getElementById('seconds');
        this.currentUtcElement = document.getElementById('currentUtc');
        this.localTimeElement = document.getElementById('localTime');
        this.nextMidnightElement = document.getElementById('nextMidnight');
        this.timeZoneElement = document.getElementById('timeZone');
        this.totalSecondsElement = document.getElementById('totalSeconds');
        this.currentDateElement = document.getElementById('currentDate');
        this.dayProgressElement = document.getElementById('dayProgress');
        this.footerTimezoneElement = document.getElementById('footerTimezone');
        this.screenshotCanvas = document.getElementById('screenshotCanvas');

        // Progress bars
        this.hoursProgressElement = document.getElementById('hoursProgress');
        this.minutesProgressElement = document.getElementById('minutesProgress');
        this.secondsProgressElement = document.getElementById('secondsProgress');

        // State
        this.zoomLevel = 1;
        this.minZoom = 0.5;
        this.maxZoom = 3;
        this.zoomStep = 0.1;
        this.currentTheme = 'shadow';
        this.isFullscreen = false;

        this.previousValues = { hours: null, minutes: null, seconds: null };

        this.initializeApp();
    }

    initializeApp() {
        // Initialize the UTC time calculator
        this.timeCalculator = new UTCTimeCalculator();
        
        // Register this instance to receive time updates
        this.timeCalculator.onUpdate((data) => this.updateCountdown(data));
        
        this.initializeEventListeners();
        this.initializeFloatingParticles();
        this.updateTimezoneInfo();
        this.startCountdown();
        this.showNotification('Shadow Kiro Clock Activated', 'success');
    }

    initializeEventListeners() {
        // Zoom controls
        document.getElementById('zoomInBtn').addEventListener('click', () => this.zoomIn());
        document.getElementById('zoomOutBtn').addEventListener('click', () => this.zoomOut());
        document.getElementById('resetZoomBtn').addEventListener('click', () => this.resetZoom());

        // Action buttons
        document.getElementById('screenshotBtn').addEventListener('click', () => this.takeScreenshot());
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
        document.getElementById('shareBtn').addEventListener('click', () => this.shareCountdown());

        // Theme buttons
        document.getElementById('shadowTheme').addEventListener('click', () => this.setTheme('shadow'));
        document.getElementById('kiroTheme').addEventListener('click', () => this.setTheme('kiro'));
        document.getElementById('voidTheme').addEventListener('click', () => this.setTheme('void'));

        // Discord profile click
        document.getElementById('discordProfile').addEventListener('click', () => this.showDiscordId());

        // Mouse wheel zoom
        this.clockContainer.addEventListener('wheel', (e) => {
            e.preventDefault();
            if (e.deltaY < 0) {
                this.zoomIn();
            } else {
                this.zoomOut();
            }
        });

        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case '+':
                case '=':
                    this.zoomIn();
                    break;
                case '-':
                    this.zoomOut();
                    break;
                case '0':
                    this.resetZoom();
                    break;
                case 's':
                case 'S':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.takeScreenshot();
                    }
                    break;
                case 'f':
                case 'F':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleFullscreen();
                    }
                    break;
                case 'Escape':
                    if (this.isFullscreen) {
                        this.toggleFullscreen();
                    }
                    break;
            }
        });

        // Fullscreen change event
        document.addEventListener('fullscreenchange', () => {
            this.isFullscreen = !!document.fullscreenElement;
            this.updateFullscreenButton();
        });
    }

    startCountdown() {
        // Start the modular time calculator
        this.timeCalculator.start();
    }

    updateCountdown(data) {
        // If no data provided, get it from the time calculator
        if (!data && this.timeCalculator) {
            data = this.timeCalculator.getCountdownData();
        }
        
        // If still no data, return early to prevent errors
        if (!data || !data.formattedTimes) {
            console.warn('No countdown data available');
            return;
        }
        
        // Update time displays using precise UTC calculations
        this.currentUtcElement.textContent = data.formattedTimes.currentUTC;
        this.localTimeElement.textContent = data.formattedTimes.currentLocal;
        this.nextMidnightElement.textContent = data.formattedTimes.nextMidnight;
        this.currentDateElement.textContent = data.formattedTimes.currentDate;
        
        // Update main countdown display with animation
        this.updateTimeValue(this.hoursElement, data.timeRemaining.hours, 'hours');
        this.updateTimeValue(this.minutesElement, data.timeRemaining.minutes, 'minutes');
        this.updateTimeValue(this.secondsElement, data.timeRemaining.seconds, 'seconds');
        
        // Update progress bars
        this.updateProgressBars(
            parseInt(data.timeRemaining.hours),
            parseInt(data.timeRemaining.minutes),
            parseInt(data.timeRemaining.seconds)
        );
        
        // Update additional info
        this.totalSecondsElement.textContent = data.timeRemaining.totalSeconds.toLocaleString();
        this.dayProgressElement.textContent = `${data.dayProgress.toFixed(1)}%`;
        
        // Store current values for next comparison
        this.previousValues = {
            hours: data.timeRemaining.hours,
            minutes: data.timeRemaining.minutes,
            seconds: data.timeRemaining.seconds
        };
        
        // Check if countdown reached zero (midnight UTC)
        if (this.timeCalculator.isUTCMidnight()) {
            this.celebrateMidnight();
        }
    }

    updateTimeValue(element, newValue, type) {
        if (this.previousValues[type] !== null && this.previousValues[type] !== newValue) {
            element.classList.add('changing');
            setTimeout(() => element.classList.remove('changing'), 500);
        }
        element.textContent = newValue;
    }

    updateProgressBars(hours, minutes, seconds) {
        // Calculate progress percentages
        const hoursProgress = ((23 - hours) / 23) * 100;
        const minutesProgress = ((59 - minutes) / 59) * 100;
        const secondsProgress = ((59 - seconds) / 59) * 100;

        this.hoursProgressElement.style.width = `${hoursProgress}%`;
        this.minutesProgressElement.style.width = `${minutesProgress}%`;
        this.secondsProgressElement.style.width = `${secondsProgress}%`;
    }

    celebrateMidnight() {
        // Add celebration effect
        document.body.style.animation = 'celebrationFlash 2s ease-in-out';
        setTimeout(() => {
            document.body.style.animation = '';
        }, 2000);

        // Add celebration CSS if not already added
        if (!document.getElementById('celebrationStyles')) {
            const style = document.createElement('style');
            style.id = 'celebrationStyles';
            style.textContent = `
                @keyframes celebrationFlash {
                    0%, 100% { background-color: #0a0a0a; }
                    25% { background-color: rgba(0, 255, 255, 0.1); }
                    50% { background-color: rgba(255, 0, 255, 0.1); }
                    75% { background-color: rgba(255, 255, 0, 0.1); }
                }
            `;
            document.head.appendChild(style);
        }

        this.showNotification('🌙 Kiro\'s Shadow Hour Has Arrived! 🌙', 'success');
    }

    initializeFloatingParticles() {
        const particlesContainer = document.getElementById('floatingParticles');

        // Create floating particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    updateTimezoneInfo() {
        const timezoneInfo = this.timeCalculator.getTimezoneInfo();
        this.timeZoneElement.textContent = timezoneInfo.timezone;
        this.footerTimezoneElement.textContent = timezoneInfo.offset;
    }
}