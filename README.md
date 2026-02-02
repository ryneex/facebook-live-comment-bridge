# Facebook Live Comment Bridge

A browser extension that scrapes comments from the Facebook Live Producer dashboard and forwards them to your API endpoint in real-time. Enough for creating live comment overlays.

## Installation

1. Clone this repository:

```bash
git clone https://github.com/ryneex/facebook-live-comment-bridge.git
cd facebook-live-comment-scraper
```

2. Install dependencies:

```bash
pnpm install
```

3. Build the extension:

```bash
# For Chrome
pnpm build

# For Firefox
pnpm build:firefox
```

4. Load the extension:
   - **Chrome**: Go to `chrome://extensions/`, enable "Developer mode", click "Load unpacked", and select the `.output/chrome-mv3` directory
   - **Firefox**: Go to `about:debugging`, click "This Firefox", click "Load Temporary Add-on", and select the manifest file from `.output/firefox-mv2`

## Configuration

1. Click the extension icon in your browser toolbar
2. Enter your API endpoint URL (e.g., `https://api.example.com/comments`)
3. (Optional) Enter your API key for authentication
4. Click "Save"

## Usage

The extension only works on the Facebook Live Producer dashboard comments page:
`https://www.facebook.com/live/producer/dashboard/*/COMMENTS/`

Once you're on this page, the extension automatically scrapes comments every second and sends them to your configured API endpoint.

## API Format

The extension sends POST requests to your configured endpoint:

- **Method**: `POST`
- **Content-Type**: `application/json`
- **Headers**: `x-api-key` (if configured)
- **Body**: Array of comment objects

### Comment Object

```typescript
{
  image: string,    // Profile picture URL
  author: string,   // Comment author name
  comment: string   // Comment text content
}
```

### Example Request

```json
[
  {
    "image": "https://scontent.xx.fbcdn.net/v/...",
    "author": "John Doe",
    "comment": "Great stream!"
  }
]
```

## Development

```bash
# Development mode
pnpm dev              # Chrome
pnpm dev:firefox      # Firefox

# Build
pnpm build            # Chrome
pnpm build:firefox    # Firefox

# Other commands
pnpm compile          # Type-check
pnpm format           # Format code
```

## Tech Stack

- WXT - Web Extension Toolkit
- React - UI framework
- TypeScript - Type safety
- Tailwind CSS - Styling
