'use client';

import { useState } from 'react';

/**
 * Contact form. Currently shows a success state on submit without sending —
 * wire `onSubmit` to a real endpoint (Formspree, Resend, a route handler) to
 * actually deliver messages. See README.
 */
export default function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="card form ticks"
      data-reveal
      data-reveal-delay="1"
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <div className="row2">
        <div className="field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" placeholder="Your name" required readOnly={sent} />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="you@company.com" required readOnly={sent} />
        </div>
      </div>
      <div className="field">
        <label htmlFor="subject">Subject</label>
        <input id="subject" name="subject" type="text" placeholder="What's this about?" readOnly={sent} />
      </div>
      <div className="field">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows={5} placeholder="Tell me about the role or project…" required readOnly={sent} />
      </div>
      <div className="form__foot">
        <button
          className="btn btn--primary"
          type="submit"
          data-magnetic="0.25"
          style={sent ? { opacity: 0.55, pointerEvents: 'none' } : undefined}
        >
          {sent ? 'Sent ' : 'Send message '}
          <span className="arrow">→</span>
        </button>
        {!sent && <span className="form__note">// encrypted · no spam</span>}
        <span className={`form__ok${sent ? ' show' : ''}`}>✓ Thanks — I&apos;ll be in touch shortly.</span>
      </div>
    </form>
  );
}
