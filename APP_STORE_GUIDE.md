# App Store Submission Guide — 30 Day SWC

## Step 5: App Store Assets Checklist

### App Icon
You already have `public/icons/icon-512.png`. For the stores you need:
- **Apple**: 1024x1024 PNG — no transparency, no rounded corners (Apple rounds them automatically)
- **Google**: 512x512 PNG (you already have this)

To create the 1024x1024 version, upscale your existing icon-512.png using:
- Figma, Canva, or any image editor
- Or use: `sips -z 1024 1024 public/icons/icon-512.png --out app-icon-1024.png`

### Screenshots Required
Take screenshots of your app on real devices or simulators:

**Apple App Store (required sizes):**
| Device | Size |
|--------|------|
| iPhone 6.7" (15 Pro Max) | 1290 x 2796 |
| iPhone 6.5" (11 Pro Max) | 1242 x 2688 |
| iPad 12.9" (optional) | 2048 x 2732 |

**Google Play:**
| Type | Size |
|------|------|
| Phone | min 320px, max 3840px (any side) |
| Feature Graphic | 1024 x 500 (required) |

**Recommended screenshots (5-8 per store):**
1. Dashboard / Home screen
2. 30-Day Challenge view
3. Impact Tracker
4. Testimonies feed (with video)
5. Prayer Wall
6. Community / Groups
7. Events page
8. Soul-Winning Toolkit

**Pro tip:** Use https://screenshots.pro or https://mockuphone.com to put your screenshots in device frames.

### App Description

**App Name:** 30-Day Soul-Winning Challenge (max 30 chars for Apple)
**Subtitle (Apple):** Your Evangelism Companion (max 30 chars)

**Short Description (Google Play, max 80 chars):**
Daily evangelism challenges, prayer tools & a community of soul winners.

**Full Description (both stores, max 4000 chars):**
```
Transform your evangelism journey with the 30-Day Soul-Winning Challenge app — your complete companion for sharing the Gospel.

FEATURES:
- 30-Day Challenge: Daily evangelism tasks with scripture guidance
- Impact Tracker: Log and track every soul you reach
- Follow-Up Tools: Keep in touch with new believers
- Prayer Wall: Post and pray for community requests
- Testimonies: Share video, audio, and text testimonies
- Community & Groups: Connect with other soul winners
- Events: Find and join evangelism events near you
- Soul-Winning Toolkit: Scripture cards, conversation starters, and more
- Global Impact Board: See your ranking among soul winners worldwide
- Live Feed: Real-time updates from the community

START FREE:
Enjoy 21 days free, then continue for just $2 CAD/month. Cancel anytime.

Built for every believer who wants to make a difference. Whether you're new to evangelism or a seasoned soul winner, this app equips and encourages you every step of the way.
```

### Required URLs (create these pages on your website or use a free service)
- **Privacy Policy:** Required by both stores. Use https://app-privacy-policy-generator.nisrulz.com/ to generate one, then host at `30dayswc.com/privacy`
- **Terms of Service:** Host at `30dayswc.com/terms`
- **Support URL:** Can be an email like `support@30dayswc.com` or a contact page

### App Category
- **Apple:** Lifestyle (primary), Education (secondary)
- **Google:** Education → Education, or Lifestyle

---

## Step 3 & 4: Native App Wrapper with Capacitor

### Prerequisites
- **Xcode** installed (for iOS) — download from Mac App Store
- **Android Studio** installed (for Android) — https://developer.android.com/studio
- **Apple Developer Account** — https://developer.apple.com ($99/year)
- **Google Play Developer Account** — https://play.google.com/console ($25 one-time)
- **CocoaPods** — `sudo gem install cocoapods`

### Installation Steps

#### 1. Install Capacitor
```bash
cd /Users/bernardbarnieh/Documents/Area\ 51/Winningsouls/winning-souls
npm install @capacitor/core @capacitor/cli
npx cap init "30 Day SWC" "com.winningsouls.app" --web-dir=out
```

#### 2. Configure Next.js for Static Export
Add to `next.config.ts`:
```ts
output: 'export',
```
Then build:
```bash
npm run build
```

#### 3. Add Platforms
```bash
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android
```

#### 4. Copy Web Build to Native Projects
```bash
npx cap copy
npx cap sync
```

#### 5. Open in IDEs
```bash
npx cap open ios      # Opens Xcode
npx cap open android  # Opens Android Studio
```

### iOS Setup in Xcode
1. Open the project in Xcode
2. Select your Team (Apple Developer account) in Signing & Capabilities
3. Set Bundle Identifier: `com.winningsouls.app`
4. Set Display Name: `30 Day SWC`
5. Set the app icon: drag your 1024x1024 icon into Assets.xcassets → AppIcon
6. Set Deployment Target: iOS 15.0 or higher
7. Test on simulator: Product → Run
8. Archive for submission: Product → Archive → Distribute App

### Android Setup in Android Studio
1. Open the android folder
2. Update `app/build.gradle` — set `applicationId "com.winningsouls.app"`
3. Set app icon using Android Studio's Image Asset tool
4. Build signed APK/AAB: Build → Generate Signed Bundle/APK
5. Upload the AAB to Google Play Console

### In-App Purchases (Apple requirement)

**IMPORTANT:** Apple requires subscriptions to go through their in-app purchase system.
You have two options:

**Option A: RevenueCat (Recommended — easier)**
1. Sign up at https://revenuecat.com (free for <$2.5k/month revenue)
2. Create products in App Store Connect and Google Play Console
3. Configure them in RevenueCat dashboard
4. Install the Capacitor plugin:
   ```bash
   npm install @revenuecat/purchases-capacitor
   ```
5. Replace your Stripe checkout with RevenueCat's purchase flow

**Option B: Native StoreKit + Google Play Billing**
More complex, requires writing native code for each platform.

### Capacitor Configuration File
After `npx cap init`, edit `capacitor.config.ts`:
```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.winningsouls.app',
  appName: '30 Day SWC',
  webDir: 'out',
  server: {
    // Use your live URL so you don't need to rebuild for every change
    url: 'https://30dayswc.com',
    cleartext: true,
  },
};

export default config;
```

Using `server.url` means the native app loads your live website. This is the simplest approach — you update the website and all app users get the update instantly without going through the app store review again.

---

## Submission Checklist

### Google Play
- [ ] Create app in Google Play Console
- [ ] Fill in store listing (description, screenshots, icon, feature graphic)
- [ ] Set up pricing (free with in-app purchases)
- [ ] Add privacy policy URL
- [ ] Complete content rating questionnaire
- [ ] Upload signed AAB
- [ ] Submit for review (~1-3 days)

### Apple App Store
- [ ] Create app in App Store Connect
- [ ] Fill in app information (description, screenshots, icon, keywords)
- [ ] Create subscription product ($2 CAD/month) in App Store Connect
- [ ] Set up in-app purchases with RevenueCat
- [ ] Add privacy policy and terms URLs
- [ ] Set age rating
- [ ] Upload build via Xcode (Archive → Distribute)
- [ ] Submit for review (~1-3 days)

---

## Quick Start Commands (run in order)
```bash
# 1. Install Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init "30 Day SWC" "com.winningsouls.app" --web-dir=out

# 2. Add platforms
npm install @capacitor/ios @capacitor/android
npx cap add ios
npx cap add android

# 3. Sync
npx cap sync

# 4. Open
npx cap open ios
npx cap open android
```
