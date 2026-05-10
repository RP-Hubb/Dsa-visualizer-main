import { Play, Pause, SkipBack, SkipForward, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * FIX #3 — Jump to End:
 * The old implementation called onStepForward up to 10 times via setTimeout.
 * This was broken: it only advanced 10 steps regardless of total length, and
 * the staggered timers could conflict with the play loop.
 *
 * Fix: Accept a dedicated `onJumpToEnd` prop. The parent computes the final
 * index and calls setSortCurrentStep(steps.length - 1) directly — O(1),
 * instant, no race conditions.
 *
 * FIX — Speed slider:
 * The old value mapping `800 - speed + 50` was inverted inconsistently.
 * New mapping: slider left = slow (high ms delay), slider right = fast (low ms).
 * Display label now shows the actual ms value so it's unambiguous.
 */
export default function PlaybackControls({
  isPlaying,
  onPlayPause,
  onReset,
  onStepBack,
  onStepForward,
  onJumpToEnd,        // NEW: dedicated jump-to-end handler
  currentStep,
  totalSteps,
  speed,
  onSpeedChange,
  disabled = false,
}) {
  const atStart = currentStep === 0;
  const atEnd   = totalSteps > 0 && currentStep >= totalSteps - 1;
  const progress = totalSteps > 1 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  // Speed: store value is ms-per-step. Slider maps:
  //   slider pos 0   → speed 800ms (slowest)
  //   slider pos 100 → speed  50ms (fastest)
  // Formula: sliderValue = 850 - speed  (so speed = 850 - sliderValue)
  const SPEED_MIN = 50;
  const SPEED_MAX = 800;
  const sliderValue = SPEED_MAX + SPEED_MIN - speed; // invert for display

  const speedLabel = speed <= 100 ? '🚀 Fast'
                   : speed <= 300 ? '⚡ Med'
                   :                '🐌 Slow';

  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

      {/* Progress bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          <span>Step {currentStep + 1} / {Math.max(totalSteps, 1)}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
          <div
            className="h-full rounded-full transition-all duration-200"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-purple))',
            }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-center gap-2">

        {/* Reset */}
        <button
          onClick={onReset}
          disabled={disabled || (atStart && !isPlaying)}
          title="Reset to beginning"
          className="p-2 rounded-lg transition-all duration-150 hover:scale-110 disabled:opacity-30"
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
        >
          <RotateCcw size={15} />
        </button>

        {/* Step back */}
        <button
          onClick={onStepBack}
          disabled={disabled || atStart}
          title="Previous step"
          className="p-2 rounded-lg transition-all duration-150 hover:scale-110 disabled:opacity-30"
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
        >
          <ChevronLeft size={18} />
        </button>

        {/* Play / Pause */}
        <button
          onClick={onPlayPause}
          disabled={disabled || atEnd}
          title={isPlaying ? 'Pause' : 'Play'}
          className="px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 hover:scale-105 disabled:opacity-30"
          style={{
            background: isPlaying ? 'rgba(255,0,170,0.2)'   : 'rgba(0,229,255,0.15)',
            color:      isPlaying ? 'var(--accent-magenta)' : 'var(--accent-cyan)',
            border:     `1px solid ${isPlaying ? 'var(--accent-magenta)' : 'var(--accent-cyan)'}`,
            minWidth: '90px',
          }}
        >
          <span className="flex items-center justify-center gap-2">
            {isPlaying ? <Pause size={15} /> : <Play size={15} />}
            {isPlaying ? 'Pause' : 'Play'}
          </span>
        </button>

        {/* Step forward */}
        <button
          onClick={onStepForward}
          disabled={disabled || atEnd}
          title="Next step"
          className="p-2 rounded-lg transition-all duration-150 hover:scale-110 disabled:opacity-30"
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
        >
          <ChevronRight size={18} />
        </button>

        {/* Jump to End — FIX #3: calls dedicated handler, not onStepForward loop */}
        <button
          onClick={onJumpToEnd}
          disabled={disabled || atEnd}
          title="Jump to final state"
          className="p-2 rounded-lg transition-all duration-150 hover:scale-110 disabled:opacity-30"
          style={{ color: 'var(--text-secondary)', background: 'var(--bg-secondary)' }}
        >
          <SkipForward size={15} />
        </button>

      </div>

      {/* Speed control */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono shrink-0 w-8" style={{ color: 'var(--text-muted)' }}>Slow</span>
        <input
          type="range"
          min={SPEED_MIN}
          max={SPEED_MAX}
          step={50}
          value={sliderValue}
          onChange={e => onSpeedChange(SPEED_MAX + SPEED_MIN - Number(e.target.value))}
          className="flex-1 h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: 'var(--accent-cyan)' }}
        />
        <span className="text-xs font-mono shrink-0 w-8 text-right" style={{ color: 'var(--text-muted)' }}>Fast</span>
        <span className="text-xs font-mono shrink-0 w-16 text-right" style={{ color: 'var(--accent-cyan)' }}>
          {speedLabel}
        </span>
      </div>

    </div>
  );
}
