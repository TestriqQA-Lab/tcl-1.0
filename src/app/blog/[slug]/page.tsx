import { Metadata } from "next";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { postQuery, postSlugsQuery, relatedPostsQuery } from "@/sanity/lib/queries";
import { BlogPostHeader } from "@/components/blog/post/BlogPostHeader";
import { BlogPostContent } from "@/components/blog/post/BlogPostContent";
import { TableOfContents } from "@/components/blog/post/TableOfContents";
import { RelatedPosts } from "@/components/blog/post/RelatedPosts";
import { extractTableOfContents } from "@/lib/toc";
import { ShareArticle } from "@/components/blog/post/ShareArticle";

// Enable static generation for all posts
export async function generateStaticParams() {
    const slugs = await client.fetch(postSlugsQuery);
    return slugs.map((slug: string) => ({ slug }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await client.fetch(postQuery, { slug });

    if (!post) {
        return {
            title: "Post Not Found",
        };
    }

    return {
        title: `${post.title} | The Career Lab`,
        description: post.description,
        openGraph: {
            images: post.heroImage ? [post.heroImage] : [],
        },
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Fetch post and related posts in parallel
    const [post, relatedPosts] = await Promise.all([
        client.fetch(postQuery, { slug }),
        client.fetch(relatedPostsQuery, { slug })
    ]);

    if (!post) {
        notFound();
    }

    // Automatically generate TOC from content
    const sections = extractTableOfContents(post.body);

    return (
        <article className="py-8 lg:py-12 max-w-7xl mx-auto">
            <BlogPostHeader
                title={post.title}
                description={post.description}
                author={post.author}
                publishedAt={post.publishedAt}
                readTime={post.readTime}
                heroImage={post.heroImage}
            />

            {/* Two-column layout: Content + Sidebar (TOC + Related) */}
            <div className="flex flex-col lg:flex-row gap-10 lg:gap-16">
                {/* Main content */}
                <div className="flex-1 min-w-0">
                    <ShareArticle title={post.title} slug={slug} />
                    <BlogPostContent body={post.body} />
                </div>

                {/* Right sidebar: TOC + Related Posts — sticky together */}
                <div className="hidden lg:flex flex-col gap-8 w-full max-w-[260px] shrink-0 sticky top-24 self-start">
                    <TableOfContents sections={sections} />
                    <RelatedPosts posts={relatedPosts} />
                </div>
            </div>

            {/* Mobile: Related Posts below content */}
            <div className="lg:hidden">
                <RelatedPosts posts={relatedPosts} />
            </div>
        </article>
    );
}
