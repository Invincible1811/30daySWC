# Winning Souls — 30-Day Soul-Winning Challenge

A companion web app for the **30-Day Soul-Winning Challenge** book. Designed to equip, encourage, and empower believers to share the Gospel daily.

## Features

- **30-Day Challenge** — Daily scriptures, prayers, encouragement, and evangelism challenges
- **Soul Tracker** — Log and follow up with every person you lead to Christ
- **Prayer Wall** — Post prayer requests and intercede for fellow soul winners
- **Testimonies** — Share stories of God's faithfulness and be encouraged by others
- **Community Feed** — Connect with soul winners, share reports, and celebrate milestones
- **Events & Groups** — Organize outreach events and join evangelism teams
- **Evangelism Toolkit** — 30 scripture declaration cards, 34 conversation starter cards, gospel soul-winning tool, Acts of Kindness Bingo boards, and 26+ gift & outreach ideas
- **Landing Page** — Beautiful introduction page for new visitors

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **State:** React Context + localStorage persistence

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                  # Next.js app directory
│   ├── page.tsx          # Main page with routing
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles & theme
├── components/           # React components
│   ├── LandingPage.tsx   # Landing/marketing page
│   ├── Dashboard.tsx     # Main dashboard
│   ├── ChallengeCards.tsx # 30-day challenge cards
│   ├── SoulTracker.tsx   # Soul tracking & follow-up
│   ├── PrayerWall.tsx    # Prayer requests
│   ├── Testimonies.tsx   # Testimony sharing
│   ├── Community.tsx     # Community feed
│   ├── Events.tsx        # Outreach events
│   ├── Groups.tsx        # Evangelism groups
│   ├── Toolkit.tsx       # Evangelism toolkit
│   └── Navigation.tsx    # App navigation
├── lib/
│   ├── data.ts           # Data interfaces & sample data
│   ├── challenges-data.ts # 30-day challenge content
│   └── store.tsx         # Global state management
public/
└── toolkit/              # Toolkit image assets
    ├── scripture-cards/  # 30 scripture declaration cards
    ├── conversation-cards/ # 34 conversation starter cards
    ├── gospel-tool/      # Gospel soul-winning tool
    ├── bingo/            # Acts of Kindness Bingo boards
    └── gifts/            # Gifts & giveaway resources
```

## Deployment

This app is optimized for deployment on [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repo on [vercel.com](https://vercel.com)
3. Vercel auto-detects Next.js and deploys instantly

## Author

Built with love for the Kingdom.

## License

All rights reserved.
