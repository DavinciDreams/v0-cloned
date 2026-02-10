/**
 * Pre-built Remotion Composition Templates
 * These are actual Remotion compositions that can be used with @remotion/player
 */

import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

// --- Text Animation Composition ---

export interface TextAnimationProps {
  text: string;
  color?: string;
  fontSize?: number;
  backgroundColor?: string;
}

export const TextAnimation: React.FC<TextAnimationProps> = ({
  text,
  color = '#ffffff',
  fontSize = 64,
  backgroundColor = '#000000'
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Fade in and scale up
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const scale = interpolate(frame, [0, 30], [0.5, 1], {
    extrapolateRight: 'clamp',
  });

  // Fade out at the end
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 30, durationInFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          color,
          fontSize,
          fontWeight: 'bold',
          opacity: opacity * fadeOut,
          transform: `scale(${scale})`,
          textAlign: 'center',
          padding: '0 40px',
        }}
      >
        {text}
      </div>
    </AbsoluteFill>
  );
};

// --- Shape Animation Composition ---

export interface ShapeAnimationProps {
  shapes?: Array<{
    type: 'circle' | 'square' | 'triangle';
    color: string;
    size: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }>;
  backgroundColor?: string;
}

export const ShapeAnimation: React.FC<ShapeAnimationProps> = ({
  shapes = [],
  backgroundColor = '#1a1a1a'
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor }}>
      {shapes.map((shape, index) => {
        const progress = interpolate(
          frame,
          [0, durationInFrames],
          [0, 1],
          { extrapolateRight: 'clamp' }
        );

        const x = interpolate(progress, [0, 1], [shape.startX, shape.endX]);
        const y = interpolate(progress, [0, 1], [shape.startY, shape.endY]);

        const rotation = progress * 360;

        const shapeStyle: React.CSSProperties = {
          position: 'absolute',
          left: x,
          top: y,
          width: shape.size,
          height: shape.size,
          backgroundColor: shape.color,
          transform: `rotate(${rotation}deg)`,
        };

        if (shape.type === 'circle') {
          shapeStyle.borderRadius = '50%';
        } else if (shape.type === 'triangle') {
          shapeStyle.backgroundColor = 'transparent';
          shapeStyle.borderLeft = `${shape.size / 2}px solid transparent`;
          shapeStyle.borderRight = `${shape.size / 2}px solid transparent`;
          shapeStyle.borderBottom = `${shape.size}px solid ${shape.color}`;
          shapeStyle.width = 0;
          shapeStyle.height = 0;
        }

        return <div key={index} style={shapeStyle} />;
      })}
    </AbsoluteFill>
  );
};

// --- Countdown Timer Composition ---

export interface CountdownTimerProps {
  from: number;
  to?: number;
  color?: string;
  fontSize?: number;
  backgroundColor?: string;
  label?: string;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  from,
  to = 0,
  color = '#00ff88',
  fontSize = 120,
  backgroundColor = '#000000',
  label
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const totalSeconds = durationInFrames / fps;
  const currentProgress = frame / durationInFrames;
  const currentValue = Math.ceil(from - (from - to) * currentProgress);

  const scale = interpolate(frame % fps, [0, fps / 2, fps], [1, 1.1, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {label && (
        <div
          style={{
            color,
            fontSize: fontSize * 0.3,
            fontWeight: 'bold',
            opacity: 0.7,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          color,
          fontSize,
          fontWeight: 'bold',
          fontFamily: 'monospace',
          transform: `scale(${scale})`,
        }}
      >
        {currentValue}
      </div>
    </AbsoluteFill>
  );
};

// --- Logo Reveal Composition ---

export interface LogoRevealProps {
  text: string;
  subtitle?: string;
  color?: string;
  backgroundColor?: string;
}

export const LogoReveal: React.FC<LogoRevealProps> = ({
  text,
  subtitle,
  color = '#ffffff',
  backgroundColor = '#0066ff'
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Split animation into phases
  const phase1 = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const phase2 = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' });
  const phase3 = interpolate(frame, [40, 60], [0, 1], { extrapolateRight: 'clamp' });

  // Logo scale and opacity
  const logoScale = interpolate(phase1, [0, 1], [0.3, 1]);
  const logoOpacity = phase1;

  // Slide in from left
  const logoX = interpolate(phase1, [0, 1], [-100, 0]);

  // Subtitle fade in
  const subtitleOpacity = phase2;
  const subtitleY = interpolate(phase2, [0, 1], [20, 0]);

  // Background color transition
  const bgBrightness = interpolate(phase3, [0, 1], [1, 0.9]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        filter: `brightness(${bgBrightness})`,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          transform: `translateX(${logoX}px) scale(${logoScale})`,
          opacity: logoOpacity,
        }}
      >
        <div
          style={{
            color,
            fontSize: 80,
            fontWeight: 'bold',
            textAlign: 'center',
            letterSpacing: '-2px',
          }}
        >
          {text}
        </div>
      </div>

      {subtitle && (
        <div
          style={{
            color,
            fontSize: 24,
            marginTop: 20,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          {subtitle}
        </div>
      )}
    </AbsoluteFill>
  );
};

// --- Composition Registry ---

export const compositionRegistry = {
  TextAnimation,
  ShapeAnimation,
  CountdownTimer,
  LogoReveal,
};

export type CompositionType = keyof typeof compositionRegistry;
