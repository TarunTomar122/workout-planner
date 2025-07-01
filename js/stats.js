// Statistics management for tracking workout progress
class StatsManager {
    constructor() {
        this.storageKey = 'workoutPlannerStats';
        this.stats = this.loadStats();
        this.initializeStats();
    }

    initializeStats() {
        // Get stat display elements
        this.totalWorkoutsEl = document.getElementById('totalWorkouts');
        this.totalExercisesEl = document.getElementById('totalExercises');
        
        this.updateDisplay();
    }

    // Load stats from localStorage
    loadStats() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.warn('Failed to load stats from localStorage:', error);
        }
        
        return this.getDefaultStats();
    }

    // Get default stats structure
    getDefaultStats() {
        return {
            totalWorkouts: 0,
            totalExercises: 0,
            completedExercises: [],
            workoutHistory: [],
            streakDays: 0,
            lastWorkoutDate: null,
            personalRecords: {},
            createdAt: new Date().toISOString()
        };
    }

    // Save stats to localStorage
    saveStats() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.stats));
        } catch (error) {
            console.warn('Failed to save stats to localStorage:', error);
        }
    }

    // Update the display elements
    updateDisplay() {
        if (this.totalWorkoutsEl) {
            this.totalWorkoutsEl.textContent = this.stats.totalWorkouts.toLocaleString();
        }
        if (this.totalExercisesEl) {
            this.totalExercisesEl.textContent = this.stats.totalExercises.toLocaleString();
        }
    }

    // Increment exercise count
    incrementExerciseCount() {
        this.stats.totalExercises++;
        this.saveStats();
        this.updateDisplay();
        
        // Add animation to the counter
        this.animateCounter(this.totalExercisesEl);
    }

    // Complete a workout
    completeWorkout(exercises) {
        this.stats.totalWorkouts++;
        
        // Record workout in history
        const workout = {
            date: new Date().toISOString(),
            exercises: exercises.map(ex => ({
                id: ex.id,
                name: ex.name,
                muscleGroup: ex.muscleGroup
            })),
            exerciseCount: exercises.length
        };
        
        this.stats.workoutHistory.push(workout);
        
        // Update streak
        this.updateStreak();
        
        this.saveStats();
        this.updateDisplay();
        
        // Add animation to the counter
        this.animateCounter(this.totalWorkoutsEl);
        
        // Show completion message
        this.showWorkoutComplete(exercises.length);
    }

    // Update workout streak
    updateStreak() {
        const today = new Date();
        const todayString = today.toDateString();
        
        if (this.stats.lastWorkoutDate) {
            const lastWorkout = new Date(this.stats.lastWorkoutDate);
            const daysDiff = Math.floor((today - lastWorkout) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === 1) {
                // Consecutive day
                this.stats.streakDays++;
            } else if (daysDiff > 1) {
                // Streak broken
                this.stats.streakDays = 1;
            }
            // If daysDiff === 0, it's the same day, don't update streak
        } else {
            // First workout
            this.stats.streakDays = 1;
        }
        
        this.stats.lastWorkoutDate = today.toISOString();
    }

    // Mark individual exercise as completed
    markExerciseCompleted(exerciseId) {
        const today = new Date().toDateString();
        const completionRecord = {
            exerciseId,
            date: today,
            timestamp: new Date().toISOString()
        };
        
        this.stats.completedExercises.push(completionRecord);
        this.incrementExerciseCount();
    }

    // Animate counter when value changes
    animateCounter(element) {
        element.style.transform = 'scale(1.2)';
        element.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 300);
    }

    // Show workout completion message
    showWorkoutComplete(exerciseCount) {
        // Create completion toast
        const toast = document.createElement('div');
        toast.className = 'completion-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">🎉</div>
                <div class="toast-text">
                    <h4>Workout Complete!</h4>
                    <p>Completed ${exerciseCount} exercises</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Add styles for toast
        this.addToastStyles();
        
        // Show toast with animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // Add styles for completion toast
    addToastStyles() {
        if (document.getElementById('toast-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .completion-toast {
                position: fixed;
                top: -100px;
                left: 50%;
                transform: translateX(-50%);
                background: linear-gradient(135deg, #4caf50, #45a049);
                color: white;
                padding: 15px 25px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(76, 175, 80, 0.3);
                z-index: 10000;
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                backdrop-filter: blur(10px);
            }
            
            .completion-toast.show {
                top: 20px;
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .toast-icon {
                font-size: 2rem;
                animation: bounce 0.6s ease;
            }
            
            .toast-text h4 {
                margin: 0;
                font-size: 1.1rem;
                font-weight: 600;
            }
            
            .toast-text p {
                margin: 0;
                font-size: 0.9rem;
                opacity: 0.9;
            }
            
            @keyframes bounce {
                0%, 20%, 60%, 100% { transform: translateY(0); }
                40% { transform: translateY(-10px); }
                80% { transform: translateY(-5px); }
            }
        `;
        document.head.appendChild(style);
    }

    // Get workout statistics
    getWorkoutStats() {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000));
        
        const recentWorkouts = this.stats.workoutHistory.filter(workout => 
            new Date(workout.date) >= thirtyDaysAgo
        );
        
        const muscleGroupCounts = {};
        this.stats.workoutHistory.forEach(workout => {
            workout.exercises.forEach(exercise => {
                muscleGroupCounts[exercise.muscleGroup] = 
                    (muscleGroupCounts[exercise.muscleGroup] || 0) + 1;
            });
        });
        
        return {
            totalWorkouts: this.stats.totalWorkouts,
            totalExercises: this.stats.totalExercises,
            streakDays: this.stats.streakDays,
            recentWorkouts: recentWorkouts.length,
            favoriteMuscleFroup: Object.keys(muscleGroupCounts).reduce((a, b) => 
                muscleGroupCounts[a] > muscleGroupCounts[b] ? a : b, 'none'
            ),
            muscleGroupCounts
        };
    }

    // Check if exercise was completed today
    isExerciseCompletedToday(exerciseId) {
        const today = new Date().toDateString();
        return this.stats.completedExercises.some(record => 
            record.exerciseId === exerciseId && 
            new Date(record.timestamp).toDateString() === today
        );
    }

    // Get completion percentage for current workout
    getWorkoutCompletionPercentage(totalExercises, completedExercises) {
        if (totalExercises === 0) return 0;
        return Math.round((completedExercises / totalExercises) * 100);
    }

    // Export stats for backup
    exportStats() {
        return JSON.stringify(this.stats, null, 2);
    }

    // Import stats from backup
    importStats(statsJson) {
        try {
            const importedStats = JSON.parse(statsJson);
            this.stats = { ...this.getDefaultStats(), ...importedStats };
            this.saveStats();
            this.updateDisplay();
            return true;
        } catch (error) {
            console.error('Failed to import stats:', error);
            return false;
        }
    }

    // Reset all stats
    resetStats() {
        if (confirm('Are you sure you want to reset all statistics? This action cannot be undone.')) {
            this.stats = this.getDefaultStats();
            this.saveStats();
            this.updateDisplay();
            return true;
        }
        return false;
    }
}

// Initialize stats manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.statsManager = new StatsManager();
}); 