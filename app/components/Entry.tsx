type EntryProps = {
  title: string;
  period?: string;
  note?: string;
  summary?: string;
  tags?: readonly string[];
};

export function Entry({ title, period, note, summary, tags }: EntryProps) {
  return (
    <article className="entry">
      <div className="entry-top">
        <h3>{title}</h3>
        {period ? <span className="period">{period}</span> : null}
      </div>
      {note ? <p>{note}</p> : null}
      {summary ? <p>{summary}</p> : null}
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
