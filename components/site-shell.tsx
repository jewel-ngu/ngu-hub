"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { SessionControls } from "@/components/session-controls";
import { infoNavItems, navItems } from "@/lib/site-data";

type SiteShellProps = {
  readonly children: ReactNode;
  readonly currentUser: {
    readonly email: string;
    readonly name: string;
  };
  readonly isLocalPreview?: boolean;
};

function Brand(): ReactNode {
  return (
    <Link className="brand" href="/" aria-label="NGU Hub home">
      <img src="/images/ngu-mark.png" alt="NGU Real Estate" />
    </Link>
  );
}

function Navigation({ onNavigate }: { readonly onNavigate?: () => void }): ReactNode {
  const pathname = usePathname();
  const [infoOpen, setInfoOpen] = useState(pathname.startsWith("/info-hub"));

  return (
    <nav className="site-nav" aria-label="Main navigation">
      {navItems.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        if (item.label === "Info Hub") {
          return (
            <div key={item.href}>
              <div className="nav-row">
                <Link className={active ? "active" : ""} href={item.href} onClick={onNavigate}>{item.label}</Link>
                <button aria-label="Toggle Info Hub pages" onClick={() => setInfoOpen((open) => !open)}>
                  <ChevronDown size={16} className={infoOpen ? "rotate-180" : ""} />
                </button>
              </div>
              {infoOpen && (
                <div className="subnav">
                  {infoNavItems.map((subItem) => (
                    <Link className={pathname === subItem.href ? "active" : ""} href={subItem.href} key={subItem.href} onClick={onNavigate}>
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        }

        return item.external ? (
          <a href={item.href} key={item.href} target="_blank" rel="noreferrer">{item.label}</a>
        ) : (
          <Link className={active ? "active" : ""} href={item.href} key={item.href} onClick={onNavigate}>{item.label}</Link>
        );
      })}
    </nav>
  );
}

function PrimaryNavigation(): ReactNode {
  const pathname = usePathname();
  const items = [
    { label: "Home", href: "/" },
    { label: "Leaderboard", href: "/leaderboard" },
    { label: "AML/CTF", href: "/amlctf" },
    { label: "Info Hub", href: "/info-hub" },
    { label: "New to NGU", href: "/new-to-ngu" },
  ] as const;

  return (
    <nav className="primary-nav" aria-label="Quick navigation">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return <Link className={active ? "active" : ""} href={item.href} key={item.href}>{item.label}</Link>;
      })}
    </nav>
  );
}

export function SiteShell({ children, currentUser, isLocalPreview = false }: SiteShellProps): ReactNode {
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [drawerOpen]);

  const drawerContacts = (
    <div className="drawer-contacts">
      <div><h3>Sales Admin</h3><p>REA, Domain, Realworks, Form 6</p><a href="mailto:admin@ngurealestate.com.au">admin@ngurealestate.com.au</a></div>
      <div><h3>Design &amp; Branding</h3><p>RealHub, design requests, branding enquiries</p><a href="mailto:design@ngurealestate.com.au">design@ngurealestate.com.au</a></div>
      <div><h3>Accounts</h3><p>Payments, invoices and accounts enquiries</p><a href="mailto:accounts@ngurealestate.com.au">accounts@ngurealestate.com.au</a></div>
      <div><h3>AML/CTF</h3><p>Compliance guidance and First AML support</p><a href="mailto:amlctf@ngurealestate.com.au">amlctf@ngurealestate.com.au</a></div>
    </div>
  );

  return (
    <>
      <aside className="announcement">
        <span>Learn more about AML/CTF</span>
        <Link href="/amlctf">Explore the latest resources <span aria-hidden="true">↗</span></Link>
      </aside>

      <header className="site-header">
        <Brand />
        <PrimaryNavigation />
        <div className="header-actions">
          <button aria-label="Open navigation" onClick={() => setDrawerOpen(true)}>
            <span>Menu</span>
            <Menu size={27} strokeWidth={1.4} />
          </button>
        </div>
      </header>

      {drawerOpen && (
        <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)}>
          <aside className="mobile-drawer" onClick={(event) => event.stopPropagation()}>
            <div className="drawer-header">
              <Brand />
              <button className="drawer-close" aria-label="Close navigation" onClick={() => setDrawerOpen(false)}>
                <span>Close</span>
                <X size={26} strokeWidth={1.4} />
              </button>
            </div>
            <div className="drawer-content">
              <p>EXPLORE NGU</p>
              <Navigation onNavigate={() => setDrawerOpen(false)} />
              {drawerContacts}
              <SessionControls isLocalPreview={isLocalPreview} user={currentUser} />
            </div>
          </aside>
        </div>
      )}

      <main className="site-main">{children}</main>
    </>
  );
}
