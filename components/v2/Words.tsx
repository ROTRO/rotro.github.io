/**
 * Renders a sentence as word spans so ScrollFx can brighten it word by word
 * as it scrolls through the viewport (`data-words`).
 */
export default function Words({ text, className }: { text: string; className?: string }) {
  const words = text.split(' ');
  return (
    <p className={className} data-words>
      {words.map((w, i) => (
        <span key={i}>
          <span className="w">{w}</span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </p>
  );
}
