// Spotify requires 127.0.0.1 for loopback redirects; auto-redirect from localhost
if (window.location.hostname === "localhost") {
  window.location.replace(
    window.location.href.replace("localhost", "127.0.0.1")
  );
}

// --- Keyboard ASMR Sound Effect ---
(function initKeyboardSound() {
  // Create audio context (will be initialized on first user interaction)
  let audioContext = null;

  // Initialize audio context on first interaction (required by browser autoplay policies)
  function getAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume if suspended (required after user interaction)
    if (audioContext.state === "suspended") {
      audioContext.resume();
    }
    return audioContext;
  }

  // Generate a soft, kick-drum-like click sound
  function playKeyboardClick() {
    try {
      const ctx = getAudioContext();

      // Create a soft kick-drum-like thump sound
      const duration = 0.08; // Slightly longer for kick drum feel (80ms)
      const sampleRate = ctx.sampleRate;
      const frameCount = Math.floor(duration * sampleRate);
      const buffer = ctx.createBuffer(1, frameCount, sampleRate);
      const data = buffer.getChannelData(0);

      // Generate a kick drum sound with low frequencies
      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        const progress = t / duration;

        // Kick drum envelope: fast attack, exponential decay
        // Using a smoother curve that starts strong and decays quickly
        const envelope = Math.exp(-progress * 15) * (1 - progress * 0.2);

        // Low frequency thump (kick drum range: 60-100Hz)
        const kickFreq = 80; // Base kick frequency

        // Pitch sweep: start higher and drop quickly (characteristic of kick drums)
        const pitchDrop = Math.exp(-progress * 8); // Exponential pitch drop
        const currentFreq = kickFreq + kickFreq * 2 * pitchDrop;

        // Main kick thump with sub-bass
        const kick =
          Math.sin(2 * Math.PI * currentFreq * t) * 0.25 + // Main kick
          Math.sin(2 * Math.PI * currentFreq * 0.5 * t) * 0.15 + // Sub-bass
          Math.sin(2 * Math.PI * currentFreq * 1.5 * t) * 0.08; // Harmonic

        // Subtle noise for texture (very minimal)
        const noise = (Math.random() * 2 - 1) * 0.02 * (1 - progress);

        // Apply envelope and ensure no clipping (keep under 0.8)
        const output = (kick + noise) * envelope * 0.25; // Lower volume to prevent clipping
        data[i] = Math.max(-0.8, Math.min(0.8, output)); // Hard limit to prevent clipping
      }

      // Play the sound
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch (error) {
      // Silently fail if audio context creation fails (e.g., in some browsers)
      console.debug("Keyboard sound playback failed:", error);
    }
  }

  // Attach click sound to all buttons
  function attachKeyboardSound() {
    // Use event delegation to catch all button clicks, including dynamically created ones
    document.addEventListener(
      "click",
      function (e) {
        // Check if the clicked element or its parent is a button
        const button = e.target.closest("button");
        if (button && !button.disabled) {
          playKeyboardClick();
        }
      },
      true
    ); // Use capture phase to catch events early
  }

  // Initialize on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attachKeyboardSound);
  } else {
    attachKeyboardSound();
  }
})();

// --- Fortune Reveal Swoosh Sound Effect ---
(function initFortuneSwooshSound() {
  // Shared audio context - will be initialized on first use
  let audioContext = null;

  function getAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume immediately if suspended to avoid any delay
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {
        // Ignore resume errors (user interaction required)
      });
    }
    return audioContext;
  }

  // Generate a smooth, soft swoosh sound
  window.playFortuneSwoosh = function() {
    try {
      const ctx = getAudioContext();
      
      // Ensure context is running immediately (no await to avoid delay)
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }

      // Create a soft, ethereal swoosh sound - longer duration for smooth reveal
      const duration = 0.5; // 500ms for a gentle, revealing swoosh
      const sampleRate = ctx.sampleRate;
      const frameCount = Math.floor(duration * sampleRate);
      const buffer = ctx.createBuffer(1, frameCount, sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < frameCount; i++) {
        const t = i / sampleRate;
        const progress = t / duration;

        // Ultra-smooth envelope: extremely gentle attack, very smooth decay
        // Creates a whisper-soft, barely-there feel
        const envelope = 
          Math.pow(progress, 0.2) * // Extremely gentle, very slow attack
          Math.pow(1 - progress, 2.5); // Very smooth exponential decay

        // Frequency sweep: very gentle sweep from mid to low
        // Start around 400Hz, very gently sweep down to 120Hz
        const startFreq = 400;
        const endFreq = 120;
        // Use smoother easing for gentler frequency transition
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentFreq = startFreq + (endFreq - startFreq) * easedProgress;

        // Generate whisper-soft filtered noise for minimal texture
        const noise1 = (Math.random() * 2 - 1) * 0.03; // Very soft noise
        const noise2 = (Math.random() * 2 - 1) * 0.02;
        
        // Very soft swept frequency components - subtle harmonics
        const sweep1 = Math.sin(2 * Math.PI * currentFreq * t) * 0.06;
        const sweep2 = Math.sin(2 * Math.PI * currentFreq * 0.65 * t) * 0.03;
        
        // Very subtle low shimmer (avoid high frequencies that can be harsh)
        const shimmer = Math.sin(2 * Math.PI * currentFreq * 1.8 * t) * 0.015 * (1 - progress);
        
        // Combine all elements extremely softly
        const swoosh = (noise1 + noise2 + sweep1 + sweep2 + shimmer) * envelope * 0.04; // Whisper-soft volume

        // Apply strong low-pass filter effect (heavy high-frequency rolloff)
        const filterAmount = Math.pow(1 - progress, 0.7);
        const filtered = swoosh * (0.7 + 0.3 * filterAmount);

        // Ensure no clipping with very soft limits
        data[i] = Math.max(-0.3, Math.min(0.3, filtered));
      }

      // Play the sound immediately
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);
    } catch (error) {
      // Silently fail if audio context creation fails
      console.debug("Fortune swoosh sound playback failed:", error);
    }
  };
})();

// --- Spotify Web API (PKCE) integration ---
const SPOTIFY_CLIENT_ID = "faf051d1e310436988ecdc54f79b7ac2";
const CREATOR_SPOTIFY_URL = "https://open.spotify.com/user/theuribes";

// --- OpenAI API Key (loaded from config.js - gitignored) ---
// The API key is loaded from config.js to keep it out of version control
// config.js sets window.OPENAI_API_KEY which we reference here
const OPENAI_API_KEY =
  typeof window !== "undefined" && window.OPENAI_API_KEY
    ? window.OPENAI_API_KEY
    : null;
const SPOTIFY_REDIRECT_URI = (function () {
  try {
    const origin = window.location.origin;
    const isLocal = origin.includes("127.0.0.1") || origin.includes("localhost");
    if (isLocal) {
      // Spotify requires 127.0.0.1 (not localhost) for loopback redirects
      const port = window.location.port || "3000";
      return `http://127.0.0.1:${port}/index.html`;
    }
    // Production (GitHub Pages): directory path with trailing slash
    let p = window.location.pathname || "/";
    p = p.replace(/index\.html?$/i, "");
    if (!p.endsWith("/")) p += "/";
    return origin + p;
  } catch (_) {
    return window.location.origin + "/";
  }
})();

async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("spotify_pkce_verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", SPOTIFY_REDIRECT_URI);

  params.append(
    "scope",
    "user-read-email user-read-private user-read-recently-played"
  );
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  window.location.assign(
    `https://accounts.spotify.com/authorize?${params.toString()}`
  );
}

function generateCodeVerifier(length) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getAccessToken(clientId, code) {
  const verifier = localStorage.getItem("spotify_pkce_verifier");

  if (!verifier) {
    const err = new Error("spotify_pkce_verifier_missing");
    err.message = "PKCE verifier not found. Please try logging in again.";
    throw err;
  }

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", SPOTIFY_REDIRECT_URI);
  params.append("code_verifier", verifier);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!result.ok) {
    const errorData = await result.json().catch(() => ({}));
    const err = new Error("spotify_token_exchange_failed");
    err.status = result.status;
    err.details = errorData;
    err.message =
      errorData.error_description ||
      errorData.error ||
      `Token exchange failed with status ${result.status}. Make sure the redirect URI in your Spotify app settings matches: ${SPOTIFY_REDIRECT_URI}`;
    throw err;
  }
  const json = await result.json();
  return json; // contains access_token, refresh_token, expires_in
}

