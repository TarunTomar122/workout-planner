// Main application logic for the workout planner
class WorkoutPlannerApp {
    constructor() {
        this.currentWorkout = [];
        this.completedExercises = new Set();
        this.initializeApp();
    }

    initializeApp() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupApp());
        } else {
            this.setupApp();
        }
    }

    setupApp() {
        // Get DOM elements
        this.workoutPlanEl = document.getElementById('workoutPlan');
        this.generatePlanBtn = document.getElementById('generatePlan');
        this.exerciseCountSelect = document.getElementById('exerciseCount');

        // Bind events
        this.bindEvents();

        // Generate initial workout plan
        this.generateWorkoutPlan();
    }

    bindEvents() {
        // Generate new plan button
        this.generatePlanBtn.addEventListener('click', () => {
            this.generateWorkoutPlan();
        });

        // Exercise count change
        this.exerciseCountSelect.addEventListener('change', () => {
            this.generateWorkoutPlan();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts when timer modal is not open
            if (window.timer && !window.timer.isActive()) {
                switch(e.key) {
                    case 'g':
                    case 'G':
                        if (!e.ctrlKey && !e.metaKey) {
                            e.preventDefault();
                            this.generateWorkoutPlan();
                        }
                        break;
                    case 'c':
                    case 'C':
                        if (!e.ctrlKey && !e.metaKey) {
                            e.preventDefault();
                            this.completeAllExercises();
                        }
                        break;
                }
            }
        });
    }

    generateWorkoutPlan() {
        const exerciseCount = parseInt(this.exerciseCountSelect.value);
        
        // Generate balanced workout
        this.currentWorkout = exerciseManager.generateBalancedWorkout(exerciseCount);
        this.completedExercises.clear();
        
        // Render the workout plan
        this.renderWorkoutPlan();
        
        // Add generation animation
        this.animateWorkoutGeneration();
    }

    renderWorkoutPlan() {
        if (this.currentWorkout.length === 0) {
            this.renderEmptyState();
            return;
        }

        const workoutHTML = this.currentWorkout.map(exercise => this.createExerciseCard(exercise)).join('');
        this.workoutPlanEl.innerHTML = workoutHTML;
        
        // Bind exercise-specific events
        this.bindExerciseEvents();
    }

    createExerciseCard(exercise) {
        const isCompleted = this.completedExercises.has(exercise.id);
        const completedClass = isCompleted ? 'completed' : '';
        
        return `
            <div class="exercise-card ${completedClass}" data-exercise-id="${exercise.id}">
                <div class="exercise-title-row">
                    <h3>${exercise.name}</h3>
                    <span class="muscle-group">${exercise.muscleGroup}</span>
                </div>
                <div class="exercise-image">
                    ${exercise.image ? `<img src="${exercise.image}" alt="${exercise.name}" />` : exercise.icon}
                </div>
                <div class="exercise-description">
                    ${exercise.description}
                </div>
                <div class="exercise-details">
                    <p><strong>Sets:</strong> ${exercise.sets}</p>
                    <p><strong>Tip:</strong> ${exercise.tips}</p>
                </div>
                <div class="exercise-actions">
                    <button class="btn-timer" data-exercise-id="${exercise.id}">
                        ⏱️ Start Timer
                    </button>
                    <button class="btn-complete" data-exercise-id="${exercise.id}" ${isCompleted ? 'disabled' : ''}>
                        ${isCompleted ? '✅ Completed' : '✅ Mark Complete'}
                    </button>
                </div>
            </div>
        `;
    }

    bindExerciseEvents() {
        // Timer buttons
        const timerButtons = document.querySelectorAll('.btn-timer');
        timerButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exerciseId = e.target.dataset.exerciseId;
                const exercise = exerciseManager.getExerciseById(exerciseId);
                if (exercise && window.timer) {
                    window.timer.open(exercise);
                }
            });
        });

        // Complete buttons
        const completeButtons = document.querySelectorAll('.btn-complete');
        completeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const exerciseId = e.target.dataset.exerciseId;
                this.markExerciseCompleted(exerciseId);
            });
        });
    }

    markExerciseCompleted(exerciseId) {
        if (this.completedExercises.has(exerciseId)) return;
        
        this.completedExercises.add(exerciseId);
        
        // Update UI
        const exerciseCard = document.querySelector(`[data-exercise-id="${exerciseId}"]`);
        if (exerciseCard) {
            exerciseCard.classList.add('completed');
            
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

        // Check if workout is complete
        this.checkWorkoutCompletion();
        
        // Add completion animation
        this.animateExerciseCompletion(exerciseCard);
    }

    checkWorkoutCompletion() {
        if (this.completedExercises.size === this.currentWorkout.length && this.currentWorkout.length > 0) {
            // All exercises completed
            setTimeout(() => {
                this.showWorkoutCompletionDialog();
            }, 500);
        }
    }

    showWorkoutCompletionDialog() {
        if (window.statsManager) {
            window.statsManager.completeWorkout(this.currentWorkout);
        }

        // Show celebration
        this.showCelebration();
    }

    showCelebration() {
        // Create celebration overlay
        const celebration = document.createElement('div');
        celebration.className = 'celebration-overlay';
        celebration.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-emoji">🎉</div>
                <h2>Amazing Work!</h2>
                <p>You've completed your entire workout!</p>
                <div class="celebration-stats">
                    <span>${this.currentWorkout.length} exercises completed</span>
                </div>
                <button class="btn-primary" onclick="this.parentElement.parentElement.remove()">
                    Continue
                </button>
            </div>
        `;

        document.body.appendChild(celebration);
        this.addCelebrationStyles();

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (celebration.parentElement) {
                celebration.remove();
            }
        }, 5000);
    }

    addCelebrationStyles() {
        if (document.getElementById('celebration-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'celebration-styles';
        style.textContent = `
            .celebration-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            }
            
            .celebration-content {
                background: white;
                padding: 40px;
                border-radius: 16px;
                text-align: center;
                max-width: 400px;
                animation: slideIn 0.5s ease;
            }
            
            .celebration-emoji {
                font-size: 4rem;
                margin-bottom: 20px;
                animation: bounce 1s infinite;
            }
            
            .celebration-content h2 {
                color: #333;
                margin-bottom: 10px;
                font-size: 1.8rem;
            }
            
            .celebration-content p {
                color: #666;
                margin-bottom: 20px;
            }
            
            .celebration-stats {
                background: #fd79a8;
                color: white;
                padding: 10px 20px;
                border-radius: 12px;
                margin-bottom: 25px;
                font-weight: 600;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @keyframes bounce {
                0%, 20%, 60%, 100% { transform: translateY(0); }
                40% { transform: translateY(-20px); }
                80% { transform: translateY(-10px); }
            }
        `;
        document.head.appendChild(style);
    }

    completeAllExercises() {
        if (this.currentWorkout.length === 0) return;
        
        if (confirm('Mark all exercises as completed?')) {
            this.currentWorkout.forEach(exercise => {
                this.markExerciseCompleted(exercise.id);
            });
        }
    }

    animateWorkoutGeneration() {
        this.generatePlanBtn.classList.add('generating');
        this.generatePlanBtn.textContent = '🎲 Generating...';
        
        setTimeout(() => {
            this.generatePlanBtn.classList.remove('generating');
            this.generatePlanBtn.textContent = '🎲 Generate New Plan';
        }, 1000);
    }

    animateExerciseCompletion(exerciseCard) {
        if (!exerciseCard) return;
        
        // Add completion animation
        exerciseCard.style.transform = 'scale(1.05)';
        exerciseCard.style.transition = 'all 0.3s ease';
        
        setTimeout(() => {
            exerciseCard.style.transform = 'scale(1)';
        }, 300);
    }

    renderEmptyState() {
        this.workoutPlanEl.innerHTML = `
            <div class="empty-state">
                <h3>No exercises available</h3>
                <p>Please check your exercise database.</p>
            </div>
        `;
    }

    // Public methods for external access
    getCurrentWorkout() {
        return this.currentWorkout;
    }

    getCompletedExercises() {
        return Array.from(this.completedExercises);
    }

    getWorkoutProgress() {
        return {
            total: this.currentWorkout.length,
            completed: this.completedExercises.size,
            percentage: this.currentWorkout.length > 0 
                ? Math.round((this.completedExercises.size / this.currentWorkout.length) * 100)
                : 0
        };
    }
}

// Add styles for generating button state
const appStyle = document.createElement('style');
appStyle.textContent = `
    .btn-primary.generating {
        opacity: 0.7;
        pointer-events: none;
        animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .exercise-details {
        margin-bottom: 20px;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 10px;
        border-left: 4px solid #fd79a8;
    }
    
    .exercise-details p {
        margin: 6px 0;
        font-size: 14px;
        color: #636e72;
    }
    
    .exercise-details strong {
        color: #2d3436;
    }
`;
document.head.appendChild(appStyle);

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    window.workoutApp = new WorkoutPlannerApp();
    
    // Add global keyboard shortcut hints
    console.log('🏋️ Structured Workout Planner Ready!');
    console.log('💡 Workout Categories: Push Day, Pull Day, Leg Day, Full Body, At Home');
    console.log('⌨️  Shortcuts:');
    console.log('   G - Generate new workout plan');
    console.log('   C - Complete all exercises');
    console.log('   Space - Start/pause timer (when timer is open)');
    console.log('   Escape - Close timer modal');
    console.log('   R - Reset timer (when timer is open)');
}); 