import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import PageContent from '@/components/site/page-content';
import { pages } from '@/lib/site-content';
import { editorialTitles, pageMetadata } from '@/lib/seo';
export function generateStaticParams(){return Object.keys(pages).map(path=>({slug:path.split('/')}))}
export async function generateMetadata({params}:{params:Promise<{slug:string[]}>}):Promise<Metadata>{const {slug}=await params;const path=slug.join('/');const page=pages[path];return page?pageMetadata(editorialTitles[path]||page.title,page.lead,'/'+path):{title:'Page not found',robots:{index:false}}}
export default async function Page({params}:{params:Promise<{slug:string[]}>}){const {slug}=await params;const path=slug.join('/');const page=pages[path];if(!page)notFound();return <PageContent slug={path} page={page}/>}
