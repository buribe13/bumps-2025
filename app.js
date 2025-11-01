// Mock data for design-only phase
const MOCK_MONTHS = [
  {
    month: "October",
    year: 2025,
    days: [
      {
        dateISO: "2025-10-29",
        weekday: "Wed",
        songs: [
          {
            title: "POWERFUL MAN",
            artist: "Alex G",
            year: 2017,
            lyric: "DAVEY broke the law again",
          },
          {
            title: "ANYTHING",
            artist: "The Velvet Rope",
            year: 1997,
            lyric: "(Hold me) so are you ready",
          },
          {
            title: "SEND IT ON",
            artist: "D'Angelo",
            year: 2000,
            lyric: "You can't disguise your emotions, baby",
          },
        ],
      },
      {
        dateISO: "2025-10-30",
        weekday: "Thu",
        songs: [
          {
            title: "POWERFUL MAN",
            artist: "Alex G",
            year: 2017,
            lyric: "Rocket",
          },
          {
            title: "ANYTHING",
            artist: "The Velvet Rope",
            year: 1997,
            lyric: "Kiss me to journey",
          },
          {
            title: "SEND IT ON",
            artist: "D'Angelo",
            year: 2000,
            lyric: "A brother is a brother",
          },
        ],
      },
    ],
  },
  {
    month: "November",
    year: 2025,
    days: [
      {
        dateISO: "2025-11-01",
        weekday: "Sat",
        songs: [
          {
            title: "Placeholder",
            artist: "TBD",
            year: 0,
            lyric: "No data yet",
          },
          {
            title: "Placeholder",
            artist: "TBD",
            year: 0,
            lyric: "No data yet",
          },
          {
            title: "Placeholder",
            artist: "TBD",
            year: 0,
            lyric: "No data yet",
          },
        ],
      },
    ],
  },
  {
    month: "December",
    year: 2025,
    days: [
      {
        dateISO: "2025-12-01",
        weekday: "Mon",
        songs: [
          {
            title: "Placeholder",
            artist: "TBD",
            year: 0,
            lyric: "No data yet",
          },
          {
            title: "Placeholder",
            artist: "TBD",
            year: 0,
            lyric: "No data yet",
          },
          {
            title: "Placeholder",
            artist: "TBD",
            year: 0,
            lyric: "No data yet",
          },
        ],
      },
    ],
  },
  {
    month: "September",
    year: 2025,
    days: [
      {
        dateISO: "2025-09-28",
        weekday: "Sun",
        songs: [
          {
            title: "Song A",
            artist: "Artist A",
            year: 2001,
            lyric: "Sample lyric A",
          },
          {
            title: "Song B",
            artist: "Artist B",
            year: 1999,
            lyric: "Sample lyric B",
          },
          {
            title: "Song C",
            artist: "Artist C",
            year: 2010,
            lyric: "Sample lyric C",
          },
        ],
      },
    ],
  },
];

// --- Date navigation state ---
const __today = new Date();
let currentYear = __today.getFullYear();
let currentMonthIndex = __today.getMonth();
let currentDayNumber = null; // 1..31 or null

function getMonthKey(year, monthIndex) {
  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

function monthIndexToName(idx) {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][idx];
}

function toKeyedMockMap() {
  const map = new Map();
  for (const m of MOCK_MONTHS) {
    const monthIndex = new Date(`${m.month} 1, ${m.year}`).getMonth();
    map.set(getMonthKey(m.year, monthIndex), { ...m, monthIndex });
  }
  return map;
}

function createPlaceholderMonth(year, monthIndex) {
  const dateISO = `${year}-${String(monthIndex + 1).padStart(2, "0")}-01`;
  return {
    month: monthIndexToName(monthIndex),
    year,
    days: [],
  };
}

function createPlaceholderDay(year, monthIndex, dayNumber) {
  const dateISO = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(
    dayNumber
  ).padStart(2, "0")}`;
  return {
    dateISO,
    weekday: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      new Date(dateISO).getDay()
    ],
    songs: [
      { title: "Placeholder", artist: "TBD", year: 0, lyric: "No data yet" },
      { title: "Placeholder", artist: "TBD", year: 0, lyric: "No data yet" },
      { title: "Placeholder", artist: "TBD", year: 0, lyric: "No data yet" },
    ],
  };
}

function ensureSinglePlaceholderIfEmpty(year, monthIndex, days) {
  if (!Array.isArray(days) || days.length === 0) {
    return [createPlaceholderDay(year, monthIndex, 1)];
  }
  return days;
}

function getOrderedMonths() {
  // Render the month based on current navigation state
  const keyed = toKeyedMockMap();
  const d = new Date(currentYear, currentMonthIndex, 1);
  const key = getMonthKey(d.getFullYear(), d.getMonth());
  const existing = keyed.get(key);
  if (existing) {
    const ensuredDays = ensureSinglePlaceholderIfEmpty(
      d.getFullYear(),
      d.getMonth(),
      existing.days
    );
    // Constrain to a single day: selected via breadcrumb, otherwise the most recent
    let daysForRender = ensuredDays;
    if (Array.isArray(ensuredDays) && ensuredDays.length > 0) {
      let selected = null;
      if (currentDayNumber != null) {
        const yyyy = String(currentYear);
        const mm = String(currentMonthIndex + 1).padStart(2, "0");
        const dd = String(currentDayNumber).padStart(2, "0");
        const targetISO = `${yyyy}-${mm}-${dd}`;
        selected = ensuredDays.find((dy) => dy.dateISO === targetISO) || null;
      }
      if (!selected) {
        selected = ensuredDays.reduce((a, b) =>
          a.dateISO > b.dateISO ? a : b
        );
      }
      daysForRender = selected ? [selected] : ensuredDays.slice(0, 1);
    }
    return [
      {
        month: monthIndexToName(d.getMonth()),
        year: d.getFullYear(),
        days: daysForRender,
      },
    ];
  }
  const m = createPlaceholderMonth(d.getFullYear(), d.getMonth());
  m.days = ensureSinglePlaceholderIfEmpty(
    d.getFullYear(),
    d.getMonth(),
    m.days
  );
  return [m];
}

function formatDateLabel(dateISO) {
  const d = new Date(dateISO);
  return d.getDate().toString().padStart(2, "0");
}

function formatDayLabel(dateISO) {
  const d = new Date(dateISO);
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d
    .getDate()
    .toString()
    .padStart(2, "0")}`;
}

