import { Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PlaybackControls({
  isPlaying, onPlayPause, onReset, onStepBack, onStepForward,
  currentStep, totalSteps, speed, onSpeedChange,
  disabled = false
}) {
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          <span>Step {currentStep + 1} / {totalSteps}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))'
            }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onReset}
          disabled={disabled}
          className="p-2 rounded-lg transition-all duration-150 hover:scale-110 disabled:opacity-40"
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
          title="Reset"
        >
          <RotateCcw size={16} />
        </button>

        <button
          onClick={onStepBack}
          disabled={disabled || currentStep === 0}
          className="p-2 rounded-lg transition-all duration-150 hover:scale-110 disabled:opacity-40"
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
          title="Previous step"
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={onPlayPause}
          disabled={disabled || currentStep >= totalSteps - 1}
          className="px-6 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 hover:scale-105 disabled:opacity-40"
          style={{
            background: isPlaying ? 'rgba(255, 0, 170, 0.2)' : 'rgba(0, 229, 255, 0.15)',
            color: isPlaying ? 'var(--accent-magenta)' : 'var(--accent-cyan)',
            border: `1px solid ${isPlaying ? 'var(--accent-magenta)' : 'var(--accent-cyan)'}`,
          }}
        >
          <span className="flex items-center gap-2">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            {isPlaying ? 'Pause' : 'Play'}
          </span>
        </button>

        <button
          onClick={onStepForward}
          disabled={disabled || currentStep >= totalSteps - 1}
          className="p-2 rounded-lg transition-all duration-150 hover:scale-110 disabled:opacity-40"
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
          title="Next step"
        >
          <ChevronRight size={18} />
        </button>

        <button
          onClick={() => onStepForward && Array.from({ length: Math.min(10, totalSteps - currentStep - 1) }).forEach((_, i) => setTimeout(() => onStepForward(), i * 50))}
          disabled={disabled}
          className="p-2 rounded-lg transition-all duration-150 hover:scale-110 disabled:opacity-40"
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
          title="Jump to end"
        >
          <SkipForward size={16} />
        </button>
      </div>

      {/* Speed control */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono shrink-0" style={{ color: 'var(--text-muted)' }}>Speed</span>
        <input
          type="range"
          min={50}
          max={800}
          step={50}
          value={800 - speed + 50}
          onChange={e => onSpeedChange(800 - Number(e.target.value) + 50)}
          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: 'var(--accent-cyan)' }}
        />
        <span className="text-xs font-mono shrink-0 w-12 text-right" style={{ color: 'var(--text-muted)' }}>
          {speed < 200 ? '🚀 Fast' : speed > 500 ? '🐌 Slow' : '⚡ Med'}
        </span>
      </div>
    </div>
  );
}
