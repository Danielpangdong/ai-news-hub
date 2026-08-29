#!/usr/bin/env node
'use strict';

/**
 * 从公开 RSS/Atom 源抓取 AI 资讯，写入 data/news.json。
 * 任一源失败不影响其他源；全部失败时保留旧文件并退出 0（避免空部署）。
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const OUTPUT_PATH = path.join(__dirname, '..', 'data', 'news.json');
const CACHE_PATH = path.join(__dirname, '..', 'data', 'translation_cache.json');
const USER_AGENT = 'AINewsHub/1.0 (+https://github.com/Danielpangdong/ai-news-hub)';
const REQUEST_TIMEOUT_MS = 12000;
const MAX_REDIRECTS = 4;
const MAX_ITEMS = 24;
const MAX_AGE_HOURS = 168;
const TRANSLATE_ENABLED = process.env.AI_NEWS_TRANSLATE !== '0';

const RSS_SOURCES = [
    {
        name: 'TechCrunch AI',
        url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
        category: 'industry'
    },
    {
        name: 'The Verge',
        url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml',
        category: 'industry'
    },
    {
        name: 'MIT Technology Review',
        url: 'https://www.technologyreview.com/feed/',
        category: 'tech'
    },
    {
        name: 'Wired',
        url: 'https://www.wired.com/feed/tag/ai/latest/rss',
        category: 'tech'
    },
    {
        name: 'Ars Technica',
        url: 'https://arstechnica.com/tag/ai/feed/',
        category: 'tech'
    }
];

const TAG_MAPPINGS = [
    { keywords: ['openai', 'gpt', 'chatgpt', 'sora'], tag: 'OpenAI' },
    { keywords: ['claude', 'anthropic'], tag: 'Anthropic' },
    { keywords: ['google', 'gemini', 'deepmind', 'alphafold'], tag: 'Google' },
    { keywords: ['meta', 'llama'], tag: 'Meta' },
    { keywords: ['microsoft', 'copilot', 'azure'], tag: 'Microsoft' },
    { keywords: ['nvidia', 'gpu', 'h100', 'h200', 'blackwell'], tag: 'NVIDIA' },
    { keywords: ['chip', 'semiconductor', 'tpu'], tag: 'AI芯片' },
    { keywords: ['midjourney', 'dall-e', 'stable diffusion', 'flux', 'image gen'], tag: 'AIGC' },
    { keywords: ['llm', 'foundation model', 'large language'], tag: '大模型' },
    { keywords: ['robot', 'humanoid'], tag: '机器人' },
    { keywords: ['autonomous', 'self-driving', 'waymo'], tag: '自动驾驶' },
    { keywords: ['health', 'medical', 'drug', 'protein'], tag: 'AI医疗' },
    { keywords: ['funding', 'investment', 'raises', 'valuation'], tag: '融资' },
    { keywords: ['agi', 'artificial general'], tag: 'AGI' },
    { keywords: ['regulation', 'policy', 'act', 'law', 'ban'], tag: 'AI监管' },
    { keywords: ['coding', 'developer', 'github', 'cursor'], tag: 'AI编程' }
];

function decodeEntities(text) {
    return String(text)
        .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&apos;/g, "'")
        .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
        .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
        .trim();
}

function stripHtml(text) {
    return decodeEntities(text)
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function firstMatch(xml, regex) {
    const match = xml.match(regex);
    return match ? decodeEntities(match[1]).trim() : '';
}

function requestText(url, redirectCount = 0) {
    return new Promise((resolve, reject) => {
        if (redirectCount > MAX_REDIRECTS) {
            reject(new Error(`重定向过多: ${url}`));
            return;
        }

        let parsed;
        try {
            parsed = new URL(url);
        } catch (error) {
            reject(new Error(`URL 无效: ${url}`));
            return;
        }

        const client = parsed.protocol === 'http:' ? http : https;
        const req = client.get(url, {
            timeout: REQUEST_TIMEOUT_MS,
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*'
            }
        }, (res) => {
            const status = res.statusCode || 0;
            if (status >= 300 && status < 400 && res.headers.location) {
                const nextUrl = new URL(res.headers.location, url).toString();
                res.resume();
                requestText(nextUrl, redirectCount + 1).then(resolve, reject);
                return;
            }

            if (status >= 400) {
                res.resume();
                reject(new Error(`HTTP ${status}`));
                return;
            }

            const chunks = [];
            res.on('data', (chunk) => chunks.push(chunk));
            res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('请求超时'));
        });
    });
}

function parseFeed(xml, source) {
    const items = [];
    const blocks = [];
    const itemRegex = /<item\b[\s\S]*?<\/item>/gi;
    const entryRegex = /<entry\b[\s\S]*?<\/entry>/gi;
    let match;

    while ((match = itemRegex.exec(xml)) !== null) {
        blocks.push({ type: 'rss', xml: match[0] });
    }
    while ((match = entryRegex.exec(xml)) !== null) {
        blocks.push({ type: 'atom', xml: match[0] });
    }

    for (const block of blocks) {
        const title = firstMatch(block.xml, /<title[^>]*>([\s\S]*?)<\/title>/i);
        const link = block.type === 'atom'
            ? firstMatch(block.xml, /<link[^>]+href=["']([^"']+)["'][^>]*\/?>/i)
            : firstMatch(block.xml, /<link[^>]*>([\s\S]*?)<\/link>/i);
        const rawDesc = firstMatch(block.xml, /<description[^>]*>([\s\S]*?)<\/description>/i)
            || firstMatch(block.xml, /<summary[^>]*>([\s\S]*?)<\/summary>/i)
            || firstMatch(block.xml, /<content[^>]*>([\s\S]*?)<\/content>/i);
        const dateText = firstMatch(block.xml, /<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)
            || firstMatch(block.xml, /<updated[^>]*>([\s\S]*?)<\/updated>/i)
            || firstMatch(block.xml, /<published[^>]*>([\s\S]*?)<\/published>/i);

        if (!title || !link) {
            continue;
        }

        let publishedAt;
        const parsedDate = dateText ? new Date(dateText) : new Date();
        publishedAt = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;

        const ageHours = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
        if (ageHours > MAX_AGE_HOURS) {
            continue;
        }

        items.push({
            title,
            link,
            description: stripHtml(rawDesc).slice(0, 420),
            publishedAt,
            source: source.name,
            sourceCategory: source.category
        });
    }

    return items.slice(0, 8);
}

function classifyArticle(title, summary, fallback) {
    const text = `${title} ${summary}`.toLowerCase();
    if (/launch|release|announce|introduce|unveils|shipping|ga\b/.test(text)) {
        return 'product';
    }
    if (/research|breakthrough|study|paper|algorithm|benchmark|arxiv/.test(text)) {
        return 'tech';
    }
    if (/opinion|analysis|interview|why |how to|commentary|editorial/.test(text)) {
        return 'opinion';
    }
    return fallback || 'industry';
}

function extractTags(title, summary) {
    const text = `${title} ${summary}`.toLowerCase();
    const tags = [];
    TAG_MAPPINGS.forEach(({ keywords, tag }) => {
        if (keywords.some((keyword) => text.includes(keyword)) && !tags.includes(tag)) {
            tags.push(tag);
        }
    });
    return tags.length > 0 ? tags.slice(0, 5) : ['AI资讯'];
}

function getEmoji(title) {
    const lower = title.toLowerCase();
    const table = [
        ['openai', '🧠'], ['gpt', '🤖'], ['claude', '🟣'], ['gemini', '✨'],
        ['nvidia', '⚡'], ['chip', '⚡'], ['gpu', '🔥'], ['robot', '🦾'],
        ['image', '🎨'], ['video', '🎬'], ['funding', '💰'], ['regulation', '⚖️'],
        ['health', '🧬'], ['code', '💻'], ['security', '🔒']
    ];
    for (const [key, emoji] of table) {
        if (lower.includes(key)) {
            return emoji;
        }
    }
    return '📰';
}

function formatTime(date) {
    const diffHours = (Date.now() - date.getTime()) / (1000 * 60 * 60);
    if (diffHours < 1) {
        return '刚刚';
    }
    if (diffHours < 24) {
        return `${Math.floor(diffHours)}小时前`;
    }
    return `${Math.floor(diffHours / 24)}天前`;
}

function loadJson(filePath, fallback) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch {
        return fallback;
    }
    return fallback;
}

function saveJson(filePath, value) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function looksChinese(text) {
    const han = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    return han > 0 && han / Math.max(text.length, 1) > 0.15;
}

async function translateText(text, cache) {
    if (!TRANSLATE_ENABLED || !text || looksChinese(text)) {
        return text;
    }

    const cacheKey = text.slice(0, 180);
    if (cache[cacheKey]) {
        return cache[cacheKey];
    }

    const endpoint = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 400))}&langpair=en|zh-CN`;

    try {
        const raw = await requestText(endpoint);
        const payload = JSON.parse(raw);
        const translated = payload && payload.responseData && payload.responseData.translatedText;
        if (typeof translated === 'string' && translated.trim() && !/MYMEMORY WARNING/i.test(translated)) {
            cache[cacheKey] = translated.trim();
            return cache[cacheKey];
        }
    } catch (error) {
        console.log(`   翻译跳过: ${error.message}`);
    }

    return text;
}

function stableId(url) {
    let hash = 0;
    for (let i = 0; i < url.length; i += 1) {
        hash = ((hash << 5) - hash) + url.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function isHot(item) {
    const ageHours = (Date.now() - item.publishedAt.getTime()) / (1000 * 60 * 60);
    const text = `${item.title} ${item.description}`.toLowerCase();
    const notable = /openai|anthropic|google|nvidia|meta|microsoft|apple|deepmind/.test(text);
    return ageHours < 18 && notable;
}

async function fetchSource(source) {
    console.log(`抓取: ${source.name}`);
    const xml = await requestText(source.url);
    const items = parseFeed(xml, source);
    console.log(`   得到 ${items.length} 条`);
    return items;
}

async function main() {
    console.log('AI 深观察 - 开始抓取\n');
    const translationCache = loadJson(CACHE_PATH, {});
    const existing = loadJson(OUTPUT_PATH, []);
    const collected = [];

    for (const source of RSS_SOURCES) {
        try {
            const items = await fetchSource(source);
            collected.push(...items);
            await new Promise((resolve) => setTimeout(resolve, 400));
        } catch (error) {
            console.log(`   失败: ${error.message}`);
        }
    }

    const unique = [];
    const seenUrls = new Set();
    const seenTitles = new Set();

    collected
        .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
        .forEach((item) => {
            const urlKey = item.link.split('?')[0];
            const titleKey = item.title.toLowerCase().slice(0, 48);
            if (seenUrls.has(urlKey) || seenTitles.has(titleKey)) {
                return;
            }
            seenUrls.add(urlKey);
            seenTitles.add(titleKey);
            unique.push(item);
        });

    const selected = unique.slice(0, MAX_ITEMS);
    if (selected.length === 0) {
        console.log('未抓到新资讯，保留现有 data/news.json');
        if (!Array.isArray(existing) || existing.length === 0) {
            process.exitCode = 1;
        }
        return;
    }

    const news = [];
    for (const item of selected) {
        const titleZh = await translateText(item.title, translationCache);
        const summarySource = item.description || item.title;
        const summaryZh = await translateText(summarySource, translationCache);
        const category = classifyArticle(item.title, item.description, item.sourceCategory);

        news.push({
            id: stableId(item.link),
            title: titleZh,
            titleEn: item.title,
            summary: summaryZh,
            summaryEn: summarySource,
            category,
            source: item.source,
            sourceUrl: item.link,
            url: item.link,
            image: getEmoji(item.title),
            date: item.publishedAt.toISOString().split('T')[0],
            publishedAt: item.publishedAt.toISOString(),
            time: formatTime(item.publishedAt),
            hot: isHot(item),
            tags: extractTags(item.title, item.description),
            content: summaryZh
        });
    }

    saveJson(OUTPUT_PATH, news);
    saveJson(CACHE_PATH, translationCache);

    const byCategory = {};
    news.forEach((item) => {
        byCategory[item.category] = (byCategory[item.category] || 0) + 1;
    });

    console.log(`\n已写入 ${news.length} 条`);
    Object.entries(byCategory).forEach(([category, count]) => {
        console.log(`   ${category}: ${count}`);
    });
}

main().catch((error) => {
    console.error(`抓取异常: ${error.message}`);
    process.exit(1);
});
