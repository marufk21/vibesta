import { Link } from 'react-router-dom';
import { Zap, Heart, MessageCircle, Flame } from 'lucide-react';

const AuthLayout = ({ children, subtitle = 'Join Vibesta today.' }) => {
  const footerLinks = [
    'About',
    'Get App',
    'Help Center',
    'Terms of Service',
    'Privacy Policy',
    'Cookie Policy',
    'Careers',
    'Developers',
    'Community',
  ];

  return (
    <div className="relative h-screen max-h-screen w-full bg-gradient-to-br from-rose-50/60 via-background to-pink-50/40 dark:from-rose-950/20 dark:via-background dark:to-pink-950/20 text-foreground flex flex-col justify-between overflow-hidden select-none">
      {/* Decorative Ambient Gradient Glows in Pinkish-Reddish tones */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-[28rem] w-[28rem] rounded-full bg-rose-500/20 blur-3xl dark:bg-rose-600/15 animate-pulse duration-1000"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/4 h-[30rem] w-[30rem] rounded-full bg-pink-500/20 blur-3xl dark:bg-pink-600/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/3 -bottom-20 h-72 w-72 rounded-full bg-rose-400/15 blur-3xl"
      />

      {/* Main Split Layout */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-6 sm:px-8 lg:px-6 py-4 lg:py-6 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-4 lg:gap-12 z-10 min-h-0 my-auto">
        {/* Left Side: Vibesta Brand Hero Showcase (Desktop) */}
        <div className="hidden lg:flex flex-1 items-center justify-start relative w-full max-h-[380px] xl:max-h-[420px]">
          {/* Glowing Geometric Brand Art */}
          <div className="relative w-full max-w-[360px] h-[360px] xl:max-w-[400px] xl:h-[400px] flex items-center justify-center">
            {/* Pulsing ring background */}
            <div className="absolute inset-4 rounded-full border border-rose-500/30 animate-pulse duration-1000" />
            <div className="absolute inset-14 rounded-full border border-pink-500/25" />
            <div className="absolute inset-24 rounded-full border border-rose-400/20" />

            {/* Giant Stylized Vibesta 'V' Glyph with Pinkish Reddish Brand Gradient */}
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full drop-shadow-2xl"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="vibestaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e11d48" />
                  <stop offset="45%" stopColor="#f43f5e" />
                  <stop offset="85%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#db2777" />
                </linearGradient>
              </defs>

              {/* Modern geometric V wireframe */}
              <path
                d="M 90 80 L 160 80 L 200 240 L 240 80 L 310 80 L 230 330 L 170 330 Z"
                stroke="url(#vibestaGrad)"
                strokeWidth="4"
                strokeLinejoin="round"
                fill="url(#vibestaGrad)"
                fillOpacity="0.08"
              />
              <path
                d="M 125 105 L 155 105 L 200 260 L 245 105 L 275 105 L 215 310 L 185 310 Z"
                stroke="url(#vibestaGrad)"
                strokeWidth="2.5"
                strokeLinejoin="round"
                opacity="0.6"
              />
            </svg>

            {/* Floating Brand Highlight Badges */}
            <div className="absolute -top-3 -right-2 bg-card/95 border border-rose-200/80 dark:border-rose-900/60 px-4 py-2 rounded-2xl shadow-lg shadow-rose-500/10 backdrop-blur-md flex items-center gap-2.5 animate-bounce duration-1000">
              <Zap className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="text-xs font-semibold text-rose-950 dark:text-rose-100">Share Moments</span>
            </div>

            <div className="absolute bottom-2 -left-3 bg-card/95 border border-rose-200/80 dark:border-rose-900/60 px-4 py-2 rounded-2xl shadow-lg shadow-rose-500/10 backdrop-blur-md flex items-center gap-2.5">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
              <span className="text-xs font-semibold text-rose-950 dark:text-rose-100">Connect Friends</span>
            </div>

            <div className="absolute bottom-16 -right-3 bg-card/95 border border-pink-200/80 dark:border-pink-900/60 px-4 py-2 rounded-2xl shadow-lg shadow-pink-500/10 backdrop-blur-md flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4 text-pink-500 shrink-0" />
              <span className="text-xs font-semibold text-pink-950 dark:text-pink-100">Realtime Chat</span>
            </div>
          </div>
        </div>

        {/* Right Side: Primary Auth Form Area */}
        <div className="w-full max-w-[340px] sm:max-w-[380px] lg:max-w-md flex flex-col items-center lg:items-start justify-center">
          {/* Vibesta Brand Logo Header */}
          <div className="mb-2 flex items-center gap-1">
            <Flame className="w-6 h-6 sm:w-7 sm:h-7 text-rose-500 shrink-0" />
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 bg-clip-text text-transparent">
              Vibesta
            </span>
          </div>

          {/* Subtitle (title heading removed) */}
          {subtitle && (
            <div className="mb-3 sm:mb-4 text-center lg:text-left w-full">
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground font-medium">
                {subtitle}
              </p>
            </div>
          )}

          {/* Form Content */}
          <div className="w-full">{children}</div>
        </div>
      </main>

      {/* Sleek Minimalist Footer */}
      <footer className="w-full border-t border-rose-200/60 dark:border-rose-900/40 px-4 py-1.5 sm:py-2.5 text-muted-foreground text-[10px] sm:text-xs z-10 shrink-0 bg-background/50 backdrop-blur-sm">
        {/* Desktop: full link list */}
        <div className="hidden sm:flex max-w-6xl mx-auto flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center">
          {footerLinks.map((link, idx) => (
            <span
              key={idx}
              className="hover:underline hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              {link}
            </span>
          ))}
          <span className="text-rose-500/80 font-semibold">
            © 2026 Vibesta Corp.
          </span>
        </div>
        {/* Mobile: copyright only */}
        <div className="flex sm:hidden items-center justify-center">
          <span className="text-rose-500/80 font-semibold">© 2026 Vibesta Corp.</span>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
