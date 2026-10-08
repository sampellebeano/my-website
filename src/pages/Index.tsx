import { SearchBox } from "@/components/SearchBox";
import { CVNavigation } from "@/components/CVNavigation";
import { CVFooter } from "@/components/CVFooter";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { CVDownloads } from "@/components/CVDownloads";
import { entries } from "@/data/cv";
import { SkipLink } from "@/components/SkipLink";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SkipLink />
      <header className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-5 px-6 py-6">
        <CVNavigation />
        <CVDownloads />
      </header>
      <main id="main-content" tabIndex={-1} className="flex-1 px-6 pb-20">
        <section className="mx-auto max-w-3xl pt-12 text-center sm:pt-20" aria-labelledby="intro-title">
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-muted-foreground">Enterprise platforms · Solution architecture · AI</p>
          <h1 id="intro-title" className="text-5xl font-normal tracking-tight text-google-blue sm:text-7xl">Sam Green</h1>
          <p className="mt-4 text-lg font-medium">Senior Solution Consultant | ServiceNow</p>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
            Based in the UAE. I connect enterprise business priorities with ServiceNow solutions, from a single front door across business units to autonomous workforce initiatives.
          </p>
          <div className="mt-8"><SearchBox /></div>
          <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <Link className="nav-link" to="/search?query=Presight">Presight architecture</Link>
            <Link className="nav-link" to="/search?query=ITOM">ITOM experience</Link>
            <Link className="nav-link" to="/search?section=qualifications">Courses & credentials</Link>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-4xl rounded-2xl border border-border p-6 sm:p-9" aria-labelledby="featured-title">
          <p className="text-sm font-medium text-google-blue">Featured work · Proposal and demonstration</p>
          <h2 id="featured-title" className="mt-3 text-2xl font-medium tracking-tight sm:text-3xl">One enterprise. A single front door.</h2>
          <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
            For Presight, an ADX-listed AI and big data analytics company, I proposed and demonstrated a single enterprise front door and structured its architecture across five independent business units.
          </p>
          <p className="mt-3 leading-relaxed">IT, HR, Customer Experience, App Development and Asset Management.</p>
          <Link to="/search?query=Presight&section=work" className="mt-5 inline-flex items-center gap-2 font-medium text-google-blue hover:underline">
            Explore this work <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </section>

        <section className="mx-auto mt-14 max-w-4xl" aria-labelledby="career-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="career-title" className="text-2xl font-medium">Career at a glance</h2>
            <Link className="nav-link text-sm" to="/search?section=experience">View experience</Link>
          </div>
          <div className="mt-6 divide-y divide-border border-y border-border">
            {entries.filter((entry) => entry.section === "experience").map((entry) => (
              <article key={entry.id} className="flex flex-col justify-between gap-2 py-5 sm:flex-row sm:gap-6">
                <h3 className="font-medium">{entry.title}</h3>
                <p className="shrink-0 text-sm text-muted-foreground">{entry.context}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <CVFooter />
    </div>
  );
};

export default Index;
