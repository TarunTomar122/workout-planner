// Exercise database with all exercises organized by muscle groups
const EXERCISES = {
    shoulders: [
        {
            id: 'shoulder-press',
            name: 'Shoulder Press',
            muscleGroup: 'shoulders',
            description: 'Sit or stand with dumbbells at shoulder height. Press weights straight up overhead, then lower back to starting position. Keep core engaged throughout the movement.',
            icon: '💪',
            image: 'images/shoulderpress.jpg',
            sets: '3 sets of 12-15 reps',
            tips: 'Keep your back straight and avoid arching. Control the weight on the way down.'
        },
        {
            id: 'dumbbell-flies',
            name: 'Dumbbell Flies',
            muscleGroup: 'shoulders',
            description: 'Stand with feet hip-width apart, hold dumbbells at sides. Lift arms out to sides until parallel to floor, then lower slowly. Keep a slight bend in elbows.',
            icon: '🦋',
            image: 'images/flies.jpg',
            sets: '3 sets of 12-15 reps',
            tips: 'Use lighter weights and focus on controlled movement. Feel the stretch at the bottom.'
        }
    ],
    chest: [
        {
            id: 'dumbbell-press-lying',
            name: 'Dumbbell Press (Lying Down)',
            muscleGroup: 'chest',
            description: 'Lie on a bench or floor with dumbbells in each hand. Press weights up from chest level, then lower slowly. Keep your feet flat on the floor.',
            icon: '🏋️',
            image: 'images/dumbbellpress.jpg',
            sets: '3 sets of 10-12 reps',
            tips: 'Keep your core tight and avoid bouncing the weights off your chest.'
        },
        {
            id: 'incline-dumbbell-press',
            name: 'Incline Dumbbell Press',
            muscleGroup: 'chest',
            description: 'Set bench to 30-45 degree incline. Lie back with dumbbells at chest level. Press weights up and slightly forward, then lower with control.',
            icon: '📐',
            image: 'images/dumbbellpress.jpg',
            sets: '3 sets of 10-12 reps',
            tips: 'Focus on squeezing your chest muscles at the top of the movement.'
        }
    ],
    triceps: [
        {
            id: 'cable-pushdowns',
            name: 'Cable Extensions Push Down',
            muscleGroup: 'triceps',
            description: 'Stand at cable machine with rope or bar attachment. Keep elbows at sides, push weight down by extending arms. Squeeze triceps at bottom.',
            icon: '🔽',
            image: 'images/cableextensionpushdown.webp',
            sets: '3 sets of 12-15 reps',
            tips: 'Keep your elbows stationary and focus on tricep isolation.'
        },
        {
            id: 'dumbbell-overhead',
            name: 'Dumbbell Overhead Extension',
            muscleGroup: 'triceps',
            description: 'Hold one dumbbell with both hands overhead. Lower weight behind your head by bending elbows, then press back up to starting position.',
            icon: '⬆️',
            image: 'images/dumbbeloverhead.webp',
            sets: '3 sets of 10-12 reps',
            tips: 'Keep elbows close to your head and control the weight throughout the movement.'
        }
    ],
    back: [
        {
            id: 'lat-pulldown',
            name: 'Lat Pulldown',
            muscleGroup: 'back',
            description: 'Sit at lat pulldown machine with wide grip. Pull bar down to upper chest while leaning slightly back. Squeeze shoulder blades together.',
            icon: '🔽',
            image: 'images/latpulldowns.webp',
            sets: '3 sets of 10-12 reps',
            tips: 'Focus on pulling with your back muscles, not your arms. Keep chest up.'
        },
        {
            id: 'rows',
            name: 'Seated Cable Rows',
            muscleGroup: 'back',
            description: 'Sit at cable row machine with feet on platform. Pull handles to your torso, squeezing shoulder blades together. Return with control.',
            icon: '🚣',
            image: 'images/cablerows.jpeg',
            sets: '3 sets of 12-15 reps',
            tips: 'Keep your back straight and pull your elbows back, focusing on squeezing your shoulder blades.'
        }
    ],
    biceps: [
        {
            id: 'bicep-curls',
            name: 'Bicep Curls',
            muscleGroup: 'biceps',
            description: 'Stand with dumbbells at your sides, palms facing forward. Curl weights up toward shoulders, then lower slowly. Keep elbows stationary.',
            icon: '💪',
            image: 'images/bicepscurls.webp',
            sets: '3 sets of 12-15 reps',
            tips: 'Avoid swinging the weights. Focus on squeezing your biceps at the top.'
        },
    ],
    legs: [
        {
            id: 'lunges',
            name: 'Lunges',
            muscleGroup: 'legs',
            description: 'Step forward with one leg, lowering your hips until both knees are bent at 90 degrees. Push back to starting position. Alternate legs.',
            icon: '🦵',
            image: 'images/lunges.jpg',
            sets: '3 sets of 12 reps each leg',
            tips: 'Keep your front knee over your ankle and your torso upright.'
        },
        {
            id: 'deadlifts',
            name: 'Deadlifts',
            muscleGroup: 'legs',
            description: 'Stand with feet hip-width apart, holding dumbbells in front of thighs. Hinge at hips, lowering weights toward floor, then return to standing.',
            icon: '🏋️',
            image: 'images/deadlift.jpeg',
            sets: '3 sets of 10-12 reps',
            tips: 'Keep the weights close to your body and maintain a straight back throughout.'
        }
    ],
    fullBody: [
        {
            id: 'dumbbell-burpees',
            name: 'Dumbbell Burpees with Shoulder Press',
            muscleGroup: 'full body',
            description: 'Hold light dumbbells, perform a burpee, then add a shoulder press at the top. Combines cardio with strength training.',
            icon: '🔥',
            image: 'images/burpees.webp',
            sets: '3 sets of 8-10 reps',
            tips: 'Use lighter weights and focus on form over speed. This is a high-intensity exercise.'
        },
        {
            id: 'weighted-squats',
            name: 'Weighted Squats',
            muscleGroup: 'full body',
            description: 'Perform squats while holding dumbbells at your shoulders or by your sides. Adds resistance to the basic squat movement.',
            icon: '🏋️',
            image: 'images/weightedsquats.webp',
            sets: '3 sets of 12-15 reps',
            tips: 'Start with lighter weights and focus on proper squat form before adding more weight.'
        },
        {
            id: 'abs-crunches',
            name: 'Abs Crunches',
            muscleGroup: 'full body',
            description: 'Lie on your back with knees bent, hands behind head. Lift your shoulders off the ground by contracting your abs. Lower slowly.',
            icon: '💪',
            image: 'images/abs.jpg',
            sets: '3 sets of 15-20 reps',
            tips: 'Focus on using your abs, not your neck. Keep your lower back pressed to the floor.'
        }
    ]
};

