# MileageLog - SARS Tax Tracker

A professional odometer tracking web application with an automotive dashboard aesthetic, designed for SARS tax year mileage logging (March to February).

## Features

### Core Functionality
- **Photo Capture**: Take photos of your odometer readings using your device camera
- **Trip Logging**: Record start/end odometer readings with automatic distance calculation
- **Tax Year Tracking**: Automatic SARS tax year calculation (March 1 - February 28)
- **Tax Year Navigation**: Browse through previous tax years (up to 5 years back)
- **Local Storage**: All data persists locally in your browser
- **n8n Integration**: Optional webhook sync to n8n for cloud backup
- **PWA Support**: Install as a standalone app on mobile devices for offline use
- **Trip Management**: Edit or delete any logged trip with confirmation dialogs
- **Data Import/Export**: Import CSV or JSON files, export to JSON for full backup

### Dashboard Views

#### Home
- Current tax year total kilometers
- Today's trip count
- Current month statistics
- Last odometer reading
- Total trips logged

#### Log Trip
- Date selection (defaults to today)
- Odometer photo capture
- Start/End kilometer input (auto-fills start with last reading)
- Optional trip notes
- Automatic distance calculation

#### History
- Trips grouped by day
- Expandable daily summaries
- Photo gallery of odometer readings
- Full trip details with notes
- Edit and delete individual trips

#### Summary
- Tax year overview
- Total business kilometers
- Monthly breakdown
- CSV export for Google Sheets/Excel
- Activity statistics

## Setup

### Quick Start
1. Open `index.html` in any modern web browser
2. That's it! No build process or dependencies required

### Progressive Web App (PWA)
The app works offline and can be installed on your device:
- Service worker caches all assets for offline use
- Install prompt appears automatically on supported browsers
- Works in airplane mode after initial load

### Mobile Installation (PWA-Ready)
While this is a single HTML file, you can add it to your home screen on mobile:

**iOS:**
1. Open in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

**Android:**
1. Open in Chrome
2. Tap the menu (⋮)
3. Select "Add to Home Screen"

### n8n Webhook Setup (Optional)

1. In your n8n instance, create a new workflow with a Webhook node
2. Copy the webhook URL
3. In MileageLog, tap the settings icon (⚙️) in the top right
4. Paste your webhook URL
5. Save settings

**JSON Payload Format:**
```json
{
  "id": 1234567890,
  "date": "2025-12-06",
  "startKm": 110,
  "endKm": 120,
  "distance": 10,
  "notes": "Client visit to Cape Town",
  "photo": "data:image/jpeg;base64,...",
  "timestamp": "2025-12-06T08:30:00.000Z"
}
```

## Design

### Aesthetic Direction
**Automotive Dashboard Inspiration** - Inspired by classic car instrument panels with warm amber glows, precision typography, and utilitarian yet refined design.

### Typography
- **Display/Numbers**: Orbitron (monospace, digital odometer aesthetic)
- **Body Text**: Inter (clean, readable)

### Color Palette
- **Background**: Deep charcoal (#0a0a0a, #1a1a1a)
- **Accent**: Amber/Gold (#F59E0B, #D97706)
- **Text**: Light gray (#e5e5e5) with muted variants

### Key Design Elements
- Ambient amber glow effects on hero stats
- Gradient mesh backgrounds for depth
- Card-based layouts with subtle borders
- Bottom navigation with FAB (Floating Action Button)
- Smooth micro-interactions and transitions

## Data Storage

All data is stored in browser `localStorage` under the key `mileageLog`:

```json
{
  "trips": [...],
  "webhookUrl": "https://..."
}
```

### Export Your Data
Use the CSV export feature in the Summary view to download all trip data for:
- Google Sheets
- Microsoft Excel
- Backup/archive purposes

## Browser Compatibility

- ✅ Chrome/Edge (recommended)
- ✅ Safari (iOS/macOS)
- ✅ Firefox
- ✅ Any modern browser with ES6+ support

## SARS Tax Year Logic

The app automatically handles SARS tax years:
- **Tax Year**: March 1 - February 28/29
- **Example**: Tax Year 2024/25 = March 1, 2024 to February 28, 2025

All totals and summaries are calculated within the current tax year boundaries.

## Privacy & Security

- **No external servers**: All data stays on your device (unless you configure n8n webhook)
- **No tracking**: Zero analytics or tracking scripts
- **No accounts**: No login required
- **No cloud sync** (unless explicitly configured via n8n)

## Tips

1. **Daily Routine**: Take a photo each morning and log your start reading
2. **End of Day**: Add the end reading to complete the trip
3. **Pre-filled Start**: The app automatically fills the start km with your last end reading
4. **Notes**: Add client names or trip purposes for better record-keeping
5. **Export Monthly**: Download CSV monthly for extra backup security
6. **Install the App**: Add to your home screen for quick access and offline use
7. **Edit Mistakes**: Tap any trip in History to edit or delete it
8. **Tax Year Navigation**: Use the arrows next to the tax year badge to view previous years

## Development

This is a single-file application with no build process:
- Pure HTML/CSS/JavaScript
- No frameworks or external dependencies
- Self-contained and portable
- Easy to customize and modify

### File Structure
```
Odometer_app/
├── index.html        # Main application (single-file app)
├── manifest.json     # PWA manifest for app installation
├── sw.js            # Service worker for offline support
├── icons/           # PWA icons
│   ├── icon-192.svg
│   └── icon-512.svg
├── README.md        # This file
└── n8n-workflow-guide.md  # n8n setup instructions
```

### Accessibility
- Full keyboard navigation support
- ARIA labels on all interactive elements
- Focus indicators for keyboard users
- Semantic HTML structure

## License

Free to use and modify for personal or commercial use.

---

**Built with Claude Code** - Distinctive, production-grade frontend design
