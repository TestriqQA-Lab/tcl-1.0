import { BlogHero } from "@/components/blog/BlogHero";
import { FeaturedPost } from "@/components/blog/FeaturedPost";
import { ArticleGrid } from "@/components/blog/ArticleGrid";

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-[#f8fafc]">
            <BlogHero />
            <FeaturedPost />
            <ArticleGrid />
        </main>
    );
}
