import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { V2BrandPage, getBrandPageTitle } from "@/components/v2/V2BrandPage";
import { isLocale, type Locale } from "@/lib/i18n";
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;if(!isLocale(locale))return{};return{title:getBrandPageTitle(locale,"solutions"),description:"NovaLure solutions for developers, project sales teams and international buyer campaigns."};}
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!isLocale(locale))notFound();return <V2BrandPage locale={locale as Locale} kind="solutions"/>;}
