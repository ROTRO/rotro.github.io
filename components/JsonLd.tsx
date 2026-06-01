/**
 * Renders one or more JSON-LD blocks as <script type="application/ld+json">.
 * Server component — the structured data is in the initial HTML for crawlers.
 */
export default function JsonLd({
  data,
}: {
  data: Record<string, unknown> | Record<string, unknown>[];
}) {
  const blocks = Array.isArray(data) ? data : [data];
  return (
    <>
      {blocks.map((block, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
