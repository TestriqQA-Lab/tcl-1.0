"use client";

import Image from "next/image";
import { PortableText, PortableTextComponents, PortableTextTypeComponentProps } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";

import { slugify } from "@/lib/toc";

/* ───────── Custom Block Components ───────── */

const components: PortableTextComponents = {
    types: {
        image: ({ value }: PortableTextTypeComponentProps<any>) => {
            if (!value?.asset?._ref) return null;
            return (
                <div className="my-10 flex flex-col items-center">
                    <div className="relative w-full max-w-2xl aspect-[16/9] rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <Image
                            src={urlFor(value).width(1200).url()}
                            alt={value.alt || "Blog image"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 800px"
                            quality={100}
                        />
                    </div>
                    {value.caption && (
                        <p className="text-center text-sm text-gray-500 mt-3 italic max-w-lg mx-auto">
                            {value.caption}
                        </p>
                    )}
                </div>
            );
        },
        callout: ({ value }: PortableTextTypeComponentProps<any>) => (
            <div className={`bg-${value.type === 'warning' ? 'red' : 'primary'}/5 border-l-[3px] border-${value.type === 'warning' ? 'red-500' : 'primary'} rounded-r-lg p-5 my-8`}>
                <div className="flex gap-3 items-start">
                    <span className={`material-symbols-outlined text-${value.type === 'warning' ? 'red-500' : 'primary'} text-xl mt-0.5 shrink-0`}>
                        {value.type === 'warning' ? 'warning' : 'lightbulb'}
                    </span>
                    <div className="text-sm text-gray-700 leading-relaxed">{value.content}</div>
                </div>
            </div>
        ),
        quote: ({ value }: PortableTextTypeComponentProps<any>) => (
            <blockquote className="border-l-[3px] border-primary pl-6 py-1 my-10">
                <p className="text-xl sm:text-2xl italic text-gray-800 font-serif leading-relaxed">
                    &ldquo;{value.text}&rdquo;
                </p>
                {value.author && <cite className="block mt-3 text-sm text-gray-400 not-italic">— {value.author}</cite>}
            </blockquote>
        ),
        table: ({ value }: any) => {
            return (
                <div className="my-8 w-full overflow-hidden rounded-lg border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-700">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {value.rows[0].cells.map((cell: string, i: number) => (
                                        <th key={i} className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                                            {cell}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {value.rows.slice(1).map((row: any, i: number) => (
                                    <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                                        {row.cells.map((cell: string, j: number) => (
                                            <td key={j} className="px-6 py-4 whitespace-nowrap">
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        },
    },
    block: {
        h2: ({ children, value }: any) => {
            const text = value.children?.[0]?.text || '';
            const id = slugify(text);
            return (
                <h2 id={id} className="text-3xl font-bold text-gray-900 mt-16 mb-6 pb-4 border-b border-gray-100 scroll-mt-24">
                    {children}
                </h2>
            );
        },
        h3: ({ children }: any) => (
            <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">
                {children}
            </h3>
        ),
        h4: ({ children }: any) => (
            <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                {children}
            </h4>
        ),
        normal: ({ children }: any) => (
            <p className="text-gray-700 leading-relaxed mb-6 last:mb-0">{children}</p>
        ),
        blockquote: ({ children }: any) => (
            <blockquote className="border-l-4 border-gray-200 pl-4 py-1 my-8 italic text-gray-600 bg-gray-50/50 rounded-r-lg">
                {children}
            </blockquote>
        ),
    },
    list: {
        bullet: ({ children }: any) => (
            <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-700 marker:text-gray-400">{children}</ul>
        ),
        number: ({ children }: any) => (
            <ol className="list-decimal pl-6 mb-6 space-y-2 text-gray-700 marker:text-gray-400">{children}</ol>
        ),
    },
    listItem: {
        bullet: ({ children }: any) => <li className="pl-2">{children}</li>,
        number: ({ children }: any) => <li className="pl-2">{children}</li>,
    },
    marks: {
        strong: ({ children }: any) => <strong className="font-bold text-gray-900">{children}</strong>,
        em: ({ children }: any) => <em className="italic text-gray-800">{children}</em>,
        link: ({ children, value }: any) => {
            const rel = !value.href.startsWith('/') ? 'noreferrer noopener' : undefined;
            return (
                <a
                    href={value.href}
                    rel={rel}
                    target={rel ? '_blank' : undefined}
                    className="text-brand font-semibold hover:text-brand/80 underline decoration-brand/30 hover:decoration-brand underline-offset-2 transition-all"
                >
                    {children}
                </a>
            );
        },
    }
};


/* ───────── Main Content ───────── */

interface BlogPostContentProps {
    body: any;
}

export function BlogPostContent({ body }: BlogPostContentProps) {
    if (!body) return null;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/60 p-6 md:p-10 overflow-hidden">
            <div className="max-w-none text-gray-800 leading-relaxed">
                <PortableText value={body} components={components} />
            </div>
        </div>
    );
}
