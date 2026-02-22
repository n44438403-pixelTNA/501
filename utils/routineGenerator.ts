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

    (user.mcqHistory || []).forEach(result => {
        // Assume chapterTitle as topic for now if topic field is missing
        const topic = result.topic || result.chapterTitle || 'General';
        if (!topicStats[topic]) topicStats[topic] = { correct: 0, total: 0 };
        topicStats[topic].correct += result.correctCount;
        topicStats[topic].total += result.totalQuestions;
    });

    Object.keys(topicStats).forEach(topic => {
        const stats = topicStats[topic];
        if (stats.total > 0 && (stats.correct / stats.total) < 0.6) {
            weakTopics.push(topic);
        }
    });

    // 2. Determine Strategy based on Streak & Goal
    // Default goal: 3 hours (180 mins) if not set
    const goalHours = user.customSubscriptionDuration?.hours || 3; // Fallback logic, actually user doesn't store daily goal directly in interface, stored in localStorage usually.
    // We will assume 120 mins base for routine generation for now.
    const totalMinutes = 120;

    const tasks: RoutineTask[] = [];
    let focusArea = "General Study";

    if (weakTopics.length > 0) {
        focusArea = "Strengthening Weak Topics";
        // Allocate time to weak topics
        const topic = weakTopics[0]; // Focus on first weak topic
        tasks.push({
            title: `Revise ${topic}`,
            duration: 30,
            type: 'REVISION',
            description: "Read notes and review key concepts."
        });
        tasks.push({
            title: `Practice MCQs: ${topic}`,
            duration: 20,
            type: 'PRACTICE',
            description: "Take a short test to verify understanding."
        });
    } else {
        focusArea = "Advancing New Topics";
        tasks.push({
            title: "New Chapter Study",
            duration: 45,
            type: 'NEW_TOPIC',
            description: "Watch video lecture or read main notes of a new chapter."
        });
    }

    // Add Standard Practice
    tasks.push({
        title: "Daily MCQ Challenge",
        duration: 15,
        type: 'PRACTICE',
        description: "Complete the daily challenge to maintain streak."
    });

    // Add Review
    tasks.push({
        title: "Day Review",
        duration: 10,
        type: 'REVISION',
        description: "Review what you learned today."
    });

    return {
        date: today,
        tasks: tasks,
        focusArea: focusArea
    };
};
