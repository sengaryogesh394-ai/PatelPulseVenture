"use client"
import React, { useEffect, useState, memo } from 'react';

// --- Type Definitions ---
type IconType = 'html' | 'css' | 'javascript' | 'react' | 'node' | 'tailwind' | 'reactnative' | 'php' | 'java' | 'dotnet' | 'wordpress' | 'drupal';

type GlowColor = 'cyan' | 'purple' | 'green' | 'red';

interface SkillIconProps {
  type: IconType;
}

interface SkillConfig {
  id: string;
  orbitRadius: number;
  size: number;
  speed: number;
  iconType: IconType;
  phaseShift: number;
  glowColor: GlowColor;
  label: string;
}

interface OrbitingSkillProps {
  config: SkillConfig;
  angle: number;
}

interface GlowingOrbitPathProps {
  radius: number;
  glowColor?: GlowColor;
  animationDelay?: number;
}

// --- Improved SVG Icon Components ---
const iconComponents: Record<IconType, { component: () => React.JSX.Element; color: string }> = {
  html: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z" fill="#E34F26"/>
      </svg>
    ),
    color: '#E34F26'
  },
  css: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm17.09 4.413L5.41 4.41l.213 2.622 10.125.002-.255 2.716h-6.64l.24 2.573h6.182l-.366 3.523-2.91.804-2.956-.81-.188-2.11h-2.61l.29 3.751L12 19.351l5.379-1.443.744-8.157z" fill="#1572B6"/>
      </svg>
    ),
    color: '#1572B6'
  },
  javascript: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <rect width="24" height="24" fill="#F7DF1E"/>
        <path d="M22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z" fill="#323330"/>
      </svg>
    ),
    color: '#F7DF1E'
  },
  react: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <circle cx="12" cy="12" r="2.05" fill="#61DAFB"/>
          <ellipse cx="12" cy="12" rx="11" ry="4.2"/>
          <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(60 12 12)"/>
          <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(120 12 12)"/>
        </g>
      </svg>
    ),
    color: '#61DAFB'
  },
  reactnative: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <circle cx="12" cy="12" r="2.05" fill="#61DAFB"/>
          <ellipse cx="12" cy="12" rx="11" ry="4.2"/>
          <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(60 12 12)"/>
          <ellipse cx="12" cy="12" rx="11" ry="4.2" transform="rotate(120 12 12)"/>
        </g>
      </svg>
    ),
    color: '#61DAFB'
  },
  node: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M11.998 24c-.321 0-.641-.084-.922-.247l-2.936-1.737c-.438-.245-.224-.332-.08-.383.585-.203.703-.25 1.328-.602.065-.037.151-.023.218.017l2.256 1.339c.082.045.198.045.275 0l8.795-5.076c.082-.047.135-.141.135-.241V6.921c0-.103-.055-.198-.137-.246l-8.791-5.072c-.081-.047-.189-.047-.273 0L2.075 6.675c-.084.048-.139.144-.139.246v10.146c0 .1.055.194.139.241l2.409 1.392c1.307.654 2.108-.116 2.108-.89V7.787c0-.142.114-.253.256-.253h1.115c.139 0 .255.112.255.253v10.021c0 1.745-.95 2.745-2.604 2.745-.508 0-.909 0-2.026-.551L1.352 18.675C.533 18.215 0 17.352 0 16.43V6.284c0-.922.533-1.786 1.352-2.245L10.147-.963c.8-.452 1.866-.452 2.657 0l8.796 5.002c.819.459 1.352 1.323 1.352 2.245v10.146c0 .922-.533 1.783-1.352 2.245l-8.796 5.078c-.28.163-.601.247-.926.247zm2.717-6.993c-3.849 0-4.654-1.766-4.654-3.246 0-.14.114-.253.256-.253h1.136c.127 0 .232.091.252.215.173 1.164.686 1.752 3.01 1.752 1.852 0 2.639-.419 2.639-1.401 0-.566-.224-1.03-3.099-1.249-2.404-.184-3.89-.768-3.89-2.689 0-1.771 1.491-2.825 3.991-2.825 2.808 0 4.199.975 4.377 3.068.007.072-.019.141-.065.193-.047.049-.111.077-.178.077h-1.14c-.119 0-.225-.083-.248-.196-.276-1.224-.944-1.616-2.746-1.616-2.023 0-2.259.705-2.259 1.234 0 .641.278.827 3.006 1.19 2.7.359 3.982.866 3.982 2.771 0 1.922-1.603 3.024-4.399 3.024z" fill="#339933"/>
      </svg>
    ),
    color: '#339933'
  },
  tailwind: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" fill="#06B6D4"/>
      </svg>
    ),
    color: '#06B6D4'
  },
  php: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="#777BB4" className="w-full h-full">
        <path d="M12 2.5c-5.24 0-9.5 4.26-9.5 9.5s4.26 9.5 9.5 9.5 9.5-4.26 9.5-9.5-4.26-9.5-9.5-9.5zm4.45 9.57l-1.99 3.63h-1.54l1.99-3.63-1.46-2.66h1.59l1.46 2.66zm-3.27.28l-.88 1.6h-1.54l.88-1.6-.88-1.6h1.54l.88 1.6zm-3.41-.28l.88 1.6h-1.54l-.88-1.6.88-1.6h1.54l-.88 1.6z"/>
      </svg>
    ),
    color: '#777BB4',
  },
  java: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="#F89820" className="w-full h-full">
        <path d="M20.1 13.2c.4-1.8.6-3.7.6-5.6 0-.6-.1-1.2-.2-1.8-3.2 1-5.6 3.8-5.6 7.2 0 1.2.3 2.3.7 3.4 1.4.1 2.8.1 4.2 0 .3-.9.6-1.9.9-2.8zM4.1 12c0-1.8.5-3.5 1.3-5.1 1.6-.5 3.3-.8 5.1-.8 1.6 0 3.2.2 4.7.6-.8 1.6-1.3 3.3-1.3 5.1s.5 3.5 1.3 5.1c-1.5.4-3.1.6-4.7.6-1.8 0-3.5-.3-5.1-.8 1.1-1.4 1.8-3.1 1.8-5zm12.3 5.1c-1.6.5-3.3.8-5.1.8-1.5 0-2.9-.2-4.3-.5 1.3 2.9 4.1 5 7.4 5 1.1 0 2.1-.2 3.1-.5 1.5-1.9 2.5-4.2 2.8-6.7-.1.1-.3.1-.4.1-1.1 0-2.2-.2-3.3-.4zm-1.8-9.9c.8-1.6 1.3-3.3 1.3-5.1-.9.1-1.8.2-2.7.2-3.2 0-6-1.9-7.4-4.5C2.3 5.9 2 8.9 2 12c0 2.2.4 4.4 1.1 6.4.1-.1.1-.2.2-.2 1.3-2.3 3.9-3.9 6.8-3.9 1.1 0 2.2.3 3.2.8z"/>
      </svg>
    ),
    color: '#F89820',
  },
  dotnet: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="#512BD4" className="w-full h-full">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm7 12.5c0 .83-.67 1.5-1.5 1.5h-11c-.83 0-1.5-.67-1.5-1.5v-5C5 8.67 5.67 8 6.5 8h11c.83 0 1.5.67 1.5 1.5v5zm-2-4h-2v2h2v-2zm-3 0h-2v2h2v-2zm-3 0H9v2h2v-2z"/>
      </svg>
    ),
    color: '#512BD4',
  },
  wordpress: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="#21759B" className="w-full h-full">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.5 14.5c-1 0-1.5-.5-1.5-1.5v-5c0-1 .5-1.5 1.5-1.5.83 0 1.5.67 1.5 1.5v5c0 1-.67 1.5-1.5 1.5zM12 16.5c-1 0-1.5-.5-1.5-1.5v-5c0-1 .5-1.5 1.5-1.5s1.5.5 1.5 1.5v5c0 1-.5 1.5-1.5 1.5zm-5.5 0c-1 0-1.5-.5-1.5-1.5v-5c0-1 .5-1.5 1.5-1.5s1.5.5 1.5 1.5v5c0 1-.5 1.5-1.5 1.5z"/>
      </svg>
    ),
    color: '#21759B',
  },
  drupal: {
    component: () => (
      <svg viewBox="0 0 24 24" fill="#0678BE" className="w-full h-full">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.2-11.41c-.42.23-.7.66-.75 1.15-.05.48.1.98.41 1.38.49.56 1.25.9 2.05.9s1.56-.34 2.05-.9c.31-.4.46-.9.41-1.38-.05-.49-.33-.92-.75-1.15-1.09-.6-2.43-.6-3.52 0zm3.52 2.82c-.62.61-1.49.99-2.43.99s-1.81-.38-2.43-.99c-1.29-1.28-1.29-3.36 0-4.64.62-.61 1.49-.99 2.43-.99s1.81.38 2.43.99c1.29 1.28 1.29 3.36 0 4.64z"/>
      </svg>
    ),
    color: '#0678BE',
  }
};

