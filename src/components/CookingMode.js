import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Check, X, Mic } from 'lucide-react';

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.utterance = null;
  }

  speak(text, onEnd) {
    if (!this.synth) {
      console.warn('Speech synthesis not supported');
      return;
    }

    this.synth.cancel();

    this.utterance = new SpeechSynthesisUtterance(text);
    this.utterance.rate = 0.9;
    this.utterance.pitch = 1;
    this.utterance.volume = 1;

    if (onEnd) {
      this.utterance.onend = onEnd;
    }

    this.synth.speak(this.utterance);
  }

  pause() {
    if (this.synth) {
      this.synth.pause();
    }
  }

  resume() {
    if (this.synth) {
      this.synth.resume();
    }
  }

  cancel() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

const CookingMode = ({ recipe, onComplete, onExit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const speechServiceRef = useRef(null);
  const timerRef = useRef(null);
  const wakeLockRef = useRef(null);
  const recognitionRef = useRef(null);

  const currentInstruction = recipe.instructions[currentStep];
  const progress = ((currentStep + 1) / recipe.instructions.length) * 100;
  const isLastStep = currentStep === recipe.instructions.length - 1;

  useEffect(() => {
    speechServiceRef.current = new SpeechService();

    const requestWakeLock = async () => {
      try {
        if ('wakeLock' in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request('screen');
        }
      } catch (err) {
        console.log('Wake Lock error:', err);
      }
    };

    requestWakeLock();

    const setupVoiceRecognition = () => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event) => {
          const transcript = event.results[event.results.length - 1][0].transcript.toLowerCase();
          console.log('Voice command:', transcript);

          if (transcript.includes('next') || transcript.includes('step')) {
            if ('vibrate' in navigator) {
              navigator.vibrate(100);
            }
            goToNextStep();
          } else if (transcript.includes('previous') || transcript.includes('back')) {
            if ('vibrate' in navigator) {
              navigator.vibrate(100);
            }
            goToPreviousStep();
          } else if (transcript.includes('pause')) {
            if ('vibrate' in navigator) {
              navigator.vibrate(100);
            }
            setIsPaused(true);
          } else if (transcript.includes('resume') || transcript.includes('play')) {
            if ('vibrate' in navigator) {
              navigator.vibrate(100);
            }
            setIsPaused(false);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.log('Speech recognition error:', event.error);
        };
      }
    };

    setupVoiceRecognition();

    return () => {
      speechServiceRef.current?.cancel();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (wakeLockRef.current) {
        wakeLockRef.current.release();
      }
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleVoiceRecognition = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    if (!isMuted && !isPaused) {
      speakCurrentStep();
    }
  }, [currentStep]);

  useEffect(() => {
    if (currentInstruction.duration && !isPaused) {
      startTimer(currentInstruction.duration * 60);
    } else {
      stopTimer();
    }

    return () => stopTimer();
  }, [currentStep, isPaused]);

  const speakCurrentStep = () => {
    if (speechServiceRef.current && !isMuted) {
      const text = `Step ${currentStep + 1}. ${currentInstruction.description}`;
      speechServiceRef.current.speak(text);
    }
  };

  const startTimer = (seconds) => {
    setTimeRemaining(seconds);
    setIsTimerRunning(true);

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          stopTimer();
          if ('vibrate' in navigator) {
            navigator.vibrate([200, 100, 200]);
          }
          if (!isLastStep) {
            setTimeout(() => goToNextStep(), 500);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerRunning(false);
    setTimeRemaining(null);
  };

  const goToNextStep = () => {
    if (!isLastStep) {
      setCurrentStep((prev) => prev + 1);
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
    if (isPaused) {
      speechServiceRef.current?.resume();
    } else {
      speechServiceRef.current?.pause();
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
    if (!isMuted) {
      speechServiceRef.current?.cancel();
    } else {
      speakCurrentStep();
    }
  };

  const handleComplete = () => {
    speechServiceRef.current?.cancel();
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
    onComplete();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return React.createElement(
    'div',
    {
      className: 'fixed inset-0 z-50 flex flex-col animate-fade-in',
      style: { backgroundColor: 'var(--background)' }
    },
    [
      React.createElement(
        'div',
        {
          key: 'header',
          className: 'border-b glass-header'
        },
        [
          React.createElement(
            'div',
            {
              key: 'top-bar',
              className: 'container flex items-center justify-between h-16'
            },
            [
              React.createElement(
                'button',
                {
                  key: 'exit',
                  onClick: onExit,
                  className: 'btn btn-ghost',
                  style: { background: 'none', border: 'none' }
                },
                React.createElement(X, { size: 20 })
              ),
              React.createElement(
                'h2',
                {
                  key: 'title',
                  className: 'font-semibold text-lg text-pretty'
                },
                recipe.title
              ),
              React.createElement(
                'div',
                {
                  key: 'controls',
                  className: 'flex gap-2'
                },
                [
                  recognitionRef.current && React.createElement(
                    'button',
                    {
                      key: 'voice',
                      onClick: toggleVoiceRecognition,
                      className: 'btn btn-ghost',
                      style: { 
                        background: 'none', 
                        border: 'none',
                        color: isListening ? 'var(--primary)' : 'inherit'
                      }
                    },
                    React.createElement(Mic, { 
                      size: 20,
                      className: isListening ? 'animate-pulse' : ''
                    })
                  ),
                  React.createElement(
                    'button',
                    {
                      key: 'mute',
                      onClick: toggleMute,
                      className: 'btn btn-ghost',
                      style: { background: 'none', border: 'none' }
                    },
                    isMuted ? React.createElement(VolumeX, { size: 20 }) : React.createElement(Volume2, { size: 20 })
                  )
                ]
              )
            ]
          ),
          React.createElement(
            'div',
            {
              key: 'progress',
              className: 'container pb-4'
            },
            [
              React.createElement(
                'div',
                {
                  key: 'labels',
                  className: 'flex items-center justify-between text-sm mb-2',
                  style: { color: 'var(--muted-foreground)' }
                },
                [
                  React.createElement(
                    'span',
                    { key: 'step' },
                    `Step ${currentStep + 1} of ${recipe.instructions.length}`
                  ),
                  React.createElement(
                    'span',
                    { key: 'percentage' },
                    `${Math.round(progress)}% complete`
                  )
                ]
              ),
              React.createElement(
                'div',
                {
                  key: 'bar',
                  className: 'progress'
                },
                React.createElement('div', {
                  className: 'progress-bar',
                  style: { width: `${progress}%` }
                })
              )
            ]
          )
        ]
      ),
      React.createElement(
        'div',
        {
          key: 'content',
          className: 'flex-1 overflow-y-auto'
        },
        React.createElement(
          'div',
          { className: 'container py-8 md:py-12' },
          React.createElement(
            'div',
            { className: 'max-w-3xl mx-auto' },
            [
              timeRemaining !== null && React.createElement(
                'div',
                {
                  key: 'timer',
                  className: 'card mb-8 p-6 text-center animate-scale-in',
                  style: { 
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)'
                  }
                },
                [
                  React.createElement(
                    'div',
                    {
                      key: 'label',
                      className: 'text-sm font-medium mb-2'
                    },
                    'Timer'
                  ),
                  React.createElement(
                    'div',
                    {
                      key: 'time',
                      className: 'text-5xl font-bold mb-4'
                    },
                    formatTime(timeRemaining)
                  ),
                  isTimerRunning && React.createElement(
                    'div',
                    {
                      key: 'note',
                      className: 'text-sm opacity-90'
                    },
                    'Step will auto-advance when complete'
                  )
                ]
              ),
              currentInstruction.image && React.createElement(
                'div',
                {
                  key: 'image',
                  className: 'card mb-8 overflow-hidden animate-scale-in'
                },
                React.createElement(
                  'div',
                  { className: 'relative aspect-video gradient-overlay' },
                  React.createElement('img', {
                    src: currentInstruction.image || '/placeholder.svg',
                    alt: `Step ${currentStep + 1} visual guide`,
                    className: 'w-full h-full object-cover'
                  })
                )
              ),
              React.createElement(
                'div',
                {
                  key: 'step',
                  className: 'card p-8 md:p-12 animate-slide-up'
                },
                [
                  React.createElement(
                    'div',
                    {
                      key: 'number',
                      className: 'w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center text-2xl font-bold',
                      style: { 
                        backgroundColor: 'var(--primary)',
                        color: 'var(--primary-foreground)'
                      }
                    },
                    currentStep + 1
                  ),
                  React.createElement(
                    'p',
                    {
                      key: 'description',
                      className: 'text-2xl md:text-3xl font-medium text-center leading-relaxed text-balance'
                    },
                    currentInstruction.description
                  ),
                  currentInstruction.duration && !isTimerRunning && React.createElement(
                    'p',
                    {
                      key: 'duration',
                      className: 'text-center mt-6',
                      style: { color: 'var(--muted-foreground)' }
                    },
                    `Estimated time: ${currentInstruction.duration} minutes`
                  )
                ]
              ),
              isListening && React.createElement(
                'p',
                {
                  key: 'voice-hint',
                  className: 'text-center text-sm mt-4 animate-pulse',
                  style: { color: 'var(--muted-foreground)' }
                },
                'Listening for voice commands: "Next step", "Previous", "Pause", "Resume"'
              )
            ]
          )
        )
      ),
      React.createElement(
        'div',
        {
          key: 'footer',
          className: 'border-t glass-header'
        },
        React.createElement(
          'div',
          { className: 'container py-4' },
          React.createElement(
            'div',
            {
              className: 'max-w-3xl mx-auto flex items-center justify-between gap-4'
            },
            [
              React.createElement(
                'button',
                {
                  key: 'prev',
                  onClick: goToPreviousStep,
                  disabled: currentStep === 0 || isPaused,
                  className: 'btn btn-outline btn-lg gap-2 touch-target',
                  style: { backgroundColor: 'transparent' }
                },
                [
                  React.createElement(ChevronLeft, { key: 'icon', size: 20 }),
                  React.createElement(
                    'span',
                    { key: 'text', className: 'hidden md:inline' },
                    'Previous'
                  )
                ]
              ),
              React.createElement(
                'button',
                {
                  key: 'pause',
                  onClick: togglePause,
                  className: 'btn btn-outline btn-lg gap-2 touch-target',
                  style: { backgroundColor: 'transparent' }
                },
                [
                  isPaused ? React.createElement(Play, { key: 'icon', size: 20 }) : React.createElement(Pause, { key: 'icon', size: 20 }),
                  React.createElement(
                    'span',
                    { key: 'text', className: 'hidden md:inline' },
                    isPaused ? 'Resume' : 'Pause'
                  )
                ]
              ),
              isLastStep ? React.createElement(
                'button',
                {
                  key: 'complete',
                  onClick: handleComplete,
                  disabled: isPaused,
                  className: 'btn btn-primary btn-lg gap-2 touch-target'
                },
                [
                  React.createElement(Check, { key: 'icon', size: 20 }),
                  React.createElement(
                    'span',
                    { key: 'text', className: 'hidden md:inline' },
                    'Complete'
                  )
                ]
              ) : React.createElement(
                'button',
                {
                  key: 'next',
                  onClick: goToNextStep,
                  disabled: isPaused,
                  className: 'btn btn-primary btn-lg gap-2 touch-target'
                },
                [
                  React.createElement(
                    'span',
                    { key: 'text', className: 'hidden md:inline' },
                    'Next'
                  ),
                  React.createElement(ChevronRight, { key: 'icon', size: 20 })
                ]
              )
            ]
          )
        )
      )
    ]
  );
};

export default CookingMode;