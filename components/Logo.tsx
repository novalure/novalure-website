import Image from "next/image";
import Link from "next/link";
import { getPath, type Locale } from "@/lib/i18n";

export function Logo({ locale }: { locale: Locale }) {
  return (
    <Link className="brand" href={getPath(locale, "home")} aria-label="Novalure home">
      <Image
        className="brand-logo-image"
        src="/novalure-logo.png"
        alt="Novalure"
        width={376}
        height={138}
        priority
      />
    </Link>
  );
}