// --- Memoized Icon Component ---
const SkillIcon = memo(({ type }: SkillIconProps) => {
  const IconComponent = iconComponents[type]?.component;
  return IconComponent ? <IconComponent /> : null;
});
SkillIcon.displayName = 'SkillIcon';

// --- Configuration for the Orbiting Skills ---
const skillsConfig: SkillConfig[] = [
  // Inner Orbit
  { 
    id: 'html',
    orbitRadius: 100, 
    size: 40, 
    speed: 1, 
    iconType: 'html', 
    phaseShift: 0, 
    glowColor: 'cyan',
    label: 'HTML5'
  },
  { 
    id: 'css',
    orbitRadius: 100, 
    size: 45, 
    speed: 1, 
    iconType: 'css', 
    phaseShift: (2 * Math.PI) / 3, 
    glowColor: 'cyan',
    label: 'CSS3'
  },
  { 
    id: 'javascript',
    orbitRadius: 100, 
    size: 40, 
    speed: 1, 
    iconType: 'javascript', 
    phaseShift: (4 * Math.PI) / 3, 
    glowColor: 'cyan',
    label: 'JavaScript'
  },
  // Middle Orbit
  { 
    id: 'react',
    orbitRadius: 180, 
    size: 50, 
    speed: -0.6, 
    iconType: 'react', 
    phaseShift: 0, 
    glowColor: 'purple',
    label: 'React'
  },
  { 
    id: 'reactnative',
    orbitRadius: 180, 
    size: 50, 
    speed: -0.6, 
    iconType: 'reactnative', 
    phaseShift: Math.PI / 2, 
    glowColor: 'purple',
    label: 'React Native'
  },
  { 
    id: 'node',
    orbitRadius: 180, 
    size: 45, 
    speed: -0.6, 
    iconType: 'node', 
    phaseShift: Math.PI, 
    glowColor: 'purple',
    label: 'Node.js'
  },
  { 
    id: 'tailwind',
    orbitRadius: 180, 
    size: 40, 
    speed: -0.6, 
    iconType: 'tailwind', 
    phaseShift: (3 * Math.PI) / 2, 
    glowColor: 'purple',
    label: 'Tailwind CSS'
  },
  // Outer Orbit
  { 
    id: 'php',
    orbitRadius: 260, 
    size: 50, 
    speed: 0.4, 
    iconType: 'php', 
    phaseShift: 0, 
    glowColor: 'green',
    label: 'PHP'
  },
  { 
    id: 'java',
    orbitRadius: 260, 
    size: 45, 
    speed: 0.4, 
    iconType: 'java', 
    phaseShift: Math.PI / 3, 
    glowColor: 'red',
    label: 'Java'
  },
  { 
    id: 'dotnet',
    orbitRadius: 260, 
    size: 45, 
    speed: 0.4, 
    iconType: 'dotnet', 
    phaseShift: (2 * Math.PI) / 3, 
    glowColor: 'purple',
    label: '.NET'
  },
  { 
    id: 'wordpress',
    orbitRadius: 260, 
    size: 40, 
    speed: 0.4, 
    iconType: 'wordpress', 
    phaseShift: Math.PI, 
    glowColor: 'cyan',
    label: 'WordPress'
  },
  { 
    id: 'drupal',
    orbitRadius: 260, 
    size: 40, 
    speed: 0.4, 
    iconType: 'drupal', 
    phaseShift: (4 * Math.PI) / 3, 
    glowColor: 'cyan',
    label: 'Drupal'
  },
];

