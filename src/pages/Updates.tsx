import { Link, useSearchParams } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { publicContent } from "@/data/public-content";
import { formatPublicDate, groupActivity, sortActivity } from "@/lib/public-content";
import type { ActivityEntry } from "@/lib/public-content";

const ActivityArticle = ({ entry, level = "h3" }: { entry: ActivityEntry; level?: "h2" | "h3" }) => {
  const Heading = level;
  return (
    <article id={entry.id} className="content-article activity-article" aria-labelledby={`title-${entry.id}`}>
      <p className="article-context">{entry.kind === "daily" ? <>Daily note · <time dateTime={entry.activityDate}>{formatPublicDate(entry.activityDate)}</time></> : <>Weekly recap · {formatPublicDate(entry.startDate)} – {formatPublicDate(entry.endDate)}</>}</p>
      <Heading id={`title-${entry.id}`}><Link to={`/updates?entry=${entry.id}`}>{entry.title}</Link></Heading>
      {entry.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      {entry.links?.length > 0 && <nav className="collection-links" aria-label={`Related links for ${entry.title}`}>{entry.links.map((link, index) => <a key={index} className="text-link" href={link.href}>{link.label} <span aria-hidden="true">↗</span></a>)}</nav>}
      {entry.kind === "weekly" && <div className="recap-references"><p>From the daily notes</p><ul>{entry.dailyEntryIds.map(id => <li key={id}><Link className="text-link" to={`/updates?entry=${id}`}>{publicContent.activity.find(daily => daily.id === id)!.title}</Link></li>)}</ul></div>}
      <p className="publication-date">Published <time dateTime={entry.publishedAt}>{formatPublicDate(entry.publishedAt)}</time></p>
    </article>
  );
};

const Updates = () => {
  const [params] = useSearchParams();
  const requested = params.get("entry");
  const selected = publicContent.activity.find(entry => entry.id === requested);
  const weeks = groupActivity(publicContent.activity);
  const latestRecap = sortActivity(publicContent.activity).find(entry => entry.kind === "weekly");
  return (
    <SiteShell>
      <div className="page-heading"><p className="eyebrow">Day by day</p><h1>Updates</h1><p>What I’m working on, learning and thinking about. Daily notes, with a little perspective at the end of the week.</p></div>
      {requested && !selected && <p role="status" className="entry-notice">That update is unavailable. Browse the published updates below.</p>}
      {selected ? <><Link className="text-link back-link" to="/updates">← All updates</Link><div className="article-list"><ActivityArticle entry={selected} level="h2" /></div></> : publicContent.activity.length === 0 ? (
        <div className="empty-state"><h2>No updates published yet.</h2><p>This is where I’ll share daily notes and weekly recaps.</p><Link className="text-link mt-5 inline-block text-sm" to="/projects">Explore my projects <span aria-hidden="true">↗</span></Link></div>
      ) : (
        <>
          {latestRecap && <section className="latest-recap" aria-label="Latest weekly recap"><p className="eyebrow">Latest weekly recap</p><ActivityArticle entry={latestRecap} level="h2" /></section>}
          <div className="activity-weeks">
            {weeks.map(week => (
              <section key={week.startDate} className="activity-week" aria-labelledby={`week-${week.startDate}`}>
                <h2 id={`week-${week.startDate}`} className="week-heading">{formatPublicDate(week.startDate)} – {formatPublicDate(week.endDate)}</h2>
                <div className="article-list">
                  {week.recap && week.recap.id !== latestRecap?.id && <ActivityArticle entry={week.recap} />}
                  {week.daily.map(entry => <ActivityArticle key={entry.id} entry={entry} />)}
                </div>
              </section>
            ))}
          </div>
        </>
      )}
    </SiteShell>
  );
};

export default Updates;
