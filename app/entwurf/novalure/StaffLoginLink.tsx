import type { Locale } from "@/lib/i18n";

const labels: Record<Locale, string> = {
  de: "Mitarbeiter-Login",
  en: "Staff Login",
  es: "Acceso para el personal"
};

export default function StaffLoginLink({ locale }: { locale: Locale }) {
  return <a href="https://novalure-crm.app" target="_blank" rel="noreferrer" data-track="footer_staff_login">{labels[locale]}</a>;
}