// --- Memoized Orbiting Skill Component ---
const OrbitingSkill = memo(({ config, angle }: OrbitingSkillProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const { orbitRadius, size, iconType, label } = config;

  const x = Math.cos(angle) * orbitRadius;
  const y = Math.sin(angle) * orbitRadius;

  return (
    <div
      className="absolute top-1/2 left-1/2 transition-all duration-300 ease-out"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(calc(${x}px - 50%), calc(${y}px - 50%))`,
        zIndex: isHovered ? 20 : 10,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`
          relative w-full h-full p-2 bg-card/80 backdrop-blur-sm
          rounded-full flex items-center justify-center
          transition-all duration-300 cursor-pointer border border-border
          ${isHovered ? 'scale-125 shadow-2xl' : 'shadow-lg hover:shadow-xl'}
        `}
        style={{
          boxShadow: isHovered
            ? `0 0 30px ${iconComponents[iconType]?.color}40, 0 0 60px ${iconComponents[iconType]?.color}20`
            : undefined
        }}
      >
        <SkillIcon type={iconType} />
        {isHovered && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground border border-border rounded text-xs whitespace-nowrap pointer-events-none">
            {label}
          </div>
        )}
      </div>
    </div>
  );
});
OrbitingSkill.displayName = 'OrbitingSkill';

// --- Optimized Orbit Path Component ---
const GlowingOrbitPath = memo(({ radius, glowColor = 'cyan', animationDelay = 0 }: GlowingOrbitPathProps) => {
  const glowColors = {
    cyan: {
      primary: 'hsl(var(--primary) / 0.4)',
      secondary: 'hsl(var(--primary) / 0.2)',
      border: 'hsl(var(--primary) / 0.3)'
    },
    purple: {
      primary: 'hsl(var(--primary) / 0.4)',
      secondary: 'hsl(var(--primary) / 0.2)',
      border: 'hsl(var(--primary) / 0.3)'
    },
    green: {
        primary: 'hsl(140 80% 40% / 0.4)',
        secondary: 'hsl(140 80% 40% / 0.2)',
        border: 'hsl(140 80% 40% / 0.3)'
    },
    red: {
        primary: 'hsl(0 80% 50% / 0.4)',
        secondary: 'hsl(0 80% 50% / 0.2)',
        border: 'hsl(0 80% 50% / 0.3)'
    }
  };

  const colors = glowColors[glowColor] || glowColors.cyan;

  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
      style={{
        width: `${radius * 2}px`,
        height: `${radius * 2}px`,
        animationDelay: `${animationDelay}s`,
      }}
    >
      {/* Glowing background */}
      <div
        className="absolute inset-0 rounded-full animate-pulse"
        style={{
          background: `radial-gradient(circle, transparent 30%, ${colors.secondary} 70%, ${colors.primary} 100%)`,
          boxShadow: `0 0 60px ${colors.primary}, inset 0 0 60px ${colors.secondary}`,
          animation: 'pulse 4s ease-in-out infinite',
          animationDelay: `${animationDelay}s`,
        }}
      />

      {/* Static ring for depth */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1px solid ${colors.border}`,
          boxShadow: `inset 0 0 20px ${colors.secondary}`,
        }}
      />
    </div>
  );
});
GlowingOrbitPath.displayName = 'GlowingOrbitPath';