// Workout day categories for structured training
const WORKOUT_CATEGORIES = {
    push: {
        name: "Push Day",
        description: "Chest, Shoulders & Triceps",
        exercises: [
            'dumbbell-press-lying',
            'incline-dumbbell-press', 
            'shoulder-press',
            'dumbbell-flies',
            'cable-pushdowns',
            'dumbbell-overhead'
        ]
    },
    pull: {
        name: "Pull Day", 
        description: "Back & Biceps",
        exercises: [
            'lat-pulldown',
            'rows',
            'bicep-curls',
            'hammer-curls'
        ]
    },
    legs: {
        name: "Leg Day",
        description: "Lower Body Power",
        exercises: [
            'lunges',
            'deadlifts',
            'weighted-squats'
        ]
    },
    fullBody: {
        name: "Full Body",
        description: "High Intensity Cardio",
        exercises: [
            'dumbbell-burpees',
            'weighted-squats',
            'abs-crunches'
        ]
    },
    atHome: {
        name: "At Home",
        description: "Minimal Equipment",
        exercises: [
            'shoulder-press',
            'dumbbell-flies',
            'bicep-curls',
            'hammer-curls',
            'lunges',
            'weighted-squats',
            'abs-crunches',
            'dumbbell-overhead'
        ]
    }
};

// Utility functions for exercise management
class ExerciseManager {
    constructor() {
        this.allExercises = this.flattenExercises();
        this.workoutCategories = WORKOUT_CATEGORIES;
    }

    // Flatten exercises from grouped format to single array
    flattenExercises() {
        const flattened = [];
        Object.keys(EXERCISES).forEach(group => {
            EXERCISES[group].forEach(exercise => {
                flattened.push(exercise);
            });
        });
        return flattened;
    }

    // Get exercises by muscle group
    getExercisesByGroup(group) {
        return EXERCISES[group] || [];
    }

    // Get all muscle groups
    getMuscleGroups() {
        return Object.keys(EXERCISES);
    }

    // Get random exercise from a specific group
    getRandomExerciseFromGroup(group) {
        const exercises = this.getExercisesByGroup(group);
        if (exercises.length === 0) return null;
        return exercises[Math.floor(Math.random() * exercises.length)];
    }

    // Get random exercise from all exercises
    getRandomExercise() {
        return this.allExercises[Math.floor(Math.random() * this.allExercises.length)];
    }

    // Generate structured workout plan based on workout categories
    generateBalancedWorkout(count = 3) {
        // Randomly select a workout category
        const categoryKeys = Object.keys(this.workoutCategories);
        const randomCategoryKey = categoryKeys[Math.floor(Math.random() * categoryKeys.length)];
        const selectedCategory = this.workoutCategories[randomCategoryKey];
        
        // Log the selected category for development (can be removed in production)
        console.log(`🏋️ Generated ${selectedCategory.name} workout (${selectedCategory.description})`);
        
        // Get exercises from the selected category
        const categoryExerciseIds = selectedCategory.exercises;
        const availableExercises = categoryExerciseIds
            .map(id => this.getExerciseById(id))
            .filter(ex => ex !== undefined);
        
        const selectedExercises = [];
        
        // If category has fewer exercises than requested count, take all
        if (availableExercises.length <= count) {
            selectedExercises.push(...availableExercises);
        } else {
            // Randomly select the requested count from category
            const shuffledExercises = [...availableExercises];
            
            // Fisher-Yates shuffle
            for (let i = shuffledExercises.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffledExercises[i], shuffledExercises[j]] = [shuffledExercises[j], shuffledExercises[i]];
            }
            
            selectedExercises.push(...shuffledExercises.slice(0, count));
        }
        
        // If we still need more exercises (shouldn't happen with our current setup), 
        // fill with random exercises
        while (selectedExercises.length < count) {
            const randomExercise = this.getRandomExercise();
            if (!selectedExercises.find(ex => ex.id === randomExercise.id)) {
                selectedExercises.push(randomExercise);
            }
            // Safety break
            if (selectedExercises.length >= this.allExercises.length) break;
        }

        return selectedExercises;
    }

    // Get exercise by ID
    getExerciseById(id) {
        return this.allExercises.find(exercise => exercise.id === id);
    }

    // Get total number of exercises
    getTotalExerciseCount() {
        return this.allExercises.length;
    }

    // Get workout category info by key
    getWorkoutCategory(categoryKey) {
        return this.workoutCategories[categoryKey];
    }

    // Get all workout categories
    getAllWorkoutCategories() {
        return this.workoutCategories;
    }
}

// Export for use in other files
const exerciseManager = new ExerciseManager(); 