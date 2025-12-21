# Trusted Publishing Setup for stylescape

## Overview

This package uses npm's Trusted Publishing feature with OIDC authentication for
secure, token-free publishing via GitHub Actions.

## Configuration Steps

### 1. Configure Trusted Publisher on npmjs.com

1. Go to https://www.npmjs.com/package/stylescape/access
2. Navigate to the "Trusted Publisher" section
3. Click "GitHub Actions"
4. Configure:
   - **Organization or user**: `stylescape`
   - **Repository**: `stylescape`
   - **Workflow filename**: `publish_package.yml`
   - **Environment name**: (leave blank, or set if using GitHub environments)
5. Click "Add Trusted Publisher"

### 2. Security Recommendations

After configuring trusted publishing:

1. Navigate to Package Settings → Publishing access
2. Select "Require two-factor authentication and disallow tokens"
3. Click "Update Package Settings"
4. Revoke the existing `PUBLISH_NPM_TOKEN` secret from your repository (no
   longer needed)

### 3. How It Works

The workflow now uses OIDC for authentication:

- No long-lived tokens needed
- Short-lived credentials generated per publish
- Automatic provenance attestation
- Enhanced security

### 4. Publishing a New Version

```bash
# Update version
npm version patch  # or minor, major

# Push with tags
git push && git push --tags

# GitHub Actions will automatically:
# 1. Build the package
# 2. Run tests
# 3. Publish to npm using OIDC
# 4. Create a GitHub release
```

### 5. Requirements

- npm CLI 11.5.1+ (automatically used in GitHub Actions)
- Public repository (for automatic provenance)
- GitHub-hosted runners (already configured)

### 6. Verification

After your next publish, you can verify:

1. Package shows provenance badge on npmjs.com
2. No `NODE_AUTH_TOKEN` needed in workflow
3. Publish logs show OIDC authentication

## Migration Notes

- Existing token-based publishing still works during transition
- Once trusted publishing is verified, revoke old tokens
- Private dependencies still need read-only tokens for `npm ci`

## Documentation

- [npm Trusted Publishing Docs](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub OIDC Documentation](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