async function fetchProfile(token) {
  const result = await fetch("https://api.spotify.com/v1/me", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (result.status === 401) {
    const err = new Error("spotify_unauthorized");
    err.status = 401;
    throw err;
  }
  if (!result.ok) {
    const err = new Error("spotify_profile_fetch_failed");
    err.status = result.status;
    throw err;
  }
  return await result.json();
}

async function fetchRecentlyPlayed(token, limit = 50) {
  const allItems = [];
  let nextUrl = null;
  let firstRequest = true;

  do {
    const url = firstRequest
      ? new URL("https://api.spotify.com/v1/me/player/recently-played")
      : new URL(nextUrl);

    if (firstRequest) {
      // Fetch maximum items to get the most recent data
      url.searchParams.set("limit", String(Math.min(limit, 50))); // Spotify max is 50 per request
      // Note: Spotify's API doesn't support 'after' or 'before' params for recently-played
      // It always returns the most recent 50 tracks from the last 7 days
    }

    const result = await fetch(url.toString(), {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (result.status === 401) {
      const err = new Error("spotify_unauthorized");
      err.status = 401;
      throw err;
    }
    if (!result.ok) {
      const err = new Error("spotify_recently_played_failed");
      err.status = result.status;
      throw err;
    }

    const data = await result.json();

    if (data.items && Array.isArray(data.items)) {
      allItems.push(...data.items);
    }

    // Continue pagination if there's more data and we haven't reached our limit
    nextUrl = data.next;
    firstRequest = false;

    // Stop if we've collected enough items or there's no more data
    if (allItems.length >= limit || !nextUrl) {
      break;
    }
  } while (nextUrl && allItems.length < limit);

  return {
    items: allItems.slice(0, limit),
    limit: limit,
    next: null, // We've paginated, so no more next
    cursors: {},
    href: "https://api.spotify.com/v1/me/player/recently-played",
  };
}

async function refreshAccessToken(clientId, refreshToken) {
  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const result = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
  if (!result.ok) {
    throw new Error("spotify_refresh_failed");
  }
  return await result.json(); // may include new access_token and sometimes new refresh_token
}

// Return the N most recent unique tracks by recency (newest first)
function getMostRecentUniqueTracks(recentlyPlayedJson, count = 3) {
  if (!recentlyPlayedJson || !Array.isArray(recentlyPlayedJson.items)) {
    return [];
  }

  const items = [...recentlyPlayedJson.items].sort(
    (a, b) => new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
  );

  const seen = new Set();
  const results = [];
  for (const item of items) {
    const track = item.track;
    if (!track || !track.id || !track.name) continue;
    if (seen.has(track.id)) continue;
    seen.add(track.id);

    const artists =
      (track.artists || [])
        .map((a) => (a && a.name ? a.name : ""))
        .filter((name) => name.trim().length > 0)
        .join(", ") || "Unknown Artist";

    results.push({
      id: track.id,
      name: track.name || "Unknown Track",
      artists: artists,
      image: track.album?.images?.[0]?.url || "",
      previewUrl: track.preview_url || "",
      spotifyUrl: track.external_urls?.spotify || "",
      playedAt: item.played_at,
    });

    if (results.length >= count) break;
  }

  return results;
}

function renderTop3IntoLeftStack(tracks) {
  const container = document.querySelector(".song-cards");
  if (!container) {
    console.warn("renderTop3IntoLeftStack: .song-cards container not found");
    return;
  }

  if (!Array.isArray(tracks)) {
    tracks = tracks ? [tracks] : [];
  }

  const cards = Array.prototype.slice.call(
    container.querySelectorAll(".song-card")
  );

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const data = tracks && tracks[i] ? tracks[i] : null;
    const titleEl = card.querySelector(".song-title");
    const artistEl = card.querySelector(".song-artist");
    const artEl = card.querySelector(".song-art");
    const coverEl = card.querySelector(".song-art__cover");
    const listenBtn = card.querySelector(".listen-btn");

    if (!data) {
      if (titleEl) titleEl.textContent = "—";
      if (artistEl) artistEl.textContent = "—";
      if (coverEl) {
        coverEl.style.backgroundImage = "";
        coverEl.style.background = "#fff";
      } else if (artEl) {
        artEl.style.backgroundImage = "";
        artEl.style.background = "#fff";
      }
      if (card) {
        card.dataset.previewUrl = "";
        card.dataset.spotifyUrl = "";
        card.dataset.coverUrl = "";
      }
      continue;
    }

    if (titleEl) titleEl.textContent = data.name || "—";
    if (artistEl) {
      artistEl.textContent = data.artists ? `by ${data.artists}` : "—";
    }

    if (coverEl) {
      coverEl.style.background = data.image
        ? `center/cover no-repeat url('${data.image}')`
        : "#fff";
    } else if (artEl) {
      artEl.style.background = data.image
        ? `center/cover no-repeat url('${data.image}')`
        : "#fff";
    }

    if (card) {
      card.dataset.previewUrl = data.previewUrl || "";
      card.dataset.spotifyUrl = data.spotifyUrl || "";
      card.dataset.coverUrl = data.image || "";
    }

    // Remove old event listeners by cloning the button
    if (listenBtn) {
      const newListenBtn = listenBtn.cloneNode(true);
      listenBtn.parentNode.replaceChild(newListenBtn, listenBtn);
      newListenBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (card.classList.contains("dimmed")) return;
        const url = card.dataset.spotifyUrl;
        if (url) window.open(url, "_blank");
      });
    }
  }

  if (tracks && tracks.length > 0) {
    container.classList.add("is-loaded");
    preloadCoverArtGradients(tracks.map((track) => track?.image));
  }
}

let __audioEl = null;
function ensureAudio() {
  if (__audioEl) return __audioEl;
  const existing = document.getElementById("np-audio");
  if (existing) {
    __audioEl = existing;
    return __audioEl;
  }
  const audio = document.createElement("audio");
  audio.id = "np-audio";
  audio.preload = "none";
  audio.crossOrigin = "anonymous";
  document.body.appendChild(audio);
  __audioEl = audio;
  return __audioEl;
}

function setNowPlaying(title, artist, previewUrl, coverUrl) {
  const marquee = document.querySelector(".now-playing-marquee");
  if (marquee) {
    const textTrack = marquee.querySelector(".text-track");
    const hasTrack = !!(title && artist);
    if (hasTrack && textTrack) {
      const coverHtml = coverUrl
        ? `<img class="marquee-cover" src="${coverUrl}" alt="" />`
        : "";
      const label = `<span class="song-title">'${title}'</span><span class="song-artist">by ${artist}</span>${coverHtml}`;
      textTrack.innerHTML = `<span class="marquee-text">${label}</span><span class="marquee-text marquee-text--clone" aria-hidden="true">${label}</span>`;
    }
  }
  const audio = ensureAudio();
  if (previewUrl) {
    if (audio.src !== previewUrl) audio.src = previewUrl;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  } else {
    audio.pause();
  }
}

// --- Cover art background gradient ---
const GRADIENT_CACHE_KEY = "bumps_gradient_cache";
const LAST_TOP_COVER_KEY = "bumps_last_top_cover";
const DEFAULT_GRADIENT_COLORS = [
  "#c4b5fd",
  "#fda4af",
  "#93c5fd",
  "#fcd34d",
];

function rgbToHex(r, g, b) {
  return (
    "#" +
    [r, g, b]
      .map((value) => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, "0"))
      .join("")
  );
}

function mixRgb(a, b, amount) {
  return [
    a[0] + (b[0] - a[0]) * amount,
    a[1] + (b[1] - a[1]) * amount,
    a[2] + (b[2] - a[2]) * amount,
  ];
}

function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 1;
}

