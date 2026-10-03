'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Copy } from '@phosphor-icons/react';

/** Copies an address to the clipboard and confirms inline for two seconds. */
export default function CopyEmail({ email }: { email: string }) {
  const t = useTranslations('v2.contact');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <button
      type="button"
      className="pill pill--ghost pill--sm"
      onClick={() => navigator.clipboard?.writeText(email).then(() => setCopied(true), () => undefined)}
    >
      {copied ? <Check size={16} weight="bold" aria-hidden="true" /> : <Copy size={16} weight="bold" aria-hidden="true" />}
      <span aria-live="polite">{copied ? t('copied') : t('copy')}</span>
    </button>
  );
}
