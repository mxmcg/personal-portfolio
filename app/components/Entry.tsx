type EntryProps = {
  title: string;
  period?: string;
  summary: string;
  tags?: readonly string[];
  draft?: boolean;
};

export function Entry({ title, period, summary, tags, draft }: EntryProps) {
  return (
    <article className="entry">
      <div className="entry-top">
        <h3>
          {title}
          {draft ? <span className="draft">draft</span> : null}
        </h3>
        {period ? <span className="period">{period}</span> : null}
      </div>
      <p>{summary}</p>
      {tags && tags.length > 0 ? (
        <ul className="tags">
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
