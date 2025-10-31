# bumps-2025

A public diary scored by my top 3 tracks of the day.

## Features

- **Spotify Integration**: Connect your Spotify account to automatically fetch your top 3 songs each day
- **Daily Journal Entries**: AI-generated journal entries inspired by your top 3 song lyrics
- **Lyrics Integration**: Automatically fetches lyrics from your top songs
- **Beautiful UI**: Minimalist design with gradient customization

## Setup

### 1. Spotify Integration

1. The app uses Spotify Web API with PKCE authentication
2. Click the Spotify connect button to authorize
3. Your top 3 songs will be fetched automatically

### 2. Journal Card Setup

The journal card generates daily entries using:
- **Lyrics API**: Uses the free [lyrics.ovh API](https://lyrics.ovh) (no API key needed)
- **OpenAI API**: Generates inspiring journal entries from your song lyrics

#### Setting Up OpenAI API Key

To enable journal entry generation, you need to set your OpenAI API key:

1. Get an API key from [OpenAI](https://platform.openai.com/api-keys)
2. Open your browser's developer console (F12)
3. Run this command:
   ```javascript
   localStorage.setItem('openai_api_key', 'your-api-key-here')
   ```
4. Refresh the page

**Note**: The API key is stored locally in your browser and never shared.

### 3. How It Works

1. Each day, the app fetches your top 3 most-played songs from Spotify
2. Lyrics are automatically fetched for each song
3. OpenAI generates 4 inspiring journal entry slides based on the lyrics
4. Entries are cached per day, so they only regenerate if the top 3 songs change

## Journal Entry Features

- **4 Slides**: Each journal entry consists of 4 thought-provoking slides
- **Inspired by Lyrics**: Entries are generated using themes and emotions from your top songs
- **Fortune Cookie Style**: Messages are short, inspiring, and reflective
- **Daily Updates**: New entries are generated each day based on your current top songs

## Customization

- **Background Gradient**: Click the gradient customizer button (top right) to change background colors
- **Presets**: Choose from several preset gradient themes
- **Custom Colors**: Create your own color combinations

## Technical Details

- Pure JavaScript (no frameworks)
- Spotify Web API with PKCE authentication
- OpenAI GPT-4o-mini for journal generation
- Lyrics.ovh API for song lyrics
- LocalStorage for caching entries and preferences
