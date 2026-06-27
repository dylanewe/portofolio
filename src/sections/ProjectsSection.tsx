import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, GitFork, AlertCircle } from 'lucide-react';
import SectionLabel from '@/components/SectionLabel';
import ProjectModal from '@/components/ProjectModal';
import type { Project, GitHubRepo } from '@/types';

gsap.registerPlugin(ScrollTrigger);

const GITHUB_USERNAME = 'dylanewe';

const LANG_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#F05138',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Shell: '#89e051',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Vue: '#41b883',
  Svelte: '#ff3e00',
  Haskell: '#5e5086',
  Elixir: '#6e4a7e',
  Lua: '#000080',
  R: '#198CE7',
};

function langColor(lang: string | null): string {
  return (lang && LANG_COLORS[lang]) ? LANG_COLORS[lang] : 'rgba(255,255,255,0.25)';
}

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 30) return `${Math.floor(diff / 86400)}d ago`;
  if (diff < 86400 * 365) return `${Math.floor(diff / (86400 * 30))}mo ago`;
  return `${Math.floor(diff / (86400 * 365))}y ago`;
}

function repoToProject(repo: GitHubRepo): Project {
  return {
    id: String(repo.id),
    title: repo.name.toUpperCase(),
    description: repo.description || 'No description provided.',
    tags: repo.language ? [repo.language.toUpperCase(), ...(repo.topics || []).slice(0, 2).map(t => t.toUpperCase())] : (repo.topics || []).slice(0, 3).map(t => t.toUpperCase()),
    sourceUrl: repo.html_url,
    longDescription: repo.description || 'No description provided.',
  };
}

