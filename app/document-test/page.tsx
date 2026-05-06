export const dynamic = 'force-dynamic';

import {
  DocumentTemplate,
  DocumentHeader,
  DocumentTitle,
  DocumentActions,
  DocumentCopyButton,
  DocumentDownloadButton,
  DocumentFullscreenButton,
  DocumentContent,
} from '@/components/ai-elements/document-template';

const testData = {
  title: 'Project Proposal: New Analytics Dashboard',
  subtitle: 'Q3 2026 Initiative',
  author: 'Engineering Team',
  date: 'May 2026',
  sections: [
    { type: 'heading' as const, level: 1 as const, text: 'Executive Summary' },
    { type: 'paragraph' as const, text: 'This proposal outlines the development of a new analytics dashboard to improve visibility into key business metrics and empower data-driven decision making across all teams.' },
    { type: 'callout' as const, style: 'info' as const, text: 'Estimated completion: 8 weeks. Total budget required: $40,000.' },
    { type: 'heading' as const, level: 2 as const, text: 'Goals' },
    { type: 'bulletList' as const, items: ['Real-time data visualization', 'Role-based access control', 'Mobile-responsive design', 'Export to CSV and PDF'] },
    { type: 'heading' as const, level: 2 as const, text: 'Timeline' },
    { type: 'table' as const, headers: ['Phase', 'Duration', 'Owner', 'Status'], rows: [['Discovery', '1 week', 'PM', 'Complete'], ['Design', '2 weeks', 'Design', 'In Progress'], ['Development', '4 weeks', 'Engineering', 'Upcoming'], ['QA & Launch', '1 week', 'QA', 'Upcoming']] },
    { type: 'heading' as const, level: 2 as const, text: 'Technical Approach' },
    { type: 'paragraph' as const, text: 'The dashboard will be built using Next.js 16 with React Server Components for optimal performance. Data will be fetched from our existing API layer.' },
    { type: 'code' as const, language: 'typescript', text: 'const dashboard = await fetchDashboardData({\n  range: "30d",\n  metrics: ["revenue", "users", "retention"]\n});' },
    { type: 'divider' as const },
    { type: 'heading' as const, level: 2 as const, text: 'Risks & Mitigations' },
    { type: 'callout' as const, style: 'warning' as const, text: 'Third-party API dependency may introduce latency. Mitigation: implement a caching layer with Redis.' },
    { type: 'callout' as const, style: 'success' as const, text: 'Existing design system components can be reused, reducing UI development time by ~30%.' },
    { type: 'heading' as const, level: 2 as const, text: 'Conclusion' },
    { type: 'quote' as const, text: 'Data is the new oil — but only if you can see it clearly.', caption: 'Engineering Team' },
    { type: 'paragraph' as const, text: 'We recommend proceeding with this initiative in Q3. The projected ROI within 6 months justifies the investment.' },
  ],
};

export default function DocumentTestPage() {
  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Document Test</h1>
        <p className="text-muted-foreground mt-1">Formatted document renderer with .docx export</p>
      </div>
      <DocumentTemplate data={testData} options={{ height: 640, theme: 'business' }}>
        <DocumentHeader>
          <DocumentTitle />
          <DocumentActions>
            <DocumentCopyButton />
            <DocumentDownloadButton />
            <DocumentFullscreenButton />
          </DocumentActions>
        </DocumentHeader>
        <DocumentContent />
      </DocumentTemplate>
    </div>
  );
}
