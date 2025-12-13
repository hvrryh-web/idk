/**
 * ROTKPageLayout - Consistent page wrapper with Romance of Three Kingdoms styling
 * 
 * Provides consistent layout, theming, and navigation across all pages.
 * Inspired by: Romance of the Three Kingdoms, Persona, Fire Emblem
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import { ROTKButton } from '../rotk';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
  titleCjk?: string;
  subtitle?: string;
  variant?: 'parchment' | 'ink' | 'lacquer';
  icon?: React.ReactNode;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  backRoute?: string;
  headerActions?: React.ReactNode;
  accentColor?: string;
}

export function ROTKPageLayout({
  children,
  title,
  titleCjk,
  subtitle,
  variant = 'parchment',
  icon,
  showBackButton = true,
  showHomeButton = true,
  backRoute,
  headerActions,
  accentColor = 'var(--rotk-gold)',
}: PageLayoutProps) {
  const navigate = useNavigate();

  const variantStyles = {
    parchment: {
      background: 'var(--rotk-gradient-parchment)',
      border: '4px solid var(--rotk-bronze)',
      color: 'var(--rotk-ink-black)',
      headerBg: 'linear-gradient(180deg, rgba(212,175,55,0.15) 0%, transparent 100%)',
      headerBorder: 'var(--rotk-gold)',
    },
    ink: {
      background: 'linear-gradient(180deg, var(--rotk-ink-black) 0%, var(--rotk-charcoal) 100%)',
      border: '4px solid var(--rotk-gold)',
      color: 'var(--rotk-parchment)',
      headerBg: 'linear-gradient(180deg, rgba(139,0,0,0.3) 0%, transparent 100%)',
      headerBorder: 'var(--rotk-cinnabar)',
    },
    lacquer: {
      background: 'var(--rotk-gradient-cinnabar)',
      border: '4px solid var(--rotk-gold)',
      color: 'var(--rotk-parchment)',
      headerBg: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, transparent 100%)',
      headerBorder: 'var(--rotk-gold)',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className="rotk-page-layout"
      style={{
        background: styles.background,
        border: styles.border,
        borderRadius: '12px',
        color: styles.color,
        fontFamily: 'var(--rotk-font-heading)',
        margin: '1rem auto',
        maxWidth: '1400px',
        minHeight: 'calc(100vh - 120px)',
        boxShadow: 'var(--rotk-shadow-elevated), 0 0 40px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative corner elements - Fire Emblem inspired */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '80px',
          height: '80px',
          background: `linear-gradient(135deg, ${accentColor} 0%, transparent 60%)`,
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '80px',
          height: '80px',
          background: `linear-gradient(-135deg, ${accentColor} 0%, transparent 60%)`,
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '80px',
          height: '80px',
          background: `linear-gradient(45deg, ${accentColor} 0%, transparent 60%)`,
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '80px',
          height: '80px',
          background: `linear-gradient(-45deg, ${accentColor} 0%, transparent 60%)`,
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />

      {/* Header - Persona style clean layout */}
      <header
        style={{
          background: styles.headerBg,
          borderBottom: `3px solid ${styles.headerBorder}`,
          padding: '1.5rem 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          position: 'relative',
        }}
      >
        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {showBackButton && (
            <ROTKButton
              variant="secondary"
              size="small"
              icon={ArrowLeft}
              onClick={() => backRoute ? navigate(backRoute) : navigate(-1)}
            >
              Back
            </ROTKButton>
          )}
          {showHomeButton && (
            <ROTKButton
              variant="secondary"
              size="small"
              icon={Home}
              onClick={() => navigate('/home')}
            >
              Home
            </ROTKButton>
          )}
        </div>

        {/* Icon */}
        {icon && (
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '8px',
              background: accentColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--rotk-gold)',
              boxShadow: 'var(--rotk-glow-gold)',
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}

        {/* Title Section */}
        <div style={{ flex: 1 }}>
          <h1
            style={{
              margin: 0,
              fontSize: '2rem',
              fontWeight: 'bold',
              letterSpacing: '0.05em',
              textShadow: variant === 'parchment' 
                ? '1px 1px 2px rgba(0,0,0,0.2)' 
                : '0 2px 4px rgba(0,0,0,0.5)',
              display: 'flex',
              alignItems: 'baseline',
              gap: '0.75rem',
              flexWrap: 'wrap',
            }}
          >
            <span>{title}</span>
            {titleCjk && (
              <span
                style={{
                  color: accentColor,
                  fontSize: '1.5rem',
                  fontFamily: 'var(--rotk-font-heading-cjk)',
                }}
              >
                {titleCjk}
              </span>
            )}
          </h1>
          {subtitle && (
            <p
              style={{
                margin: '0.25rem 0 0',
                fontSize: '0.95rem',
                opacity: 0.8,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {/* Header Actions */}
        {headerActions && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {headerActions}
          </div>
        )}
      </header>

      {/* Content */}
      <main
        style={{
          padding: '2rem',
          position: 'relative',
        }}
      >
        {children}
      </main>
    </div>
  );
}

export default ROTKPageLayout;