function createSeededRandom(seed) {
  let state = seed >>> 0;
  return function seededRandom() {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function clamp255(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function pixelSaturation(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  return max === 0 ? 0 : (max - min) / max;
}

function pixelLuminance(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function averageColors(colors) {
  if (!colors.length) return [254, 254, 254];
  const sum = colors.reduce(
    (acc, color) => [acc[0] + color[0], acc[1] + color[1], acc[2] + color[2]],
    [0, 0, 0]
  );
  return [sum[0] / colors.length, sum[1] / colors.length, sum[2] / colors.length];
}

function boostSaturation(rgb, amount = 1.45) {
  const avg = (rgb[0] + rgb[1] + rgb[2]) / 3;
  return [
    clamp255(avg + (rgb[0] - avg) * amount),
    clamp255(avg + (rgb[1] - avg) * amount),
    clamp255(avg + (rgb[2] - avg) * amount),
  ];
}

function generateBackgroundGradient(colors, seed = 1) {
  const palette = colors.slice(0, 4);
  while (palette.length < 4) {
    palette.push(DEFAULT_GRADIENT_COLORS[palette.length]);
  }

  const rand = createSeededRandom(seed);
  const spotCount = 11 + Math.floor(rand() * 5);
  const blobs = [];

  for (let i = 0; i < spotCount; i++) {
    const color = palette[i % palette.length];
    const x = 2 + rand() * 96;
    const y = 4 + rand() * 48;
    const width = 520 + rand() * 1500;
    const height = 360 + rand() * 780;
    const alpha = 0.52 + rand() * 0.38;
    const midStop = 38 + rand() * 28;
    const fadeStop = midStop + 24 + rand() * 22;

    blobs.push(
      `radial-gradient(ellipse ${width.toFixed(0)}px ${height.toFixed(0)}px at ${x.toFixed(1)}% ${y.toFixed(1)}%, ${hexToRgba(color, alpha)} 0%, ${hexToRgba(color, alpha * 0.42)} ${midStop.toFixed(1)}%, transparent ${fadeStop.toFixed(1)}%)`
    );
  }

  const deepRgb = boostSaturation(
    [
      parseInt(palette[2].slice(1, 3), 16),
      parseInt(palette[2].slice(3, 5), 16),
      parseInt(palette[2].slice(5, 7), 16),
    ],
    1.15
  );
  const base = mixRgb(deepRgb, [255, 255, 255], 0.18);

  return `${blobs.join(",\n")},\n${rgbToHex(base[0], base[1], base[2])}`;
}

const GRADIENT_TRANSITION_MS = 700;
let activeGradientLayer = null;
let gradientFadeTimer = 0;
const gradientPreloadCache = new Map();
const gradientPreloadPromises = new Map();

function buildGradientEntry(colors, seed) {
  return {
    colors,
    seed,
    css: generateBackgroundGradient(colors, seed),
  };
}

async function preloadCoverArtGradient(imageUrl) {
  if (!imageUrl) return null;
  if (gradientPreloadCache.has(imageUrl)) {
    return gradientPreloadCache.get(imageUrl);
  }
  if (gradientPreloadPromises.has(imageUrl)) {
    return gradientPreloadPromises.get(imageUrl);
  }

  const promise = colorsFromCoverArt(imageUrl)
    .then((colors) => {
      const entry = buildGradientEntry(colors, hashString(imageUrl));
      gradientPreloadCache.set(imageUrl, entry);
      gradientPreloadPromises.delete(imageUrl);
      return entry;
    })
    .catch(() => {
      const entry = buildGradientEntry(DEFAULT_GRADIENT_COLORS, 1);
      gradientPreloadCache.set(imageUrl, entry);
      gradientPreloadPromises.delete(imageUrl);
      return entry;
    });

  gradientPreloadPromises.set(imageUrl, promise);
  return promise;
}

function preloadCoverArtGradients(urls) {
  urls.filter(Boolean).forEach((url) => {
    preloadCoverArtGradient(url);
  });
}

function getGradientLayers() {
  const root = document.querySelector(".frame-root");
  if (!root) return null;

  const a = root.querySelector(".bg-gradient--a");
  const b = root.querySelector(".bg-gradient--b");
  if (!a || !b) return null;

  return { a, b };
}

function showGradientLayer(layer, animate) {
  if (!layer) return;

  layer.classList.add("is-visible");
  if (animate) {
    void layer.offsetWidth;
  } else {
    layer.style.transition = "none";
    void layer.offsetWidth;
    layer.style.transition = "";
  }
}

function hideGradientLayer(layer) {
  if (!layer) return;
  layer.classList.remove("is-visible");
}

function initGradientLayers() {
  const layers = getGradientLayers();
  if (layers) activeGradientLayer = layers.a;
}

function applyBackgroundGradient(colors, seed = 1, options = {}) {
  const css = options.css || generateBackgroundGradient(colors, seed);
  const layers = getGradientLayers();

  if (!layers) {
    const frameRoot = document.querySelector(".frame-root");
    if (frameRoot) frameRoot.style.background = css;
    if (options.persist) {
      saveGradientCache(colors, seed, options.coverUrl || "");
    }
    return;
  }

  const { a, b } = layers;
  const previousLayer = activeGradientLayer;

  if (options.instant && previousLayer) {
    previousLayer.style.background = css;
    showGradientLayer(previousLayer, false);
    hideGradientLayer(previousLayer === a ? b : a);
    activeGradientLayer = previousLayer;
    if (options.persist) {
      saveGradientCache(colors, seed, options.coverUrl || "");
    }
    return;
  }

  const nextLayer = activeGradientLayer === a ? b : a;
  const shouldAnimate = !!previousLayer && !options.instant;

  nextLayer.style.background = css;

  if (!previousLayer) {
    showGradientLayer(nextLayer, false);
    activeGradientLayer = nextLayer;
  } else {
    showGradientLayer(nextLayer, shouldAnimate);

    if (gradientFadeTimer) {
      window.clearTimeout(gradientFadeTimer);
    }

    activeGradientLayer = nextLayer;

    if (shouldAnimate && previousLayer !== nextLayer) {
      gradientFadeTimer = window.setTimeout(() => {
        if (activeGradientLayer !== previousLayer) {
          hideGradientLayer(previousLayer);
        }
        gradientFadeTimer = 0;
      }, GRADIENT_TRANSITION_MS);
    } else if (previousLayer !== nextLayer) {
      hideGradientLayer(previousLayer);
    }
  }

  if (options.persist) {
    saveGradientCache(colors, seed, options.coverUrl || "");
  }
}

function saveGradientCache(colors, seed, coverUrl) {
  try {
    localStorage.setItem(
      GRADIENT_CACHE_KEY,
      JSON.stringify({
        colors,
        seed,
        coverUrl: coverUrl || "",
        savedAt: Date.now(),
      })
    );
  } catch {}
}

function loadGradientCache() {
  try {
    const raw = localStorage.getItem(GRADIENT_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.colors) || parsed.colors.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

function restoreCachedGradient() {
  const cached = loadGradientCache();
  if (!cached) return false;
  applyBackgroundGradient(cached.colors, cached.seed || 1, { instant: true });
  return true;
}

function restoreBackgroundOnLoad() {
  restoreCachedGradient();
  const topCover = localStorage.getItem(LAST_TOP_COVER_KEY);
  if (topCover) applyCoverArtGradient(topCover);
}

function colorsFromCoverArt(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const size = 80;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);

      const { data } = ctx.getImageData(0, 0, size, size);
      const pixels = [];

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];
        if (a < 128) continue;
        pixels.push([r, g, b]);
      }

      if (pixels.length === 0) {
        resolve(DEFAULT_GRADIENT_COLORS);
        return;
      }

      const average = averageColors(pixels);
      const colorful = pixels.filter((pixel) => pixelSaturation(...pixel) > 0.1);
      const pool = colorful.length >= 8 ? colorful : pixels;

      const bySaturation = [...pool].sort(
        (a, b) => pixelSaturation(...b) - pixelSaturation(...a)
      );
      const vibrant = averageColors(
        bySaturation.slice(0, Math.max(6, Math.floor(pool.length * 0.18)))
      );

      const byLuminance = [...pool].sort(
        (a, b) => pixelLuminance(...a) - pixelLuminance(...b)
      );
      const deep = averageColors(
        byLuminance.slice(0, Math.max(4, Math.floor(pool.length * 0.12)))
      );
      const bright = averageColors(
        byLuminance.slice(-Math.max(4, Math.floor(pool.length * 0.12)))
      );

      const colors = [
        boostSaturation(vibrant, 1.55),
        boostSaturation(average, 1.35),
        boostSaturation(deep, 1.25),
        mixRgb(boostSaturation(bright, 1.4), boostSaturation(vibrant, 1.2), 0.35),
      ].map((rgb) => rgbToHex(rgb[0], rgb[1], rgb[2]));

      resolve(colors);
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

let coverArtGradientRequest = 0;

async function applyCoverArtGradient(imageUrl) {
  const requestId = ++coverArtGradientRequest;

  if (!imageUrl) {
    if (!restoreCachedGradient()) {
      applyBackgroundGradient(DEFAULT_GRADIENT_COLORS, 1);
    }
    return;
  }

  try {
    let entry = gradientPreloadCache.get(imageUrl);
    if (!entry) {
      entry = await preloadCoverArtGradient(imageUrl);
    }
    if (requestId !== coverArtGradientRequest || !entry) return;

    applyBackgroundGradient(entry.colors, entry.seed, {
      persist: true,
      coverUrl: imageUrl,
      css: entry.css,
    });
  } catch {
    if (requestId !== coverArtGradientRequest) return;
    if (!restoreCachedGradient()) {
      applyBackgroundGradient(DEFAULT_GRADIENT_COLORS, 1);
    }
  }
}

function updateBackgroundFromCard(card) {
  const coverUrl = card?.dataset?.coverUrl || "";
  if (coverUrl) {
    applyCoverArtGradient(coverUrl);
    return;
  }
  restoreBackgroundOnLoad();
}

function setActiveSongCard(card) {
  const container = document.querySelector(".song-cards");
  if (!container || !card) return;

  const cards = container.querySelectorAll(".song-card");
  cards.forEach((entry) => {
    entry.classList.toggle("dimmed", entry !== card);
  });

  const titleEl = card.querySelector(".song-title");
  const artistEl = card.querySelector(".song-artist");
  const preview = card.dataset.previewUrl || "";
  const cover = card.dataset.coverUrl || "";
  const titleTxt = titleEl ? titleEl.textContent.replace(/[""]/g, "") : "";
  const artistTxt = artistEl ? artistEl.textContent.replace(/^by\s+/i, "") : "";

  if (titleTxt !== "—" && artistTxt !== "—") {
    setNowPlaying(titleTxt, artistTxt, preview, cover);
  }

  updateBackgroundFromCard(card);
}

function populateUI(profile) {
  const authStatus = document.getElementById("authStatus");
  if (authStatus) authStatus.textContent = "Connected";
}

function setAuthUIConnected(connected) {
  const loginBtn = document.getElementById("loginButton");
  const logoutBtn = document.getElementById("logoutButton");
  const fabAuth = document.getElementById("fabAuth");

  if (fabAuth) {
    fabAuth.classList.toggle("is-connected", connected);
  }

  if (loginBtn) {
    loginBtn.setAttribute("aria-hidden", connected ? "true" : "false");
    loginBtn.tabIndex = connected ? -1 : 0;
  }

  if (logoutBtn) {
    logoutBtn.setAttribute("aria-hidden", connected ? "false" : "true");
    logoutBtn.tabIndex = connected ? 0 : -1;
  }
}

async function initSpotify() {
  const loginBtn = document.getElementById("loginButton");
  const logoutBtn = document.getElementById("logoutButton");

  const handleLogin = () => {
    if (
      !SPOTIFY_CLIENT_ID ||
      SPOTIFY_CLIENT_ID === "YOUR_SPOTIFY_CLIENT_ID_HERE"
    ) {
      alert("Please set SPOTIFY_CLIENT_ID in app.js before connecting.");
      return;
    }
    redirectToAuthCodeFlow(SPOTIFY_CLIENT_ID);
  };

  const handleLogout = () => {
    localStorage.removeItem("spotify_pkce_verifier");
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_refresh_token");
    setAuthUIConnected(false);
  };

  if (loginBtn) loginBtn.addEventListener("click", handleLogin);
  if (logoutBtn) logoutBtn.addEventListener("click", handleLogout);

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const existingToken = localStorage.getItem("spotify_access_token");
  const existingRefresh = localStorage.getItem("spotify_refresh_token");

  try {
    if (existingToken) {
      try {
        setAuthUIConnected(true);
        const profile = await fetchProfile(existingToken);
        populateUI(profile);
        await updateLeftStackFromSpotify(existingToken, { generateFortune: true });
        startSpotifyRefresh(); // Start periodic refresh
        return;
      } catch (e) {
        if (e && e.status === 401 && existingRefresh) {
          const refreshed = await refreshAccessToken(
            SPOTIFY_CLIENT_ID,
            existingRefresh
          );
          const newAccess = refreshed.access_token;
          const newRefresh = refreshed.refresh_token || existingRefresh;
          if (newAccess) {
            localStorage.setItem("spotify_access_token", newAccess);
            if (newRefresh)
              localStorage.setItem("spotify_refresh_token", newRefresh);
            const profile = await fetchProfile(newAccess);
            populateUI(profile);
            await updateLeftStackFromSpotify(newAccess, { generateFortune: true });
            startSpotifyRefresh(); // Start periodic refresh
            return;
          }
        }
        // fall through to code flow below
        setAuthUIConnected(false);
      }
    }

    if (code) {
      try {
        const tokenResponse = await getAccessToken(SPOTIFY_CLIENT_ID, code);
        const access = tokenResponse && tokenResponse.access_token;
        const refresh = tokenResponse && tokenResponse.refresh_token;
        if (access) {
          localStorage.setItem("spotify_access_token", access);
          if (refresh) localStorage.setItem("spotify_refresh_token", refresh);
          // remove code from URL
          const cleanUrl = window.location.origin + window.location.pathname;
          window.history.replaceState({}, document.title, cleanUrl);
          setAuthUIConnected(true);
          const profile = await fetchProfile(access);
          populateUI(profile);
          await updateLeftStackFromSpotify(access, { generateFortune: true });
          startSpotifyRefresh(); // Start periodic refresh
        } else {
          console.error("No access token in response", tokenResponse);
          alert("Failed to get access token. Please try again.");
          setAuthUIConnected(false);
        }
      } catch (tokenErr) {
        console.error("Token exchange error:", tokenErr);
        alert(
          tokenErr.message ||
            "Failed to authenticate with Spotify. Please check that your redirect URI is configured correctly in your Spotify app settings."
        );
        setAuthUIConnected(false);
        // Clean up URL
        const cleanUrl = window.location.origin + window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  } catch (err) {
    console.error("Spotify auth error", err);
    setAuthUIConnected(false);
  }
}

async function updateLeftStackFromSpotify(token, options = {}) {
  const { generateFortune = false } = options;
  try {
    const recent = await fetchRecentlyPlayed(token, 50);

    const top3 = getMostRecentUniqueTracks(recent, 3);
    renderTop3IntoLeftStack(top3);

    if (top3[0]?.image) {
      try {
        localStorage.setItem(LAST_TOP_COVER_KEY, top3[0].image);
      } catch {}
    }

    // Update journal card with most recent tracks (only if we have songs)
    if (top3 && top3.length > 0) {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;
      const day = today.getDate();
      const todayISO = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;

      if (generateFortune) {
        await updateJournalCard(todayISO, top3);
      }

      const container = document.querySelector(".song-cards");
      if (container) {
        const cards = Array.prototype.slice.call(
          container.querySelectorAll(".song-card")
        );
        if (cards[0]) {
          setActiveSongCard(cards[0]);
        }
      }
    }
  } catch (e) {
    console.error("Failed to update left stack from Spotify", e);
    // On error, ensure placeholders are shown
    renderTop3IntoLeftStack([]);
    // Re-throw the error so the refresh mechanism can handle token refresh
    throw e;
  }
}

initGradientLayers();
restoreBackgroundOnLoad();

initSpotify();

// Periodic refresh of Spotify data every 30 seconds
let spotifyRefreshInterval = null;
let isRefreshing = false; // Flag to prevent overlapping refresh requests

function startSpotifyRefresh() {
  // Clear any existing interval
  if (spotifyRefreshInterval) {
    clearInterval(spotifyRefreshInterval);
  }

  // Refresh every 30 seconds
  spotifyRefreshInterval = setInterval(async () => {
    if (isRefreshing) return;

    let token = localStorage.getItem("spotify_access_token");
    if (!token) {
      clearInterval(spotifyRefreshInterval);
      spotifyRefreshInterval = null;
      return;
    }

    isRefreshing = true;
    try {
      await updateLeftStackFromSpotify(token, { generateFortune: false });
    } catch (error) {
      console.error("Failed to refresh Spotify data:", error);

      // If token expired, try to refresh it
      if (error.status === 401) {
        const refreshToken = localStorage.getItem("spotify_refresh_token");
        if (refreshToken) {
          try {
            const refreshed = await refreshAccessToken(SPOTIFY_CLIENT_ID, refreshToken);
            const newAccess = refreshed.access_token;
            const newRefresh = refreshed.refresh_token || refreshToken;
            if (newAccess) {
              localStorage.setItem("spotify_access_token", newAccess);
              if (newRefresh) localStorage.setItem("spotify_refresh_token", newRefresh);
              await updateLeftStackFromSpotify(newAccess, { generateFortune: false });
            } else {
              throw new Error("No access token in refresh response");
            }
          } catch (refreshError) {
            console.error("Failed to refresh access token:", refreshError);
            clearInterval(spotifyRefreshInterval);
            spotifyRefreshInterval = null;
            setAuthUIConnected(false);
            localStorage.removeItem("spotify_access_token");
            localStorage.removeItem("spotify_refresh_token");
          }
        } else {
          clearInterval(spotifyRefreshInterval);
          spotifyRefreshInterval = null;
          setAuthUIConnected(false);
        }
      }
    } finally {
      isRefreshing = false;
    }
  }, 30000);
}

// --- Song card microinteraction (left-stack) ---
document.addEventListener("DOMContentLoaded", function () {
  const followBtn = document.getElementById("followButton");
  if (followBtn && CREATOR_SPOTIFY_URL) {
    followBtn.href = CREATOR_SPOTIFY_URL;
  }

  var container = document.querySelector(".song-cards");
  if (!container) return;

  var cards = Array.prototype.slice.call(
    container.querySelectorAll(".song-card")
  );
  if (cards.length === 0) return;

  setActiveSongCard(cards[0]);

  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      if (!card.classList.contains("dimmed")) return;
      setActiveSongCard(card);
    });
  });
});

// --- Lyrics API Integration ---
async function fetchLyrics(songTitle, artistName) {
  try {
    // Clean up the artist name - take first artist if multiple
    const artist = artistName.split(",")[0].trim();
    // Clean up song title - remove common suffixes
    const title = songTitle
      .replace(/\s*\(.*?\)\s*/g, "")
      .replace(/\s*-.*$/, "")
      .trim();

    // Try lyrics.ovh API first
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(
      artist
    )}/${encodeURIComponent(title)}`;

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        // 404 is expected for songs without lyrics, not an error
        if (response.status === 404) {
          console.log(`Lyrics not found for "${title}" by "${artist}"`);
          return null;
        }
        console.warn(
          `Lyrics API returned ${response.status} for "${title}" by "${artist}"`
        );
        return null;
      }

      const data = await response.json();

      // Check if we got valid lyrics
      if (data.lyrics && data.lyrics.trim().length > 0) {
        return data.lyrics.trim();
      }

      return null;
    } catch (fetchError) {
      clearTimeout(timeoutId);

      // Handle abort (timeout)
      if (fetchError.name === "AbortError") {
        console.warn(`Lyrics fetch timeout for "${title}" by "${artist}"`);
        return null;
      }

      // Handle CORS or network errors
      if (
        fetchError instanceof TypeError &&
        fetchError.message.includes("fetch")
      ) {
        console.warn(
          `CORS or network error fetching lyrics for "${title}" by "${artist}": ${fetchError.message}`
        );
        return null;
      }

      throw fetchError; // Re-throw unexpected errors
    }
  } catch (error) {
    console.error(
      `Error fetching lyrics for "${songTitle}" by "${artistName}":`,
      error
    );
    return null;
  }
}

// --- Helper function to get OpenAI API key from config.js ---
function getOpenAIApiKey() {
  // The API key is injected by GitHub Actions from Secrets during deployment
  // For local development, it comes from config.js (gitignored)
  // For GitHub Pages, it comes from the config.js created during deployment

  let apiKey = null;

  // Check window.OPENAI_API_KEY (from config.js)
  if (typeof window !== "undefined" && window.OPENAI_API_KEY) {
    apiKey = window.OPENAI_API_KEY;
  } else if (OPENAI_API_KEY) {
    // Fallback to constant (from config.js loaded before app.js)
    apiKey = OPENAI_API_KEY;
  }

  return apiKey && apiKey !== "YOUR_OPENAI_API_KEY_HERE" ? apiKey : null;
}

// --- OpenAI API Integration ---
async function generateJournalEntry(songLyrics, previousFortunes = []) {
  // Use the helper function to get API key from all sources
  const apiKey = getOpenAIApiKey();

  if (!apiKey || apiKey === "YOUR_OPENAI_API_KEY_HERE") {
    console.error("OpenAI API key not configured.");
    return null;
  }

  try {
    // Combine all lyrics with full context
    const songsWithLyrics = songLyrics.filter((s) => s.lyrics);

    let lyricsSection = "";
    if (songsWithLyrics.length > 0) {
      lyricsSection = songsWithLyrics
        .map((s) => `"${s.title}" by ${s.artist}:\n${s.lyrics}`)
        .join("\n\n");
    }

    const artistList = songLyrics
      .map((s) => s.artist)
      .filter((artist, index, self) => self.indexOf(artist) === index)
      .join(", ");

    const songList = songLyrics
      .map((s) => `"${s.title}" by ${s.artist}`)
      .join(", ");

    let prompt = `Generate a fortune cookie message based on these 3 most recent songs I just played.

RECENT SONGS: ${songList}

ARTISTS: ${artistList}
`;

    if (lyricsSection) {
      prompt += `
SONGS & LYRICS:
${lyricsSection}
`;
    } else {
      prompt += `
NOTE: Lyrics were not available for these songs, so base the fortune on the song titles, artists, and what you know about them.
`;
    }

    prompt += `

Write a single fortune cookie phrase that:
- Is a short, punchy one-liner (under 12 words)
- Feels cryptic and poetic like a real fortune cookie slip
- Draws subtle inspiration from the themes or vibes of these songs
- Uses second person ("You", "Your") or timeless wisdom
- Never names the songs or artists
`;

    const recentFortunes = [...new Set(previousFortunes.map((f) => f.trim()).filter(Boolean))];
    if (recentFortunes.length > 0) {
      prompt += `
PREVIOUS FORTUNES FROM THIS SESSION (never repeat or closely paraphrase any of these):
${recentFortunes.map((f) => `- "${f}"`).join("\n")}

Write something clearly different in wording, metaphor, and angle.
`;
    }

    prompt += `
Format your response as a JSON object with a single "message" field:
{
  "message": "Your short fortune phrase here"
}

Return ONLY valid JSON, no markdown, no code blocks, no explanations.`;

    const isLocal = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost";
    const endpoint = isLocal ? "/api/chat" : "https://api.openai.com/v1/chat/completions";
    const headers = isLocal
      ? { "Content-Type": "application/json", "X-API-Key": apiKey }
      : { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` };

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that responds with valid JSON only, no markdown formatting, no code blocks, just raw JSON.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.95,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || "Unknown error";

      console.error("OpenAI API error:", response.status, errorMessage);

      let userMessage = `OpenAI API error (${response.status}): ${errorMessage}`;
      if (response.status === 401) {
        userMessage =
          "Invalid OpenAI API key. Please check your config.js file contains window.OPENAI_API_KEY.";
      } else if (response.status === 429) {
        userMessage = "OpenAI API rate limit exceeded. Please try again later.";
      } else if (response.status === 500 || response.status === 503) {
        userMessage =
          "OpenAI service is temporarily unavailable. Please try again later.";
      }

      throw new Error(userMessage);
    }

    const data = await response.json();

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Unexpected response format from OpenAI API");
    }

    const content = data.choices[0].message.content.trim();

    // Try multiple methods to extract JSON
    let fortuneMessage = null;

    // Method 1: Try parsing as direct JSON object
    try {
      const parsed = JSON.parse(content);
      if (parsed.message && typeof parsed.message === "string") {
        fortuneMessage = parsed.message;
      } else if (typeof parsed === "string") {
        fortuneMessage = parsed;
      }
    } catch (e) {
      // Continue to other methods
    }

    // Method 2: Extract JSON from markdown code blocks
    if (!fortuneMessage) {
      const jsonBlockMatch = content.match(
        /```(?:json)?\s*(\{[\s\S]*?\})\s*```/
      );
      if (jsonBlockMatch) {
        try {
          const parsed = JSON.parse(jsonBlockMatch[1]);
          if (parsed.message) {
            fortuneMessage = parsed.message;
          }
        } catch (e) {
          // Continue to next method
        }
      }
    }

    // Method 3: Try to find JSON object in content (last resort)
    if (!fortuneMessage) {
      const jsonMatch = content.match(/\{[\s\S]*"message"[\s\S]*\}/);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.message) {
            fortuneMessage = parsed.message;
          }
        } catch (e) {
          // If all else fails, use the content directly (might be plain text)
          fortuneMessage = content.replace(/["{}]/g, "").trim();
        }
      } else {
        // If no JSON found, use the content directly (might be plain text response)
        fortuneMessage = content.trim();
      }
    }

    if (!fortuneMessage || fortuneMessage.length === 0) {
      throw new Error("No fortune message found in OpenAI response");
    }

    return fortuneMessage;
  } catch (error) {
    console.error("Error generating journal entry:", error);
    // Re-throw with better context for UI display
    if (error.message.includes("API key")) {
      throw new Error(error.message);
    } else if (error.message.includes("rate limit")) {
      throw new Error(error.message);
    } else {
      throw new Error(`Failed to generate journal entry: ${error.message}`);
    }
  }
}

