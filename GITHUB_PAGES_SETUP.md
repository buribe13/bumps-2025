# Setting Up OpenAI API Key for GitHub Pages

Since `config.js` is gitignored for security, you need to use GitHub Secrets to make it work on GitHub Pages.

## Steps to Enable OpenAI on GitHub Pages

### 1. Add Your API Key as a GitHub Secret

1. Go to your GitHub repository: `https://github.com/buribe13/bumps-2025`
2. Click **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Name: `OPENAI_API_KEY`
6. Value: Paste your OpenAI API key (the one from your local `config.js`)
7. Click **Add secret**

### 2. Enable GitHub Pages with Actions

1. Still in **Settings**, go to **Pages** (left sidebar)
2. Under **Source**, select **GitHub Actions**
3. Save the changes

### 3. Enable GitHub Actions (if not already enabled)

1. Go to **Settings** → **Actions** → **General**
2. Under **Workflow permissions**, select:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
3. Click **Save**

### 4. Trigger the Deployment

The GitHub Actions workflow will automatically:
- Run when you push to `main` branch
- Create `config.js` from your secret during deployment
- Deploy to GitHub Pages with the API key included

**To trigger manually:**
1. Go to **Actions** tab in your repo
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow** → **Run workflow**

## How It Works

- The `.github/workflows/deploy.yml` file automatically creates `config.js` during deployment
- The API key is stored securely in GitHub Secrets (never exposed in code)
- The generated `config.js` only exists in the deployed site, not in your repo

## Security Notes

✅ Your API key remains secure:
- Stored in GitHub Secrets (encrypted)
- Never committed to git
- Only injected during deployment
- Generated file only exists on GitHub Pages, not in your repo

## Verification

After deployment, check:
1. Visit your GitHub Pages URL
2. Open browser console (F12)
3. Look for: "✅ OpenAI API Key configured. Fortune cookies will be generated!"
4. If you see an error, check the Actions tab for deployment logs

