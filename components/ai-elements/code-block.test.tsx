import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  CodeBlock,
  CodeBlockContainer,
  CodeBlockHeader,
  CodeBlockTitle,
  CodeBlockFilename,
  CodeBlockActions,
  CodeBlockContent,
  CodeBlockCopyButton,
  highlightCode,
} from './code-block';


// Mock shiki
vi.mock('shiki', () => ({
  createHighlighter: vi.fn(() =>
    Promise.resolve({
      getLoadedLanguages: () => ['javascript', 'typescript', 'python'],
      codeToTokens: (code: string) => ({
        tokens: code.split('\n').map((line) => [
          {
            content: line,
            color: '#000000',
          },
        ]),
        fg: '#000000',
        bg: '#ffffff',
      }),
    })
  ),
}));

const sampleCode = `function hello() {
  console.log('Hello, World!');
}`;

const pythonCode = `def hello():
    print("Hello, World!")`;

// vitest.setup.ts installs navigator.clipboard as an own property with vi.fn() mocks.
// Replacing navigator.clipboard via Object.defineProperty doesn't work reliably because
// happy-dom may return the original object via its prototype getter regardless.
// Instead we mutate writeText directly on the existing clipboard object each beforeEach,
// and keep a local reference so assertions don't depend on navigator.clipboard identity.
let writeTextMock: ReturnType<typeof vi.fn>;

