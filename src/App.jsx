import React, { useEffect, useMemo, useState } from 'react'

const GENRES = [
  'Adventure','Afrofuturism','Art & Photography','Autobiography','Biography','Business & Economics','Children’s Fiction','Classic Fiction','Comics','Cookbooks / Food Writing','Cultural Studies','Cyberpunk','Detective / Crime','Drama / Literary Fiction','Dystopian (YA or Adult)','Education / Teaching','Environmental Writing','Essays & Journalism','Espionage','Fantasy','Folklore & Mythology','Graphic Novels','Hard Science Fiction','Health & Wellness','Historical Fiction','History','Horror','Humor / Satire','LGBTQ+ Literature','Legal Thriller','Magical Realism','Memoir','Middle Grade Fiction','Mystery','Noir','Paranormal Romance','Philosophy','Picture Books','Politics & Current Affairs','Psychological Thriller','Religion & Spirituality','Romance','Science & Nature','Science Fiction','Self-Help / Personal Development','Short Stories','Space Opera','Speculative Fiction','Spirituality','Steampunk','Technology / Engineering','Thriller & Suspense','Travel','True Crime','Urban Fantasy','Young Adult (YA)'
]

const coverUrl = (cover_i) =>
  cover_i ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg` : 'https://via.placeholder.com/128x193?text=No+Cover'

function useDarkToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    if (dark) document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])
  return [dark, setDark]
}

export default function App() {
  const [dark, setDark] = useDarkToggle()
  const [query, setQuery] = useState('')
  const [selectedGenres, setSelectedGenres] = useState([])
  const [quickTags, setQuickTags] = useState([])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [error, setError] = useState('')
  const pageSize = 20

  useEffect(() => {
    const tags = []
    const yr = query.match(/after\s+(\d{4})/i)
    if (yr) tags.push('Year: > ' + yr[4])
    const matchGenre = GENRES.find((g) => query.toLowerCase().includes(g.toLowerCase().split(' ')))
    if (matchGenre) tags.push(matchGenre)
    setQuickTags(tags)
  }, [query])

  const genreParam = useMemo(() => selectedGenres || '', [selectedGenres])

  async function searchBooks(p = 1) {
    setLoading(true)
    setError('')
    try {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (genreParam) params.append('subject', genreParam)
      params.set('page', String(p))
      const url = `https://openlibrary.org/search.json?${params.toString()}`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Network error')
      const data = await res.json()
      const docs = data.docs?.slice(0, pageSize) || []
      setBooks(docs)
      setPage(p)
    } catch (e) {
      setError('Could not load results. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => searchBooks(1), 400)
    return () => clearTimeout(timer)
  }, [query, genreParam])

  function toggleGenre(g) {
    setSelectedGenres((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    )
  }

  return (
    <div>
      <header className="app-header"> 
        <div className="container navbar"> 
          <div className="brand"> 
            <img src="https://img.freepik.com/premium-vector/book-finder-logo-design-template_145155-4553.jpg" alt="Book Finder logo" className="brand-logo" referrerPolicy="no-referrer" /> 
            <span className="brand-name">Book Finder</span> 
          </div>

          <div>
            <button onClick={() => setDark((d) => !d)} className="btn">{dark ? 'Light' : 'Dark'}</button>
          </div>
        </div>

        <div className="container hero" role="region" aria-label="Hero search">
          <h1>Find the next great read</h1>
          <p>Natural queries like “Books about Afrofuturism published after 2010”.</p>
          <div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input"
              placeholder='Try: "Speculative Fiction award winners"'
            />
          </div>
        </div>

        <div className="carousel-wrap">
          <div className="container">
            <div className="carousel" role="tablist" aria-label="Genres">
              {GENRES.map((g) => (
                <button
                  key={g}
                  onClick={() => toggleGenre(g)}
                  className={`chip ${selectedGenres.includes(g) ? 'is-active' : ''}`}
                  role="tab"
                  aria-selected={selectedGenres.includes(g)}
                  aria-label={g}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="container main">
        <div className="grid">
          <aside className="sidebar">
            <div className="panel" aria-label="Filters">
              <h2>Filters</h2>

              <details open>
                <summary>Genre</summary>
                <div className="detail-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {GENRES.slice(0, 12).map((g) => (
                    <button
                      key={g}
                      onClick={() => toggleGenre(g)}
                      className="tag"
                      aria-pressed={selectedGenres.includes(g)}
                    >
                      {g}
                    </button>
                  ))}
                  <p className="muted">Use the carousel above for the full list.</p>
                </div>
              </details>

              <details>
                <summary>Year</summary>
                <div className="detail-body" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="number" min="0" placeholder="From" className="input" style={{ width: 96, padding: '6px 8px' }} />
                  <span className="muted">to</span>
                  <input type="number" min="0" placeholder="To" className="input" style={{ width: 96, padding: '6px 8px' }} />
                </div>
              </details>

              <details>
                <summary>Language</summary>
                <div className="detail-body" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['English','Spanish','French','German','Hindi'].map((l) => (
                    <span key={l} className="tag">{l}</span>
                  ))}
                </div>
              </details>
            </div>
          </aside>

          <section>
            <div className="quick-tags">
              {quickTags.map((t) => (
                <span key={t} className="qt">{t}</span>
              ))}
            </div>

            <div className="toolbar">
              <div className="muted">Showing recent results</div>
              <button onClick={() => searchBooks(page)} className="btn">Refresh</button>
            </div>

            {loading ? (
              <div className="cards">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skel">
                    <div className="b h1"></div>
                    <div className="b h2"></div>
                    <div className="b h3"></div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="panel" style={{ borderColor: '#fecaca', background: '#fef2f2', color: '#991b1b' }}>
                {error}
              </div>
            ) : (
              <div className="cards">
                {books.map((b) => (
                  <article key={b.key} className="card">
                    <a className="card-cover" href={`https://openlibrary.org${b.key}`} target="_blank" rel="noreferrer">
                      <img src={coverUrl(b.cover_i)} alt={b.title} loading="lazy" />
                    </a>
                    <h3 className="card-title" title={b.title}>{b.title}</h3>
                    <p className="card-sub" title={(b.author_name || []).join(', ')}>
                      {(b.author_name || []).join(', ')}
                    </p>
                    <div className="card-meta">
                      <span>{b.first_publish_year || '—'}</span>
                      <a href={`https://openlibrary.org${b.key}`} target="_blank" rel="noreferrer" style={{ color: 'var(--brand)' }}>
                        Details
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            )}

            <div className="pager">
              <button
                onClick={() => { const p = Math.max(1, page - 1); searchBooks(p) }}
                className="page"
                disabled={page === 1}
              >
                Previous
              </button>
              <span className="muted">Page {page}</span>
              <button onClick={() => searchBooks(page + 1)} className="page">Next</button>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}