function normalizeFortuneText(text) {
  return (text || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function isDuplicateFortune(message, previousFortunes) {
  const normalized = normalizeFortuneText(message);
  if (!normalized) return false;
  return previousFortunes.some(
    (prev) => normalizeFortuneText(prev) === normalized
  );
}

// --- Fortune generation ---
async function generateJournalEntryForDay(_dateISO, top3Songs, previousFortunes = []) {
  // Fetch lyrics for all 3 songs with better error handling
  const lyricsPromises = top3Songs.map(async (song) => {
    try {
      const lyrics = await fetchLyrics(song.name, song.artists);
      return {
        title: song.name,
        artist: song.artists,
        lyrics: lyrics,
      };
    } catch (error) {
      console.error(`Failed to fetch lyrics for "${song.name}":`, error);
      return {
        title: song.name,
        artist: song.artists,
        lyrics: null,
      };
    }
  });

  const songLyrics = await Promise.all(lyricsPromises);

  // Check if we got at least one set of lyrics
  const hasLyrics = songLyrics.some((s) => s.lyrics);
  if (!hasLyrics) {
    console.warn(
      "No lyrics found for any of the top 3 songs. Proceeding without lyrics for journal generation."
    );
    // Continue anyway - OpenAI can generate based on song titles and artists
    // But add a note in the prompt that lyrics weren't available
  }

  // Generate a fresh fortune cookie message using OpenAI
  let fortuneMessage = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    fortuneMessage = await generateJournalEntry(songLyrics, previousFortunes);
    if (
      fortuneMessage &&
      !isDuplicateFortune(fortuneMessage, previousFortunes)
    ) {
      break;
    }
  }

  if (!fortuneMessage || typeof fortuneMessage !== "string") {
    console.error("Journal generation failed: No fortune message returned");
    // Fallback if generation fails
    return "Unable to generate fortune message. Please check your OpenAI API key and try again.";
  }

  return fortuneMessage;
}

let readingAnimationId = 0;

const FORTUNE_PAPER = {
  width: 340,
  padX: 24,
  padY: 12,
  fontSize: 12,
  lineHeight: 16,
  maxLines: 2,
  gap: 8,
  fallDuration: 11500,
};

function getPaperPivot(group) {
  return group?.userData?.paperPivot || group;
}

function setPaperRotation(group, rx, ry, rz) {
  const pivot = getPaperPivot(group);
  pivot.rotation.set(
    rx,
    ry !== undefined ? ry : pivot.rotation.y,
    rz !== undefined ? rz : pivot.rotation.z
  );
  syncFortuneShadow(group);
}

function syncFortuneShadow(group) {
  const shadow = group.userData.shadow;
  if (!shadow) return;
  const pivot = group.userData.paperPivot;
  const rx = pivot ? pivot.rotation.x : group.rotation.x;
  const ry = pivot ? pivot.rotation.y : group.rotation.y;
  const rz = pivot ? pivot.rotation.z : group.rotation.z;

  shadow.rotation.x = -rx * 0.3;
  shadow.rotation.z = rz;

  const tiltX = Math.sin(rx);
  const tiltY = Math.sin(ry);
  shadow.position.x = tiltY * 18;
  shadow.position.y = -(group.userData.paperHeight || 40) / 2 - 10 + tiltX * -14;

  const facing = Math.abs(Math.cos(rx) * Math.cos(ry));
  shadow.scale.set(0.85 + facing * 0.2, 0.3 + facing * 0.15, 1);

  const baseOpacity = group.userData.shadowOpacity ?? 0.14;
  if (shadow.material) {
    shadow.material.opacity = baseOpacity * (0.3 + facing * 0.7);
  }
}

let fortuneHost = null;
let fortuneScene = null;
let fortuneCamera = null;
let fortuneRenderer = null;
let fortuneActive = null;
let fortuneAnimating = false;
let fortuneRaf = 0;
let fortuneQuoteEl = null;
let fortuneHistory = [];

function randomLandingRotZ() {
  const side = Math.random() > 0.5 ? 1 : -1;
  return THREE.MathUtils.degToRad(side * (7 + Math.random() * 5));
}

function getPreviousFortuneTexts() {
  return fortuneHistory.slice();
}

function setFortuneQuote(text) {
  if (!fortuneQuoteEl) fortuneQuoteEl = document.getElementById("fortuneQuote");
  if (!fortuneQuoteEl) return;
  const trimmed = text?.trim();
  fortuneQuoteEl.textContent = trimmed ? `"${trimmed}"` : "";
}

function removeActiveFortune() {
  if (fortuneActive?.group && fortuneScene) {
    fortuneScene.remove(fortuneActive.group);
    disposeFortuneGroup(fortuneActive.group);
  }
  fortuneActive = null;
}

function getFortuneStageMetrics() {
  const vv = window.visualViewport;
  const width = Math.round(vv?.width ?? window.innerWidth);
  const height = Math.round(
    vv?.height ?? window.innerHeight ?? document.documentElement.clientHeight
  );
  const offsetTop = Math.round(vv?.offsetTop ?? 0);
  const offsetLeft = Math.round(vv?.offsetLeft ?? 0);

  return {
    width,
    height,
    centerX: 0,
    centerY: 0,
    offsetTop,
    offsetLeft,
  };
}

function syncFortuneViewport() {
  if (!fortuneHost) return getFortuneStageMetrics();

  const metrics = getFortuneStageMetrics();
  fortuneHost.style.position = "fixed";
  fortuneHost.style.top = `${metrics.offsetTop}px`;
  fortuneHost.style.left = `${metrics.offsetLeft}px`;
  fortuneHost.style.width = `${metrics.width}px`;
  fortuneHost.style.height = `${metrics.height}px`;
  fortuneHost.style.zIndex = "6";
  fortuneHost.style.pointerEvents = "none";

  if (fortuneRenderer) {
    fortuneRenderer.setSize(metrics.width, metrics.height, false);
  }
  if (fortuneCamera) {
    fortuneCamera.left = -metrics.width / 2;
    fortuneCamera.right = metrics.width / 2;
    fortuneCamera.top = metrics.height / 2;
    fortuneCamera.bottom = -metrics.height / 2;
    fortuneCamera.updateProjectionMatrix();
  }

  return metrics;
}


async function animateFortuneFall(text) {
  const currentId = readingAnimationId;

  if (!fortuneScene) initFortuneScene();
  if (!fortuneScene) return;

  removeActiveFortune();
  fortuneAnimating = true;
  setFortuneQuote(text);

  let paper;
  let group;
  try {
    paper = createFortunePaperTexture(text);
    group = createFortunePaperMesh(paper.texture, paper.height);
  } catch (err) {
    console.error("Fortune paper render failed:", err);
    fortuneAnimating = false;
    return;
  }

  const { width, height } = getFortuneStageMetrics();
  const halfH = paper.height / 2;
  const startY = height / 2 + halfH + 96;
  const endY = -height / 2 - halfH - 96;
  const centerX = (Math.random() - 0.5) * width * 0.2;

  group.position.set(centerX, startY, 0);
  group.userData.opacity = 1;
  setFortuneShadowOpacity(group, 0.1);
  fortuneScene.add(group);
  fortuneActive = { group, text };

  const pivot = getPaperPivot(group);
  pivot.rotation.set(0, 0, 0);

  const sway1Amp = 28 + Math.random() * 22;
  const sway1Freq = 0.55 + Math.random() * 0.2;
  const sway1Phase = Math.random() * Math.PI * 2;
  const sway2Amp = 10 + Math.random() * 8;
  const sway2Freq = 1.8 + Math.random() * 0.6;
  const sway2Phase = Math.random() * Math.PI * 2;

  const spinDir = Math.random() > 0.5 ? 1 : -1;
  const readableAt = 0.46;
  const tiltX = 0.34 + Math.random() * 0.14;
  const tiltY = 0.07;
  const tiltZ = 0.045;
  const spinZStart = (Math.random() - 0.5) * 0.55;
  const spinZRate = spinDir * (0.1 + Math.random() * 0.16);
  const flutterAmp = 0.035;
  const flutterFreq = 2.4 + Math.random() * 0.6;
  const flutterPhase = Math.random() * Math.PI * 2;
  const rockFreq = 0.7 + Math.random() * 0.3;
  const rockPhase = Math.random() * Math.PI * 2;

  const duration = FORTUNE_PAPER.fallDuration;

  await new Promise((resolve) => {
    const start = performance.now();

    const step = (now) => {
      if (currentId !== readingAnimationId) {
        resolve();
        return;
      }

      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const s = elapsed / 1000;

      group.position.y = startY + (endY - startY) * t;

      const swayMain = Math.sin(s * sway1Freq + sway1Phase) * sway1Amp;
      const swayFlutter = Math.sin(s * sway2Freq + sway2Phase) * sway2Amp;
      group.position.x = centerX + swayMain + swayFlutter;
      group.position.z = Math.sin(s * 1.1) * 4;

      const flatWindow = Math.exp(-Math.pow((t - readableAt) / 0.15, 2) * 2.8);
      const tumble =
        spinDir * tiltX * Math.sin((t - readableAt) * Math.PI * 1.1);
      const flutter =
        Math.sin(s * flutterFreq + flutterPhase) *
        flutterAmp *
        (1 - flatWindow * 0.92);

      pivot.rotation.x = tumble + flutter;
      pivot.rotation.y =
        Math.sin(s * rockFreq + rockPhase) * tiltY * (1 - flatWindow * 0.65);
      pivot.rotation.z =
        spinZStart +
        s * spinZRate * (1 - flatWindow * 0.4) +
        (Math.sin(s * sway1Freq + sway1Phase) * 0.65 +
          Math.sin(s * sway2Freq + sway2Phase) * 0.35) *
          tiltZ *
          (1 - flatWindow * 0.5);
      syncFortuneShadow(group);

      if (t < 1) requestAnimationFrame(step);
      else resolve();
    };

    requestAnimationFrame(step);
  });

  if (currentId !== readingAnimationId) {
    if (group.parent) fortuneScene.remove(group);
    disposeFortuneGroup(group);
    fortuneAnimating = false;
    return;
  }

  fortuneScene.remove(group);
  disposeFortuneGroup(group);
  fortuneActive = null;
  fortuneAnimating = false;
}


function createPaperNoisePattern(ctx) {
  const tile = document.createElement("canvas");
  tile.width = 128;
  tile.height = 128;
  const tileCtx = tile.getContext("2d");
  const imageData = tileCtx.createImageData(128, 128);
  for (let i = 0; i < imageData.data.length; i += 4) {
    const grain = 210 + Math.random() * 45;
    imageData.data[i] = grain;
    imageData.data[i + 1] = grain - 4;
    imageData.data[i + 2] = grain - 10;
    imageData.data[i + 3] = 28;
  }
  tileCtx.putImageData(imageData, 0, 0);
  return ctx.createPattern(tile, "repeat");
}

function drawPaperBackground(ctx, width, height) {
  ctx.save();

  const base = ctx.createLinearGradient(0, 0, width, height);
  base.addColorStop(0, "#fdf9f1");
  base.addColorStop(0.45, "#f7f0e3");
  base.addColorStop(1, "#efe4d2");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, width, height);

  const warmWash = ctx.createRadialGradient(
    width * 0.3,
    height * 0.2,
    0,
    width * 0.3,
    height * 0.2,
    width * 0.8
  );
  warmWash.addColorStop(0, "rgba(255, 252, 245, 0.55)");
  warmWash.addColorStop(1, "rgba(255, 252, 245, 0)");
  ctx.fillStyle = warmWash;
  ctx.fillRect(0, 0, width, height);

  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = 0.55;
  ctx.fillStyle = createPaperNoisePattern(ctx);
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = "source-over";

  const edgeShade = ctx.createLinearGradient(0, 0, width, 0);
  edgeShade.addColorStop(0, "rgba(0, 0, 0, 0.07)");
  edgeShade.addColorStop(0.08, "rgba(0, 0, 0, 0)");
  edgeShade.addColorStop(0.92, "rgba(0, 0, 0, 0)");
  edgeShade.addColorStop(1, "rgba(0, 0, 0, 0.07)");
  ctx.fillStyle = edgeShade;
  ctx.fillRect(0, 0, width, height);

  const topHighlight = ctx.createLinearGradient(0, 0, 0, height * 0.35);
  topHighlight.addColorStop(0, "rgba(255, 255, 255, 0.35)");
  topHighlight.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = topHighlight;
  ctx.fillRect(0, 0, width, height * 0.35);

  ctx.strokeStyle = "rgba(0, 0, 0, 0.08)";
  ctx.lineWidth = 1;
  ctx.strokeRect(0.5, 0.5, width - 1, height - 1);

  ctx.restore();
}

