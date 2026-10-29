import type {Metadata} from "next";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import Motion from "./motion";
import "./globals.css";
import "./premium.css";
import "./hero-animation.css";
import "./atlas.css";
import "./atlas-cinematic.css";
import "./audit-refinement.css";
import "./visual-system.css";
import { SITE_ORIGIN, websiteStructuredData } from "@/lib/seo";
export const metadata:Metadata={metadataBase:new URL(SITE_ORIGIN),title:{default:"ProAge Atlas — Research for healthy aging",template:"%s | ProAge Atlas"},description:"An AI evidence workspace for geroscience teams. Search biomedical literature, compare findings and prepare a source-linked research brief.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><head><link rel="preload" href="/fonts/dm-sans-regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><link rel="preload" href="/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous"/><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(websiteStructuredData).replace(/</g,'\u003c')}}/></head><body><a className="skip-link" href="#main">Skip to content</a><Header/><Motion/>{children}<Footer/></body></html>}
