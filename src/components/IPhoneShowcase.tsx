import { Component, createRef, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, BatteryFull, Pause, Play, Signal, Wifi } from "lucide-react";
import { projects as personalProjects, type PersonalProject } from "@/data/projects";
import "./iphone-showcase.css";

export interface IPhoneShowcaseProps {
  projects?: PersonalProject[];
  selectedId?: string;
  onSelectProject?: (project: PersonalProject) => void;
  onHome?: () => void;
}

const APPS_PER_PAGE = 8;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
const MINUTE_MS = 60_000;

const DemoClock = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer: number | undefined;
    const update = () => {
      window.clearTimeout(timer);
      const current = new Date();
      setNow(current);
      timer = window.setTimeout(update, MINUTE_MS - current.getTime() % MINUTE_MS);
    };

    update();
    document.addEventListener("visibilitychange", update);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  const localTime = now.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
  return <time dateTime={now.toISOString()}>{localTime}</time>;
};

interface ShowcaseHandsetProps {
  expanded: boolean;
  children: ReactNode;
}

class ShowcaseHandset extends Component<ShowcaseHandsetProps, object, DOMRect | null> {
  private handset = createRef<HTMLDivElement>();
  private movement?: Animation;

  getSnapshotBeforeUpdate(previous: ShowcaseHandsetProps) {
    if (previous.expanded === this.props.expanded || window.matchMedia(REDUCED_MOTION).matches) return null;
    return this.handset.current?.getBoundingClientRect() ?? null;
  }

  componentDidUpdate(_previous: ShowcaseHandsetProps, _state: object, from: DOMRect | null) {
    const handset = this.handset.current;
    if (!from || !handset?.animate) return;

    // The snapshot includes any in-flight movement, so reversals start where the phone is.
    this.cancelMovement();
    const to = handset.getBoundingClientRect();
    if (!from.width || !from.height || !to.width || !to.height) return;
    if (from.x === to.x && from.y === to.y && from.width === to.width && from.height === to.height) return;

    this.movement = handset.animate([
      { transform: `translate(${from.x - to.x}px, ${from.y - to.y}px) scale(${from.width / to.width}, ${from.height / to.height})`, transformOrigin: "top left" },
      { transform: "none", transformOrigin: "top left" },
    ], { duration: 420, easing: "cubic-bezier(0.22, 1, 0.36, 1)" });
  }

  cancelMovement() {
    this.movement?.cancel();
    this.movement = undefined;
  }

  componentWillUnmount() {
    this.cancelMovement();
  }

  render() {
    return <div ref={this.handset} className="demo-iphone" role="group" aria-label="Sam’s project iPhone">{this.props.children}</div>;
  }
}