function createPaperShadowTexture(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * 2);
  canvas.height = Math.round(height * 2);
  const ctx = canvas.getContext("2d");
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, canvas.width * 0.48);
  grad.addColorStop(0, "rgba(0, 0, 0, 0.38)");
  grad.addColorStop(0.55, "rgba(0, 0, 0, 0.14)");
  grad.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  if ("SRGBColorSpace" in THREE) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }
  texture.needsUpdate = true;
  return texture;
}

function setFortuneShadowOpacity(group, opacity) {
  const shadow = group.userData.shadow;
  if (!shadow?.material) return;
  shadow.material.opacity = opacity;
  group.userData.shadowOpacity = opacity;
}

function wrapFortuneLines(ctx, text, maxWidth, maxLines) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [""];

  const lines = [];
  let current = "";

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
      if (lines.length >= maxLines) break;
    } else {
      current = test;
    }
  }

  if (lines.length < maxLines && current) {
    lines.push(current);
  } else if (lines.length >= maxLines && current) {
    let last = lines[maxLines - 1];
    while (ctx.measureText(`${last}…`).width > maxWidth && last.length > 0) {
      last = last.slice(0, -1);
    }
    lines[maxLines - 1] = `${last}…`;
  }

  return lines.slice(0, maxLines);
}

