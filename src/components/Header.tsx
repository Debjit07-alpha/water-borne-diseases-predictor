import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <Link href="/" className="text-2xl font-bold">
        AquaWatch
      </Link>
      <nav>
        <ul className="flex items-center space-x-4">
          <li>
            <Link href="/report">
              <Button>Report an Incident</Button>
            </Link>
          </li>
          <li>
            <Link href="/diseases">
              <Button variant="outline">Learn More</Button>
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
