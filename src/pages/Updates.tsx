import { Link } from "react-router-dom";
import { SiteShell } from "@/components/SiteShell";
import { PageHeading } from "@/components/PageHeading";
import { publicContent } from "@/data/public-content";
import { formatPublicDate, groupActivity, sortActivity } from "@/lib/public-content";
import type { ActivityEntry } from "@/lib/public-content";

const ActivityArticle = ({ entry, level = "h3" }: { entry: ActivityEntry; level?: "h2" | "h3" }) => {
  const Heading = level;
  return (
    <article id={entry.id} className="content-article activity-article" aria-labelledby={`title-${entry.id}`}>
      <p className="article-context">{entry.kind === "daily" ? <>Daily note · <time dateTime={entry.activityDate}>{formatPublicDate(entry.activityDate)}</time></> : <>Weekly recap · {formatPublicDate(entry.startDate)} – {formatPublicDate(entry.endDate)}</>}</p>
      <Heading id={`title-${entry.id}`}>{entry.title}</Heading>
      {entry.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      {entry.links?.length > 0 && <nav className="collection-links" aria-label={`Related links for ${entry.title}`}>{entry.links.map((link, index) => <a key={index} className="text-link" href={link.href}>{link.label} <span aria-hidden="true">↗</span></a>)}</nav>}
      {entry.kind === "weekly" && <div className="recap-references"><p>From the daily notes</p><ul>{entry.dailyEntryIds.map(id => <li key={id}>{publicContent.activity.find(daily => daily.id === id)!.title}</li>)}</ul></div>}
      <p className="publication-date">Published <time dateTime={entry.publishedAt}>{formatPublicDate(entry.publishedAt)}</time></p>
    </article>
  );
};

const Updates = () => {
  const weeks = groupActivity(publicContent.activity);
  const latestRecap = sortActivity(publicContent.activity).find(entry => entry.kind === "weekly");
  return (
    <SiteShell>
      <PageHeading eyebrow="Lately" title="Updates" description="A place for notes on what I’m working on and learning." />
      {publicContent.activity.length === 0 ? (
        <div className="empty-state"><h2>I haven’t posted anything yet.</h2><p>For now, you can see what I’m building.</p><Link className="text-link mt-5 inline-block text-sm" to="/projects">My projects <span aria-hidden="true">↗</span></Link></div>
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
