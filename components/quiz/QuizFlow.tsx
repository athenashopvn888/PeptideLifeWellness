'use client';

import { useState } from 'react';
import { quizQuestions, getWellnessFocus, recommendations } from '@/lib/data/quiz-questions';
import { ArrowRight, ArrowLeft, CheckCircle, BookOpen, Calculator, FlaskConical, Bell, Mail } from 'lucide-react';
import Link from 'next/link';

const iconMap: Record<string, React.ElementType> = {
  BookOpen, Calculator, FlaskConical, Bell,
};

export default function QuizFlow() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [email, setEmail] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  const currentQuestion = quizQuestions[step];
  const totalSteps = quizQuestions.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // In Phase 2, this stores to Supabase
      localStorage.setItem('quiz_lead', JSON.stringify({ email, answers, timestamp: new Date().toISOString() }));
      setEmailSubmitted(true);
    }
  };

  if (showResult) {
    const focus = getWellnessFocus(answers);

    if (!emailSubmitted) {
      return (
        <div className="max-w-lg mx-auto text-center animate-fade-in-up">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-border">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-soft mb-6">
              <CheckCircle size={32} className="text-green" />
            </div>
            <h2 className="text-2xl font-bold text-navy mb-2">Your Results Are Ready!</h2>
            <p className="text-gray mb-6">Enter your email to see your personalized wellness focus and get free updates.</p>
            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-light" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue"
                  id="quiz-email-input"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue text-white py-3.5 rounded-xl text-sm font-semibold hover:bg-blue-dark transition-colors"
                id="quiz-email-submit"
              >
                See My Results
              </button>
            </form>
            <button
              onClick={() => setEmailSubmitted(true)}
              className="mt-3 text-xs text-gray hover:text-gray-dark transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-lg mx-auto text-center animate-fade-in-up">
        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-lg border border-border">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-soft mb-6">
            <CheckCircle size={32} className="text-green" />
          </div>
          <h2 className="text-2xl font-bold text-navy mb-2">Your Wellness Focus</h2>
          <div className="bg-blue-soft rounded-xl px-6 py-4 my-6">
            <p className="text-lg font-bold text-blue">{focus}</p>
          </div>
          <p className="text-sm text-gray mb-8">
            Based on your answers, here are some recommended next steps to support your wellness education journey.
          </p>
          <div className="space-y-3">
            {recommendations.map((rec) => {
              const Icon = iconMap[rec.icon] || BookOpen;
              return (
                <Link
                  key={rec.href}
                  href={rec.href}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border hover:bg-silver transition-colors text-left group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-soft flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-blue" />
                  </div>
                  <span className="text-sm font-medium text-navy group-hover:text-blue transition-colors">{rec.label}</span>
                  <ArrowRight size={16} className="text-gray-light ml-auto" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto animate-fade-in">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray">Question {step + 1} of {totalSteps}</span>
          <span className="text-xs font-medium text-blue">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-silver rounded-full overflow-hidden">
          <div
            className="h-full bg-blue rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-border">
        <h2 className="text-xl font-bold text-navy mb-6">{currentQuestion.question}</h2>
        <div className="space-y-3">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => handleAnswer(option)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 text-sm font-medium ${
                answers[currentQuestion.id] === option
                  ? 'border-blue bg-blue-soft text-blue'
                  : 'border-border hover:border-blue/30 hover:bg-silver text-gray-dark'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {step > 0 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-6 flex items-center gap-2 text-sm text-gray hover:text-navy transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        )}
      </div>
    </div>
  );
}
