import { Button, Code, Tooltip } from '@radix-ui/themes';
import { Copy, Check } from 'lucide-react';
import { useCopyToClipboard } from './useCopyToClipboard';

export interface SnippetProps {
  code: string;
}

export const Snippet = ({ code }: SnippetProps) => {
  const [copied, copy] = useCopyToClipboard(code);
  return (
    <div className="snippet">
      <Code>{code}</Code>

      <Tooltip content={copied ? 'Copied!' : 'Copy'} side="top">
        <Button variant="ghost" onClick={copy}>
          {copied ? <Check color="var(--jade-11)" /> : <Copy />}
        </Button>
      </Tooltip>
    </div>
  );
};
