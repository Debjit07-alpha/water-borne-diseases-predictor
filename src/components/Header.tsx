import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="h-14 border-b bg-white/50 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold tracking-tight font-heading-sans">
              River Pulse
              <span className="text-sm font-normal text-foreground/60 ml-2">
                North-East India
              </span>
            </h1>
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-2">
            <Link href="/incidents">
              <Button variant="ghost" size="sm">Recent Incidents</Button>
            </Link>
            <Link href="/report">
              <Button variant="secondary" size="sm">Report an Incident</Button>
            </Link>
            <Link href="/diseases">
              <Button variant="ghost" size="sm">Learn More</Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
