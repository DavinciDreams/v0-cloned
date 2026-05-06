"use client";

import { useState, useCallback, createContext, useContext, useRef } from 'react';
import { ChevronLeft, ChevronRight, Download, Maximize2, Minimize2, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PresentationProps, Slide, PresentationTheme } from '@/lib/schemas/presentation.schema';

// ─── Theme definitions ────────────────────────────────────────────────────────

const themes: Record<PresentationTheme, {
  bg: string; text: string; accent: string; muted: string; card: string; border: string;
}> = {
  professional: {
    bg: 'bg-[#1e3a5f]', text: 'text-white', accent: 'text-[#4fc3f7]',
    muted: 'text-blue-200', card: 'bg-[#234876]', border: 'border-blue-400/30',
  },
  modern: {
    bg: 'bg-[#0f0f0f]', text: 'text-white', accent: 'text-[#a78bfa]',
    muted: 'text-gray-400', card: 'bg-[#1a1a1a]', border: 'border-purple-500/30',
  },
  minimal: {
    bg: 'bg-white', text: 'text-gray-900', accent: 'text-gray-700',
    muted: 'text-gray-500', card: 'bg-gray-50', border: 'border-gray-200',
  },
  dark: {
    bg: 'bg-[#111827]', text: 'text-white', accent: 'text-[#34d399]',
    muted: 'text-gray-400', card: 'bg-[#1f2937]', border: 'border-emerald-500/30',
  },
  colorful: {
    bg: 'bg-[#7c3aed]', text: 'text-white', accent: 'text-yellow-300',
    muted: 'text-purple-200', card: 'bg-[#6d28d9]', border: 'border-yellow-300/30',
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

type ThemeColors = { bg: string; text: string; accent: string; muted: string; card: string; border: string };

interface PresentationCtx {
  data: PresentationProps['data'];
  options: PresentationProps['options'];
  currentSlide: number;
  setCurrentSlide: (n: number) => void;
  isFullscreen: boolean;
  setIsFullscreen: (v: boolean) => void;
  theme: ThemeColors;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const PresentationContext = createContext<PresentationCtx | null>(null);

function usePresentationContext() {
  const ctx = useContext(PresentationContext);
  if (!ctx) throw new Error('Must be used inside <Presentation>');
  return ctx;
}

// ─── Slide layouts ────────────────────────────────────────────────────────────

function SlideRenderer({ slide, theme }: { slide: Slide; theme: ThemeColors }) {
  const bg = slide.background ? { style: { background: slide.background } } : {};

  switch (slide.layout) {
    case 'title':
      return (
        <div className={cn('flex flex-col items-center justify-center h-full text-center px-16', theme.bg, theme.text)} {...bg}>
          {slide.title && <h1 className="text-5xl font-bold mb-6 leading-tight">{slide.title}</h1>}
          {slide.subtitle && <p className={cn('text-2xl', theme.muted)}>{slide.subtitle}</p>}
          {slide.author && <p className={cn('mt-8 text-sm', theme.muted)}>{slide.author}</p>}
        </div>
      );

    case 'two-column':
      return (
        <div className={cn('flex flex-col h-full px-12 py-10', theme.bg, theme.text)} {...bg}>
          {slide.title && <h2 className={cn('text-3xl font-bold mb-8', theme.accent)}>{slide.title}</h2>}
          <div className="flex gap-8 flex-1">
            <div className="flex-1">
              {slide.leftTitle && <h3 className="text-xl font-semibold mb-3">{slide.leftTitle}</h3>}
              {slide.leftContent && <p className={cn('text-base leading-relaxed', theme.muted)}>{slide.leftContent}</p>}
              {slide.leftBullets && (
                <ul className="space-y-2">
                  {slide.leftBullets.map((b, i) => (
                    <li key={i} className={cn('flex items-start gap-2 text-base', theme.muted)}>
                      <span className={cn('mt-1.5 w-1.5 h-1.5 rounded-full shrink-0', theme.accent.replace('text-', 'bg-'))} />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className={cn('w-px', theme.border.replace('border-', 'bg-'))} />
            <div className="flex-1">
              {slide.rightTitle && <h3 className="text-xl font-semibold mb-3">{slide.rightTitle}</h3>}
              {slide.rightContent && <p className={cn('text-base leading-relaxed', theme.muted)}>{slide.rightContent}</p>}
              {slide.rightBullets && (
                <ul className="space-y-2">
                  {slide.rightBullets.map((b, i) => (
                    <li key={i} className={cn('flex items-start gap-2 text-base', theme.muted)}>
                      <span className={cn('mt-1.5 w-1.5 h-1.5 rounded-full shrink-0', theme.accent.replace('text-', 'bg-'))} />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      );

    case 'quote':
      return (
        <div className={cn('flex flex-col items-center justify-center h-full text-center px-20', theme.bg, theme.text)} {...bg}>
          <div className={cn('text-8xl leading-none mb-4 opacity-30', theme.accent)}>"</div>
          {slide.quote && <p className="text-2xl font-light italic leading-relaxed mb-8">{slide.quote}</p>}
          {slide.author && <p className={cn('text-base font-semibold', theme.accent)}>— {slide.author}</p>}
        </div>
      );

    case 'image':
      return (
        <div className={cn('flex flex-col h-full', theme.bg, theme.text)} {...bg}>
          {slide.title && (
            <div className="px-12 py-6">
              <h2 className={cn('text-3xl font-bold', theme.accent)}>{slide.title}</h2>
            </div>
          )}
          {slide.image && (
            <div className="flex-1 px-12 pb-8">
              <img src={slide.image} alt={slide.title ?? ''} className="w-full h-full object-contain rounded-lg" />
            </div>
          )}
          {slide.caption && <p className={cn('text-center pb-4 text-sm', theme.muted)}>{slide.caption}</p>}
        </div>
      );

    case 'blank':
      return <div className={cn('h-full', theme.bg)} {...bg} />;

    case 'team':
      return (
        <div className={cn('flex flex-col h-full px-12 py-10', theme.bg, theme.text)} {...bg}>
          {slide.title && <h2 className={cn('text-3xl font-bold mb-8 text-center', theme.accent)}>{slide.title}</h2>}
          {slide.content && <p className={cn('text-center text-base', theme.muted)}>{slide.content}</p>}
        </div>
      );

    case 'comparison':
      return (
        <div className={cn('flex flex-col h-full px-12 py-10', theme.bg, theme.text)} {...bg}>
          {slide.title && <h2 className={cn('text-3xl font-bold mb-8', theme.accent)}>{slide.title}</h2>}
          <div className="flex gap-6 flex-1">
            <div className={cn('flex-1 rounded-xl p-6 border', theme.card, theme.border)}>
              {slide.leftTitle && <h3 className="text-xl font-bold mb-4">{slide.leftTitle}</h3>}
              {slide.leftBullets && (
                <ul className="space-y-3">
                  {slide.leftBullets.map((b, i) => (
                    <li key={i} className={cn('text-base', theme.muted)}>✓ {b}</li>
                  ))}
                </ul>
              )}
            </div>
            <div className={cn('flex-1 rounded-xl p-6 border', theme.card, theme.border)}>
              {slide.rightTitle && <h3 className="text-xl font-bold mb-4">{slide.rightTitle}</h3>}
              {slide.rightBullets && (
                <ul className="space-y-3">
                  {slide.rightBullets.map((b, i) => (
                    <li key={i} className={cn('text-base', theme.muted)}>✓ {b}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      );

    default: // 'content'
      return (
        <div className={cn('flex flex-col h-full px-12 py-10', theme.bg, theme.text)} {...bg}>
          {slide.title && <h2 className={cn('text-3xl font-bold mb-8', theme.accent)}>{slide.title}</h2>}
          {slide.content && <p className={cn('text-lg leading-relaxed mb-6', theme.muted)}>{slide.content}</p>}
          {slide.bullets && (
            <ul className="space-y-4 flex-1">
              {slide.bullets.map((bullet, i) => (
                <li key={i} className={cn('flex items-start gap-3 text-lg', theme.muted)}>
                  <span className={cn('mt-2 w-2 h-2 rounded-full shrink-0', theme.accent.replace('text-', 'bg-'))} />
                  {bullet}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
  }
}

// ─── Compound components ──────────────────────────────────────────────────────

export function PresentationHeader({ children }: { children: React.ReactNode }) {
  const { theme } = usePresentationContext();
  return (
    <div className={cn('flex items-center justify-between px-4 py-2 border-b', theme.border, 'bg-black/20')}>
      {children}
    </div>
  );
}

export function PresentationTitle() {
  const { data, theme } = usePresentationContext();
  return <span className={cn('text-sm font-medium truncate', theme.text)}>{data.title}</span>;
}

export function PresentationActions({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-1">{children}</div>;
}

export function PresentationDownloadButton() {
  const { data } = usePresentationContext();
  const [loading, setLoading] = useState(false);

  const handleExport = useCallback(async () => {
    setLoading(true);
    try {
      const pptxgen = (await import('pptxgenjs')).default;
      const prs = new pptxgen();
      prs.layout = 'LAYOUT_WIDE';

      for (const slide of data.slides) {
        const s = prs.addSlide();
        const bg = slide.background ?? '#1e3a5f';
        s.background = { color: bg.replace('#', '') };

        if (slide.layout === 'title') {
          if (slide.title) s.addText(slide.title, { x: 1, y: 1.5, w: '80%', h: 1.5, fontSize: 40, bold: true, color: 'FFFFFF', align: 'center' });
          if (slide.subtitle) s.addText(slide.subtitle, { x: 1, y: 3.2, w: '80%', h: 0.8, fontSize: 22, color: '4fc3f7', align: 'center' });
          if (slide.author) s.addText(slide.author, { x: 1, y: 4.3, w: '80%', h: 0.5, fontSize: 14, color: '90caf9', align: 'center' });
        } else if (slide.layout === 'quote') {
          if (slide.quote) s.addText(`"${slide.quote}"`, { x: 1, y: 1.5, w: '80%', h: 2.5, fontSize: 22, italic: true, color: 'FFFFFF', align: 'center' });
          if (slide.author) s.addText(`— ${slide.author}`, { x: 1, y: 4.2, w: '80%', h: 0.5, fontSize: 16, color: '4fc3f7', align: 'center' });
        } else {
          if (slide.title) s.addText(slide.title, { x: 0.8, y: 0.5, w: '85%', h: 0.9, fontSize: 28, bold: true, color: '4fc3f7' });
          if (slide.content) s.addText(slide.content, { x: 0.8, y: 1.6, w: '85%', h: 1, fontSize: 16, color: 'BBDEFB' });
          if (slide.bullets) {
            const bulletText = slide.bullets.map(b => ({ text: b, options: { bullet: true } }));
            s.addText(bulletText, { x: 0.8, y: slide.content ? 2.8 : 1.6, w: '85%', h: 2.5, fontSize: 18, color: 'BBDEFB', paraSpaceAfter: 8 });
          }
        }
      }

      await prs.writeFile({ fileName: `${data.title.replace(/\s+/g, '_')}.pptx` });
    } catch (e) {
      console.error('[Presentation] Export failed:', e);
    } finally {
      setLoading(false);
    }
  }, [data]);

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/20 text-white transition-colors disabled:opacity-50"
    >
      <Download className="w-3.5 h-3.5" />
      {loading ? 'Exporting…' : '.pptx'}
    </button>
  );
}

export function PresentationCopyButton() {
  const { data } = usePresentationContext();
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data]);
  return (
    <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export function PresentationFullscreenButton() {
  const { isFullscreen, setIsFullscreen, containerRef } = usePresentationContext();
  const toggle = useCallback(() => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen, setIsFullscreen, containerRef]);
  return (
    <button onClick={toggle} className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors">
      {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
    </button>
  );
}

export function PresentationContent() {
  const { data, currentSlide, setCurrentSlide, theme, options } = usePresentationContext();
  const slides = data.slides;
  const slide = slides[currentSlide];
  const total = slides.length;
  const aspectRatio = options?.aspectRatio ?? '16:9';
  const paddingTop = aspectRatio === ('16:9' as string) ? '56.25%' : '75%';

  return (
    <div className="flex flex-col">
      {/* Slide area */}
      <div className="relative w-full" style={{ paddingTop }}>
        <div className="absolute inset-0 overflow-hidden rounded-b-none">
          {slide && <SlideRenderer slide={slide} theme={theme} />}
        </div>
      </div>

      {/* Navigation bar */}
      <div className={cn('flex items-center justify-between px-4 py-2 border-t', theme.border, 'bg-black/30')}>
        <button
          onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
          disabled={currentSlide === 0}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white disabled:opacity-30 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Slide dots */}
        <div className="flex items-center gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={cn(
                'rounded-full transition-all',
                i === currentSlide ? 'w-4 h-2 bg-white' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              )}
            />
          ))}
        </div>

        <button
          onClick={() => setCurrentSlide(Math.min(total - 1, currentSlide + 1))}
          disabled={currentSlide === total - 1}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white disabled:opacity-30 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Speaker notes */}
      {slide?.notes && (
        <div className={cn('px-4 py-2 text-xs border-t', theme.border, theme.muted, 'bg-black/20')}>
          <span className="font-semibold">Notes: </span>{slide.notes}
        </div>
      )}
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export const Presentation = ({
  data,
  options,
  children,
}: PresentationProps & { children?: React.ReactNode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const themeName = (data.theme ?? 'professional') as PresentationTheme;
  const theme = themes[themeName] ?? themes.professional;
  const height = options?.height ?? 520;

  return (
    <PresentationContext.Provider value={{
      data, options, currentSlide, setCurrentSlide,
      isFullscreen, setIsFullscreen, theme, containerRef,
    }}>
      <div
        ref={containerRef}
        className={cn('rounded-xl overflow-hidden border shadow-lg', theme.border, theme.bg)}
        style={{ minHeight: height }}
      >
        {children}
      </div>
    </PresentationContext.Provider>
  );
};