function render() {
  const container = document.getElementById("months");
  container.innerHTML = "";

  const monthsToRender = getOrderedMonths();
  for (const block of monthsToRender) {
    const monthEl = document.createElement("section");
    monthEl.className = "month";
    monthEl.innerHTML = `
      <div class="days"></div>
    `;

    const daysEl = monthEl.querySelector(".days");

    // Create wrapper for left column (brand text + breadcrumb)
    const leftColumn = document.createElement("div");
    leftColumn.className = "left-column";

    // Add brand text above breadcrumb
    const brandText = document.createElement("div");
    brandText.className = "brand-text";
    brandText.textContent = "a public diary scored by my 3 most recent tracks";
    leftColumn.appendChild(brandText);

    // Insert breadcrumb: Year / Month / Day
    const crumbs = document.createElement("div");
    crumbs.className = "month-crumbs";
    let dayLabel = "Day";
    if (currentDayNumber) {
      // Show just the day number in breadcrumb
      dayLabel = String(currentDayNumber).padStart(2, "0");
    } else if (block.days.length > 0) {
      // Show the first day's number if no day is selected
      const firstDay = block.days[0];
      const dayNum = new Date(firstDay.dateISO).getDate();
      dayLabel = String(dayNum).padStart(2, "0");
    }
    crumbs.innerHTML = `
      <span class="crumb month-year" id="crumbYear" role="button" tabindex="0">${block.year}</span>
      <span class="crumb-sep">/</span>
      <span class="crumb month-title" id="crumbMonth" role="button" tabindex="0">${block.month}</span>
      <span class="crumb-sep">/</span>
      <span class="crumb" id="crumbDay" role="button" tabindex="0">${dayLabel}</span>
    `;
    leftColumn.appendChild(crumbs);
    daysEl.appendChild(leftColumn);

    // Create a right-side container for day cards
    const dayList = document.createElement("div");
    dayList.className = "day-list";
    daysEl.appendChild(dayList);
    for (const day of block.days) {
      const id = `day-${day.dateISO}`;
      const dayWrap = document.createElement("div");
      dayWrap.className = "day";
      dayWrap.id = id;

      const labelEl = document.createElement("div");
      labelEl.className = "day-label";
      labelEl.id = "dayLabel";
      labelEl.setAttribute("role", "button");
      labelEl.setAttribute("tabindex", "0");
      // Show selected day if available, otherwise show current day
      if (currentDayNumber) {
        const yyyy = String(currentYear);
        const mm = String(currentMonthIndex + 1).padStart(2, "0");
        const dd = String(currentDayNumber).padStart(2, "0");
        const targetISO = `${yyyy}-${mm}-${dd}`;
        labelEl.textContent = formatDayLabel(targetISO);
      } else {
        labelEl.textContent = formatDayLabel(day.dateISO);
      }
      dayWrap.appendChild(labelEl);

      const dayEl = document.createElement("article");
      dayEl.className = "day-card";
      dayEl.innerHTML = `
        <div class="songs"></div>
      `;

      const songsEl = dayEl.querySelector(".songs");
      day.songs.slice(0, 3).forEach((song) => {
        const s = document.createElement("div");
        s.className = "song";
        s.innerHTML = `
          <div class="dot"></div>
          <div>
            <div class="title">${song.title}</div>
            <div class="artist">${song.artist}</div>
          </div>
          <div class="year">${song.year}</div>
        `;
        songsEl.appendChild(s);
      });

      dayWrap.appendChild(dayEl);
      dayList.appendChild(dayWrap);
    }

    container.appendChild(monthEl);
  }

  wireBreadcrumbHandlers();

  if (currentDayNumber) {
    const y = String(currentYear);
    const m = String(currentMonthIndex + 1).padStart(2, "0");
    const d = String(currentDayNumber).padStart(2, "0");
    const el = document.getElementById(`day-${y}-${m}-${d}`);
    el?.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }
}

// --- Picker overlay logic ---
function getUniqueYears() {
  const years = new Set();
  for (const m of MOCK_MONTHS) years.add(m.year);
  years.add(currentYear);
  return Array.from(years).sort((a, b) => a - b);
}

function openPicker(type) {
  const overlay = document.getElementById("pickerOverlay");
  const optionsEl = document.getElementById("pickerOptions");
  const titleEl = document.getElementById("pickerTitle");
  const closeBtn = document.getElementById("pickerClose");

  if (!overlay || !optionsEl || !titleEl || !closeBtn) return;

  optionsEl.innerHTML = "";
  let options = [];
  if (type === "year") {
    titleEl.textContent = "Select Year";
    options = getUniqueYears().map((y) => ({ label: String(y), value: y }));
  } else if (type === "month") {
    titleEl.textContent = "Select Month";
    options = Array.from({ length: 12 }, (_, i) => ({
      label: monthIndexToName(i),
      value: i,
    }));
  } else if (type === "day") {
    titleEl.textContent = "Select Day";
    const daysInMonth = new Date(
      currentYear,
      currentMonthIndex + 1,
      0
    ).getDate();
    options = Array.from({ length: daysInMonth }, (_, i) => {
      const dayNumber = i + 1;
      const yyyy = String(currentYear);
      const mm = String(currentMonthIndex + 1).padStart(2, "0");
      const dd = String(dayNumber).padStart(2, "0");
      const dateISO = `${yyyy}-${mm}-${dd}`;
      return {
        label: formatDayLabel(dateISO),
        value: dayNumber,
      };
    });
  }

  for (const opt of options) {
    const btn = document.createElement("button");
    btn.className = "picker-option";
    btn.type = "button";
    btn.setAttribute("role", "option");
    btn.textContent = opt.label;
    btn.addEventListener("click", () => {
      if (type === "year") {
        currentYear = opt.value;
        currentDayNumber = null;
      } else if (type === "month") {
        currentMonthIndex = opt.value;
        currentDayNumber = null;
      } else if (type === "day") {
        currentDayNumber = opt.value;
      }
      closeOverlay();
      render();
    });
    optionsEl.appendChild(btn);
  }

  function onBackdrop(e) {
    if (e.target === overlay) {
      closeOverlay();
    }
  }
  function onKey(e) {
    if (e.key === "Escape") {
      closeOverlay();
    }
  }
  function closeOverlay() {
    overlay.hidden = true;
    overlay.removeEventListener("click", onBackdrop);
    document.removeEventListener("keydown", onKey);
    closeBtn.removeEventListener("click", closeOverlay);
    document.body.classList.remove("no-scroll");
  }

  overlay.hidden = false;
  overlay.addEventListener("click", onBackdrop);
  document.addEventListener("keydown", onKey);
  closeBtn.addEventListener("click", closeOverlay);
  document.body.classList.add("no-scroll");
}

