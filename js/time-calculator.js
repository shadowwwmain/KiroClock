// Modular UTC time calculation system for Shadow Kiro Clock

class UTCTimeCalculator {
    constructor() {
        this.updateInterval = null;
        this.callbacks = [];
    }
    
    /**
     * Get current UTC time as Date object
     */
    getCurrentUTC() {
        return new Date();
    }
    
    /**
     * Get next UTC midnight as Date object
     */
    getNextUTCMidnight() {
        const now = this.getCurrentUTC();
        const nextMidnight = new Date(now);
        
        // Set to next day at 00:00:00.000 UTC
        nextMidnight.setUTCDate(nextMidnight.getUTCDate() + 1);
        nextMidnight.setUTCHours(0, 0, 0, 0);
        
        return nextMidnight;
    }
    
    /**
     * Get today's UTC midnight (start of current UTC day)
     */
    getTodayUTCMidnight() {
        const now = this.getCurrentUTC();
        const todayMidnight = new Date(now);
        
        // Set to today at 00:00:00.000 UTC
        todayMidnight.setUTCHours(0, 0, 0, 0);
        
        return todayMidnight;
    }
    
    /**
     * Calculate milliseconds until next UTC midnight
     */
    getMillisecondsUntilMidnight() {
        const now = this.getCurrentUTC();
        const nextMidnight = this.getNextUTCMidnight();
        
        return nextMidnight.getTime() - now.getTime();
    }
    
    /**
     * Convert milliseconds to HH:MM:SS format
     */
    millisecondsToHMS(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return {
            hours: hours.toString().padStart(2, '0'),
            minutes: minutes.toString().padStart(2, '0'),
            seconds: seconds.toString().padStart(2, '0'),
            totalSeconds: totalSeconds
        };
    }
    
    /**
     * Calculate percentage of UTC day that has passed (0-100)
     */
    getUTCDayProgress() {
        const now = this.getCurrentUTC();
        const todayMidnight = this.getTodayUTCMidnight();
        const nextMidnight = this.getNextUTCMidnight();
        
        const totalDayMs = nextMidnight.getTime() - todayMidnight.getTime();
        const elapsedMs = now.getTime() - todayMidnight.getTime();
        
        return (elapsedMs / totalDayMs) * 100;
    }
    
    /**
     * Get comprehensive time data for the countdown
     */
    getCountdownData() {
        const now = this.getCurrentUTC();
        const nextMidnight = this.getNextUTCMidnight();
        const msUntilMidnight = this.getMillisecondsUntilMidnight();
        const timeData = this.millisecondsToHMS(msUntilMidnight);
        const dayProgress = this.getUTCDayProgress();
        
        return {
            currentUTC: now,
            nextMidnight: nextMidnight,
            millisecondsRemaining: msUntilMidnight,
            timeRemaining: {
                hours: timeData.hours,
                minutes: timeData.minutes,
                seconds: timeData.seconds,
                totalSeconds: timeData.totalSeconds
            },
            dayProgress: dayProgress,
            formattedTimes: {
                currentUTC: now.toUTCString().split(' ')[4] || '00:00:00',
                nextMidnight: '00:00:00',
                currentLocal: now.toLocaleTimeString(),
                currentDate: now.toDateString()
            }
        };
    }
    
    /**
     * Register a callback to be called on each update
     */
    onUpdate(callback) {
        this.callbacks.push(callback);
    }
    
    /**
     * Start the countdown timer
     */
    start() {
        // Initial update
        this.notifyCallbacks();
        
        // Update every second
        this.updateInterval = setInterval(() => {
            this.notifyCallbacks();
        }, 1000);
    }
    
    /**
     * Stop the countdown timer
     */
    stop() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    
    /**
     * Notify all registered callbacks with current countdown data
     */
    notifyCallbacks() {
        const data = this.getCountdownData();
        this.callbacks.forEach(callback => {
            try {
                callback(data);
            } catch (error) {
                console.error('Error in countdown callback:', error);
            }
        });
    }
    
    /**
     * Check if it's currently UTC midnight (within 1 second)
     */
    isUTCMidnight() {
        const msUntilMidnight = this.getMillisecondsUntilMidnight();
        return msUntilMidnight < 1000; // Less than 1 second until midnight
    }
    
    /**
     * Get timezone information
     */
    getTimezoneInfo() {
        const now = new Date();
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const offset = now.getTimezoneOffset();
        const offsetHours = Math.floor(Math.abs(offset) / 60);
        const offsetMinutes = Math.abs(offset) % 60;
        const offsetSign = offset <= 0 ? '+' : '-';
        const offsetString = `UTC${offsetSign}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
        
        return {
            timezone: timezone,
            offset: offsetString,
            offsetMinutes: offset
        };
    }
}

// Export for use in other modules
window.UTCTimeCalculator = UTCTimeCalculator;