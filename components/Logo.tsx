import Image from "next/image";
import Link from "next/link";
import { getPath, type Locale } from "@/lib/i18n";

export function Logo({ locale, priority = false }: { locale: Locale; priority?: boolean }) {
  return (
    <Link className="brand" href={getPath(locale, "home")} aria-label="NovaLure home">
      <Image
        className="brand-logo-image"
        src="/novalure-logo-reference.png"
        alt="NovaLure"
        width={417}
        height={130}
        priority={priority}
      />
    </Link>
  );
}