function wireBreadcrumbHandlers() {
  const yearEl = document.getElementById("crumbYear");
  const monthEl = document.getElementById("crumbMonth");
  const dayEl = document.getElementById("crumbDay");
  const dayLabelEl = document.getElementById("dayLabel");

  yearEl?.addEventListener("click", () => openPicker("year"));
  monthEl?.addEventListener("click", () => openPicker("month"));
  dayEl?.addEventListener("click", () => openPicker("day"));
  dayLabelEl?.addEventListener("click", () => openPicker("day"));

  const onKeyOpen = (type) => (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker(type);
    }
  };
  yearEl?.addEventListener("keydown", onKeyOpen("year"));
  monthEl?.addEventListener("keydown", onKeyOpen("month"));
  dayEl?.addEventListener("keydown", onKeyOpen("day"));
  dayLabelEl?.addEventListener("keydown", onKeyOpen("day"));
}

// Placeholder for future Spotify integration
async function fetchTopSongsForDay(/* date */) {
  // Intentionally left as a stub for later integration.
  return [];
}

// --- Spotify Web API (PKCE) integration ---
const SPOTIFY_CLIENT_ID = "faf051d1e310436988ecdc54f79b7ac2";

// --- OpenAI API Key (loaded from config.js - gitignored) ---
// The API key is loaded from config.js to keep it out of version control
// config.js sets window.OPENAI_API_KEY which we reference here
const OPENAI_API_KEY =
  typeof window !== "undefined" && window.OPENAI_API_KEY
    ? window.OPENAI_API_KEY
    : null;
// Normalize redirect URI based on environment
// Localhost: use /index.html, Production: use directory path with trailing slash
const __pathNormalized = (function () {
  try {
    var p = window.location.pathname || "/";
    var origin = window.location.origin;

    // Check if we're on localhost (development)
    if (origin.includes("127.0.0.1") || origin.includes("localhost")) {
      // For localhost, use /index.html
      return "/index.html";
    } else {
      // For production (GitHub Pages), remove index.html and ensure trailing slash
      p = p.replace(/index\.html?$/i, "");
      if (!p.endsWith("/")) p += "/";
      return p;
    }
  } catch (_) {
    return "/";
  }
})();
const SPOTIFY_REDIRECT_URI = window.location.origin + __pathNormalized;

// Log redirect URI for debugging
console.log("Spotify Redirect URI:", SPOTIFY_REDIRECT_URI);

async function redirectToAuthCodeFlow(clientId) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("spotify_pkce_verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", SPOTIFY_REDIRECT_URI);

  console.log("Redirecting to Spotify with URI:", SPOTIFY_REDIRECT_URI);
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
      url.searchParams.set("limit", String(Math.min(limit, 50))); // Spotify max is 50 per request
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

  // Return the combined result in the same format as the API
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
  // Spotify returns newest-first; ensure sort just in case
  const items = [...recentlyPlayedJson.items].sort(
    (a, b) => new Date(b.played_at) - new Date(a.played_at)
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
      image:
        (track.album &&
          track.album.images &&
          track.album.images[0] &&
          track.album.images[0].url) ||
        "",
      previewUrl: track.preview_url || "",
      spotifyUrl: (track.external_urls && track.external_urls.spotify) || "",
      playedAt: item.played_at,
    });
    if (results.length >= count) break;
  }
  return results;
}

function groupTop3ByDay(recentlyPlayedJson) {
  if (!recentlyPlayedJson || !Array.isArray(recentlyPlayedJson.items)) {
    return new Map();
  }
  const byDay = new Map();
  for (const item of recentlyPlayedJson.items) {
    const playedAt = item.played_at;
    if (!playedAt) continue;
    const d = new Date(playedAt);
    if (isNaN(d.getTime())) continue; // Skip invalid dates
    const dateISO = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
    const track = item.track;
    if (!track) continue;
    const trackId = track.id;
    if (!trackId) continue; // Skip tracks without an ID
    if (!track.name) continue; // Skip tracks without a name

    if (!byDay.has(dateISO))
      byDay.set(dateISO, { counts: new Map(), meta: new Map() });
    const entry = byDay.get(dateISO);
    entry.counts.set(trackId, (entry.counts.get(trackId) || 0) + 1);
    if (!entry.meta.has(trackId)) {
      const artists =
        (track.artists || [])
          .map((a) => (a && a.name ? a.name : ""))
          .filter((name) => name.trim().length > 0)
          .join(", ") || "Unknown Artist";

      entry.meta.set(trackId, {
        id: track.id,
        name: track.name || "Unknown Track",
        artists: artists,
        image:
          (track.album &&
            track.album.images &&
            track.album.images[0] &&
            track.album.images[0].url) ||
          "",
        previewUrl: track.preview_url || "",
        spotifyUrl: (track.external_urls && track.external_urls.spotify) || "",
      });
    }
  }
  // Convert to top 3 per day
  const result = new Map();
  for (const [dateISO, data] of byDay.entries()) {
    const sorted = Array.from(data.counts.entries()).sort(
      (a, b) => b[1] - a[1]
    );
    console.log(`Processing ${dateISO}:`, sorted.length, "unique tracks");

    const top3 = [];
    for (const [trackId, count] of sorted) {
      if (top3.length >= 3) break;
      const track = data.meta.get(trackId);
      if (track && track.id && track.name) {
        top3.push(track);
      } else {
        console.warn(
          `Skipping invalid track metadata for trackId: ${trackId} on ${dateISO}`,
          track
        );
      }
    }

    console.log(`Top 3 for ${dateISO}:`, top3.length, "valid tracks");
    if (top3.length > 0) {
      result.set(dateISO, top3);
    }
  }
  return result;
}

