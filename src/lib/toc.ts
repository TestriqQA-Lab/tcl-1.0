
export interface TOCSection {
    id: string;
    label: string;
    level: number; // 2 for h2, 3 for h3
    numbered?: boolean;
    num?: number;
}

export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-');    // Replace multiple - with single -
}

export function extractTableOfContents(blocks: any[]): TOCSection[] {
    if (!blocks || !Array.isArray(blocks)) return [];

    const sections: TOCSection[] = [];
    let sectionCount = 0;

    blocks.forEach((block) => {
        if (block._type === 'block' && block.style === 'h2') {
            const text = block.children?.map((child: any) => child.text).join('') || '';
            if (text) {
                sectionCount++;
                sections.push({
                    id: slugify(text),
                    label: text,
                    level: 2,
                    numbered: true,
                    num: sectionCount
                });
            }
        }
        // Add h3 support if needed later, for now just H2 as per original design
    });

    return sections;
}
