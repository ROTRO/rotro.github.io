'use client';

import { useState, type FormEvent } from 'react';
import { useTranslations } from 'next-intl';
import { EnvelopeSimple } from '@phosphor-icons/react';
import { SITE } from '@/lib/site';

type Field = 'name' | 'from' | 'message';
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Contact form with no backend: validates inline, then opens the visitor's
 * mail app with the message pre-filled (mailto:). Nothing is "sent" by the
 * page itself, and the helper text says so.
 */
export default function MailForm() {
  const t = useTranslations('v2.contact');
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get('name') ?? '').trim();
    const from = String(data.get('from') ?? '').trim();
    const message = String(data.get('message') ?? '').trim();

    const next: Partial<Record<Field, string>> = {};
    if (!name) next.name = t('errName');
    if (!EMAIL.test(from)) next.from = t('errEmail');
    if (!message) next.message = t('errMessage');
    setErrors(next);

    const firstBad = (['name', 'from', 'message'] as Field[]).find((f) => next[f]);
    if (firstBad) {
      e.currentTarget.querySelector<HTMLElement>(`[name="${firstBad}"]`)?.focus();
      return;
    }

    const subject = encodeURIComponent(t('subject', { name }));
    const body = encodeURIComponent(`${message}\n\n${name}\n${from}`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  };

  const field = (id: Field, label: string, multiline = false, help?: string) => {
    const err = errors[id];
    const describedBy = [help ? `${id}-help` : null, err ? `${id}-err` : null].filter(Boolean).join(' ') || undefined;
    const common = {
      id,
      name: id,
      'aria-invalid': err ? true : undefined,
      'aria-describedby': describedBy,
    };
    return (
      <div className="field">
        <label htmlFor={id}>{label}</label>
        {multiline ? (
          <textarea {...common} rows={5} />
        ) : (
          <input {...common} type={id === 'from' ? 'email' : 'text'} autoComplete={id === 'from' ? 'email' : 'name'} />
        )}
        {help && <span className="help" id={`${id}-help`}>{help}</span>}
        {err && <span className="err" id={`${id}-err`}>{err}</span>}
      </div>
    );
  };

  return (
    <form className="form" noValidate onSubmit={onSubmit} data-rv>
      <h2>{t('formTitle')}</h2>
      {field('name', t('name'))}
      {field('from', t('from'))}
      {field('message', t('message'), true, t('messageHelp'))}
      <div className="field">
        <button type="submit" className="pill pill--accent" style={{ width: 'fit-content' }} aria-describedby="send-help">
          {t('send')}
          <EnvelopeSimple size={18} weight="bold" aria-hidden="true" />
        </button>
        <span className="help" id="send-help">{t('sendHelp')}</span>
      </div>
    </form>
  );
}
