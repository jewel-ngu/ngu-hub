import { Link2 } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function Footer(): ReactNode {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <img src="/images/ngu-mark.png" alt="NGU Real Estate" />
        <p>Never give up.</p>
      </div>
      <div>
        <h2>Stay connected</h2>
        <div className="socials">
          <a href="https://www.facebook.com/ngurealestate" aria-label="Facebook"><img src="/images/facebook.png" alt="" /></a>
          <a href="https://www.instagram.com/ngu_real_estate" aria-label="Instagram"><img src="/images/instagram.png" alt="" /></a>
          <a href="https://ngurealestate.com.au" aria-label="NGU website"><Link2 /></a>
        </div>
      </div>
      <div>
        <h2>Quick Links</h2>
        <Link href="/ngu-offices">NGU Offices</Link>
        <Link href="/our-people">Contact List</Link>
        <a href="https://ngurealestate.com.au">Join NGU</a>
      </div>
      <p className="footer-legal">© 2026 NGU Real Estate · The Hub</p>
    </footer>
  );
}
