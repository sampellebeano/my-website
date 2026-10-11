import { Link, useSearchParams } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { publicContent } from "@/data/public-content";
import { formatPublicDate } from "@/lib/public-content";
import type { BookEntry } from "@/lib/public-content";

const statuses = [
  { id: "reading", label: "Reading" },
  { id: "read", label: "Read" },
  { id: "want-to-read", label: "Want to read" },
] as const;

const BookArticle = ({ book, detail = false }: { book: BookEntry; detail?: boolean }) => {
  const Heading = detail ? "h2" : "h3";
  return (
    <article id={book.id} className="content-article book-article" aria-labelledby={`title-${book.id}`}>
      <p className="article-context">{book.author}{detail ? ` · ${statuses.find(status => status.id === book.status)!.label}` : ""}</p>
      <Heading id={`title-${book.id}`}><Link to={`/books?entry=${book.id}`}>{book.title}</Link></Heading>
      {book.note && <p>{book.note}</p>}
      {book.completedOn && <p className="publication-date">Finished <time dateTime={book.completedOn}>{formatPublicDate(book.completedOn)}</time></p>}
      {book.url && <a className="text-link mt-4 inline-block text-sm" href={book.url}>About this book <span aria-hidden="true">↗</span></a>}
    </article>
  );
};

const Books = () => {
  const [params] = useSearchParams();
  const requested = params.get("entry");
  const selected = publicContent.books.find(book => book.id === requested);
  return (
    <SiteShell>
      <div className="page-heading"><p className="eyebrow">The reading shelf</p><h1>Books</h1><p>What I’m reading, what I’ve read, and a few things on the list.</p></div>
      {requested && !selected && <p role="status" className="entry-notice">That book is unavailable. Browse the reading shelf below.</p>}
      {selected ? <><Link className="text-link back-link" to="/books">← All books</Link><div className="article-list"><BookArticle book={selected} detail /></div></> : publicContent.books.length === 0 ? (
        <div className="empty-state"><h2>No books added yet.</h2><p>I’ll add my reading list here, along with a few personal notes.</p></div>
      ) : statuses.map(status => {
        const books = publicContent.books.filter(book => book.status === status.id);
        return books.length ? <section key={status.id} className="book-group" aria-labelledby={`books-${status.id}`}><h2 id={`books-${status.id}`} className="week-heading">{status.label}</h2><div className="article-list">{books.map(book => <BookArticle key={book.id} book={book} />)}</div></section> : null;
      })}
    </SiteShell>
  );
};

export default Books;
