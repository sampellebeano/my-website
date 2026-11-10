import { SiteShell } from "@/components/SiteShell";
import { publicContent } from "@/data/public-content";
import { formatPublicDate } from "@/lib/public-content";
import type { BookEntry } from "@/lib/public-content";

const statuses = [
  { id: "reading", label: "Reading" },
  { id: "read", label: "Read" },
  { id: "want-to-read", label: "Want to read" },
] as const;

const BookArticle = ({ book }: { book: BookEntry }) => {
  return (
    <article id={book.id} className="content-article book-article" aria-labelledby={`title-${book.id}`}>
      <p className="article-context">{book.author}</p>
      <h3 id={`title-${book.id}`}>{book.title}</h3>
      {book.note && <p>{book.note}</p>}
      {book.completedOn && <p className="publication-date">Finished <time dateTime={book.completedOn}>{formatPublicDate(book.completedOn)}</time></p>}
      {book.url && <a className="text-link mt-4 inline-block text-sm" href={book.url}>About this book <span aria-hidden="true">↗</span></a>}
    </article>
  );
};

const Books = () => {
  return (
    <SiteShell>
      <div className="page-heading"><p className="eyebrow">The reading shelf</p><h1>Books</h1><p>Books I’m reading, have finished or plan to get to.</p></div>
      {publicContent.books.length === 0 ? (
        <div className="empty-state"><h2>The shelf is empty for now.</h2><p>I’ll add books and a few notes as I go.</p></div>
      ) : statuses.map(status => {
        const books = publicContent.books.filter(book => book.status === status.id);
        return books.length ? <section key={status.id} className="book-group" aria-labelledby={`books-${status.id}`}><h2 id={`books-${status.id}`} className="week-heading">{status.label}</h2><div className="article-list">{books.map(book => <BookArticle key={book.id} book={book} />)}</div></section> : null;
      })}
    </SiteShell>
  );
};

export default Books;