describe('CodeBlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    writeTextMock = vi.fn().mockResolvedValue(undefined);
    // Mutate the clipboard object that setup.ts installed in-place.
    (navigator.clipboard as any).writeText = writeTextMock;
  });

  describe('CodeBlock Container', () => {
    it('renders code block', () => {
      render(<CodeBlock code={sampleCode} language="javascript" />);
      expect(screen.getByText(/function hello/)).toBeInTheDocument();
    });

    it('renders with line numbers when enabled', () => {
      const { container } = render(
        <CodeBlock code={sampleCode} language="javascript" showLineNumbers />
      );
      const codeElement = container.querySelector('code');
      expect(codeElement).toHaveClass('[counter-increment:line_0]');
    });

    it('renders without line numbers by default', () => {
      const { container } = render(
        <CodeBlock code={sampleCode} language="javascript" />
      );
      const codeElement = container.querySelector('code');
      expect(codeElement).not.toHaveClass('[counter-increment:line_0]');
    });

    it('applies custom className', () => {
      const { container } = render(
        <CodeBlock code={sampleCode} language="javascript" className="custom-class" />
      );
      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('renders children alongside code', () => {
      render(
        <CodeBlock code={sampleCode} language="javascript">
          <div data-testid="custom-child">Custom content</div>
        </CodeBlock>
      );
      expect(screen.getByTestId('custom-child')).toBeInTheDocument();
      expect(screen.getByText(/function hello/)).toBeInTheDocument();
    });
  });

  describe('Language Support', () => {
    it('renders JavaScript code', () => {
      render(<CodeBlock code={sampleCode} language="javascript" />);
      expect(screen.getByText(/function hello/)).toBeInTheDocument();
    });

    it('renders TypeScript code', () => {
      const tsCode = 'const x: number = 42;';
      render(<CodeBlock code={tsCode} language="typescript" />);
      expect(screen.getByText(/const x: number/)).toBeInTheDocument();
    });

    it('renders Python code', () => {
      render(<CodeBlock code={pythonCode} language="python" />);
      expect(screen.getByText(/def hello/)).toBeInTheDocument();
    });

    it('sets data-language attribute', () => {
      const { container } = render(
        <CodeBlock code={sampleCode} language="javascript" />
      );
      const codeBlock = container.querySelector('[data-language]');
      expect(codeBlock).toHaveAttribute('data-language', 'javascript');
    });
  });

  describe('CodeBlockContainer', () => {
    it('renders container with language attribute', () => {
      const { container } = render(
        <CodeBlockContainer language="javascript">
          <div>Content</div>
        </CodeBlockContainer>
      );
      expect(container.firstChild).toHaveAttribute('data-language', 'javascript');
    });

    it('applies content visibility optimization', () => {
      const { container } = render(
        <CodeBlockContainer language="javascript">
          <div>Content</div>
        </CodeBlockContainer>
      );
      expect(container.firstChild).toHaveStyle({
        contentVisibility: 'auto',
        containIntrinsicSize: 'auto 200px',
      });
    });
  });

  describe('CodeBlockHeader', () => {
    it('renders header with children', () => {
      render(
        <CodeBlockHeader>
          <span data-testid="header-content">Header</span>
        </CodeBlockHeader>
      );
      expect(screen.getByTestId('header-content')).toBeInTheDocument();
    });

    it('applies header styling', () => {
      const { container } = render(<CodeBlockHeader>Header</CodeBlockHeader>);
      expect(container.firstChild).toHaveClass('bg-muted/80', 'border-b');
    });
  });

  describe('CodeBlockTitle', () => {
    it('renders title with children', () => {
      render(<CodeBlockTitle>example.js</CodeBlockTitle>);
      expect(screen.getByText('example.js')).toBeInTheDocument();
    });
  });

  describe('CodeBlockFilename', () => {
    it('renders filename', () => {
      render(<CodeBlockFilename>example.js</CodeBlockFilename>);
      expect(screen.getByText('example.js')).toBeInTheDocument();
    });

    it('applies monospace font', () => {
      const { container } = render(<CodeBlockFilename>example.js</CodeBlockFilename>);
      expect(container.firstChild).toHaveClass('font-mono');
    });
  });

  describe('CodeBlockActions', () => {
    it('renders actions container with children', () => {
      render(
        <CodeBlockActions>
          <button data-testid="action-btn">Action</button>
        </CodeBlockActions>
      );
      expect(screen.getByTestId('action-btn')).toBeInTheDocument();
    });
  });

  describe('CodeBlockCopyButton', () => {
    it('renders copy button', () => {
      render(
        <CodeBlock code={sampleCode} language="javascript">
          <CodeBlockCopyButton />
        </CodeBlock>
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows copy icon initially', () => {
      render(
        <CodeBlock code={sampleCode} language="javascript">
          <CodeBlockCopyButton />
        </CodeBlock>
      );
      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('copies code to clipboard on click', async () => {
      const user = userEvent.setup();
      render(
        <CodeBlock code={sampleCode} language="javascript">
          <CodeBlockCopyButton />
        </CodeBlock>
      );

      // Spy immediately before click so we intercept the exact call
      const writeTextSpy = vi
        .spyOn(navigator.clipboard, 'writeText')
        .mockResolvedValue(undefined);

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(writeTextSpy).toHaveBeenCalledWith(sampleCode);
      });

      writeTextSpy.mockRestore();
    });

    it('shows check icon after successful copy', async () => {
      const user = userEvent.setup();
      render(
        <CodeBlock code={sampleCode} language="javascript">
          <CodeBlockCopyButton />
        </CodeBlock>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(button.querySelector('svg')).toBeInTheDocument();
      });
    });

    it('calls onCopy callback when provided', async () => {
      const user = userEvent.setup();
      const onCopy = vi.fn();
      render(
        <CodeBlock code={sampleCode} language="javascript">
          <CodeBlockCopyButton onCopy={onCopy} />
        </CodeBlock>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(onCopy).toHaveBeenCalledTimes(1);
      });
    });

    it('calls onError callback when copy fails', async () => {
      const user = userEvent.setup();
      const onError = vi.fn();

      writeTextMock.mockRejectedValueOnce(new Error('Copy failed'));

      render(
        <CodeBlock code={sampleCode} language="javascript">
          <CodeBlockCopyButton onError={onError} />
        </CodeBlock>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      await waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });

    it('accepts custom timeout', async () => {
      const user = userEvent.setup();
      render(
        <CodeBlock code={sampleCode} language="javascript">
          <CodeBlockCopyButton timeout={100} />
        </CodeBlock>
      );

      const button = screen.getByRole('button');
      await user.click(button);

      // Icon should change back after custom timeout
      await waitFor(
        () => {
          expect(button.querySelector('svg')).toBeInTheDocument();
        },
        { timeout: 200 }
      );
    });
  });

  describe('CodeBlockContent', () => {
    it('renders code content', () => {
      render(<CodeBlockContent code={sampleCode} language="javascript" />);
      expect(screen.getByText(/function hello/)).toBeInTheDocument();
    });

    it('renders with line numbers', () => {
      const { container } = render(
        <CodeBlockContent code={sampleCode} language="javascript" showLineNumbers />
      );
      const codeElement = container.querySelector('code');
      expect(codeElement).toHaveClass('[counter-increment:line_0]');
    });

    it('handles multiline code', () => {
      render(<CodeBlockContent code={sampleCode} language="javascript" />);
      expect(screen.getByText(/function hello/)).toBeInTheDocument();
      expect(screen.getByText(/console.log/)).toBeInTheDocument();
    });

    it('handles empty code', () => {
      const { container } = render(
        <CodeBlockContent code="" language="javascript" />
      );
      expect(container.querySelector('pre')).toBeInTheDocument();
    });

    it('handles single line code', () => {
      render(<CodeBlockContent code="const x = 42;" language="javascript" />);
      expect(screen.getByText('const x = 42;')).toBeInTheDocument();
    });
  });

  describe('Composable Pattern', () => {
    it('renders complete code block with header and actions', () => {
      render(
        <CodeBlock code={sampleCode} language="javascript">
          <CodeBlockHeader>
            <CodeBlockTitle>
              <CodeBlockFilename>example.js</CodeBlockFilename>
            </CodeBlockTitle>
            <CodeBlockActions>
              <CodeBlockCopyButton />
            </CodeBlockActions>
          </CodeBlockHeader>
        </CodeBlock>
      );

      expect(screen.getByText('example.js')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText(/function hello/)).toBeInTheDocument();
    });

    it('works without header', () => {
      render(<CodeBlock code={sampleCode} language="javascript" />);
      expect(screen.getByText(/function hello/)).toBeInTheDocument();
    });
  });

  describe('highlightCode utility', () => {
    // Each test uses its own unique string so the module-level tokensCache
    // is always cold. Sharing the same key would cause test 2 to hit the
    // cache warm (populated by test 1's async work) and skip the callback.
    const uniqueCodeForCacheMiss = 'const CACHE_TEST_MISS = "highlightCode-cache-miss";';
    const uniqueCodeForCallback = 'const CACHE_TEST_CB = "highlightCode-cache-callback";';

    it('returns tokenized code synchronously when cached', () => {
      const result = highlightCode(uniqueCodeForCacheMiss, 'javascript');
      // First call returns null (not cached yet)
      expect(result).toBeNull();
    });

    it('calls callback with tokenized code asynchronously', async () => {
      const callback = vi.fn();
      highlightCode(uniqueCodeForCallback, 'javascript', callback);

      await waitFor(() => {
        expect(callback).toHaveBeenCalledWith(
          expect.objectContaining({
            tokens: expect.any(Array),
            fg: expect.any(String),
            bg: expect.any(String),
          })
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('uses semantic pre and code elements', () => {
      const { container } = render(
        <CodeBlock code={sampleCode} language="javascript" />
      );
      expect(container.querySelector('pre')).toBeInTheDocument();
      expect(container.querySelector('code')).toBeInTheDocument();
    });

    it('copy button is keyboard accessible', async () => {
      const user = userEvent.setup();
      render(
        <CodeBlock code={sampleCode} language="javascript">
          <CodeBlockCopyButton />
        </CodeBlock>
      );

      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(writeTextMock).toHaveBeenCalled();
      });
    });
  });

  describe('Performance', () => {
    it('applies content visibility for large code blocks', () => {
      const largeCode = Array(100)
        .fill('console.log("line");')
        .join('\n');
      const { container } = render(
        <CodeBlock code={largeCode} language="javascript" />
      );
      expect(container.firstChild).toHaveStyle({ contentVisibility: 'auto' });
    });
  });
});
