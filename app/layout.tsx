import type {Metadata} from "next";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import Motion from "./motion";
import "./globals.css";
import "./premium.css";
import "./hero-animation.css";
import "./inquiry-animation.css";
import "./atlas.css";
import "./atlas-cinematic.css";
import "./audit-refinement.css";
import { SITE_ORIGIN } from "@/lib/seo";
export const metadata:Metadata={metadataBase:new URL(SITE_ORIGIN),title:{default:"ProAge Atlas — Research for healthy aging",template:"%s | ProAge Atlas"},description:"Scientific evidence, aging measurements and study planning for longevity research teams. Explore the research prototype.",icons:{icon:"/favicon.svg",shortcut:"/favicon.svg"}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><head><link rel="preload" href="/fonts/inter-regular.woff" as="font" type="font/woff" crossOrigin="anonymous"/><link rel="preload" href="/fonts/newsreader-regular.woff" as="font" type="font/woff" crossOrigin="anonymous"/></head><body><a className="skip-link" href="#main">Skip to content</a><Header/><Motion/>{children}<Footer/></body></html>}
