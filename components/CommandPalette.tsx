'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'motion/react';
import { useTranslations } from 'next-intl';
import { NAV, SITE } from '@/lib/site';
import { projects } from '@/lib/projects';

interface Cmd {
  id: string;
  group: 'Pages' | 'Projects' | 'Actions';
  label: string;
  hint?: string;
  run: (router: ReturnType<typeof useRouter>) => void | Promise<void>;
}

/** Subsequence fuzzy match: returns a score (higher = better) or -1. */
function fuzzy(query: string, target: string): number {
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (!q) return 0;
  let qi = 0;
  let score = 0;
  let streak = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      qi++;
      streak++;
      score += streak * (ti === 0 || t[ti - 1] === ' ' ? 3 : 1);
    } else {
      streak = 0;
    }
  }
  return qi === q.length ? score : -1;
}

/**
 * Ctrl/Cmd+K command palette: fuzzy jump to any page, project case study,
 * or quick action (sound, email, CV, game). Opens via keyboard or the
 * header hint button (custom 'nv:cmdk' event). Pauses Lenis while open.
 */
export default function CommandPalette() {
  const router = useRouter();
  const tNav = useTranslations('nav');
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands = useMemo<Cmd[]>(
    () => [
      ...NAV.map<Cmd>((n) => ({
        id: `page-${n.to}`,
        group: 'Pages',
        label: tNav(n.key),
        hint: n.to,
        run: (r) => r.push(n.to),
      })),
      ...projects.map<Cmd>((p) => ({
        id: `proj-${p.id}`,
        group: 'Projects',
        label: p.name,
        hint: p.tagline,
        run: (r) => r.push(`/projects/${p.id}`),
      })),
      {
        id: 'act-sound',
        group: 'Actions',
        label: 'Toggle ambient sound',
        hint: 'on / off',
        run: () => {
          window.dispatchEvent(new CustomEvent('nv:sound-toggle'));
        },
      },
      {
        id: 'act-email',
        group: 'Actions',
        label: 'Copy email address',
        hint: SITE.email,
        run: async () => {
          await navigator.clipboard.writeText(SITE.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 1400);
        },
      },
      {
        id: 'act-cv',
        group: 'Actions',
        label: 'Download CV',
        hint: 'PDF',
        run: () => {
          window.open('/assets/Bilel-Hedhli-CV.pdf', '_blank', 'noreferrer');
        },
      },
      {
        id: 'act-play',
        group: 'Actions',
        label: 'Play Deploy Run',
        hint: 'the game',
        run: (r) => r.push('/play'),
      },
    ],
    [tNav]
  );

  const results = useMemo(() => {
    const scored = commands
      .map((c) => ({ c, s: fuzzy(query, `${c.label} ${c.hint ?? ''}`) }))
      .filter((x) => x.s >= 0);
    if (query) scored.sort((a, b) => b.s - a.s);
    return scored.map((x) => x.c);
  }, [commands, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
  }, []);

  // global open triggers: Ctrl/Cmd+K and the header hint button
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('nv:cmdk', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('nv:cmdk', onOpen);
    };
  }, []);

  // while open: focus input, pause Lenis so arrows/wheel don't scroll the page
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    lenis?.stop();
    return () => lenis?.start();
  }, [open]);

  useEffect(() => setActive(0), [query]);

  // keep the active row in view
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [active, results]);

  const exec = (cmd: Cmd) => {
    void cmd.run(router);
    if (cmd.id !== 'act-email') close();
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      e.preventDefault();
      exec(results[active]);
    }
  };

  let lastGroup = '';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmdk"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onPointerDown={(e) => e.target === e.currentTarget && close()}
        >
          <motion.div
            className="cmdk__panel"
            initial={{ opacity: 0, y: 14, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ type: 'spring', stiffness: 480, damping: 38 }}
          >
            <div className="cmdk__head">
              <input
                ref={inputRef}
                className="cmdk__input"
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="cmdk-list"
                aria-activedescendant={results[active]?.id}
                placeholder="Jump to a page, project, action…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                spellCheck={false}
                autoComplete="off"
              />
              <kbd className="cmdk__esc">esc</kbd>
            </div>
            <div className="cmdk__list" id="cmdk-list" role="listbox" ref={listRef}>
              {results.length === 0 && <div className="cmdk__empty">No matches.</div>}
              {results.map((cmd, i) => {
                const showGroup = cmd.group !== lastGroup;
                lastGroup = cmd.group;
                return (
                  <div key={cmd.id}>
                    {showGroup && <div className="cmdk__group">{cmd.group}</div>}
                    <button
                      type="button"
                      id={cmd.id}
                      role="option"
                      aria-selected={i === active}
                      data-active={i === active}
                      className="cmdk__item"
                      onPointerMove={() => setActive(i)}
                      onClick={() => exec(cmd)}
                    >
                      <span className="cmdk__label">
                        {cmd.id === 'act-email' && copied ? 'Copied ✓' : cmd.label}
                      </span>
                      {cmd.hint && <span className="cmdk__hint">{cmd.hint}</span>}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
