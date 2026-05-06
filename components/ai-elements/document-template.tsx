"use client";

import { useState, useCallback, createContext, useContext, useRef } from 'react';
import { Download, Maximize2, Minimize2, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DocumentProps, DocumentSection } from '@/lib/schemas/document.schema';

// ─── Theme definitions ────────────────────────────────────────────────────────

const themes = {
  default: {
    page: 'bg-white text-gray-900',
    heading1: 'text-3xl font-bold text-gray-900 mt-8 mb-4',
    heading2: 'text-2xl font-bold text-gray-800 mt-6 mb-3 border-b border-gray-200 pb-2',
    heading3: 'text-xl font-semibold text-gray-700 mt-5 mb-2',
    heading4: 'text-base font-semibold text-gray-700 mt-4 mb-1',
    paragraph: 'text-base text-gray-700 leading-relaxed mb-4',
    listItem: 'text-base text-gray-700 leading-relaxed',
    code: 'bg-gray-100 text-gray-800',
    table: 'border-gray-200',
    tableHeader: 'bg-gray-50 text-gray-700 font-semibold',
    tableRow: 'border-gray-200 text-gray-700',
    quote: 'border-blue-400 bg-blue-50 text-blue-900',
    divider: 'border-gray-200',
  },
  academic: {
    page: 'bg-white text-gray-900 font-serif',
    heading1: 'text-3xl font-bold text-gray-900 mt-8 mb-4 font-serif',
    heading2: 'text-2xl font-bold text-gray-800 mt-6 mb-3 border-b-2 border-gray-400 pb-1 font-serif',
    heading3: 'text-xl font-semibold text-gray-700 mt-5 mb-2 font-serif',
    heading4: 'text-base font-semibold text-gray-700 mt-4 mb-1 font-serif',
    paragraph: 'text-base text-gray-700 leading-loose mb-4 text-justify font-serif',
    listItem: 'text-base text-gray-700 leading-loose font-serif',
    code: 'bg-gray-100 text-gray-800 font-mono',
    table: 'border-gray-400',
    tableHeader: 'bg-gray-100 text-gray-800 font-bold',
    tableRow: 'border-gray-300 text-gray-700',
    quote: 'border-gray-500 bg-gray-50 text-gray-700 italic',
    divider: 'border-gray-400',
  },
  business: {
    page: 'bg-white text-gray-900',
    heading1: 'text-3xl font-bold text-blue-900 mt-8 mb-4',
    heading2: 'text-2xl font-bold text-blue-800 mt-6 mb-3 border-b-2 border-blue-600 pb-1',
    heading3: 'text-xl font-semibold text-blue-700 mt-5 mb-2',
    heading4: 'text-base font-semibold text-blue-700 mt-4 mb-1',
    paragraph: 'text-base text-gray-700 leading-relaxed mb-4',
    listItem: 'text-base text-gray-700 leading-relaxed',
    code: 'bg-slate-100 text-slate-800',
    table: 'border-blue-200',
    tableHeader: 'bg-blue-700 text-white font-semibold',
    tableRow: 'border-blue-100 text-gray-700',
    quote: 'border-blue-500 bg-blue-50 text-blue-900',
    divider: 'border-blue-200',
  },
  minimal: {
    page: 'bg-white text-gray-800',
    heading1: 'text-2xl font-light text-gray-900 mt-8 mb-4 tracking-tight',
    heading2: 'text-xl font-normal text-gray-800 mt-6 mb-3',
    heading3: 'text-lg font-medium text-gray-700 mt-5 mb-2',
    heading4: 'text-base font-medium text-gray-700 mt-4 mb-1',
    paragraph: 'text-sm text-gray-600 leading-relaxed mb-4',
    listItem: 'text-sm text-gray-600 leading-relaxed',
    code: 'bg-gray-50 text-gray-700 border border-gray-100',
    table: 'border-gray-100',
    tableHeader: 'bg-gray-50 text-gray-600 font-medium',
    tableRow: 'border-gray-100 text-gray-600',
    quote: 'border-gray-300 bg-transparent text-gray-500 italic',
    divider: 'border-gray-100',
  },
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface DocumentCtx {
  data: DocumentProps['data'];
  options: DocumentProps['options'];
  isFullscreen: boolean;
  setIsFullscreen: (v: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
  t: typeof themes[keyof typeof themes];
}

const DocumentContext = createContext<DocumentCtx | null>(null);

function useDocumentContext() {
  const ctx = useContext(DocumentContext);
  if (!ctx) throw new Error('Must be used inside <DocumentTemplate>');
  return ctx;
}

// ─── Section renderer ─────────────────────────────────────────────────────────

function SectionRenderer({ section, t }: { section: DocumentSection; t: typeof themes[keyof typeof themes] }) {
  switch (section.type) {
    case 'heading': {
      const level = section.level ?? 2;
      const cls = level === 1 ? t.heading1 : level === 2 ? t.heading2 : level === 3 ? t.heading3 : t.heading4;
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4';
      return <Tag className={cls}>{section.text}</Tag>;
    }

    case 'paragraph':
      return (
        <p className={cn(t.paragraph, section.align === 'center' && 'text-center', section.align === 'right' && 'text-right')}>
          {section.text}
        </p>
      );

    case 'bulletList':
      return (
        <ul className="list-none space-y-2 mb-4 pl-4">
          {(section.items ?? []).map((item, i) => (
            <li key={i} className={cn('flex items-start gap-2', t.listItem)}>
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-current shrink-0 opacity-60" />
              {item}
            </li>
          ))}
        </ul>
      );

    case 'numberedList':
      return (
        <ol className="list-none space-y-2 mb-4 pl-4">
          {(section.items ?? []).map((item, i) => (
            <li key={i} className={cn('flex items-start gap-3', t.listItem)}>
              <span className="font-semibold text-sm opacity-60 mt-0.5 w-5 shrink-0">{i + 1}.</span>
              {item}
            </li>
          ))}
        </ol>
      );

    case 'table':
      return (
        <div className="overflow-x-auto mb-6">
          <table className={cn('w-full border-collapse border text-sm', t.table)}>
            {section.headers && (
              <thead>
                <tr>
                  {section.headers.map((h, i) => (
                    <th key={i} className={cn('border px-4 py-2 text-left', t.table, t.tableHeader)}>{h}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {(section.rows ?? []).map((row, ri) => (
                <tr key={ri} className={ri % 2 === 1 ? 'bg-gray-50/50' : ''}>
                  {row.map((cell, ci) => (
                    <td key={ci} className={cn('border px-4 py-2', t.table, t.tableRow)}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'divider':
      return <hr className={cn('my-6 border-t', t.divider)} />;

    case 'code':
      return (
        <pre className={cn('rounded-lg p-4 mb-4 text-sm overflow-x-auto', t.code)}>
          <code>{section.text}</code>
        </pre>
      );

    case 'quote':
      return (
        <blockquote className={cn('border-l-4 pl-4 py-2 my-4 rounded-r', t.quote)}>
          <p className="text-base italic">{section.text}</p>
          {section.caption && <cite className="text-sm mt-1 block opacity-70">— {section.caption}</cite>}
        </blockquote>
      );

    case 'image':
      return (
        <figure className="mb-6">
          {section.url && (
            <img src={section.url} alt={section.caption ?? ''} className="w-full rounded-lg object-contain max-h-96" />
          )}
          {section.caption && <figcaption className="text-center text-sm text-gray-500 mt-2">{section.caption}</figcaption>}
        </figure>
      );

    case 'callout': {
      const calloutStyles: Record<string, string> = {
        info: 'bg-blue-50 border-blue-400 text-blue-900',
        warning: 'bg-yellow-50 border-yellow-400 text-yellow-900',
        success: 'bg-green-50 border-green-400 text-green-900',
        error: 'bg-red-50 border-red-400 text-red-900',
      };
      const calloutIcons: Record<string, string> = {
        info: 'ℹ️', warning: '⚠️', success: '✅', error: '❌',
      };
      const style = section.style ?? 'info';
      return (
        <div className={cn('border-l-4 rounded-r-lg px-4 py-3 mb-4 flex gap-3', calloutStyles[style])}>
          <span>{calloutIcons[style]}</span>
          <p className="text-base">{section.text}</p>
        </div>
      );
    }

    default:
      return null;
  }
}

// ─── Compound components ──────────────────────────────────────────────────────

export function DocumentHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
      {children}
    </div>
  );
}

export function DocumentTitle() {
  const { data } = useDocumentContext();
  return <span className="text-sm font-medium text-foreground truncate">{data.title}</span>;
}

export function DocumentActions({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-1">{children}</div>;
}

export function DocumentDownloadButton() {
  const { data } = useDocumentContext();
  const [loading, setLoading] = useState(false);

  const handleExport = useCallback(async () => {
    setLoading(true);
    try {
      const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType } = await import('docx');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const children: any[] = [];

      // Title
      children.push(new Paragraph({
        text: data.title,
        heading: HeadingLevel.TITLE,
        spacing: { after: 200 },
      }));

      if (data.subtitle) {
        children.push(new Paragraph({
          children: [new TextRun({ text: data.subtitle, size: 28, color: '555555' })],
          spacing: { after: 400 },
        }));
      }

      if (data.author || data.date) {
        children.push(new Paragraph({
          children: [new TextRun({ text: [data.author, data.date].filter(Boolean).join(' · '), size: 22, color: '888888' })],
          spacing: { after: 600 },
        }));
      }

      for (const section of data.sections) {
        switch (section.type) {
          case 'heading': {
            const levels: Record<number, typeof HeadingLevel[keyof typeof HeadingLevel]> = {
              1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2,
              3: HeadingLevel.HEADING_3, 4: HeadingLevel.HEADING_4,
            };
            children.push(new Paragraph({ text: section.text ?? '', heading: levels[section.level ?? 2] ?? HeadingLevel.HEADING_2, spacing: { before: 240, after: 120 } }));
            break;
          }
          case 'paragraph':
            children.push(new Paragraph({ text: section.text ?? '', spacing: { after: 200 } }));
            break;
          case 'bulletList':
            for (const item of section.items ?? []) {
              children.push(new Paragraph({ text: item, bullet: { level: 0 }, spacing: { after: 80 } }));
            }
            break;
          case 'numberedList':
            for (const item of section.items ?? []) {
              children.push(new Paragraph({ text: item, numbering: { reference: 'default-numbering', level: 0 }, spacing: { after: 80 } }));
            }
            break;
          case 'quote':
            children.push(new Paragraph({
              children: [new TextRun({ text: `"${section.text ?? ''}"`, italics: true, color: '555555' })],
              indent: { left: 720 },
              spacing: { before: 160, after: 160 },
            }));
            break;
          case 'code':
            children.push(new Paragraph({
              children: [new TextRun({ text: section.text ?? '', font: 'Courier New', size: 20, color: '333333' })],
              shading: { type: 'clear', fill: 'F5F5F5' },
              spacing: { before: 160, after: 160 },
            }));
            break;
          case 'divider':
            children.push(new Paragraph({ text: '', spacing: { after: 200 } }));
            break;
          case 'table':
            if (section.headers || section.rows?.length) {
              const rows: InstanceType<typeof TableRow>[] = [];
              if (section.headers) {
                rows.push(new TableRow({
                  children: section.headers.map(h => new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: h, bold: true })] })],
                    shading: { type: 'clear', fill: 'EEEEEE' },
                  })),
                }));
              }
              for (const row of section.rows ?? []) {
                rows.push(new TableRow({
                  children: row.map(cell => new TableCell({
                    children: [new Paragraph({ text: cell })],
                  })),
                }));
              }
              children.push(new Table({
                rows,
                width: { size: 100, type: WidthType.PERCENTAGE },
              }));
            }
            break;
        }
      }

      const doc = new Document({
        sections: [{ children }],
        numbering: {
          config: [{
            reference: 'default-numbering',
            levels: [{ level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.LEFT }],
          }],
        },
      });

      const blob = await Packer.toBlob(doc);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.title.replace(/\s+/g, '_')}.docx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('[Document] Export failed:', e);
    } finally {
      setLoading(false);
    }
  }, [data]);

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
    >
      <Download className="w-3.5 h-3.5" />
      {loading ? 'Exporting…' : '.docx'}
    </button>
  );
}

export function DocumentCopyButton() {
  const { data } = useDocumentContext();
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    const text = data.sections
      .map(s => {
        if (s.type === 'heading') return `${'#'.repeat(s.level ?? 2)} ${s.text}`;
        if (s.type === 'paragraph') return s.text;
        if (s.type === 'bulletList') return (s.items ?? []).map(i => `• ${i}`).join('\n');
        if (s.type === 'numberedList') return (s.items ?? []).map((i, n) => `${n + 1}. ${i}`).join('\n');
        if (s.type === 'quote') return `> ${s.text}`;
        if (s.type === 'divider') return '---';
        if (s.type === 'code') return `\`\`\`\n${s.text}\n\`\`\``;
        return s.text ?? '';
      })
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data]);
  return (
    <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export function DocumentFullscreenButton() {
  const { isFullscreen, setIsFullscreen, containerRef } = useDocumentContext();
  const toggle = useCallback(() => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen, setIsFullscreen, containerRef]);
  return (
    <button onClick={toggle} className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors">
      {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
    </button>
  );
}

export function DocumentContent() {
  const { data, options, t } = useDocumentContext();
  const height = options?.height ?? 640;


  return (
    <div
      className="overflow-y-auto bg-gray-100"
      style={{ height }}
    >
      {/* Paper page */}
      <div className={cn('max-w-[210mm] mx-auto my-6 shadow-md rounded-sm px-16 py-12 min-h-[297mm]', t.page)}>
        {/* Document header */}
        <header className="mb-8 pb-4 border-b border-gray-200">
          <h1 className={cn('text-4xl font-bold mb-2', t.heading1.split(' ').filter(c => !c.startsWith('mt-') && !c.startsWith('mb-')).join(' '))}>{data.title}</h1>
          {data.subtitle && <p className="text-lg text-gray-500 mt-1">{data.subtitle}</p>}
          {(data.author || data.date) && (
            <p className="text-sm text-gray-400 mt-2">{[data.author, data.date].filter(Boolean).join(' · ')}</p>
          )}
        </header>

        {/* Sections */}
        {data.sections.map((section, i) => (
          <SectionRenderer key={i} section={section} t={t} />
        ))}
      </div>
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export const DocumentTemplate = ({
  data,
  options,
  children,
}: DocumentProps & { children?: React.ReactNode }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const themeName = (options?.theme ?? 'default') as keyof typeof themes;
  const t = themes[themeName] ?? themes.default;

  return (
    <DocumentContext.Provider value={{ data, options, isFullscreen, setIsFullscreen, containerRef, t }}>
      <div ref={containerRef} className="rounded-xl overflow-hidden border border-border shadow-lg bg-background">
        {children}
      </div>
    </DocumentContext.Provider>
  );
};
