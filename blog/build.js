#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { marked } = require('marked');

// Configuration
const POSTS_DIR = './blog/posts';
const OUTPUT_DIR = './blog';
const TEMPLATE_FILE = './blog/template.html';

// Ensure marked is available
try {
    require.resolve('marked');
} catch (e) {
    console.error('Error: marked package not found. Install it with: npm install marked');
    process.exit(1);
}

// Parse frontmatter from markdown file
function parseFrontmatter(content) {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
        throw new Error('No frontmatter found');
    }
    
    const frontmatter = {};
    const frontmatterContent = match[1];
    const markdownContent = match[2];
    
    // Parse YAML-style frontmatter
    frontmatterContent.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
            const key = line.substring(0, colonIndex).trim();
            const value = line.substring(colonIndex + 1).trim().replace(/^"(.*)"$/, '$1');
            frontmatter[key] = value;
        }
    });
    
    return { frontmatter, content: markdownContent };
}

// Calculate reading time (average 200 words per minute)
function calculateReadingTime(content) {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
}

// Generate HTML from markdown
function generateHTML(markdownFile) {
    console.log(`Processing ${markdownFile}...`);
    
    const filePath = path.join(POSTS_DIR, markdownFile);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    try {
        const { frontmatter, content } = parseFrontmatter(fileContent);
        
        // Configure marked for better code highlighting
        marked.setOptions({
            highlight: function(code, lang) {
                return `<div class="highlight"><code class="language-${lang || 'text'}">${code}</code></div>`;
            },
            breaks: true,
            gfm: true
        });
        
        // Convert markdown to HTML
        const htmlContent = marked(content);
        
        // Load template
        const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
        
        // Calculate reading time if not provided
        const readTime = frontmatter.readTime || calculateReadingTime(content);
        
        // Prepare template data
        const templateData = {
            title: frontmatter.title || 'Untitled',
            description: frontmatter.description || '',
            date: frontmatter.date || new Date().toISOString().split('T')[0],
            readTime: readTime,
            tags: frontmatter.tags || '',
            tagList: frontmatter.tags ? frontmatter.tags.split(',').map(tag => tag.trim()) : [],
            slug: frontmatter.slug || path.basename(markdownFile, '.md'),
            content: htmlContent
        };
        
        // Replace template placeholders
        let finalHTML = template;
        
        // Handle simple replacements
        Object.keys(templateData).forEach(key => {
            if (key !== 'tagList') {
                const regex = new RegExp(`{{${key}}}`, 'g');
                finalHTML = finalHTML.replace(regex, templateData[key]);
            }
        });
        
        // Handle tag list (simple implementation without handlebars)
        const tagListRegex = /{{#each tagList}}[\s\S]*?{{\/each}}/g;
        const tagListMatch = finalHTML.match(tagListRegex);
        if (tagListMatch && templateData.tagList.length > 0) {
            const tagHTML = templateData.tagList.map(tag => 
                `<span class="tag">${tag}</span>`
            ).join('\n                    ');
            
            finalHTML = finalHTML.replace(tagListRegex, tagHTML);
        } else {
            finalHTML = finalHTML.replace(tagListRegex, '');
        }
        
        // Write output file
        const outputFile = path.join(OUTPUT_DIR, `${templateData.slug}.html`);
        fs.writeFileSync(outputFile, finalHTML);
        
        console.log(`✅ Generated ${outputFile}`);
        
        return {
            ...templateData,
            outputFile: `${templateData.slug}.html`
        };
        
    } catch (error) {
        console.error(`❌ Error processing ${markdownFile}:`, error.message);
        return null;
    }
}

// Generate blog index page
function generateIndex(posts) {
    console.log('Generating blog index...');
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const indexHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Technical Blog | Hugh Fitzpatrick</title>
    <meta name="description" content="Technical articles about systems engineering, infrastructure, and software development">
    <link rel="stylesheet" href="../index.html" type="text/css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
        
        :root {
            --terminal-bg: #0d1117;
            --terminal-dark: #010409;
            --terminal-border: #21262d;
            --terminal-text: #c9d1d9;
            --terminal-text-dim: #8b949e;
            --accent-cyan: #39d0d8;
            --card-bg: #161b22;
            --card-border: #30363d;
            --terminal-green: #56d364;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', 'JetBrains Mono', monospace;
            background: var(--terminal-bg);
            color: var(--terminal-text);
            line-height: 1.6;
            min-height: 100vh;
        }

        .container {
            max-width: 900px;
            margin: 0 auto;
            padding: 0 20px;
        }

        header {
            background: var(--terminal-dark);
            border-bottom: 1px solid var(--terminal-border);
            padding: 2rem 0;
            text-align: center;
        }

        .blog-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: var(--terminal-text);
            margin-bottom: 1rem;
        }

        .blog-description {
            font-size: 1.1rem;
            color: var(--terminal-text-dim);
            margin-bottom: 2rem;
        }

        .back-link {
            color: var(--accent-cyan);
            text-decoration: none;
            font-family: 'JetBrains Mono', monospace;
        }

        .back-link::before {
            content: '← ';
            margin-right: 0.3rem;
        }

        .posts {
            padding: 3rem 0;
        }

        .post-card {
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-radius: 8px;
            padding: 2rem;
            margin-bottom: 2rem;
            transition: border-color 0.3s ease;
        }

        .post-card:hover {
            border-color: var(--accent-cyan);
        }

        .post-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--terminal-text);
            margin-bottom: 0.5rem;
        }

        .post-title a {
            color: inherit;
            text-decoration: none;
        }

        .post-title a:hover {
            color: var(--accent-cyan);
        }

        .post-meta {
            display: flex;
            gap: 1rem;
            margin-bottom: 1rem;
            font-size: 0.9rem;
            color: var(--terminal-text-dim);
        }

        .post-description {
            color: var(--terminal-text-dim);
            margin-bottom: 1rem;
            line-height: 1.6;
        }

        .post-tags {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }

        .tag {
            background: rgba(57, 208, 216, 0.1);
            color: var(--accent-cyan);
            padding: 0.2rem 0.6rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-family: 'JetBrains Mono', monospace;
        }

        .read-more {
            color: var(--accent-cyan);
            text-decoration: none;
            font-weight: 500;
            margin-top: 1rem;
            display: inline-block;
        }

        .read-more::after {
            content: ' →';
            margin-left: 0.3rem;
        }

        @media (max-width: 768px) {
            .blog-title {
                font-size: 2rem;
            }
            
            .post-meta {
                flex-direction: column;
                gap: 0.5rem;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <h1 class="blog-title">Technical Blog</h1>
            <p class="blog-description">Articles about systems engineering, infrastructure automation, and software development</p>
            <a href="../index.html" class="back-link">Back to Portfolio</a>
        </div>
    </header>

    <main class="posts">
        <div class="container">
            ${posts.map(post => `
            <article class="post-card">
                <h2 class="post-title">
                    <a href="${post.outputFile}">${post.title}</a>
                </h2>
                <div class="post-meta">
                    <span>📅 ${post.date}</span>
                    <span>⏱️ ${post.readTime} min read</span>
                </div>
                <p class="post-description">${post.description}</p>
                <div class="post-tags">
                    ${post.tagList.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <a href="${post.outputFile}" class="read-more">Read Article</a>
            </article>
            `).join('')}
        </div>
    </main>
</body>
</html>`;

    fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), indexHTML);
    console.log('✅ Generated blog/index.html');
}

// Main function
function main() {
    console.log('🚀 Building blog...\n');
    
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Get all markdown files
    const markdownFiles = fs.readdirSync(POSTS_DIR)
        .filter(file => file.endsWith('.md'));
    
    if (markdownFiles.length === 0) {
        console.log('No markdown files found in', POSTS_DIR);
        return;
    }
    
    // Generate HTML for each post
    const generatedPosts = [];
    for (const file of markdownFiles) {
        const post = generateHTML(file);
        if (post) {
            generatedPosts.push(post);
        }
    }
    
    // Generate index page
    if (generatedPosts.length > 0) {
        generateIndex(generatedPosts);
    }
    
    console.log(`\n✨ Blog build complete! Generated ${generatedPosts.length} posts.`);
    console.log('📂 Files created in:', path.resolve(OUTPUT_DIR));
}

// Run if called directly
if (require.main === module) {
    main();
}

module.exports = { generateHTML, generateIndex, main };