async function fetchAllRepos(username: string): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const url = `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=pushed&per_page=100&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) {
      if (res.status === 404) throw new Error(`GitHub user "${username}" not found.`);
      if (res.status === 403) throw new Error('GitHub API rate limit hit. Try again in a minute.');
      throw new Error(`GitHub API error: ${res.status}`);
    }
    const data = (await res.json()) as GitHubRepo[];
    repos.push(...data);
    const linkHeader = res.headers.get('Link') || '';
    const hasNext = linkHeader.includes('rel="next"');
    if (!hasNext || data.length === 0) break;
    page++;
  }
  return repos;
}

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const planetRef = useRef<HTMLImageElement>(null);

  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<'updated' | 'stars' | 'name'>('updated');
  const [hideForks, setHideForks] = useState(false);

  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Fetch repos on mount
  useEffect(() => {
    let cancelled = false;
    fetchAllRepos(GITHUB_USERNAME)
      .then(data => {
        if (cancelled) return;
        setRepos(data);
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load repositories.');
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // ScrollTrigger entrance animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cards = cardsContainerRef.current?.children;
    if (cards) {
      gsap.fromTo(
        cards,
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'left 80%',
            containerAnimation: ScrollTrigger.getAll().find(st => st.vars.pin)?.animation,
          },
        }
      );
    }

    if (planetRef.current) {
      gsap.fromTo(
        planetRef.current,
        { scale: 0.9, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'left 80%',
            containerAnimation: ScrollTrigger.getAll().find(st => st.vars.pin)?.animation,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === section) st.kill();
      });
    };
  }, []);

  const filteredRepos = useMemo(() => {
    let result = hideForks ? repos.filter(r => !r.fork) : repos;
    if (sortBy === 'stars') {
      result = [...result].sort((a, b) => b.stargazers_count - a.stargazers_count);
    } else if (sortBy === 'name') {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      result = [...result].sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime());
    }
    return result;
  }, [repos, sortBy, hideForks]);

  const updateScrollButtons = useCallback(() => {
    const container = cardsContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 10);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 10);
  }, []);

  useEffect(() => {
    const container = cardsContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', updateScrollButtons, { passive: true });
    updateScrollButtons();
    return () => container.removeEventListener('scroll', updateScrollButtons);
  }, [updateScrollButtons, filteredRepos]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    const container = cardsContainerRef.current;
    if (!container) return;
    const scrollAmount = 304;
    container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
  };

  const shownCount = filteredRepos.length;
  const totalCount = repos.length;

  return (
    <section ref={sectionRef} id="projects" className="section-panel justify-center">
      {/* Purple planet with orbiting moons */}
      <div
        className="absolute right-[12%] top-[15%] pointer-events-none"
        style={{ zIndex: 1, animation: 'moonOrbit 25s linear infinite' }}
      >
        <div className="absolute -top-6 -left-10"><div className="w-3 h-3 bg-purple-300 opacity-40 pixel-art" /></div>
        <div className="absolute -bottom-8 -right-8"><div className="w-4 h-4 bg-purple-400 opacity-30 pixel-art" /></div>
      </div>

      <img
        ref={planetRef}
        src="/assets/purple-planet.png"
        alt=""
        className="pixel-art absolute opacity-0 float-medium"
        style={{
          width: 'min(18vw, 200px)',
          right: '8%',
          top: '12%',
          zIndex: 1,
          filter: 'drop-shadow(0 0 20px rgba(180,100,255,0.3))',
        }}
        draggable={false}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative px-6 md:px-20 max-w-[900px] w-full" style={{ zIndex: 2 }}>
        <div className="text-left">
          <SectionLabel text="SECTOR 04" className="justify-center md:justify-start" />

          <h2
            className="mt-5 glow-purple"
            style={{
              fontFamily: 'var(--pixel-font)',
              fontSize: 'clamp(22px, 3.5vw, 32px)',
              lineHeight: 1.4,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              color: '#ffffff',
            }}
          >
            MISSION LOG
          </h2>

          <p
            className="mt-3"
            style={{
              fontFamily: 'var(--pixel-font)',
              fontSize: '9px',
              lineHeight: 1.8,
              color: 'rgba(240, 230, 255, 0.6)',
            }}
          >
            Projects fetched live from GitHub
          </p>
        </div>

        {/* Toolbar */}
        <div className="mt-6 flex flex-col md:flex-row md:items-center gap-3 md:gap-5">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as 'updated' | 'stars' | 'name')}
            className="px-3 py-2 cursor-pointer"
            style={{
              fontFamily: 'var(--pixel-font)',
              fontSize: '8px',
              letterSpacing: '0.5px',
              background: 'rgba(60, 20, 100, 0.5)',
              border: '1px solid rgba(180, 100, 255, 0.3)',
              color: 'rgba(240, 230, 255, 0.9)',
            }}
            aria-label="Sort repositories"
          >
            <option value="updated">SORT: RECENTLY UPDATED</option>
            <option value="stars">SORT: MOST STARS</option>
            <option value="name">SORT: NAME A-Z</option>
          </select>

          <label
            className="flex items-center gap-2 cursor-pointer"
            style={{
              fontFamily: 'var(--pixel-font)',
              fontSize: '8px',
              letterSpacing: '0.5px',
              color: 'rgba(240, 230, 255, 0.7)',
            }}
          >
            <input
              type="checkbox"
              checked={hideForks}
              onChange={e => setHideForks(e.target.checked)}
              className="cursor-pointer"
              style={{ accentColor: '#b347d9' }}
            />
            HIDE FORKS
          </label>

          {!loading && !error && (
            <span
              className="md:ml-auto"
              style={{
                fontFamily: 'var(--pixel-font)',
                fontSize: '8px',
                letterSpacing: '0.5px',
                color: 'rgba(240, 230, 255, 0.5)',
              }}
            >
              {shownCount === totalCount ? `${totalCount} REPOS` : `${shownCount} / ${totalCount} REPOS`}
            </span>
          )}
        </div>

        {/* Carousel */}
        <div className="relative mt-5 pl-10 pr-10">
          {/* Left arrow */}
          <button
            onClick={() => scrollCarousel('left')}
            disabled={!canScrollLeft || loading || !!error || filteredRepos.length === 0}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
            style={{
              background: 'rgba(60, 20, 100, 0.6)',
              border: '2px solid rgba(180, 100, 255, 0.3)',
              color: 'var(--bright-purple)',
              fontFamily: 'var(--pixel-font)',
              fontSize: '12px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--bright-purple)';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(180,100,255,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(180, 100, 255, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            aria-label="Scroll left"
          >
            &lt;
          </button>

          {/* Cards container */}
          <div
            ref={cardsContainerRef}
            className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          >
            {loading && (
              <div
                className="glass-card flex-shrink-0 w-[260px] md:w-[280px] flex items-center justify-center"
                style={{ height: '220px' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--pixel-font)',
                    fontSize: '9px',
                    color: 'rgba(240, 230, 255, 0.5)',
                  }}
                >
                  FETCHING<span className="animate-pulse">...</span>
                </span>
              </div>
            )}

            {!loading && error && (
              <div
                className="glass-card flex-shrink-0 w-[260px] md:w-[280px] p-5"
                style={{ borderColor: 'rgba(255, 80, 80, 0.3)', background: 'rgba(80, 20, 20, 0.35)' }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle size={14} color="#ff8080" />
                  <span
                    style={{
                      fontFamily: 'var(--pixel-font)',
                      fontSize: '9px',
                      color: '#ff8080',
                    }}
                  >
                    ERROR
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--pixel-font)',
                    fontSize: '8px',
                    lineHeight: 1.8,
                    color: 'rgba(240, 230, 255, 0.6)',
                  }}
                >
                  {error}
                </p>
              </div>
            )}

            {!loading && !error && filteredRepos.length === 0 && (
              <div
                className="glass-card flex-shrink-0 w-[260px] md:w-[280px] flex items-center justify-center"
                style={{ height: '220px' }}
              >
                <span
                  style={{
                    fontFamily: 'var(--pixel-font)',
                    fontSize: '9px',
                    color: 'rgba(240, 230, 255, 0.5)',
                    textAlign: 'center',
                    padding: '0 20px',
                  }}
                >
                  NO REPOSITORIES MATCH
                </span>
              </div>
            )}

            {!loading && !error && filteredRepos.map(repo => {
              const project = repoToProject(repo);
              return (
                <div
                  key={repo.id}
                  className="glass-card flex-shrink-0 w-[260px] md:w-[280px] overflow-hidden cursor-pointer snap-start flex flex-col"
                  style={{ padding: 0 }}
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Header gradient */}
                  <div
                    className="relative h-[100px] overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, rgba(60,20,100,0.8) 0%, rgba(20,5,40,0.9) 100%)`,
                    }}
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `radial-gradient(circle at 30% 30%, ${langColor(repo.language)}22 0%, transparent 60%)`,
                      }}
                    />
                    <div className="absolute bottom-3 left-4 right-4">
                      <div className="flex items-start justify-between gap-2">
                        <h3
                          className="text-white glow-purple line-clamp-2"
                          style={{
                            fontFamily: 'var(--pixel-font)',
                            fontSize: '11px',
                            letterSpacing: '1px',
                          }}
                        >
                          {project.title}
                        </h3>
                        {repo.fork && (
                          <span
                            className="flex-shrink-0 px-1.5 py-0.5"
                            style={{
                              fontFamily: 'var(--pixel-font)',
                              fontSize: '6px',
                              letterSpacing: '0.5px',
                              color: 'rgba(240, 230, 255, 0.7)',
                              background: 'rgba(180, 100, 255, 0.2)',
                              border: '1px solid rgba(180, 100, 255, 0.3)',
                            }}
                          >
                            FORK
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-4 flex-1 flex flex-col">
                    <p
                      className="line-clamp-2"
                      style={{
                        fontFamily: 'var(--pixel-font)',
                        fontSize: '8px',
                        lineHeight: 1.8,
                        color: 'rgba(240, 230, 255, 0.55)',
                      }}
                    >
                      {project.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {repo.language && (
                        <span
                          className="tag-pill flex items-center gap-1"
                          style={{ padding: '3px 8px' }}
                        >
                          <span
                            className="inline-block"
                            style={{
                              width: '7px',
                              height: '7px',
                              borderRadius: '50%',
                              background: langColor(repo.language),
                            }}
                          />
                          {repo.language.toUpperCase()}
                        </span>
                      )}
                      {project.tags.filter(t => t !== repo.language?.toUpperCase()).slice(0, 2).map(tag => (
                        <span key={tag} className="tag-pill">{tag}</span>
                      ))}
                    </div>

                    {/* Stats */}
                    <div
                      className="mt-auto pt-3 flex items-center gap-3"
                      style={{
                        fontFamily: 'var(--pixel-font)',
                        fontSize: '7px',
                        color: 'rgba(240, 230, 255, 0.45)',
                      }}
                    >
                      {repo.stargazers_count > 0 && (
                        <span className="flex items-center gap-1">
                          <Star size={10} /> {repo.stargazers_count}
                        </span>
                      )}
                      {repo.forks_count > 0 && (
                        <span className="flex items-center gap-1">
                          <GitFork size={10} /> {repo.forks_count}
                        </span>
                      )}
                      <span className="ml-auto">{timeAgo(repo.pushed_at)}</span>
                    </div>

                    {/* View link */}
                    <div
                      className="mt-3 flex items-center gap-1 transition-colors duration-200 hover:text-[#ff8ed8]"
                      style={{
                        fontFamily: 'var(--pixel-font)',
                        fontSize: '8px',
                        letterSpacing: '1px',
                        color: 'var(--pixel-pink)',
                      }}
                    >
                      <span>VIEW →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scrollCarousel('right')}
            disabled={!canScrollRight || loading || !!error || filteredRepos.length === 0}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 flex items-center justify-center transition-all duration-200 disabled:opacity-30 disabled:pointer-events-none"
            style={{
              background: 'rgba(60, 20, 100, 0.6)',
              border: '2px solid rgba(180, 100, 255, 0.3)',
              color: 'var(--bright-purple)',
              fontFamily: 'var(--pixel-font)',
              fontSize: '12px',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--bright-purple)';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(180,100,255,0.3)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(180, 100, 255, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            aria-label="Scroll right"
          >
            &gt;
          </button>
        </div>
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </section>
  );
};

export default ProjectsSection;
