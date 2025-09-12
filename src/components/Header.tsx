import Link from "next/link";
import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="py-4">
      <div className="container flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold text-white">
          AquaWatch
        </Link>
        <nav>
          <ul className="flex items-center space-x-3">
            <li>
              <Link href="/report">
                <Button className="bg-white text-black">Report an Incident</Button>
              </Link>
            </li>
            <li>
              <Link href="/diseases">
                <Button variant="outline" className="border-white text-white">Learn More</Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
