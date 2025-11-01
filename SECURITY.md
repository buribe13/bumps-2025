# Security Guide

## API Key Security

This project uses OpenAI API keys which are sensitive credentials. Follow these security practices:

### Current Status

✅ **FIXED**: The exposed API key has been removed from git history  
✅ **SECURED**: `config.js` is properly gitignored  
⚠️ **ACTION REQUIRED**: Generate a NEW API key (your old one was disabled)

### Setup Instructions

1. **Generate a New API Key**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key (your previous one was disabled due to exposure)
   - Copy the key immediately (you won't be able to see it again)

2. **Configure Locally**
   ```bash
   cp config.example.js config.js
   ```
   Then edit `config.js` and replace `YOUR_OPENAI_API_KEY_HERE` with your actual key.

3. **Verify It's Ignored**
   ```bash
   git status
   ```
   You should NOT see `config.js` in the output. If you do, it means it's being tracked - contact support.

### What Was Fixed

- ✅ Removed exposed API key from all git history
- ✅ Verified `config.js` is in `.gitignore`
- ✅ Added security warnings to config files
- ✅ Cleaned up git reflog and garbage collected old objects

### Security Best Practices

#### ✅ DO:
- Keep `config.js` in `.gitignore` (already done)
- Use environment variables or config files that are gitignored
- Regenerate keys immediately if exposed
- Use separate keys for development and production

#### ❌ DON'T:
- Commit `config.js` to version control
- Share API keys in screenshots, emails, or chat
- Hardcode keys directly in `app.js` or `index.html`
- Remove `config.js` from `.gitignore`

### If Your Key Is Exposed

1. **Immediately revoke the key** on OpenAI's website
2. **Generate a new key** and update `config.js`
3. **Check git history** if it was committed (we've already cleaned it)
4. **Review usage** on OpenAI's dashboard for any unauthorized access

### Verifying Security

Check that your key is not in version control:
```bash
# This should return nothing
git log --all --full-history -p | grep -i "sk-proj-"

# This should show config.js is ignored
git check-ignore -v config.js
```

### Remote Repository

⚠️ **Important**: If you've already pushed to GitHub/GitLab with the exposed key:
- The old key is already disabled (good!)
- The key may still be visible in remote git history
- Consider making the repository private if it's public
- GitHub has secret scanning that may have already detected and notified you

### Future Protection

Consider using:
- **GitHub Secrets** (for CI/CD)
- **Environment variables** (for server-side)
- **Secret management tools** (1Password, AWS Secrets Manager, etc.)
- **Pre-commit hooks** to prevent committing secrets

## Questions?

If you have security concerns or questions, review:
- [OpenAI API Key Security](https://platform.openai.com/docs/guides/production-best-practices/api-keys)
- [Git Security Best Practices](https://git-scm.com/docs/git-config#_security)

