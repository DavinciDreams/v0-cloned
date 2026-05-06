export const dynamic = 'force-dynamic';

import {
  Presentation,
  PresentationHeader,
  PresentationTitle,
  PresentationActions,
  PresentationCopyButton,
  PresentationDownloadButton,
  PresentationFullscreenButton,
  PresentationContent,
} from '@/components/ai-elements/presentation';

const testData = {
  title: 'Acme Inc. — Series A Pitch',
  theme: 'professional' as const,
  slides: [
    { id: 's1', layout: 'title' as const, title: 'Acme Inc.', subtitle: 'The future of widget manufacturing', author: 'Jane Smith, CEO' },
    { id: 's2', layout: 'content' as const, title: 'The Problem', bullets: ['Widgets take 3 weeks to deliver', 'Quality is inconsistent', 'Costs rising 20% YoY'] },
    { id: 's3', layout: 'two-column' as const, title: 'Our Solution', leftTitle: 'Before', leftBullets: ['Manual process', '21 days', '$50/unit'], rightTitle: 'After', rightBullets: ['Automated pipeline', '2 days', '$12/unit'] },
    { id: 's4', layout: 'comparison' as const, title: 'Competitive Landscape', leftTitle: 'Competitors', leftBullets: ['Slow delivery', 'No customization', 'High cost'], rightTitle: 'Acme', rightBullets: ['2-day delivery', 'Fully custom', '$12/unit'] },
    { id: 's5', layout: 'content' as const, title: 'Traction', bullets: ['$2M ARR', '150 customers', '40% MoM growth'], notes: 'Emphasize the growth rate here.' },
    { id: 's6', layout: 'quote' as const, quote: 'Acme cut our delivery time by 90%. We will never go back.', author: 'Bob Lee, VP Operations at Globex' },
  ],
};

export default function PresentationTestPage() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Presentation Test</h1>
        <p className="text-muted-foreground mt-1">Interactive slide deck with .pptx export</p>
      </div>
      <Presentation data={testData} options={{ height: 520, aspectRatio: '16:9' }}>
        <PresentationHeader>
          <PresentationTitle />
          <PresentationActions>
            <PresentationCopyButton />
            <PresentationDownloadButton />
            <PresentationFullscreenButton />
          </PresentationActions>
        </PresentationHeader>
        <PresentationContent />
      </Presentation>
    </div>
  );
}