// --- Main App Component ---
export default function TechStackSection() {
  const [time, setTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const animate = (currentTime: number) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      setTime(prevTime => prevTime + deltaTime);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPaused]);

  const orbitConfigs: Array<{ radius: number; glowColor: GlowColor; delay: number }> = [
    { radius: 100, glowColor: 'cyan', delay: 0 },
    { radius: 180, glowColor: 'purple', delay: 1.5 },
    { radius: 260, glowColor: 'green', delay: 3 },
  ];

  return (
    <section className="py-20 sm:py-28 bg-background relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold tracking-tight font-headline sm:text-4xl">Technologies We Use</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                We leverage a modern tech stack to build robust and scalable solutions for our clients.
            </p>
        </div>
        <div 
            className="relative w-full h-[450px] md:h-[600px] flex items-center justify-center mt-12"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            
            {/* Central "Code" Icon with enhanced glow */}
            <div className="w-20 h-20 bg-gradient-to-br from-card to-secondary rounded-full flex items-center justify-center z-10 relative shadow-2xl border border-border">
            <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl animate-pulse"></div>
            <div className="absolute inset-0 rounded-full bg-accent/20 blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="relative z-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                    </linearGradient>
                </defs>
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
            </div>
            </div>

            {/* Render glowing orbit paths */}
            {orbitConfigs.map((config) => (
            <GlowingOrbitPath
                key={`path-${config.radius}`}
                radius={config.radius}
                glowColor={config.glowColor}
                animationDelay={config.delay}
            />
            ))}

            {/* Render orbiting skill icons */}
            {skillsConfig.map((config) => {
            const angle = time * config.speed + (config.phaseShift || 0);
            return (
                <OrbitingSkill
                key={config.id}
                config={config}
                angle={angle}
                />
            );
            })}
        </div>
    </section>
  );
}
