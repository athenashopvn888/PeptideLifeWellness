export const quizQuestions = [
  {
    id: 1,
    question: 'What is your main wellness focus?',
    options: [
      'General wellness',
      'Healthy aging education',
      'Skin and beauty education',
      'Fitness and recovery education',
      'Sleep and routine tracking',
      'Weight management education',
    ],
  },
  {
    id: 2,
    question: 'Are you new to peptides?',
    options: [
      'Yes, just learning',
      'Some experience',
      'Experienced',
    ],
  },
  {
    id: 3,
    question: 'What tool would help you most?',
    options: [
      'Calculator',
      'Daily reminders',
      'Wellness journal',
      'Safety information',
      'Research updates',
    ],
  },
  {
    id: 4,
    question: 'How often do you want wellness updates?',
    options: [
      'Weekly',
      'Twice per month',
      'Monthly',
    ],
  },
  {
    id: 5,
    question: 'Would you like to save your result and tracker?',
    options: [
      'Yes, create free account',
      'Not now',
    ],
  },
];

export function getWellnessFocus(answers: Record<number, string>): string {
  const focus = answers[1] || 'General wellness';
  const focusMap: Record<string, string> = {
    'General wellness': 'General Wellness Education',
    'Healthy aging education': 'Healthy Aging Education',
    'Skin and beauty education': 'Skin + Beauty Education',
    'Fitness and recovery education': 'Fitness + Recovery Education',
    'Sleep and routine tracking': 'Sleep + Routine Tracking',
    'Weight management education': 'Weight Management Education',
  };
  return focusMap[focus] || 'General Wellness Education';
}

export const recommendations = [
  { label: 'Read beginner guide', href: '/guides/what-are-peptides', icon: 'BookOpen' },
  { label: 'Try calculator', href: '/calculator', icon: 'Calculator' },
  { label: 'Start free tracker', href: '/tracker', icon: 'FlaskConical' },
  { label: 'Join wellness updates', href: '/contact', icon: 'Bell' },
];
