// Timer functionality for exercises
class Timer {
    constructor() {
        this.timeRemaining = 30; // Default 30 seconds
        this.originalTime = 30;
        this.isRunning = false;
        this.timerInterval = null;
        this.currentExercise = null;
        
        this.initializeTimer();
    }

    initializeTimer() {
        // Get timer elements
        this.modal = document.getElementById('timerModal');
        this.timeDisplay = document.getElementById('timerTime');
        this.exerciseNameEl = document.getElementById('timerExerciseName');
        this.startBtn = document.getElementById('timerStart');
        this.pauseBtn = document.getElementById('timerPause');
        this.resetBtn = document.getElementById('timerReset');
        this.closeBtn = document.getElementById('closeTimer');
        this.completeBtn = document.getElementById('completeExercise');
        this.presetBtns = document.querySelectorAll('.preset-btn');

        this.bindEvents();
        this.updateDisplay();
    }

    bindEvents() {
        // Timer control buttons
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.closeBtn.addEventListener('click', () => this.close());
        this.completeBtn.addEventListener('click', () => this.complete());

        // Preset time buttons
        this.presetBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const time = parseInt(e.target.dataset.time);
                this.setTime(time);
            });
        });

        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.modal.style.display === 'block') {
                switch(e.key) {
                    case ' ':
                    case 'Spacebar':
                        e.preventDefault();
                        this.isRunning ? this.pause() : this.start();
                        break;
                    case 'Escape':
                        this.close();
                        break;
                    case 'r':
                    case 'R':
                        this.reset();
                        break;
                }
            }
        });
    }

    setTime(seconds) {
        this.timeRemaining = seconds;
        this.originalTime = seconds;
        this.updateDisplay();
        this.updatePresetButtons();
    }

    updatePresetButtons() {
        this.presetBtns.forEach(btn => {
            const time = parseInt(btn.dataset.time);
            btn.classList.toggle('active', time === this.originalTime);
        });
    }

    start() {
        if (this.timeRemaining <= 0) {
            this.reset();
        }

        this.isRunning = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;

        this.timerInterval = setInterval(() => {
            this.timeRemaining--;
            this.updateDisplay();

            if (this.timeRemaining <= 0) {
                this.complete();
            }
        }, 1000);
    }

    pause() {
        this.isRunning = false;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    reset() {
        this.pause();
        this.timeRemaining = this.originalTime;
        this.updateDisplay();
    }

    complete() {
        this.pause();
        
        // Play completion sound (if supported)
        this.playCompletionSound();
        
        // Visual feedback
        this.timeDisplay.style.color = '#4caf50';
        this.timeDisplay.textContent = 'Complete! ✅';
        
        // Mark exercise as completed if we have a reference
        if (this.currentExercise) {
            this.markExerciseCompleted(this.currentExercise.id);
        }

        // Auto-close after 2 seconds
        setTimeout(() => {
            this.close();
        }, 2000);
    }

    playCompletionSound() {
        try {
            // Create a simple beep sound using Web Audio API
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            // Fallback: vibrate if available
            if (navigator.vibrate) {
                navigator.vibrate([200, 100, 200]);
            }
        }
    }

    markExerciseCompleted(exerciseId) {
        const exerciseCard = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
        if (exerciseCard) {
            exerciseCard.classList.add('completed');
            
            // Update the complete button in the card
            const completeBtn = exerciseCard.querySelector('.btn-complete');
            if (completeBtn) {
                completeBtn.textContent = '✅ Completed';
                completeBtn.disabled = true;
            }
        }

        // Update stats
        if (window.statsManager) {
            window.statsManager.incrementExerciseCount();
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        this.timeDisplay.textContent = timeString;
        this.timeDisplay.style.color = this.timeRemaining <= 10 ? '#ff6b9d' : '';

        // Update page title when timer is running
        if (this.isRunning && this.timeRemaining > 0) {
            document.title = `${timeString} - Workout Timer`;
        } else {
            document.title = 'Daily Workout Planner ✨';
        }
    }

    open(exercise) {
        this.currentExercise = exercise;
        
        if (exercise) {
            this.exerciseNameEl.textContent = `${exercise.name} Timer`;
        } else {
            this.exerciseNameEl.textContent = 'Exercise Timer';
        }

        this.modal.style.display = 'block';
        this.reset();
        
        // Focus on start button for keyboard accessibility
        setTimeout(() => {
            this.startBtn.focus();
        }, 100);
    }

    close() {
        this.pause();
        this.modal.style.display = 'none';
        this.currentExercise = null;
        
        // Reset display color
        this.timeDisplay.style.color = '';
        
        // Reset page title
        document.title = 'Daily Workout Planner ✨';
    }

    // Public method to check if timer is active
    isActive() {
        return this.modal.style.display === 'block';
    }

    // Public method to get current time for external display
    getCurrentTime() {
        return {
            remaining: this.timeRemaining,
            original: this.originalTime,
            isRunning: this.isRunning
        };
    }
}

// Initialize timer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.timer = new Timer();
});

// Add CSS for active preset button
const style = document.createElement('style');
style.textContent = `
    .preset-btn.active {
        background: linear-gradient(135deg, #667eea, #764ba2) !important;
        color: white !important;
        border-color: #667eea !important;
    }
`;
document.head.appendChild(style); 