import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Type declaration for global afterEach (available in Vitest test environment)
declare global {
  const afterEach: (fn: () => void) => void;
}

// Cleanup after each test
afterEach(() => {
  cleanup();
  // Clear mock call history but keep spies intact
  vi.clearAllMocks();
});

// Extend Vitest's expect with jest-dom matchers
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Vi {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface Assertion extends jest.Matchers<void, any> {}
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface AsymmetricMatchersContaining extends jest.Matchers<void, any> {}
  }
}

// Mock ResizeObserver for components that use it
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Mock Clipboard API for testing
// We need a persistent mock that survives across tests
if (!('clipboard' in navigator) || !(navigator.clipboard?.writeText && typeof (navigator.clipboard.writeText as any).mockImplementation === 'function')) {
  const clipboardMock = {
    writeText: vi.fn(() => Promise.resolve()),
    readText: vi.fn(() => Promise.resolve('')),
  };

  // Try to delete any existing clipboard
  try {
    delete (navigator as any).clipboard;
  } catch {
    // Ignore if non-configurable
  }

  // Define mock clipboard
  Object.defineProperty(navigator, 'clipboard', {
    value: clipboardMock,
    writable: false,
    configurable: true,
  });
}
