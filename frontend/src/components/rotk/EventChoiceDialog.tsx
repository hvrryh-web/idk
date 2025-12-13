/**
 * EventChoiceDialog - Dialog component for NPC conversations and event choices
 * 
 * Features NPC portrait, dialogue text with typewriter effect, and choice buttons.
 * Used for story events, NPC interactions, and decision points.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, User } from 'lucide-react';
import { ScrollOverlay } from './ScrollOverlay';
import { ROTKButton } from './ROTKButton';
import '../../styles/rotkTheme.css';

export interface DialogChoice {
  id: string;
  text: string;
  textCjk?: string;
  isDisabled?: boolean;
  disabledReason?: string;
  consequence?: 'positive' | 'negative' | 'neutral';
}

export interface EventChoiceDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  speakerName: string;
  speakerNameCjk?: string;
  speakerTitle?: string;
  speakerPortrait?: string;
  dialogueText: string;
  dialogueTextCjk?: string;
  choices?: DialogChoice[];
  onChoiceSelect?: (choiceId: string) => void;
  showTypewriter?: boolean;
  typewriterSpeed?: number;
  autoAdvance?: boolean;
  showContinuePrompt?: boolean;
  onContinue?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function EventChoiceDialog({
  isOpen,
  onClose,
  speakerName,
  speakerNameCjk,
  speakerTitle,
  speakerPortrait,
  dialogueText,
  dialogueTextCjk,
  choices,
  onChoiceSelect,
  showTypewriter = true,
  typewriterSpeed = 30,
  autoAdvance: _autoAdvance = false, // Reserved for future auto-advance feature
  showContinuePrompt = false,
  onContinue,
  className = '',
  style = {},
}: EventChoiceDialogProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [displayedTextCjk, setDisplayedTextCjk] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  
  // Reset typewriter on new dialogue
  useEffect(() => {
    if (isOpen) {
      setDisplayedText('');
      setDisplayedTextCjk('');
      setIsTypingComplete(false);
    }
  }, [isOpen, dialogueText, dialogueTextCjk]);
  
  // Typewriter effect
  useEffect(() => {
    if (!isOpen || !showTypewriter) {
      setDisplayedText(dialogueText);
      setDisplayedTextCjk(dialogueTextCjk || '');
      setIsTypingComplete(true);
      return;
    }
    
    const textToType = dialogueTextCjk || dialogueText;
    let currentIndex = 0;
    
    const timer = setInterval(() => {
      if (currentIndex < textToType.length) {
        const currentChar = textToType.slice(0, currentIndex + 1);
        if (dialogueTextCjk) {
          setDisplayedTextCjk(currentChar);
        } else {
          setDisplayedText(currentChar);
        }
        currentIndex++;
      } else {
        clearInterval(timer);
        setDisplayedText(dialogueText);
        setDisplayedTextCjk(dialogueTextCjk || '');
        setIsTypingComplete(true);
      }
    }, typewriterSpeed);
    
    return () => clearInterval(timer);
  }, [isOpen, dialogueText, dialogueTextCjk, showTypewriter, typewriterSpeed]);
  
  // Skip to end of typewriter
  const handleSkipTypewriter = useCallback(() => {
    setDisplayedText(dialogueText);
    setDisplayedTextCjk(dialogueTextCjk || '');
    setIsTypingComplete(true);
  }, [dialogueText, dialogueTextCjk]);
  
  const handleChoiceClick = (choiceId: string) => {
    onChoiceSelect?.(choiceId);
  };
  
  const getChoiceStyle = (consequence?: 'positive' | 'negative' | 'neutral'): React.CSSProperties => {
    switch (consequence) {
      case 'positive':
        return {
          borderColor: '#00A86B',
          background: 'linear-gradient(90deg, rgba(0, 168, 107, 0.1) 0%, transparent 100%)',
        };
      case 'negative':
        return {
          borderColor: '#C41E3A',
          background: 'linear-gradient(90deg, rgba(196, 30, 58, 0.1) 0%, transparent 100%)',
        };
      default:
        return {};
    }
  };
  
  return (
    <ScrollOverlay
      isOpen={isOpen}
      onClose={onClose}
      variant="paper"
      size="large"
      transition="inkBlot"
      showCloseButton={Boolean(onClose)}
      closeOnBackdrop={false}
      className={className}
      style={style}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {/* Speaker Section */}
        <div
          style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
          }}
        >
          {/* Portrait */}
          <div
            style={{
              width: 80,
              height: 100,
              borderRadius: '4px',
              background: speakerPortrait
                ? `url(${speakerPortrait}) center/cover`
                : 'linear-gradient(135deg, #424242 0%, #2D2D2D 100%)',
              border: '3px solid #CD7F32',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {!speakerPortrait && <User size={32} color="#D4C5A9" />}
          </div>
          
          {/* Speaker Info */}
          <div style={{ flex: 1 }}>
            {speakerNameCjk && (
              <h2
                style={{
                  fontFamily: '"Noto Serif SC", SimSun, serif',
                  fontSize: '1.5rem',
                  fontWeight: 700,
                  color: '#8B0000',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                {speakerNameCjk}
              </h2>
            )}
            <h3
              style={{
                fontFamily: '"Cinzel", Georgia, serif',
                fontSize: speakerNameCjk ? '0.875rem' : '1.25rem',
                fontWeight: 600,
                color: '#1A1A1A',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {speakerName}
            </h3>
            {speakerTitle && (
              <span
                style={{
                  fontFamily: '"Inter", sans-serif',
                  fontSize: '0.75rem',
                  color: '#757575',
                  fontStyle: 'italic',
                }}
              >
                {speakerTitle}
              </span>
            )}
          </div>
        </div>
        
        {/* Dialogue Text */}
        <div
          onClick={!isTypingComplete ? handleSkipTypewriter : undefined}
          style={{
            padding: '1.25rem',
            background: 'linear-gradient(135deg, rgba(253, 246, 227, 0.8) 0%, rgba(212, 197, 169, 0.5) 100%)',
            border: '2px solid #CD7F32',
            borderRadius: '4px',
            position: 'relative',
            cursor: !isTypingComplete ? 'pointer' : 'default',
            minHeight: 100,
          }}
        >
          {/* Decorative quote mark */}
          <span
            style={{
              position: 'absolute',
              top: 8,
              left: 12,
              fontSize: '3rem',
              fontFamily: '"Noto Serif SC", SimSun, serif',
              color: 'rgba(205, 127, 50, 0.3)',
              lineHeight: 1,
              pointerEvents: 'none',
            }}
          >
            「
          </span>
          
          {/* CJK Text */}
          {dialogueTextCjk && (
            <p
              style={{
                fontFamily: '"Noto Serif SC", SimSun, serif',
                fontSize: '1.125rem',
                lineHeight: 1.8,
                color: '#1A1A1A',
                margin: '0 0 0.75rem 0',
                paddingLeft: '2rem',
              }}
            >
              {showTypewriter ? displayedTextCjk : dialogueTextCjk}
              {showTypewriter && !isTypingComplete && (
                <span
                  style={{
                    borderRight: '2px solid #8B0000',
                    animation: 'blink 1s infinite',
                  }}
                >
                  &nbsp;
                </span>
              )}
            </p>
          )}
          
          {/* English Text */}
          <p
            style={{
              fontFamily: '"Inter", sans-serif',
              fontSize: dialogueTextCjk ? '0.875rem' : '1rem',
              lineHeight: 1.6,
              color: dialogueTextCjk ? '#424242' : '#1A1A1A',
              margin: 0,
              paddingLeft: '2rem',
              fontStyle: dialogueTextCjk ? 'italic' : 'normal',
            }}
          >
            {showTypewriter && !dialogueTextCjk ? displayedText : dialogueText}
            {showTypewriter && !isTypingComplete && !dialogueTextCjk && (
              <span
                style={{
                  borderRight: '2px solid #8B0000',
                  marginLeft: 2,
                }}
              >
                &nbsp;
              </span>
            )}
          </p>
          
          {/* Decorative closing quote */}
          <span
            style={{
              position: 'absolute',
              bottom: 8,
              right: 12,
              fontSize: '3rem',
              fontFamily: '"Noto Serif SC", SimSun, serif',
              color: 'rgba(205, 127, 50, 0.3)',
              lineHeight: 1,
              pointerEvents: 'none',
            }}
          >
            」
          </span>
          
          {/* Click to skip hint */}
          {showTypewriter && !isTypingComplete && (
            <div
              style={{
                position: 'absolute',
                bottom: 4,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: '0.625rem',
                color: '#757575',
                fontStyle: 'italic',
              }}
            >
              Click to skip
            </div>
          )}
        </div>
        
        {/* Choices or Continue */}
        {isTypingComplete && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              animation: 'rotk-panel-enter 300ms ease-out',
            }}
          >
            {choices && choices.length > 0 ? (
              <>
                <div
                  style={{
                    fontFamily: '"Cinzel", Georgia, serif',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: '#8B0000',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}
                >
                  Choose your response
                </div>
                {choices.map((choice, index) => (
                  <button
                    key={choice.id}
                    onClick={() => !choice.isDisabled && handleChoiceClick(choice.id)}
                    disabled={choice.isDisabled}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.75rem 1rem',
                      background: 'linear-gradient(135deg, #FDF6E3 0%, #E8DCC8 100%)',
                      border: '2px solid #CD7F32',
                      borderRadius: '4px',
                      cursor: choice.isDisabled ? 'not-allowed' : 'pointer',
                      opacity: choice.isDisabled ? 0.5 : 1,
                      transition: 'all 200ms ease',
                      textAlign: 'left',
                      ...getChoiceStyle(choice.consequence),
                    }}
                    onMouseEnter={(e) => {
                      if (!choice.isDisabled) {
                        e.currentTarget.style.borderColor = '#D4AF37';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(212, 175, 55, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = getChoiceStyle(choice.consequence).borderColor || '#CD7F32';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Choice number */}
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #CD7F32 0%, #A66628 100%)',
                        border: '2px solid #D4AF37',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        color: '#FDF6E3',
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>
                    
                    {/* Choice text */}
                    <div style={{ flex: 1 }}>
                      {choice.textCjk && (
                        <div
                          style={{
                            fontFamily: '"Noto Serif SC", SimSun, serif',
                            fontSize: '1rem',
                            color: '#1A1A1A',
                            marginBottom: '0.25rem',
                          }}
                        >
                          {choice.textCjk}
                        </div>
                      )}
                      <div
                        style={{
                          fontFamily: '"Inter", sans-serif',
                          fontSize: choice.textCjk ? '0.75rem' : '0.875rem',
                          color: choice.textCjk ? '#424242' : '#1A1A1A',
                          fontStyle: choice.textCjk ? 'italic' : 'normal',
                        }}
                      >
                        {choice.text}
                      </div>
                      {choice.isDisabled && choice.disabledReason && (
                        <div
                          style={{
                            fontFamily: '"Inter", sans-serif',
                            fontSize: '0.625rem',
                            color: '#C41E3A',
                            marginTop: '0.25rem',
                          }}
                        >
                          ({choice.disabledReason})
                        </div>
                      )}
                    </div>
                    
                    {/* Arrow */}
                    <ChevronRight size={18} color={choice.isDisabled ? '#757575' : '#CD7F32'} />
                  </button>
                ))}
              </>
            ) : showContinuePrompt && onContinue ? (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <ROTKButton
                  variant="gold"
                  size="medium"
                  icon={ChevronRight}
                  iconPosition="right"
                  onClick={onContinue}
                >
                  Continue
                </ROTKButton>
              </div>
            ) : null}
          </div>
        )}
      </div>
      
      {/* Blink animation for cursor */}
      <style>
        {`
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
          }
        `}
      </style>
    </ScrollOverlay>
  );
}

export default EventChoiceDialog;
