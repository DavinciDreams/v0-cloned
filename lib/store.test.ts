import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {
  useGenerativeUIStore,
  useMessages,
  useUIComponents,
  useAppState,
  type Message,
  type UIComponent,
} from './store';

const initialState = {
  messages: [] as Message[],
  uiComponents: {} as Record<string, UIComponent>,
  isLoading: false,
  error: null as string | null,
};

beforeEach(() => {
  act(() => {
    useGenerativeUIStore.setState(initialState);
  });
});

describe('initial state', () => {
  it('has empty messages array', () => {
    const { result } = renderHook(() => useGenerativeUIStore((s) => s.messages));
    expect(result.current).toEqual([]);
  });

  it('has empty uiComponents map', () => {
    const { result } = renderHook(() => useGenerativeUIStore((s) => s.uiComponents));
    expect(result.current).toEqual({});
  });

  it('is not loading', () => {
    const { result } = renderHook(() => useGenerativeUIStore((s) => s.isLoading));
    expect(result.current).toBe(false);
  });

  it('has no error', () => {
    const { result } = renderHook(() => useGenerativeUIStore((s) => s.error));
    expect(result.current).toBeNull();
  });
});

describe('addMessage', () => {
  it('adds a message to the messages array', () => {
    const { result } = renderHook(() => useGenerativeUIStore());
    const msg: Message = { id: 'msg-1', role: 'user', content: 'Hello' };

    act(() => { result.current.addMessage(msg); });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0]).toEqual(msg);
  });

  it('appends messages in order', () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => {
      result.current.addMessage({ id: 'msg-1', role: 'user', content: 'First' });
      result.current.addMessage({ id: 'msg-2', role: 'assistant', content: 'Second' });
    });

    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[1].id).toBe('msg-2');
  });
});

describe('updateMessage', () => {
  it("updates the target message's content", () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => {
      result.current.addMessage({ id: 'msg-1', role: 'user', content: 'Original' });
      result.current.addMessage({ id: 'msg-2', role: 'assistant', content: 'Old response' });
    });

    act(() => { result.current.updateMessage('msg-2', { content: 'Updated response' }); });

    const last = result.current.messages[result.current.messages.length - 1];
    expect(last.content).toBe('Updated response');
    expect(last.id).toBe('msg-2');
  });

  it('does not affect other messages', () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => {
      result.current.addMessage({ id: 'msg-1', role: 'user', content: 'First' });
      result.current.addMessage({ id: 'msg-2', role: 'assistant', content: 'Second' });
    });
    act(() => { result.current.updateMessage('msg-2', { content: 'Updated' }); });

    expect(result.current.messages[0].content).toBe('First');
  });
});

describe('clearMessages', () => {
  it('empties the messages array', () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => { result.current.addMessage({ id: 'msg-1', role: 'user', content: 'Hello' }); });
    act(() => { result.current.clearMessages(); });

    expect(result.current.messages).toEqual([]);
  });
});

describe('addUIComponent', () => {
  it('adds a component to the uiComponents map', () => {
    const { result } = renderHook(() => useGenerativeUIStore());
    const component: UIComponent = { id: 'comp-1', type: 'Button', props: { label: 'Click me' } };

    act(() => { result.current.addUIComponent(component); });

    expect(result.current.uiComponents['comp-1']).toEqual(component);
  });

  it('stores multiple components independently', () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => {
      result.current.addUIComponent({ id: 'a', type: 'Button', props: {} });
      result.current.addUIComponent({ id: 'b', type: 'Card', props: {} });
    });

    expect(Object.keys(result.current.uiComponents)).toHaveLength(2);
  });
});

