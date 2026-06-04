import { BlogHero } from "@/components/blog/BlogHero";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { ArticleGrid } from "@/components/blog/ArticleGrid";

export const revalidate = 300; // Revalidate every 5 minutes — blog content changes infrequently

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-[#f8fafc]">
            <BlogHero />
            <FeaturedPost />
            <ArticleGrid />
        </main>
    );
}
