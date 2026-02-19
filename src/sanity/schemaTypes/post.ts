import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'post',
    title: 'Blog Post',
    type: 'document',
    fields: [
        defineField({
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (rule) => rule.required(),
        }),
        defineField({
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        }),
        defineField({
            name: 'heroImage',
            title: 'Hero Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                }
            ]
        }),
        defineField({
            name: 'author',
            title: 'Author',
            type: 'object',
            fields: [
                { name: 'name', type: 'string', title: 'Name' },
                { name: 'role', type: 'string', title: 'Role' },
                { name: 'image', type: 'image', title: 'Avatar' },
            ]
        }),
        defineField({
            name: 'publishedAt',
            title: 'Published at',
            type: 'datetime',
        }),
        defineField({
            name: 'readTime',
            title: 'Read Time',
            type: 'string',
            description: 'e.g. "8 min read"',
        }),
        defineField({
            name: 'category',
            title: 'Category',
            type: 'string',
        }),
        defineField({
            name: 'body',
            title: 'Body',
            type: 'array',
            of: [
                { type: 'block' },
                {
                    type: 'image',
                    options: { hotspot: true },
                    fields: [
                        {
                            name: 'alt',
                            type: 'string',
                            title: 'Alternative Text',
                        },
                        {
                            name: 'caption',
                            type: 'string',
                            title: 'Caption',
                        }
                    ]
                },
                {
                    name: 'callout',
                    title: 'Callout',
                    type: 'object',
                    fields: [
                        { name: 'content', title: 'Content', type: 'text' },
                        { name: 'type', title: 'Type', type: 'string', options: { list: ['info', 'warning', 'tip'] } }
                    ]
                },
                {
                    name: 'quote',
                    title: 'Quote',
                    type: 'object',
                    fields: [
                        { name: 'text', title: 'Text', type: 'text' },
                        { name: 'author', title: 'Author', type: 'string' }
                    ]
                }
            ],
        }),
        defineField({
            name: 'sections',
            title: 'Table of Contents Sections',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'id', title: 'ID', type: 'string' },
                    { name: 'label', title: 'Label', type: 'string' },
                    { name: 'numbered', title: 'Numbered?', type: 'boolean' },
                    { name: 'num', title: 'Number', type: 'number', hidden: ({ parent }) => !parent?.numbered }
                ]
            }]
        }),
    ],
})
