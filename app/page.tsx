"use client";

import { useEffect } from "react";

function SongCard({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <article className={`song-card${dimmed ? " dimmed" : ""}`}>
      <div className="song-row">
        <div className="song-meta">
          <div className="song-title">—</div>
          <div className="song-artist">—</div>
        </div>
        <div className="song-art">
          <div className="song-art__cover" />
        </div>
      </div>
      <button className="listen-btn" type="button">
        <span>Listen</span>
        <svg
          className="arrow"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M9 6L15 12L9 18"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </article>
  );
}

export default function Home() {
  useEffect(() => {
    import("@/lib/bumps-app").then(({ initBumpsApp }) => initBumpsApp());
  }, []);

  return (
    <>
      <main className="frame-root">
        <div className="bg-gradient bg-gradient--a is-visible" aria-hidden="true" />
        <div className="bg-gradient bg-gradient--b" aria-hidden="true" />

        <div className="now-playing-marquee" aria-live="polite">
          <div className="marquee-shell">
            <div className="marquee-viewport">
              <div className="text-track">
                <span className="marquee-text">
                  <span className="song-title">&apos;—&apos;</span>
                  <span className="song-artist">by —</span>
                </span>
                <span className="marquee-text marquee-text--clone" aria-hidden="true">
                  <span className="song-title">&apos;—&apos;</span>
                  <span className="song-artist">by —</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="frame-grid">
          <section className="left-stack" aria-label="Songs">
            <div className="song-cards">
              <SongCard />
              <SongCard dimmed />
              <SongCard dimmed />
            </div>
            <p className="fortune-quote" id="fortuneQuote" aria-live="polite" />
          </section>
        </div>
      </main>

      <div className="fortune-canvas-host" id="fortuneCanvasHost" aria-hidden="true" />

      <div className="fab-container">
        <div className="fab-auth" id="fabAuth">
          <button
            className="fab-btn"
            type="button"
            id="loginButton"
            aria-label="Connect Spotify"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.359.24-.66.54-.78 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.242 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </button>

          <button
            className="fab-btn"
            type="button"
            id="logoutButton"
            aria-label="Disconnect Spotify"
            aria-hidden="true"
            tabIndex={-1}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="16 17 21 12 16 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="21"
                y1="12"
                x2="9"
                y2="12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <button
          className="fab-btn"
          type="button"
          id="refreshButton"
          aria-label="Refresh songs"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M1 4v6h6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M23 20v-6h-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <a
        className="follow-btn"
        id="followButton"
        href="https://open.spotify.com/user/theuribes"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Follow me on Spotify"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.84-.179-.84-.66 0-.359.24-.66.54-.78 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.242 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z" />
        </svg>
        Follow me
      </a>
    </>
  );
}
