import { User } from '../types';

export interface DailyRoutine {
    date: string;
    tasks: RoutineTask[];
    focusArea: string;
}

export interface RoutineTask {
    title: string;
    duration: number; // minutes
    type: 'REVISION' | 'NEW_TOPIC' | 'PRACTICE' | 'BREAK';
    description?: string;
}

export const generateDailyRoutine = (user: User): DailyRoutine => {
    const today = new Date().toDateString();

    // 1. Identify Weak Topics (from mcqHistory)
    const weakTopics: string[] = [];
    const topicStats: Record<string, { correct: number, total: number }> = {};

    // 1. Identify Weak Topics (from mcqHistory)
    // Enhanced: Use last 10 tests only for recent weakness
    (user.mcqHistory || []).slice(0, 10).forEach(result => {
        // Use chapterTitle or topic
        const topic = result.topic || result.chapterTitle || 'General';
        if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0 };
        topicStats[topic].correct += result.correctCount;
        topicStats[topic].total += result.totalQuestions;
    });

    Object.keys(topicStats).forEach(topic => {
        const stats = topicStats[topic];
        // Weakness threshold: < 60% accuracy
        if (stats.total > 5 && (stats.correct / stats.total) < 0.6) {
            weakTopics.push(topic);
        }
    });

    // 2. Determine Strategy based on User Level (Implied by Streak & Progress)
    // If streak > 7 days, increase difficulty/load
    const streak = user.streak || 0;
    const isConsistent = streak > 7;

    // Default goal from local storage (passed via user object if synced, but we use a default here)
    const totalMinutes = isConsistent ? 150 : 90; // 2.5h vs 1.5h

    const tasks: RoutineTask[] = [];
    let focusArea = "Foundational Study";

    // A. WEAKNESS RECOVERY
    if (weakTopics.length > 0) {
        focusArea = "Targeted Weakness Recovery";
        const topic = weakTopics[0];
        tasks.push({
            title: `Deep Dive: ${topic}`,
            duration: 45,
            type: 'REVISION',
            description: `Your accuracy in ${topic} is low. Review the premium notes carefully.`
        });
        tasks.push({
            title: `Fix Mistakes: ${topic}`,
            duration: 20,
            type: 'PRACTICE',
            description: "Retake MCQs for this topic focusing on previous errors."
        });
    }
    // B. NEW LEARNING (If no major weaknesses)
    else {
        focusArea = "Accelerated Learning";
        tasks.push({
            title: "New Chapter Video",
            duration: 60,
            type: 'NEW_TOPIC',
            description: "Watch a full video lecture for the next chapter in your syllabus."
        });
    }

    // C. CONSISTENCY TASK
    tasks.push({
        title: "Daily Challenge (Streak)",
        duration: 15,
        type: 'PRACTICE',
        description: "Complete today's Daily Challenge to keep your streak alive."
    });

    // D. REVISION (Spaced Repetition)
    if (user.mcqHistory && user.mcqHistory.length > 0) {
        const randomOldTopic = user.mcqHistory[Math.floor(Math.random() * user.mcqHistory.length)].chapterTitle;
        tasks.push({
            title: `Flash Review: ${randomOldTopic}`,
            duration: 10,
            type: 'REVISION',
            description: "Quickly scan through notes of a past topic to retain memory."
        });
    } else {
        tasks.push({
            title: "Explore Library",
            duration: 10,
            type: 'REVISION',
            description: "Browse the library and pick a topic for tomorrow."
        });
    }

    return {
        date: today,
        tasks: tasks,
        focusArea: focusArea
    };
};
