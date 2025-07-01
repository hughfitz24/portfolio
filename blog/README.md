# Portfolio Blog CMS

A simple static site generator for technical blog posts, built with Node.js and Markdown.

## Features

- **Markdown to HTML conversion** with frontmatter support
- **Responsive design** matching the portfolio theme
- **Automatic blog index generation** with post previews
- **SEO optimized** with meta tags and Open Graph support
- **Syntax highlighting** for code blocks
- **Reading time calculation** 
- **Tag system** for categorizing posts
- **Social sharing buttons**

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Create a Blog Post

Create a new `.md` file in `blog/posts/`:

```markdown
---
title: "Your Article Title"
description: "Brief description of your article"
date: "2025-01-07"
readTime: 5
tags: "tag1,tag2,tag3"
slug: "your-article-slug"
---

# Your Article Title

Your article content here...
```

### 3. Build the Blog

```bash
npm run build-blog
```

### 4. Preview Locally

```bash
npm run dev
```

Then open http://localhost:8000/blog/ in your browser.

## File Structure

```
portfolio/
├── blog/
│   ├── posts/               # Markdown files
│   │   ├── example-post.md
│   │   └── another-post.md
│   ├── template.html        # Article template
│   ├── build.js            # Static site generator
│   ├── index.html          # Generated blog index
│   └── *.html              # Generated article pages
├── package.json
└── README.md
```

## Frontmatter Options

All blog posts must include frontmatter at the top:

```yaml
---
title: "Article Title"           # Required
description: "Article summary"   # Required (for SEO)
date: "YYYY-MM-DD"              # Required
readTime: 5                     # Optional (auto-calculated)
tags: "tag1,tag2,tag3"          # Optional
slug: "url-slug"                # Optional (auto-generated)
---
```

## Writing Tips

### Code Blocks

Use fenced code blocks with language specification:

```javascript
function example() {
    console.log('Hello world!');
}
```

### Links

- Internal links: `[Portfolio](../index.html)`
- External links: `[GitHub](https://github.com/username)`

### Images

```markdown
![Alt text](./images/screenshot.png)
```

### Tables

| Feature | Status |
|---------|--------|
| Markdown | ✅ |
| Syntax highlighting | ✅ |

## Deployment

### GitHub Pages

1. Build the blog:
   ```bash
   npm run build-blog
   ```

2. Commit and push all files in the `blog/` directory

3. The blog will be available at `https://username.github.io/portfolio/blog/`

### Custom Domain

Update the URLs in `template.html` to match your domain:

```html
<meta property="og:url" content="https://yourdomain.com/blog/{{slug}}.html">
```

## Customization

### Styling

Edit the CSS in `template.html` to customize the appearance. The styles are designed to match the main portfolio theme.

### Template

Modify `template.html` to change the article layout. Available template variables:

- `{{title}}` - Article title
- `{{description}}` - Article description
- `{{date}}` - Publication date
- `{{readTime}}` - Reading time in minutes
- `{{tags}}` - Comma-separated tags
- `{{slug}}` - URL slug
- `{{content}}` - Converted HTML content

### Build Script

The `build.js` script can be extended to add features like:

- RSS feed generation
- Sitemap creation
- Image optimization
- Advanced syntax highlighting

## Example Posts

The system comes with two example posts:

1. **Terraform Enterprise Patterns** - About building scalable infrastructure modules
2. **Java Build Optimization** - About improving Maven build performance

These demonstrate the writing style and technical depth expected for the blog.

## Integration with Main Portfolio

Add a link to your blog in the main portfolio:

```html
<a href="./blog/" class="btn btn-primary">📝 Technical Blog</a>
```

## Performance

The generated blog is optimized for performance:

- **Static HTML** - No server-side processing required
- **Minimal JavaScript** - Only for interactive features
- **Responsive images** - Automatically sized for mobile
- **Fast loading** - Optimized CSS and minimal dependencies

## SEO Features

- Meta descriptions from frontmatter
- Open Graph tags for social sharing
- Structured data (JSON-LD) for articles
- Canonical URLs
- Mobile-friendly design

## Troubleshooting

### "marked package not found"

Install the required dependency:
```bash
npm install marked
```

### Build fails with YAML parsing error

Check your frontmatter syntax - ensure proper formatting:
```yaml
---
title: "Use quotes for titles with special characters"
date: "2025-01-07"
---
```

### Articles not appearing in index

Ensure your markdown files:
1. Are in the `blog/posts/` directory
2. Have the `.md` extension
3. Include valid frontmatter

## Contributing

This is a personal portfolio project, but feel free to fork and adapt for your own use!

## License

MIT License - feel free to use this for your own technical blog.
