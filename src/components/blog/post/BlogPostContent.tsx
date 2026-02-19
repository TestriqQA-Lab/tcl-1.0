"use client";

import Image from "next/image";
import { PortableText, PortableTextComponents, PortableTextTypeComponentProps } from "@portabletext/react";
import { urlFor } from "@/sanity/lib/image";

/* ───────── Custom Block Components ───────── */

const components: PortableTextComponents = {
    types: {
        image: ({ value }: PortableTextTypeComponentProps<any>) => {
            if (!value?.asset?._ref) return null;
            return (
                <div className="my-10 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    <div className="relative w-full aspect-[16/9]">
                        <Image
                            src={urlFor(value).url()}
                            alt={value.alt || "Blog image"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 800px"
                        />
                    </div>
                    {value.caption && (
                        <p className="text-center text-xs text-gray-400 py-3 italic">
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
    },
    block: {
        h2: ({ children, value }: any) => {
            const id = value.children?.[0]?.text?.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `section-${Math.random().toString(36).substr(2, 9)}`;
            return (
                <h2 id={id} className="text-2xl font-bold text-gray-900 mt-12 mb-4 scroll-mt-24">
                    {children}
                </h2>
            );
        },
        normal: ({ children }: any) => (
            <p className="text-gray-700 leading-relaxed mb-6">{children}</p>
        ),
    },
    marks: {
        strong: ({ children }: any) => <strong className="font-bold text-gray-900">{children}</strong>,
        em: ({ children }: any) => <em className="italic text-gray-800">{children}</em>,
    }
};


/* ───────── Main Content ───────── */

interface BlogPostContentProps {
    body: any;
}

export function BlogPostContent({ body }: BlogPostContentProps) {
    if (!body) return null;

    return (
        <div className="max-w-none">
            <PortableText value={body} components={components} />
        </div>
    );
}
