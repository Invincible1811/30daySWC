import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Winning Souls",
};

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", padding: "40px 24px" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <a href="/" style={{ color: "#1E40AF", fontSize: 14, fontWeight: 600, textDecoration: "none", display: "inline-block", marginBottom: 24 }}>
          ← Back to Winning Souls
        </a>
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 32px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", marginBottom: 8 }}>Privacy Policy</h1>
          <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 32 }}>Last Updated: April 2026</p>

          <div style={{ fontSize: 15, color: "#374151", lineHeight: 1.8 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>1. Information We Collect</h2>
            <p>When you create an account, we collect your name, email address, and optional profile information (city, country, church, phone number, bio). We also collect data you voluntarily provide: soul records, testimonies, prayer requests, community posts, and challenge progress.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>2. How We Use Your Information</h2>
            <p>We use your information to: provide and improve the app experience, display your username and location to other members in the community directory, send email notifications (account confirmation, password resets), and aggregate anonymous statistics for the community dashboard.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>3. Data Sharing</h2>
            <p>We do <strong>not</strong> sell, trade, or share your personal data with third parties. Your soul records and follow-up contacts are visible only to you. Community posts, testimonies, and prayer requests are visible to all app users as part of the community features.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>4. Data Storage &amp; Security</h2>
            <p>Your data is stored securely on Supabase infrastructure with row-level security policies. Passwords are hashed and never stored in plain text. All connections use HTTPS encryption.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>5. Your Rights</h2>
            <p>You can: view and edit your profile at any time, delete your account and all associated data by contacting the admin, export your data upon request, and opt out of non-essential communications.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>6. Cookies &amp; Local Storage</h2>
            <p>We use local storage to save your app preferences and session data. We do not use tracking cookies or third-party analytics that identify you personally. The only third-party service we use is Supabase for authentication and database.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>7. Payment Information</h2>
            <p>Payments are processed securely through Stripe. We never store your credit card details. Stripe handles all payment data in compliance with PCI-DSS standards.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>8. Children&apos;s Privacy</h2>
            <p>This app is intended for users aged 13 and above. We do not knowingly collect data from children under 13.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>9. Data Retention</h2>
            <p>Your data is retained for as long as your account is active. If you request account deletion, all personal data will be permanently removed within 30 days.</p>

            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8, marginTop: 24 }}>10. Contact</h2>
            <p>For privacy-related questions or data requests, contact the app administrator through the community section or reach out via the app&apos;s support channels.</p>
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", marginTop: 32 }}>&copy; {new Date().getFullYear()} Winning Souls. All rights reserved.</p>
      </div>
    </div>
  );
}
