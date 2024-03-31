import { useEffect } from 'react';
import { useCallback, useState } from 'react';

export const useCopyToClipboard = (text: string) => {
  const [copied, setCopied] = useState<boolean>(false);

  const copy = useCallback(async () => {
    if (!navigator?.clipboard) {
      console.warn('Clipboard not supported');
      return false;
    }

    // Try to save to clipboard then set copied state if successful
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      return true;
    } catch (error) {
      console.warn('Copy failed', error);
      setCopied(false);
      return false;
    }
  }, []);

  // Clear copied state after 3 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => setCopied(false), 3000);
      return () => clearTimeout(timeout);
    }
  }, [copied]);

  return [copied, copy] as const;
};