describe('updateUIComponent', () => {
  it('merges updates into an existing component', () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => {
      result.current.addUIComponent({ id: 'comp-1', type: 'Button', props: { label: 'Old' } });
    });
    act(() => {
      result.current.updateUIComponent('comp-1', { props: { label: 'New', disabled: true } });
    });

    expect(result.current.uiComponents['comp-1'].props).toEqual({ label: 'New', disabled: true });
  });

  it('preserves fields not included in the update', () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => {
      result.current.addUIComponent({ id: 'comp-1', type: 'Button', props: { label: 'Keep' } });
    });
    act(() => { result.current.updateUIComponent('comp-1', { state: { active: true } }); });

    expect(result.current.uiComponents['comp-1'].type).toBe('Button');
    expect(result.current.uiComponents['comp-1'].props).toEqual({ label: 'Keep' });
  });
});

describe('removeUIComponent', () => {
  it('removes a component by id', () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => {
      result.current.addUIComponent({ id: 'comp-1', type: 'Button', props: {} });
      result.current.addUIComponent({ id: 'comp-2', type: 'Card', props: {} });
    });
    act(() => { result.current.removeUIComponent('comp-1'); });

    expect(result.current.uiComponents['comp-1']).toBeUndefined();
    expect(result.current.uiComponents['comp-2']).toBeDefined();
  });
});

describe('clearUIComponents', () => {
  it('empties the uiComponents map', () => {
    const { result } = renderHook(() => useGenerativeUIStore());

    act(() => { result.current.addUIComponent({ id: 'comp-1', type: 'Button', props: {} }); });
    act(() => { result.current.clearUIComponents(); });

    expect(result.current.uiComponents).toEqual({});
  });
});

describe('setLoading', () => {
  it('sets isLoading to true', () => {
    const { result } = renderHook(() => useGenerativeUIStore());
    act(() => { result.current.setLoading(true); });
    expect(result.current.isLoading).toBe(true);
  });

  it('sets isLoading back to false', () => {
    const { result } = renderHook(() => useGenerativeUIStore());
    act(() => { result.current.setLoading(true); });
    act(() => { result.current.setLoading(false); });
    expect(result.current.isLoading).toBe(false);
  });
});

describe('setError', () => {
  it('sets an error string', () => {
    const { result } = renderHook(() => useGenerativeUIStore());
    act(() => { result.current.setError('oops'); });
    expect(result.current.error).toBe('oops');
  });

  it('clears the error when set to null', () => {
    const { result } = renderHook(() => useGenerativeUIStore());
    act(() => { result.current.setError('oops'); });
    act(() => { result.current.setError(null); });
    expect(result.current.error).toBeNull();
  });
});

describe('useMessages hook', () => {
  it('exposes messages and actions', () => {
    const { result } = renderHook(() => useMessages());
    expect(Array.isArray(result.current.messages)).toBe(true);
    expect(typeof result.current.addMessage).toBe('function');
    expect(typeof result.current.clearMessages).toBe('function');
  });
});

describe('useUIComponents hook', () => {
  it('exposes uiComponents and actions', () => {
    const { result } = renderHook(() => useUIComponents());
    expect(typeof result.current.uiComponents).toBe('object');
    expect(typeof result.current.addUIComponent).toBe('function');
    expect(typeof result.current.getUIComponentsByType).toBe('function');
  });

  it('getUIComponentsByType filters by type', () => {
    act(() => {
      useGenerativeUIStore.getState().addUIComponent({ id: 'b1', type: 'Button', props: {} });
      useGenerativeUIStore.getState().addUIComponent({ id: 'c1', type: 'Card', props: {} });
      useGenerativeUIStore.getState().addUIComponent({ id: 'b2', type: 'Button', props: {} });
    });

    const { result } = renderHook(() => useUIComponents());
    const buttons = result.current.getUIComponentsByType('Button');
    expect(buttons).toHaveLength(2);
    expect(buttons.every((c) => c.type === 'Button')).toBe(true);
  });
});

describe('useAppState hook', () => {
  it('exposes isLoading, error, and setters', () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.setLoading).toBe('function');
    expect(typeof result.current.setError).toBe('function');
  });
});
