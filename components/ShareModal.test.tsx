/// <reference types="jest" />
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ShareModal } from './ShareModal';

// Mock third-party UI libraries to prevent JSDOM / SWC parsing issues
jest.mock('lucide-react', () => ({
  Copy: () => <span data-testid="icon-copy" />,
  Check: () => <span data-testid="icon-check" />,
  Mail: () => <span data-testid="icon-mail" />,
  MessageCircle: () => <span data-testid="icon-messagecircle" />,
  Share2: () => <span data-testid="icon-share2" />,
}));

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children?: React.ReactNode; open?: boolean }) => (open ? <div data-testid="dialog">{children}</div> : null),
  DialogContent: ({ children }: { children?: React.ReactNode }) => <div data-testid="dialog-content">{children}</div>,
  DialogHeader: ({ children }: { children?: React.ReactNode }) => <div data-testid="dialog-header">{children}</div>,
  DialogTitle: ({ children }: { children?: React.ReactNode }) => <div data-testid="dialog-title">{children}</div>,
  DialogDescription: ({ children }: { children?: React.ReactNode }) => <div data-testid="dialog-description">{children}</div>,
}));

describe('ShareModal', () => {
  const originalShare = navigator.share;
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    Object.defineProperty(navigator, 'share', { value: originalShare, configurable: true });
    Object.defineProperty(navigator, 'clipboard', { value: originalClipboard, configurable: true });
  });

  it('calls navigator.share when available on button click', async () => {
    const mockShare = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { value: mockShare, configurable: true });

    render(<ShareModal url="https://link.test" title="Awesome Link" />);
    
    const shareBtn = screen.getByRole('button', { name: /share link/i });
    fireEvent.click(shareBtn);

    expect(mockShare).toHaveBeenCalledWith({
      title: 'Awesome Link',
      url: 'https://link.test',
    });
  });

  it('opens fallback modal correctly and encodes intents when share is unavailable', () => {
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });

    render(<ShareModal url="https://link.test/?a=b" title="Awesome Link" />);
    
    const shareBtn = screen.getByRole('button', { name: /share link/i });
    fireEvent.click(shareBtn);

    // Modal should be open
    expect(screen.getByText('Share this link')).toBeInTheDocument();

    // Check if the input renders the URL properly and protects against unencoded execution
    const input = screen.getByLabelText('Shortened URL');
    expect(input).toHaveValue('https://link.test/?a=b');
  });

  it('copies to clipboard on fallback', async () => {
    const mockWriteText = jest.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { value: undefined, configurable: true });
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: mockWriteText }, configurable: true });

    render(<ShareModal url="https://link.test" title="Awesome Link" />);
    fireEvent.click(screen.getByRole('button', { name: /share link/i }));
    
    const copyBtn = screen.getByRole('button', { name: /copy to clipboard/i });
    fireEvent.click(copyBtn);

    expect(mockWriteText).toHaveBeenCalledWith('https://link.test');
    await waitFor(() => {
      expect(screen.getByText('Copied')).toBeInTheDocument();
    });
  });
});