export const IPhoneShowcase = ({ projects = personalProjects, selectedId, onSelectProject, onHome }: IPhoneShowcaseProps) => {
  const [localSelection, setLocalSelection] = useState<{ sourceId?: string; id: string | null } | null>(null);
  const activeId = localSelection && localSelection.sourceId === selectedId ? localSelection.id : selectedId;
  const selectedIndex = projects.findIndex(project => project.id === activeId);
  const selected = projects[selectedIndex] ?? null;
  const activeProjectId = selected?.id;
  const [page, setPage] = useState(() => Math.max(0, Math.floor(projects.findIndex(project => project.id === selectedId) / APPS_PER_PAGE)));
  const [playback, setPlayback] = useState({ id: null as string | null, playing: false, failed: false });
  const playing = playback.id === selected?.id && playback.playing;
  const failed = playback.id === selected?.id && playback.failed;
  const pageCount = Math.max(1, Math.ceil(projects.length / APPS_PER_PAGE));
  const currentPage = Math.min(page, pageCount - 1);
  const firstApp = currentPage * APPS_PER_PAGE;
  const visibleProjects = projects.slice(firstApp, firstApp + APPS_PER_PAGE);
  const firstVisibleId = visibleProjects[0]?.id;
  const screenId = useId();
  const handset = useRef<ShowcaseHandset>(null);
  const homeButton = useRef<HTMLButtonElement>(null);
  const launchButtons = useRef(new Map<string, HTMLButtonElement>());
  const previousSelection = useRef<string | null>(null);
  const returningToLauncher = useRef(false);
  const paginationFocusPending = useRef(false);
  const recording = selected?.screenshot;
  const recordingSrc = recording?.src;
  const routeControlled = Boolean(onSelectProject);

  useEffect(() => {
    setPlayback({ id: activeProjectId ?? null, playing: Boolean(recordingSrc) && !window.matchMedia(REDUCED_MOTION).matches, failed: false });
    if (activeProjectId) {
      setPage(Math.floor(selectedIndex / APPS_PER_PAGE));
      previousSelection.current = activeProjectId;
      if (!routeControlled) homeButton.current?.focus({ preventScroll: true });
    } else if (previousSelection.current) {
      if (returningToLauncher.current || !routeControlled) {
        launchButtons.current.get(previousSelection.current)?.focus({ preventScroll: true });
      }
      returningToLauncher.current = false;
      previousSelection.current = null;
    }
  }, [activeProjectId, recordingSrc, selectedIndex, routeControlled]);

  useEffect(() => {
    const preference = window.matchMedia(REDUCED_MOTION);
    const stop = () => {
      if (!preference.matches) return;
      handset.current?.cancelMovement();
      setPlayback(value => ({ ...value, playing: false }));
    };
    preference.addEventListener("change", stop);
    return () => preference.removeEventListener("change", stop);
  }, []);

  useEffect(() => {
    if (!paginationFocusPending.current) return;
    launchButtons.current.get(firstVisibleId)?.focus({ preventScroll: true });
    paginationFocusPending.current = false;
  }, [currentPage, firstVisibleId]);

  const openApp = (app: PersonalProject) => {
    if (onSelectProject) {
      setLocalSelection(null);
      onSelectProject(app);
    } else {
      setLocalSelection({ sourceId: selectedId, id: app.id });
    }
  };

  const goHome = () => {
    returningToLauncher.current = true;
    if (onHome) onHome();
    else setLocalSelection({ sourceId: selectedId, id: null });
  };

  const changePage = (nextPage: number) => {
    paginationFocusPending.current = true;
    setPage(nextPage);
  };

  const controls = (
    <div className="demo-phone-controls">
      {selected ? <>
        <button ref={homeButton} type="button" className="demo-phone-button" onClick={goHome} aria-label="Return to iPhone home screen" aria-controls={screenId}><ArrowLeft size={14} aria-hidden="true" />Home</button>
        <span className="demo-current-app">{selected.title}</span>
        {recording && !failed && <button type="button" className="demo-phone-button" aria-label={`${playing ? "Pause" : "Play"} ${selected.title} demo`} aria-controls={screenId} onClick={() => setPlayback({ id: selected.id, playing: !playing, failed: false })}>{playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}{playing ? "Pause" : "Play"}</button>}
      </> : pageCount > 1 ? <>
        <button type="button" className="demo-phone-button" aria-label="Previous apps page" aria-controls={screenId} disabled={currentPage === 0} onClick={() => changePage(currentPage - 1)}><ArrowLeft size={14} aria-hidden="true" /><span>Prev</span></button>
        <span className="demo-page-count" aria-label={`Page ${currentPage + 1} of ${pageCount}`}>{currentPage + 1} / {pageCount}</span>
        <button type="button" className="demo-phone-button" aria-label="Next apps page" aria-controls={screenId} disabled={currentPage === pageCount - 1} onClick={() => changePage(currentPage + 1)}><span>Next</span><ArrowRight size={14} aria-hidden="true" /></button>
      </> : <span className="demo-phone-hint">Pick an app to have a look.</span>}
    </div>
  );

  return (
    <div className="phone-showcase-device" onKeyDown={event => {
      if (event.key === "Escape" && selected) {
        event.preventDefault();
        goHome();
      }
    }}>
      {selected && controls}
      <ShowcaseHandset ref={handset} expanded={Boolean(selected)}>
        <div className="demo-iphone-screen" id={screenId}>
          <div className="demo-home" hidden={Boolean(selected)}>
            <div className="demo-status-bar">
              {!selected && <DemoClock />}
              <span className="demo-status-icons" aria-hidden="true"><Signal /><Wifi /><BatteryFull /></span>
            </div>
            <div className="demo-launcher" aria-label="App collection">
              <div className="demo-app-grid">
                {visibleProjects.map(app => (
                  <button key={app.id} ref={control => {
                    if (control) launchButtons.current.set(app.id, control);
                    else launchButtons.current.delete(app.id);
                  }} type="button" className="demo-app-icon" aria-label={`Open ${app.title} ${app.screenshot ? "demo" : "overview"}`} aria-controls={screenId} onClick={() => openApp(app)}>
                    {app.icon ? <img src={app.icon} width="60" height="60" alt="" draggable={false} /> : <span className="demo-app-monogram" aria-hidden="true">{app.title.length <= 4 ? app.title : app.title.slice(0, 2)}</span>}
                    <span className="demo-app-name">{app.title}</span>
                  </button>
                ))}
              </div>
              {!projects.length && <p className="demo-launcher-empty">Projects will appear here.</p>}
            </div>
            <div className="demo-home-caption" aria-hidden="true"><span>Sam’s projects.</span><span>A few things I’m working on.</span></div>
          </div>
          {selected && (
            <div className="demo-open-app" key={selected.id}>
              {recording ? (
                failed ? <p className="demo-load-error" role="alert">This recording couldn’t load. Return home and open the app to try again.</p> : <img className="demo-recording" src={playing ? recording.src : recording.poster} alt={recording.alt} width={recording.width} height={recording.height} decoding="async" onError={() => setPlayback({ id: selected.id, playing: false, failed: true })} />
              ) : (
                <div className="demo-project-overview">
                  <p className="demo-overview-label">Project overview</p>
                  <h3>{selected.title}</h3>
                  {selected.status && <p className="demo-overview-status">{selected.status}</p>}
                  <p>{selected.summary}</p>
                  <p className="demo-overview-availability">No recording available yet.</p>
                </div>
              )}
              <button type="button" className="demo-home-gesture" aria-label="Return to iPhone home screen" onClick={goHome} />
            </div>
          )}
        </div>
      </ShowcaseHandset>
      {!selected && controls}
      <p className="sr-only" role="status">{selected ? recording ? `${selected.title} demo ${failed ? "unavailable" : playing ? "playing" : "paused"}.` : `${selected.title} project overview. No recording available yet.` : `iPhone home screen. Choose an app to view its recording or project overview.${projects.length ? ` Apps ${firstApp + 1}–${Math.min(firstApp + APPS_PER_PAGE, projects.length)} of ${projects.length}.` : ""}`}</p>
    </div>
  );
};
