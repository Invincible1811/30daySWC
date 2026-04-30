import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Winning Souls",
};

export default function TermsPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "40px 24px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <a href="/" style={{ color: "#1E40AF", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-block", marginBottom: 24 }}>
          ← Back to Winning Souls
        </a>
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 32px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Terms of Service</h1>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 32 }}>Last Updated: April 2026</p>

          <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>1. Acceptance of Terms</h2>
            <p>By creating an account or using Winning Souls, you agree to be bound by these Terms of Service. If you do not agree, please discontinue use of the app immediately.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>2. Description of Service</h2>
            <p>Winning Souls is a 30-day evangelism challenge companion app that provides daily challenges, scripture resources, soul tracking, community features, direct messaging, and evangelism tools to help believers share the Gospel boldly.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>3. User Accounts</h2>
            <p>You are responsible for maintaining the security of your account credentials. You must provide accurate information when creating an account. You may not impersonate others or create accounts for fraudulent purposes. One account per person.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>4. Subscription &amp; Payments</h2>
            <p>The app offers a <strong>free 12-day trial</strong> upon registration. After the trial period, a subscription of <strong>$8 per month</strong> is required to continue accessing all features. Subscriptions are billed monthly and can be cancelled at any time. Upon cancellation, access continues until the end of the current billing period. Refunds are handled on a case-by-case basis.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>5. Free Trial</h2>
            <p>New users receive 12 days of free, unrestricted access to all app features. No payment information is required during the trial. At the end of the trial, you will be prompted to subscribe to continue using the app.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>6. Acceptable Use</h2>
            <p>You agree to:</p>
            <ul style={{ paddingLeft: 24, marginTop: 8 }}>
              <li>Use the app for its intended purpose of evangelism and spiritual growth</li>
              <li>Treat other community members with respect and love</li>
              <li>Not post offensive, hateful, sexually explicit, or inappropriate content</li>
              <li>Not attempt to hack, exploit, reverse-engineer, or disrupt the service</li>
              <li>Not use the messaging feature for spam, solicitation, or harassment</li>
              <li>Not create multiple accounts to circumvent the subscription</li>
            </ul>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>7. Content Ownership</h2>
            <p>You retain ownership of content you post (testimonies, prayer requests, community posts). By posting, you grant Winning Souls a non-exclusive, royalty-free license to display your content within the app for other users to see. Admins may remove content that violates community guidelines without notice.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>8. Termination</h2>
            <p>We reserve the right to suspend or terminate accounts that violate these terms, post inappropriate content, or engage in behavior harmful to the community. You may delete your account at any time by contacting the admin. Upon termination, your data will be removed according to our Privacy Policy.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>9. Disclaimer of Warranties</h2>
            <p>The app is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, express or implied. We do not guarantee uninterrupted service, data accuracy, or specific spiritual outcomes from using the app or following the daily challenges.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>10. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Winning Souls and its operators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the app.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>11. Changes to Terms</h2>
            <p>We may update these terms at any time. Significant changes will be communicated via in-app announcement. Continued use of the app after changes constitutes acceptance of the updated terms.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>12. Governing Law</h2>
            <p>These terms shall be governed by applicable law. Any disputes will be resolved through good-faith discussion before pursuing other remedies.</p>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", marginTop: 32 }}>&copy; {new Date().getFullYear()} Winning Souls. All rights reserved.</p>
      </div>
    </div>
  );
}