function renderTop3IntoLeftStack(tracks) {
  const container = document.querySelector(".song-cards");
  if (!container) {
    console.warn("renderTop3IntoLeftStack: .song-cards container not found");
    return;
  }

  // Ensure tracks is an array
  if (!Array.isArray(tracks)) {
    console.warn(
      "renderTop3IntoLeftStack: tracks is not an array, converting:",
      tracks
    );
    tracks = tracks ? [tracks] : [];
  }

  const cards = Array.prototype.slice.call(
    container.querySelectorAll(".song-card")
  );

  console.log("renderTop3IntoLeftStack called with tracks:", tracks);
  console.log("Tracks array length:", tracks.length);
  console.log("Found", cards.length, "song cards");

  const badgeClasses = [
    "song-badge-gold",
    "song-badge-silver",
    "song-badge-bronze",
  ];
  const badgeNumbers = ["1", "2", "3"];

  // Ensure we have at least 3 cards (should be in HTML)
  if (cards.length < 3) {
    console.warn("Expected 3 song cards, found", cards.length);
  }

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const data = tracks && tracks[i] ? tracks[i] : null;
    const titleEl = card.querySelector(".song-title");
    const artistEl = card.querySelector(".song-artist");
    const artEl = card.querySelector(".song-art");
    const listenBtn = card.querySelector(".listen-btn");

    if (!data) {
      console.log(`Card ${i + 1}: No data, setting placeholders`);
      if (titleEl) titleEl.textContent = "—";
      if (artistEl) artistEl.textContent = "—";
      if (artEl) {
        artEl.style.backgroundImage = "";
        artEl.style.background = "#fff";
      }
      if (card) {
        card.dataset.previewUrl = "";
        card.dataset.spotifyUrl = "";
      }
      continue;
    }

    console.log(`Card ${i + 1}: Rendering`, data.name, "by", data.artists);

    if (titleEl) titleEl.textContent = data.name || "—";
    if (artistEl) {
      artistEl.textContent = data.artists ? `by ${data.artists}` : "—";
    }

    if (artEl) {
      artEl.style.background = data.image
        ? `center/cover no-repeat url('${data.image}')`
        : "#fff";
      artEl.style.borderRadius = "24px";
      // Ensure badge exists with correct class and number
      let badge = artEl.querySelector(".song-badge");
      if (!badge) {
        badge = document.createElement("span");
        badge.className = "song-badge";
        artEl.appendChild(badge);
      }
      badge.className = `song-badge ${badgeClasses[i] || badgeClasses[0]}`;
      badge.textContent = badgeNumbers[i] || "1";
    }

    if (card) {
      card.dataset.previewUrl = data.previewUrl || "";
      card.dataset.spotifyUrl = data.spotifyUrl || "";
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

function setNowPlaying(title, artist, previewUrl) {
  const pill = document.querySelector(".now-playing-pill");
  if (pill) {
    const textTrack = pill.querySelector(".text-track");
    const hasTrack = !!(title && artist);
    if (hasTrack) {
      const text = `Now Playing: ${title} — ${artist} 🔊 `;
      if (textTrack) {
        // Update both text elements for seamless scrolling (matching CodePen structure)
        textTrack.innerHTML = `<div class="text">${text}</div><div class="text text--clone">${text}</div>`;
      } else {
        // Fallback for older structure
        const textElement = pill.querySelector(".text");
        if (textElement) {
          textElement.textContent = text;
        } else {
          pill.textContent = text;
        }
      }
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

function populateUI(profile) {
  const profileSection = document.getElementById("profile");
  const authStatus = document.getElementById("authStatus");
  if (profileSection) profileSection.hidden = false;
  if (authStatus) authStatus.textContent = "Connected";

  const displayName = document.getElementById("displayName");
  const avatar = document.getElementById("avatar");
  const id = document.getElementById("id");
  const email = document.getElementById("email");
  const uri = document.getElementById("uri");
  const url = document.getElementById("url");
  const imgUrl = document.getElementById("imgUrl");

  if (displayName) displayName.innerText = profile.display_name || "";
  if (avatar) {
    avatar.innerHTML = "";
    if (profile.images && profile.images[0]) {
      const profileImage = new Image(200, 200);
      profileImage.src = profile.images[0].url;
      avatar.appendChild(profileImage);
    }
  }
  if (id) id.innerText = profile.id || "";
  if (email) email.innerText = profile.email || "";
  if (uri) {
    uri.innerText = profile.uri || "";
    if (profile.external_urls && profile.external_urls.spotify) {
      uri.setAttribute("href", profile.external_urls.spotify);
    }
  }
  if (url) {
    url.innerText = profile.href || "";
    if (profile.href) {
      url.setAttribute("href", profile.href);
    }
  }
  if (imgUrl) {
    imgUrl.innerText =
      profile.images && profile.images[0] && profile.images[0].url
        ? profile.images[0].url
        : "(no profile image)";
  }
}

function setAuthUIConnected(connected) {
  // Update all login buttons
  const loginButtons = [
    document.getElementById("loginButton"),
    document.getElementById("loginButtonAuthBar"),
  ].filter(Boolean);

  // Update all logout buttons
  const logoutButtons = [
    document.getElementById("logoutButton"),
    document.getElementById("logoutButtonAuthBar"),
  ].filter(Boolean);

  const authStatus = document.getElementById("authStatus");
  const authSeparator = document.querySelector(".auth-separator");

  if (connected) {
    loginButtons.forEach((btn) => (btn.hidden = true));
    logoutButtons.forEach((btn) => (btn.hidden = false));
    if (authSeparator) authSeparator.style.display = "";
    if (authStatus) {
      authStatus.textContent = "Connected";
      authStatus.style.display = "";
    }
  } else {
    loginButtons.forEach((btn) => (btn.hidden = false));
    logoutButtons.forEach((btn) => (btn.hidden = true));
    if (authSeparator) authSeparator.style.display = "none";
    if (authStatus) {
      authStatus.textContent = "Not connected";
      authStatus.style.display = "none";
    }
  }
}

async function initSpotify() {
  // Handle multiple login buttons (in auth-bar and FAB)
  const loginButtons = [
    document.getElementById("loginButton"),
    document.getElementById("loginButtonAuthBar"),
  ].filter(Boolean);

  // Handle multiple logout buttons (in auth-bar and FAB)
  const logoutButtons = [
    document.getElementById("logoutButton"),
    document.getElementById("logoutButtonAuthBar"),
  ].filter(Boolean);

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
    const profileEl = document.getElementById("profile");
    if (profileEl) profileEl.hidden = true;
  };

  // Attach event listeners to all login buttons
  loginButtons.forEach((btn) => {
    btn.addEventListener("click", handleLogin);
  });

  // Attach event listeners to all logout buttons
  logoutButtons.forEach((btn) => {
    btn.addEventListener("click", handleLogout);
  });

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
        await updateLeftStackFromSpotify(existingToken);
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
            await updateLeftStackFromSpotify(newAccess);
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
          await updateLeftStackFromSpotify(access);
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

async function updateLeftStackFromSpotify(token) {
  try {
    const recent = await fetchRecentlyPlayed(token, 50);
    console.log("Fetched recently played:", recent);
    console.log("Total items fetched:", recent.items?.length || 0);

    // If we have very few tracks, warn the user
    if (recent.items && recent.items.length < 3) {
      console.warn(
        `Only ${recent.items.length} track(s) found. Spotify's recently played API only returns tracks from the last 7 days.`
      );
    }

    // Get the 3 most recent unique tracks (newest first)
    const top3 = getMostRecentUniqueTracks(recent, 3);
    console.log("Most recent 3 tracks:", top3);
    console.log(
      "Tracks:",
      top3.map((t) => `${t.name} by ${t.artists}`)
    );

    // Always render (even if empty, will show "—" placeholders)
    console.log("Final top3 to render:", top3, "length:", top3.length);
    renderTop3IntoLeftStack(top3);

    // Update journal card with most recent tracks (only if we have songs)
    if (top3 && top3.length > 0) {
      // Use local date components to ensure accurate date
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1; // getMonth() is 0-indexed
      const day = today.getDate();
      const todayISO = `${year}-${String(month).padStart(2, "0")}-${String(
        day
      ).padStart(2, "0")}`;
      await updateJournalCard(todayISO, top3);

      // ensure first card is active to trigger play
      const container = document.querySelector(".song-cards");
      if (container) {
        const cards = Array.prototype.slice.call(
          container.querySelectorAll(".song-card")
        );
        if (cards[0]) {
          cards.forEach((c, i) => c.classList.toggle("dimmed", i !== 0));
          const titleEl = cards[0].querySelector(".song-title");
          const artistEl = cards[0].querySelector(".song-artist");
          const preview = cards[0].dataset.previewUrl || "";
          const titleTxt = titleEl
            ? titleEl.textContent.replace(/[""]/g, "")
            : "";
          const artistTxt = artistEl ? artistEl.textContent : "";
          // Only set now playing if we have actual data
          if (titleTxt !== "—" && artistTxt !== "—") {
            setNowPlaying(titleTxt, artistTxt, preview);
          }
        }
      }
    }
  } catch (e) {
    console.error("Failed to update left stack from Spotify", e);
    // On error, ensure placeholders are shown
    renderTop3IntoLeftStack([]);
  }
}

// Kick off UI render and Spotify init (guarded for new UI layout)
if (document.getElementById("months")) {
  render();
}
initSpotify();

// Periodic refresh of Spotify data every 30 seconds
let spotifyRefreshInterval = null;
function startSpotifyRefresh() {
  // Clear any existing interval
  if (spotifyRefreshInterval) {
    clearInterval(spotifyRefreshInterval);
  }

  // Refresh every 30 seconds
  spotifyRefreshInterval = setInterval(async () => {
    const token = localStorage.getItem("spotify_access_token");
    if (token) {
      try {
        console.log("🔄 Refreshing Spotify data...");
        await updateLeftStackFromSpotify(token);
      } catch (error) {
        console.error("Failed to refresh Spotify data:", error);
        // If token expired, stop refreshing (user will need to reconnect)
        if (error.status === 401) {
          clearInterval(spotifyRefreshInterval);
          spotifyRefreshInterval = null;
        }
      }
    }
  }, 30000); // 30 seconds
}

// Start refreshing after initial load
setTimeout(() => {
  const token = localStorage.getItem("spotify_access_token");
  if (token) {
    startSpotifyRefresh();
  }
}, 5000); // Start after 5 seconds to let initial load complete

// --- Song card microinteraction (left-stack) ---
document.addEventListener("DOMContentLoaded", function () {
  var container = document.querySelector(".song-cards");
  if (!container) return;

  var cards = Array.prototype.slice.call(
    container.querySelectorAll(".song-card")
  );
  if (cards.length === 0) return;

  function setActiveCard(nextActive) {
    cards.forEach(function (card) {
      if (card === nextActive) {
        card.classList.remove("dimmed");
      } else {
        card.classList.add("dimmed");
      }
    });
  }

  // Initialize to first card active
  setActiveCard(cards[0]);

  cards.forEach(function (card) {
    card.addEventListener("click", function () {
      if (!card.classList.contains("dimmed")) return;
      setActiveCard(card);
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

// --- OpenAI API Integration ---
async function generateJournalEntry(songLyrics) {
  // Use the shared API key - check both window.OPENAI_API_KEY (from config.js) and fallback
  const apiKey =
    typeof window !== "undefined" && window.OPENAI_API_KEY
      ? window.OPENAI_API_KEY
      : OPENAI_API_KEY;

  // Log key status for debugging (without exposing the key)
  const keyStatus = {
    windowKey: typeof window !== "undefined" ? !!window.OPENAI_API_KEY : false,
    constantKey: !!OPENAI_API_KEY,
    apiKeyExists: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    keyPrefix: apiKey ? apiKey.substring(0, 7) + "..." : "none",
  };
  console.log("🔑 OpenAI API Key check:", keyStatus);

  // On GitHub Pages, config.js might not be loaded if it's gitignored
  if (
    !apiKey &&
    typeof window !== "undefined" &&
    window.location.hostname.includes("github.io")
  ) {
    console.warn(
      "⚠️ Running on GitHub Pages - config.js might not be deployed (it's gitignored). You may need to manually upload config.js or include it in the repo."
    );
  }

  if (!apiKey || apiKey === "YOUR_OPENAI_API_KEY_HERE") {
    console.error(
      "❌ OpenAI API key not configured. Check if config.js is loaded and contains window.OPENAI_API_KEY"
    );
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

Write a single fortune cookie message that:
- Is mysterious, poetic, and thought-provoking like a real fortune cookie
- Draws subtle connections to the themes, lyrics, or vibes of these songs
- Is concise (2-3 sentences maximum, ideally just 1-2 sentences)
- Feels inspiring or reflective, not just descriptive
- Uses second person ("You", "Your") or timeless wisdom
- Has the mystical, slightly cryptic quality of fortune cookies
- References the music subtly—maybe a theme, emotion, or vibe from the songs—but doesn't explicitly name the songs or artists

Examples of good fortune cookie style:
- "The rhythm you seek is already within you. Listen."
- "Your next chapter begins when you stop replaying the last one."
- "The melody of change is quieter than you think, but louder than you expect."
- "What you're searching for in others, you'll find in your own reflection."

Format your response as a JSON object with a single "message" field:
{
  "message": "Your fortune cookie message here - mysterious, poetic, and inspired by the songs"
}

Return ONLY valid JSON, no markdown, no code blocks, no explanations.`;

    console.log("🔮 Calling OpenAI API...");
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
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
        temperature: 0.85,
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || "Unknown error";

      console.error("❌ OpenAI API error:", response.status, errorMessage);

      // Provide user-friendly error messages
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

    console.log("✅ OpenAI API call successful");

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

// Cache version - increment this to invalidate all cached entries
const JOURNAL_CACHE_VERSION = 4; // Updated for fortune cookie format

// --- Journal Entry Generation & Caching ---
async function generateJournalEntryForDay(dateISO, top3Songs) {
  // Always check if this is today - if not, don't use cache
  // Use local date components to ensure accurate date
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // getMonth() is 0-indexed
  const day = today.getDate();
  const todayISO = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;

  const isToday = dateISO === todayISO;

  // Only check cache if it's today
  if (isToday) {
    const cacheKey = `journal_entry_${dateISO}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Check cache version - if different, regenerate
        if (parsed.cacheVersion !== JOURNAL_CACHE_VERSION) {
          console.log("Cache version mismatch - regenerating with new prompt");
          // Remove old cache entry
          localStorage.removeItem(cacheKey);
        } else {
          // Verify it's for the same songs (by checking first song) and generated today
          const cacheDate = parsed.generatedAt
            ? new Date(parsed.generatedAt)
            : null;
          const cacheIsToday =
            cacheDate &&
            cacheDate.getFullYear() === today.getFullYear() &&
            cacheDate.getMonth() === today.getMonth() &&
            cacheDate.getDate() === today.getDate();

          if (
            parsed.message &&
            parsed.songs &&
            parsed.songs.length > 0 &&
            parsed.songs[0].title === top3Songs[0]?.name &&
            cacheIsToday
          ) {
            return parsed.message;
          }
        }
      } catch (e) {
        console.warn("Failed to parse cached journal entry", e);
      }
    }
  }

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

  // Generate fortune cookie message using OpenAI
  const fortuneMessage = await generateJournalEntry(songLyrics);

  if (!fortuneMessage || typeof fortuneMessage !== "string") {
    console.error("Journal generation failed: No fortune message returned");
    // Fallback if generation fails
    return "Unable to generate fortune message. Please check your OpenAI API key and try again.";
  }

  // Cache the result with version number
  const cacheKey = `journal_entry_${dateISO}`;
  localStorage.setItem(
    cacheKey,
    JSON.stringify({
      message: fortuneMessage,
      songs: top3Songs.map((s) => ({ title: s.name, artist: s.artists })),
      generatedAt: new Date().toISOString(),
      cacheVersion: JOURNAL_CACHE_VERSION,
    })
  );

  return fortuneMessage;
}

// Format date for journal display (MM.DD.YY)
function formatJournalDate(dateISO) {
  // Parse date string as local date (YYYY-MM-DD) to avoid timezone issues
  const parts = dateISO.split("-");
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const day = parseInt(parts[2], 10);
  const d = new Date(year, month - 1, day); // month is 0-indexed

  const monthStr = String(d.getMonth() + 1).padStart(2, "0");
  const dayStr = String(d.getDate()).padStart(2, "0");
  const yearStr = String(d.getFullYear()).slice(-2);
  return `${monthStr}.${dayStr}.${yearStr}`;
}

// --- Journal card logic ---
async function updateJournalCard(dateISO, top3Songs) {
  const card = document.querySelector(".journal-card");
  if (!card) return;

  // Always use today's date for display, regardless of data date
  // Use local date components to ensure accurate date
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // getMonth() is 0-indexed
  const day = today.getDate();
  const todayISO = `${year}-${String(month).padStart(2, "0")}-${String(
    day
  ).padStart(2, "0")}`;

  // Show loading state
  const textEl = card.querySelector(".journal-text");
  if (textEl) {
    textEl.textContent = "Generating fortune...";
  }

  try {
    // Always generate for today (use todayISO, not dateISO)
    const fortuneMessage = await generateJournalEntryForDay(
      todayISO,
      top3Songs
    );

    // Update date to today
    const dateEl = card.querySelector(".journal-date");
    if (dateEl) {
      dateEl.textContent = formatJournalDate(todayISO);
    }

    // Render fortune message
    if (textEl) {
      textEl.textContent = fortuneMessage;
    }

    // Hide dots and pager buttons since we only have one message
    const dotsEl = card.querySelector(".dots");
    const pagerEl = card.querySelector(".pager");
    if (dotsEl) dotsEl.style.display = "none";
    if (pagerEl) pagerEl.style.display = "none";
  } catch (error) {
    console.error("Failed to update journal card:", error);

    // Show error message to user
    const errorMessage = error.message || "Unknown error occurred";
    const isApiKeyError = errorMessage.toLowerCase().includes("api key");

    if (textEl) {
      if (isApiKeyError) {
        textEl.textContent = `${errorMessage}\n\nTo fix: Copy config.example.js to config.js and add your API key.`;
      } else {
        textEl.textContent = `${errorMessage}\n\nCheck the browser console for more details.`;
      }
    }

    // Hide dots and pager buttons on error too
    const dotsEl = card.querySelector(".dots");
    const pagerEl = card.querySelector(".pager");
    if (dotsEl) dotsEl.style.display = "none";
    if (pagerEl) pagerEl.style.display = "none";
  }
}

// --- Journal Card Parallax Effect ---
(function initJournalCardParallax() {
  const card = document.querySelector(".journal-card");
  if (!card) return;

  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  // Track mouse position
  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Calculate center of viewport
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Calculate distance from center (normalized to -1 to 1)
    const deltaX = (mouseX - centerX) / centerX;
    const deltaY = (mouseY - centerY) / centerY;

    // Set target position (very subtle movement - max 8px)
    targetX = deltaX * 8;
    targetY = deltaY * 8;
  });

  // Smooth interpolation for subtle movement
  function animateParallax() {
    // Ease towards target
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;

    // Apply transform
    card.style.transform = `translate(${currentX}px, ${currentY}px)`;

    requestAnimationFrame(animateParallax);
  }

  // Start animation loop
  animateParallax();
})();

document.addEventListener("DOMContentLoaded", function () {
  const card = document.querySelector(".journal-card");
  if (!card) return;

  // Check if OpenAI API key is configured
  if (!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_OPENAI_API_KEY_HERE") {
    console.warn(
      "%c⚠️ OpenAI API Key Not Configured",
      "color: #f59e0b; font-size: 16px; font-weight: bold;"
    );
    console.log(
      "%cTo enable fortune cookie generation, copy config.example.js to config.js and add your API key",
      "color: #333; font-size: 14px;"
    );
  } else {
    console.log(
      "%c✅ OpenAI API Key configured. Fortune cookies will be generated!",
      "color: #10a37f; font-size: 14px;"
    );
  }

  // Helper function to clear journal cache (useful for testing)
  window.clearJournalCache = function () {
    const keys = Object.keys(localStorage);
    const journalKeys = keys.filter((key) => key.startsWith("journal_entry_"));
    journalKeys.forEach((key) => localStorage.removeItem(key));
    console.log(
      `%c🗑️ Cleared ${journalKeys.length} journal cache entries`,
      "color: #f59e0b; font-size: 14px;"
    );
    console.log("Refresh the page to regenerate entries with new format.");
  };

  // Initialize with today's entry if we have Spotify data
  const accessToken = localStorage.getItem("spotify_access_token");
  if (accessToken) {
    initializeJournalCard(accessToken);
  }
});

// Initialize journal card with most recent songs
async function initializeJournalCard(token) {
  try {
    const recent = await fetchRecentlyPlayed(token, 50);
    // Get the 3 most recent unique tracks
    const top3 = getMostRecentUniqueTracks(recent, 3);

    // Use local date components to ensure accurate date
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1; // getMonth() is 0-indexed
    const day = today.getDate();
    const todayISO = `${year}-${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    if (top3 && top3.length > 0) {
      // Always pass todayISO to ensure journal shows today's date
      await updateJournalCard(todayISO, top3);
    }
  } catch (error) {
    console.error("Failed to initialize journal card:", error);
  }
}

// --- Gradient Customizer ---
(function initGradientCustomizer() {
  const frameRoot = document.querySelector(".frame-root");
  const overlay = document.querySelector(".gradient-customizer-overlay");
  const openBtn = document.getElementById("openCustomizer");
  const closeBtn = document.getElementById("closeCustomizer");

  if (!frameRoot || !overlay) return;

  // Open/close overlay
  function openOverlay() {
    overlay.removeAttribute("hidden");
    document.body.classList.add("no-scroll");
  }

  function closeOverlay() {
    overlay.setAttribute("hidden", "");
    document.body.classList.remove("no-scroll");
  }

  if (openBtn) {
    openBtn.addEventListener("click", openOverlay);
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", closeOverlay);
  }

  // Close when clicking backdrop
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeOverlay();
    }
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hasAttribute("hidden")) {
      closeOverlay();
    }
  });

  // Default gradient colors (current soft red theme)
  const defaultColors = {
    color1: "#fefefe",
    color2: "#fff5f5",
    color3: "#fff8f8",
  };

  // Gradient presets
  const presets = [
    {
      name: "Default",
      colors: { color1: "#fefefe", color2: "#fff5f5", color3: "#fff8f8" },
    },
    {
      name: "Green Tea",
      colors: { color1: "#f8fcf8", color2: "#e6f5e6", color3: "#d4edda" },
    },
    {
      name: "Sakura",
      colors: { color1: "#fffefe", color2: "#ffeef0", color3: "#ffe4e6" },
    },
    {
      name: "Ocean",
      colors: { color1: "#f0f8ff", color2: "#e6f2ff", color3: "#d9ecff" },
    },
    {
      name: "Sunset",
      colors: { color1: "#fffaf0", color2: "#fff5e6", color3: "#ffe6d9" },
    },
    {
      name: "Lavender",
      colors: { color1: "#faf9ff", color2: "#f5f2ff", color3: "#f0ebff" },
    },
  ];

  let currentPresetIndex = 0;

  // Helper: Convert hex to rgba
  function hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Generate gradient CSS
  function generateGradient(color1, color2, color3) {
    const c1_95 = hexToRgba(color1, 0.95);
    const c1_5 = hexToRgba(color1, 0.5);
    const c2_6 = hexToRgba(color2, 0.6);
    const c2_4 = hexToRgba(color2, 0.4);
    const c2_35 = hexToRgba(color2, 0.35);
    const c3_9 = hexToRgba(color3, 0.9);
    const c3_8 = hexToRgba(color3, 0.8);
    const c3_5 = hexToRgba(color3, 0.5);
    const c3_4 = hexToRgba(color3, 0.4);
    const c3_3 = hexToRgba(color3, 0.3);
    const c3_25 = hexToRgba(color3, 0.25);
    const c3_2 = hexToRgba(color3, 0.2);

    return `radial-gradient(
      ellipse 1400px 900px at 15% 10%,
      ${c1_95} 0%,
      ${c1_5} 40%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 1600px 1100px at 85% 90%,
      ${c2_6} 0%,
      ${c2_4} 35%,
      ${c3_2} 60%,
      transparent 80%
    ),
    radial-gradient(
      ellipse 1000px 1200px at 50% 50%,
      ${c2_35} 0%,
      ${c3_2} 45%,
      transparent 70%
    ),
    radial-gradient(
      ellipse 800px 600px at 25% 70%,
      ${c2_4} 0%,
      ${c3_25} 50%,
      transparent 75%
    ),
    radial-gradient(
      ellipse 1200px 800px at 75% 25%,
      ${c3_9} 0%,
      ${c3_4} 40%,
      transparent 70%
    ),
    linear-gradient(
      110deg,
      ${c3_8} 0%,
      ${c3_4} 30%,
      ${c3_3} 60%,
      ${c3_5} 100%
    ),
    ${color1}`;
  }

  // Apply gradient to background
  function applyGradient(color1, color2, color3) {
    const gradient = generateGradient(color1, color2, color3);
    frameRoot.style.background = gradient;

    // Save to localStorage
    localStorage.setItem(
      "customGradient",
      JSON.stringify({ color1, color2, color3 })
    );
  }

  // Get color inputs
  const color1Picker = document.getElementById("color1");
  const color1Text = document.getElementById("color1-text");
  const color2Picker = document.getElementById("color2");
  const color2Text = document.getElementById("color2-text");
  const color3Picker = document.getElementById("color3");
  const color3Text = document.getElementById("color3-text");
  const applyBtn = document.getElementById("applyGradient");
  const resetBtn = document.getElementById("resetGradient");
  const prevPresetBtn = document.getElementById("prevPreset");
  const nextPresetBtn = document.getElementById("nextPreset");
  const presetNameEl = document.getElementById("presetName");

  if (
    !color1Picker ||
    !color1Text ||
    !color2Picker ||
    !color2Text ||
    !color3Picker ||
    !color3Text
  ) {
    return;
  }

  // Sync color picker with text input
  function syncColorInputs(picker, textInput) {
    picker.addEventListener("input", (e) => {
      textInput.value = e.target.value.toUpperCase();
    });
    textInput.addEventListener("input", (e) => {
      const value = e.target.value;
      if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
        picker.value = value;
      }
    });
    textInput.addEventListener("blur", (e) => {
      const value = e.target.value;
      if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
        e.target.value = picker.value.toUpperCase();
      }
    });
  }

  syncColorInputs(color1Picker, color1Text);
  syncColorInputs(color2Picker, color2Text);
  syncColorInputs(color3Picker, color3Text);

  // Apply button
  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      const color1 = color1Picker.value;
      const color2 = color2Picker.value;
      const color3 = color3Picker.value;
      applyGradient(color1, color2, color3);
      closeOverlay();
    });
  }

  // Reset button
  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      color1Picker.value = defaultColors.color1;
      color1Text.value = defaultColors.color1.toUpperCase();
      color2Picker.value = defaultColors.color2;
      color2Text.value = defaultColors.color2.toUpperCase();
      color3Picker.value = defaultColors.color3;
      color3Text.value = defaultColors.color3.toUpperCase();
      applyGradient(
        defaultColors.color1,
        defaultColors.color2,
        defaultColors.color3
      );
      currentPresetIndex = 0;
      if (presetNameEl) presetNameEl.textContent = presets[0].name;
    });
  }

  // Load preset
  function loadPreset(index) {
    if (index < 0 || index >= presets.length) return;
    currentPresetIndex = index;
    const preset = presets[index];

    color1Picker.value = preset.colors.color1;
    color1Text.value = preset.colors.color1.toUpperCase();
    color2Picker.value = preset.colors.color2;
    color2Text.value = preset.colors.color2.toUpperCase();
    color3Picker.value = preset.colors.color3;
    color3Text.value = preset.colors.color3.toUpperCase();

    if (presetNameEl) presetNameEl.textContent = preset.name;

    applyGradient(
      preset.colors.color1,
      preset.colors.color2,
      preset.colors.color3
    );
  }

  // Preset navigation
  if (prevPresetBtn) {
    prevPresetBtn.addEventListener("click", () => {
      const newIndex =
        (currentPresetIndex - 1 + presets.length) % presets.length;
      loadPreset(newIndex);
    });
  }

  if (nextPresetBtn) {
    nextPresetBtn.addEventListener("click", () => {
      const newIndex = (currentPresetIndex + 1) % presets.length;
      loadPreset(newIndex);
    });
  }

  // Load saved gradient on page load
  const saved = localStorage.getItem("customGradient");
  if (saved) {
    try {
      const { color1, color2, color3 } = JSON.parse(saved);
      color1Picker.value = color1;
      color1Text.value = color1.toUpperCase();
      color2Picker.value = color2;
      color2Text.value = color2.toUpperCase();
      color3Picker.value = color3;
      color3Text.value = color3.toUpperCase();
      applyGradient(color1, color2, color3);
    } catch (e) {
      console.error("Failed to load saved gradient", e);
    }
  }
})();

// Settings functionality removed - API key is now configured in app.js

// --- Screenshot Functionality ---
(function initScreenshot() {
  const screenshotBtn = document.getElementById("screenshotButton");
  if (!screenshotBtn || typeof html2canvas === "undefined") return;

  screenshotBtn.addEventListener("click", async () => {
    try {
      // Hide FAB buttons during screenshot
      const fabContainer = document.querySelector(".fab-container");
      if (fabContainer) {
        fabContainer.style.display = "none";
      }

      // Capture the frame-root element
      const frameRoot = document.querySelector(".frame-root");
      if (!frameRoot) {
        if (fabContainer) fabContainer.style.display = "flex";
        return;
      }

      // Take screenshot
      const canvas = await html2canvas(frameRoot, {
        backgroundColor: null,
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
      });

      // Show FAB buttons again
      if (fabContainer) {
        fabContainer.style.display = "flex";
      }

      // Convert to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `bumps-screenshot-${Date.now()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (error) {
      console.error("Screenshot failed:", error);
      // Make sure to show buttons even if there's an error
      const fabContainer = document.querySelector(".fab-container");
      if (fabContainer) {
        fabContainer.style.display = "flex";
      }
    }
  });
})();
