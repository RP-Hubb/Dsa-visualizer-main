import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUIZ_QUESTIONS } from '../../utils';
import { CheckCircle, XCircle, RotateCcw, Trophy } from 'lucide-react';

export default function QuizMode() {
  const [questions] = useState(() => [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5));
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [history, setHistory] = useState([]);

  const q = questions[currentQ];

  const handleSelect = (optionIdx) => {
    if (answered) return;
    setSelected(optionIdx);
    setAnswered(true);
    const correct = optionIdx === q.answer;
    if (correct) setScore(s => s + 1);
    setHistory(h => [...h, { question: q.question, selected: optionIdx, correct, answer: q.answer }]);
  };

  const handleNext = () => {
    if (currentQ >= questions.length - 1) {
      setFinished(true);
    } else {
      setCurrentQ(c => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  const handleRestart = () => {
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
    setHistory([]);
  };

  const pct = Math.round((score / questions.length) * 100);
  const grade = pct >= 90 ? 'S' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'F';
  const gradeColor = pct >= 80 ? '#00ff88' : pct >= 60 ? '#ffb300' : '#ff0044';

  if (finished) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-6 p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="text-center"
        >
          <div className="text-8xl font-display font-black mb-2" style={{ color: gradeColor }}>{grade}</div>
          <div className="text-3xl font-display font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            {score} / {questions.length} correct
          </div>
          <div className="text-lg" style={{ color: 'var(--text-secondary)' }}>{pct}% score</div>

          <div className="mt-4 text-lg" style={{ color: gradeColor }}>
            {pct === 100 ? '🏆 Perfect score! You\'re a DSA master!' :
             pct >= 80 ? '🎉 Great job! Strong understanding!' :
             pct >= 60 ? '📚 Good effort! Review the weak areas.' :
             '💪 Keep practicing! Revisit the visualizations.'}
          </div>
        </motion.div>

        {/* Score breakdown */}
        <div className="w-full max-w-lg rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="font-display font-bold" style={{ color: 'var(--text-primary)' }}>Review</h3>
          </div>
          <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
            {history.map((h, i) => (
              <div key={i} className="px-4 py-3 flex items-start gap-3">
                {h.correct
                  ? <CheckCircle size={18} style={{ color: 'var(--accent-green)', shrink: 0 }} className="mt-0.5 shrink-0" />
                  : <XCircle size={18} style={{ color: 'var(--accent-magenta)' }} className="mt-0.5 shrink-0" />
                }
                <div className="flex-1">
                  <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{questions[i].question}</p>
                  {!h.correct && (
                    <p className="text-xs mt-1" style={{ color: 'var(--accent-green)' }}>
                      ✓ {questions[i].options[questions[i].answer]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleRestart}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all hover:scale-105"
          style={{ background: 'rgba(0,229,255,0.15)', color: 'var(--accent-cyan)', border: '1px solid var(--accent-cyan)' }}>
          <RotateCcw size={16} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4 h-full overflow-auto max-w-2xl mx-auto">
      <div>
        <h1 className="font-display text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Quiz Mode</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Test your DSA knowledge!</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <motion.div
            className="h-full rounded-full"
            animate={{ width: `${((currentQ) / questions.length) * 100}%` }}
            style={{ background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))' }}
          />
        </div>
        <span className="text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
          {currentQ + 1}/{questions.length}
        </span>
        <span className="text-sm font-mono" style={{ color: 'var(--accent-green)' }}>
          Score: {score}
        </span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          className="space-y-4"
        >
          <div className="rounded-xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="text-xs font-mono mb-2" style={{ color: 'var(--text-muted)' }}>QUESTION {currentQ + 1}</div>
            <p className="text-lg font-medium leading-relaxed" style={{ color: 'var(--text-primary)' }}>
              {q.question}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-2">
            {q.options.map((option, i) => {
              const isSelected = selected === i;
              const isCorrect = i === q.answer;
              let bg = 'var(--bg-card)', borderColor = 'var(--border)', color = 'var(--text-primary)';

              if (answered) {
                if (isCorrect) { bg = 'rgba(0,255,136,0.15)'; borderColor = 'var(--accent-green)'; color = 'var(--accent-green)'; }
                else if (isSelected && !isCorrect) { bg = 'rgba(255,0,170,0.15)'; borderColor = 'var(--accent-magenta)'; color = 'var(--accent-magenta)'; }
              } else if (isSelected) {
                bg = 'rgba(0,229,255,0.1)'; borderColor = 'var(--accent-cyan)'; color = 'var(--accent-cyan)';
              }

              return (
                <motion.button
                  key={i}
                  whileHover={!answered ? { scale: 1.01 } : {}}
                  whileTap={!answered ? { scale: 0.99 } : {}}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                  className="w-full text-left p-4 rounded-xl flex items-center gap-3 transition-all"
                  style={{ background: bg, border: `2px solid ${borderColor}`, color, cursor: answered ? 'default' : 'pointer' }}
                >
                  <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: isCorrect && answered ? 'var(--accent-green)' : isSelected && !isCorrect && answered ? 'var(--accent-magenta)' : 'var(--bg-secondary)', color: 'white' }}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1">{option}</span>
                  {answered && isCorrect && <CheckCircle size={18} style={{ color: 'var(--accent-green)' }} />}
                  {answered && isSelected && !isCorrect && <XCircle size={18} style={{ color: 'var(--accent-magenta)' }} />}
                </motion.button>
              );
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="rounded-xl p-4"
                style={{
                  background: selected === q.answer ? 'rgba(0,255,136,0.08)' : 'rgba(255,0,170,0.08)',
                  border: `1px solid ${selected === q.answer ? 'rgba(0,255,136,0.3)' : 'rgba(255,0,170,0.3)'}`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {selected === q.answer
                    ? <CheckCircle size={16} style={{ color: 'var(--accent-green)' }} />
                    : <XCircle size={16} style={{ color: 'var(--accent-magenta)' }} />
                  }
                  <span className="font-medium text-sm" style={{ color: selected === q.answer ? 'var(--accent-green)' : 'var(--accent-magenta)' }}>
                    {selected === q.answer ? 'Correct!' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{q.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {answered && (
            <button onClick={handleNext}
              className="w-full py-3 rounded-xl font-medium text-sm transition-all hover:scale-[1.02]"
              style={{ background: 'rgba(0,229,255,0.15)', color: 'var(--accent-cyan)', border: '1px solid var(--accent-cyan)' }}>
              {currentQ >= questions.length - 1 ? 'See Results 🏆' : 'Next Question →'}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
