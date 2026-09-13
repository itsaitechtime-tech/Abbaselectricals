export function ServiceCard({
  title,
  summary,
  index,
}: {
  title: string;
  summary: string;
  index?: number;
}) {
  return (
    <article className="panel group rounded-2xl p-6">
      {typeof index === "number" && (
        <p className="eyebrow mb-4 text-accent/90">
          {String(index).padStart(2, "0")}
        </p>
      )}
      <h3 className="display text-xl text-cream md:text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-paper-muted">{summary}</p>
    </article>
  );
}