function createFortunePaperTexture(text, options = {}) {
  const { blank = false } = options;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const maxTextWidth = FORTUNE_PAPER.width - FORTUNE_PAPER.padX * 2;

  const measureCanvas = document.createElement("canvas");
  const measureCtx = measureCanvas.getContext("2d");
  measureCtx.font = `italic 400 ${FORTUNE_PAPER.fontSize}px "Libre Baskerville", Georgia, serif`;

  const lines = blank
    ? [""]
    : wrapFortuneLines(
        measureCtx,
        text,
        maxTextWidth,
        FORTUNE_PAPER.maxLines
      );

  const height =
    FORTUNE_PAPER.padY * 2 + lines.length * FORTUNE_PAPER.lineHeight;

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(FORTUNE_PAPER.width * dpr);
  canvas.height = Math.round(height * dpr);

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  drawPaperBackground(ctx, FORTUNE_PAPER.width, height);

  if (!blank) {
    ctx.fillStyle = "#c62828";
    ctx.font = `italic 400 ${FORTUNE_PAPER.fontSize}px "Libre Baskerville", Georgia, serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const startY =
      height / 2 - ((lines.length - 1) * FORTUNE_PAPER.lineHeight) / 2;

    lines.forEach((line, i) => {
      ctx.fillText(
        line,
        FORTUNE_PAPER.width / 2,
        startY + i * FORTUNE_PAPER.lineHeight
      );
    });
  }

  const bottomShade = ctx.createLinearGradient(0, height - 8, 0, height);
  bottomShade.addColorStop(0, "rgba(0, 0, 0, 0)");
  bottomShade.addColorStop(1, "rgba(0, 0, 0, 0.06)");
  ctx.fillStyle = bottomShade;
  ctx.fillRect(0, height - 8, FORTUNE_PAPER.width, 8);

  const texture = new THREE.CanvasTexture(canvas);
  if ("SRGBColorSpace" in THREE) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }
  texture.needsUpdate = true;

  return { texture, height, lines };
}

function createFortunePaperMesh(texture, height) {
  const group = new THREE.Group();
  group.userData.paperHeight = height;

  const shadowTexture = createPaperShadowTexture(
    FORTUNE_PAPER.width * 0.92,
    height * 0.28
  );
  const shadowGeo = new THREE.PlaneGeometry(
    FORTUNE_PAPER.width * 0.92,
    height * 0.28
  );
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const shadow = new THREE.Mesh(shadowGeo, shadowMat);
  shadow.position.y = -height / 2 - 10;
  shadow.position.z = -1;
  group.add(shadow);
  group.userData.shadow = shadow;
  group.userData.shadowOpacity = 0;

  const paperPivot = new THREE.Group();
  const geometry = new THREE.PlaneGeometry(FORTUNE_PAPER.width, height);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = 0.5;
  mesh.scale.x = 1;
  paperPivot.add(mesh);
  group.add(paperPivot);
  group.userData.paperPivot = paperPivot;
  group.userData.paper = mesh;

  return group;
}

function getFortunePaperMesh(group) {
  return group?.userData?.paper || group?.children?.[1] || null;
}

function disposeFortuneGroup(group) {
  if (!group) return;
  group.children.forEach((child) => {
    child.geometry?.dispose();
    child.material?.map?.dispose();
    child.material?.dispose();
  });
}

function resizeFortuneScene() {
  if (!fortuneRenderer || !fortuneCamera || !fortuneHost) return;
  syncFortuneViewport();
}

function renderFortuneScene() {
  if (fortuneRenderer && fortuneScene && fortuneCamera) {
    fortuneRenderer.render(fortuneScene, fortuneCamera);
  }
}

function startFortuneLoop() {
  if (fortuneRaf) return;
  const tick = () => {
    fortuneRaf = requestAnimationFrame(tick);
    renderFortuneScene();
  };
  tick();
}

function initFortuneScene() {
  if (fortuneRenderer || typeof THREE === "undefined") return;

  fortuneHost = document.getElementById("fortuneCanvasHost");
  if (!fortuneHost) return;

  document.body.appendChild(fortuneHost);

  const { width, height } = syncFortuneViewport();

  fortuneScene = new THREE.Scene();
  fortuneCamera = new THREE.OrthographicCamera(
    -width / 2,
    width / 2,
    height / 2,
    -height / 2,
    0.1,
    1000
  );
  fortuneCamera.position.z = 10;

  fortuneRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  fortuneRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  fortuneRenderer.setSize(width, height, false);
  fortuneHost.appendChild(fortuneRenderer.domElement);

  window.addEventListener("resize", resizeFortuneScene);
  window.addEventListener("load", resizeFortuneScene);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", resizeFortuneScene);
    window.visualViewport.addEventListener("scroll", resizeFortuneScene);
  }
  requestAnimationFrame(() => requestAnimationFrame(resizeFortuneScene));
  startFortuneLoop();
}

// --- Reading display logic ---

async function updateJournalCard(dateISO, top3Songs) {
  if (!fortuneScene) initFortuneScene();
  if (!fortuneScene) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const todayISO = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;

  readingAnimationId += 1;
  removeActiveFortune();
  setFortuneQuote("");

  try {
    const minDelay = Math.random() * 2000 + 3000;
    const previousFortunes = getPreviousFortuneTexts();
    const [fortuneMessage] = await Promise.all([
      generateJournalEntryForDay(todayISO, top3Songs, previousFortunes),
      new Promise((resolve) => setTimeout(resolve, minDelay)),
    ]);

    fortuneHistory.push(fortuneMessage);

    if (typeof window.playFortuneSwoosh === "function") {
      window.playFortuneSwoosh();
    }

    await animateFortuneFall(fortuneMessage);
  } catch (error) {
    console.error("Failed to update reading:", error);

    const errorMessage = error.message || "Unknown error occurred";
    const isApiKeyError = errorMessage.toLowerCase().includes("api key");

    if (isApiKeyError) {
      await animateFortuneFall(
        errorMessage +
          " For GitHub Pages: Ensure OPENAI_API_KEY secret is configured."
      );
    } else {
      await animateFortuneFall(errorMessage);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  initFortuneScene();

  window.clearJournalCache = function () {
    const keys = Object.keys(localStorage);
    const journalKeys = keys.filter((key) => key.startsWith("journal_entry_"));
    journalKeys.forEach((key) => localStorage.removeItem(key));
    console.log(`Cleared ${journalKeys.length} journal cache entries`);
  };
});

// --- Refresh Functionality ---
(function initRefresh() {
  const refreshBtn = document.getElementById("refreshButton");
  if (!refreshBtn) return;

  refreshBtn.addEventListener("click", async () => {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) return;

    // Disable button and show loading state
    refreshBtn.disabled = true;
    refreshBtn.classList.add("refreshing");

    try {
      await updateLeftStackFromSpotify(token, { generateFortune: true });
    } catch (error) {
      console.error("Failed to refresh songs:", error);

      if (error.status === 401) {
        const refreshToken = localStorage.getItem("spotify_refresh_token");
        if (refreshToken) {
          try {
            const refreshed = await refreshAccessToken(SPOTIFY_CLIENT_ID, refreshToken);
            const newAccess = refreshed.access_token;
            const newRefresh = refreshed.refresh_token || refreshToken;
            if (newAccess) {
              localStorage.setItem("spotify_access_token", newAccess);
              if (newRefresh) localStorage.setItem("spotify_refresh_token", newRefresh);
              await updateLeftStackFromSpotify(newAccess, { generateFortune: true });
            } else {
              throw new Error("No access token in refresh response");
            }
          } catch (refreshError) {
            console.error("Failed to refresh access token:", refreshError);
            localStorage.removeItem("spotify_access_token");
            localStorage.removeItem("spotify_refresh_token");
            setAuthUIConnected(false);
          }
        } else {
          localStorage.removeItem("spotify_access_token");
          localStorage.removeItem("spotify_refresh_token");
          setAuthUIConnected(false);
        }
      }
    } finally {
      // Re-enable button and remove loading state
      refreshBtn.disabled = false;
      refreshBtn.classList.remove("refreshing");
    }
  });
})();
