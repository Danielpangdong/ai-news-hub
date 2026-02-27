#!/usr/bin/env node

/**
 * AI 资讯抓取脚本 (带自动翻译)
 * 搜索外网AI资讯，自动翻译成中文，更新 data/news.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

// RSS 源列表
const RSS_SOURCES = [
    {
        name: 'TechCrunch AI',
        url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
        category: 'industry',
        parser: 'rss2',
        lang: 'en'
    },
    {
        name: 'The Verge AI',
        url: 'https://www.theverge.com/artificial-intelligence/rss/index.xml',
        category: 'industry',
        parser: 'rss2',
        lang: 'en'
    },
    {
        name: 'MIT Tech Review',
        url: 'https://www.technologyreview.com/feed/',
        category: 'tech',
        parser: 'rss2',
        lang: 'en'
    },
    {
        name: 'Wired AI',
        url: 'https://www.wired.com/feed/tag/ai/latest/rss',
        category: 'tech',
        parser: 'rss2',
        lang: 'en'
    },
    {
        name: 'Ars Technica AI',
        url: 'https://arstechnica.com/tag/artificial-intelligence/feed/',
        category: 'tech',
        parser: 'rss2',
        lang: 'en'
    }
];

// 关键词标签映射（中英文）
const TAG_MAPPINGS = [
    { keywords: ['OpenAI', 'GPT', 'ChatGPT'], tag: 'OpenAI' },
    { keywords: ['Claude', 'Anthropic'], tag: 'Anthropic' },
    { keywords: ['Google', 'Gemini', 'Bard', 'DeepMind'], tag: 'Google' },
    { keywords: ['Meta', 'Llama', 'Facebook'], tag: 'Meta' },
    { keywords: ['Microsoft', 'Copilot', 'Azure'], tag: 'Microsoft' },
    { keywords: ['NVIDIA', 'GPU', 'H100', 'H200'], tag: 'NVIDIA' },
    { keywords: ['芯片', 'chip', 'semiconductor'], tag: 'AI芯片' },
    { keywords: ['生成式', 'generation', 'diffusion', 'Midjourney', 'DALL-E', 'Stable Diffusion'], tag: 'AIGC' },
    { keywords: ['大模型', 'LLM', 'foundation model', 'large language'], tag: '大模型' },
    { keywords: ['机器人', 'robotics', 'robot'], tag: '机器人' },
    { keywords: ['自动驾驶', 'autonomous', 'self-driving'], tag: '自动驾驶' },
    { keywords: ['医疗', 'healthcare', 'medicine'], tag: 'AI医疗' },
    { keywords: ['融资', 'funding', 'investment'], tag: '融资' },
    { keywords: ['AGI', 'artificial general intelligence'], tag: 'AGI' },
    { keywords: ['监管', 'regulation', 'policy', '法案'], tag: 'AI监管' },
    { keywords: ['编程', 'coding', 'developer', '代码'], tag: 'AI编程' }
];

// 翻译缓存
let translationCache = {};
const CACHE_FILE = path.join(__dirname, '..', 'data', 'translation_cache.json');

// 加载翻译缓存
function loadTranslationCache() {
    try {
        if (fs.existsSync(CACHE_FILE)) {
            translationCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
            console.log(`💾 已加载 ${Object.keys(translationCache).length} 条翻译缓存`);
        }
    } catch (e) {
        translationCache = {};
    }
}

// 保存翻译缓存
function saveTranslationCache() {
    try {
        fs.writeFileSync(CACHE_FILE, JSON.stringify(translationCache, null, 2));
    } catch (e) {
        // 忽略保存错误
    }
}

// 调用 LibreTranslate API (免费开源翻译服务)
async function translateText(text, targetLang = 'zh') {
    if (!text || text.trim().length === 0) return text;
    
    // 检查缓存
    const cacheKey = text.substring(0, 100);
    if (translationCache[cacheKey]) {
        return translationCache[cacheKey];
    }
    
    // 简单的英文检测
    const englishRatio = (text.match(/[a-zA-Z]/g) || []).length / text.length;
    if (englishRatio < 0.3) {
        // 已经是中文为主，无需翻译
        return text;
    }
    
    try {
        // 尝试使用 LibreTranslate 免费实例
        const encodedText = encodeURIComponent(text.substring(0, 500)); // 限制长度
        
        // 可用的免费 LibreTranslate 实例
        const instances = [
            'https://libretranslate.de',
            'https://libretranslate.com',
            'https://translate.argosopentech.com'
        ];
        
        for (const instance of instances) {
            try {
                const response = await new Promise((resolve, reject) => {
                    const req = https.get(
                        `${instance}/translate?q=${encodedText}&source=en&target=${targetLang}&format=text`,
                        { timeout: 8000 },
                        (res) => {
                            let data = '';
                            res.on('data', chunk => data += chunk);
                            res.on('end', () => {
                                try {
                                    resolve(JSON.parse(data));
                                } catch (e) {
                                    reject(e);
                                }
                            });
                        }
                    );
                    req.on('error', reject);
                    req.on('timeout', () => reject(new Error('timeout')));
                });
                
                if (response && response.translatedText) {
                    // 保存到缓存
                    translationCache[cacheKey] = response.translatedText;
                    return response.translatedText;
                }
            } catch (e) {
                continue; // 尝试下一个实例
            }
        }
        
        // 如果在线翻译失败，返回原文并标注
        console.log(`   ⚠️ 翻译失败，保留原文: ${text.substring(0, 50)}...`);
        return text + ' [需翻译]';
        
    } catch (err) {
        return text + ' [需翻译]';
    }
}

// 批量翻译（带重试和限流）
async function translateBatch(texts, concurrency = 2) {
    const results = [];
    const queue = [...texts];
    
    async function processNext() {
        if (queue.length === 0) return;
        const text = queue.shift();
        const translated = await translateText(text);
        results.push(translated);
        await new Promise(r => setTimeout(r, 500)); // 限流
        return processNext();
    }
    
    await Promise.all(Array(concurrency).fill(null).map(processNext));
    return results;
}

// 文章分类器
function classifyArticle(title, summary) {
    const text = (title + ' ' + summary).toLowerCase();
    
    if (/launch|release|announce|introduce|unveils|发布|推出|上线/i.test(text)) {
        return 'product';
    }
    if (/research|breakthrough|study|paper|algorithm|技术|突破|研究|论文/i.test(text)) {
        return 'tech';
    }
    if (/opinion|analysis|view|interview|深度|观点|评论|分析/i.test(text)) {
        return 'opinion';
    }
    return 'industry';
}

// 提取标签
function extractTags(title, summary) {
    const text = title + ' ' + summary;
    const tags = [];
    
    TAG_MAPPINGS.forEach(({ keywords, tag }) => {
        if (keywords.some(kw => text.toLowerCase().includes(kw.toLowerCase()))) {
            if (!tags.includes(tag)) {
                tags.push(tag);
            }
        }
    });
    
    return tags.length > 0 ? tags : ['AI资讯'];
}

// 简单的 RSS 解析器
function parseRSS(xml, source) {
    const items = [];
    const itemRegex = /<item>(.*?)<\/item>/gs;
    const titleRegex = /<title>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/title>/;
    const linkRegex = /<link>(.*?)<\/link>/;
    const descRegex = /<description>(?:<!\[CDATA\[)?(.*?)(?:\]\]>)?<\/description>/s;
    const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;
    
    let match;
    let count = 0;
    
    while ((match = itemRegex.exec(xml)) !== null && count < 5) {
        const itemXml = match[1];
        
        const titleMatch = itemXml.match(titleRegex);
        const linkMatch = itemXml.match(linkRegex);
        const descMatch = itemXml.match(descRegex);
        const dateMatch = itemXml.match(pubDateRegex);
        
        if (titleMatch && linkMatch) {
            const title = cleanText(titleMatch[1]);
            const link = cleanText(linkMatch[1]);
            const description = descMatch ? cleanText(descMatch[1]).replace(/<[^>]*>/g, '').substring(0, 300) : '';
            const pubDate = dateMatch ? new Date(dateMatch[1]) : new Date();
            
            // 只获取最近48小时的内容
            const hoursAgo = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60);
            if (hoursAgo > 48) continue;
            
            items.push({
                title,
                link,
                description,
                pubDate,
                source: source.name,
                sourceCategory: source.category,
                lang: source.lang || 'en'
            });
            count++;
        }
    }
    
    return items;
}

function cleanText(text) {
    return text
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/<[^>]*>/g, '')
        .trim();
}

// 获取 RSS
function fetchRSS(url) {
    return new Promise((resolve, reject) => {
        https.get(url, { timeout: 10000 }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        }).on('error', reject).on('timeout', () => reject(new Error('Timeout')));
    });
}

// 生成 emoji 图标
function getEmoji(title) {
    const emojis = {
        'OpenAI': '🧠', 'GPT': '🤖', 'chatbot': '💬', 'language': '🗣️',
        'image': '🎨', 'vision': '👁️', 'video': '🎬', 'audio': '🎵',
        'chip': '⚡', 'GPU': '🔥', 'hardware': '💻', 'NVIDIA': '🎮',
        'funding': '💰', 'investment': '💵', 'acquisition': '🤝',
        'robot': '🦾', 'robotics': '🤖', 'autonomous': '🚗',
        'health': '🏥', 'medical': '💊', 'drug': '💉',
        'security': '🔒', 'privacy': '👁️‍🗨️', 'regulation': '⚖️',
        'code': '💻', 'developer': '👨‍💻', 'programming': '⌨️',
        'research': '🔬', 'paper': '📄', 'study': '📊',
        'data': '📈', 'analytics': '📉', 'cloud': '☁️'
    };
    
    const lowerTitle = title.toLowerCase();
    for (const [key, emoji] of Object.entries(emojis)) {
        if (lowerTitle.includes(key.toLowerCase())) return emoji;
    }
    return '📰';
}

// 格式化时间
function formatTime(date) {
    const now = new Date();
    const diff = (now - date) / (1000 * 60 * 60);
    
    if (diff < 1) return '刚刚';
    if (diff < 24) return `${Math.floor(diff)}小时前`;
    return `${Math.floor(diff / 24)}天前`;
}

// 主函数
async function main() {
    console.log('🤖 AI 深观察 - 开始抓取资讯...');
    console.log('🌐 自动翻译功能已启用\n');
    
    // 加载翻译缓存
    loadTranslationCache();
    
    const allNews = [];
    
    // 抓取所有源
    for (const source of RSS_SOURCES) {
        try {
            console.log(`📡 抓取: ${source.name}`);
            const xml = await fetchRSS(source.url);
            const items = parseRSS(xml, source);
            
            console.log(`   📝 获取 ${items.length} 条，开始翻译...`);
            
            // 批量翻译标题和摘要
            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                
                // 翻译标题
                const translatedTitle = await translateText(item.title);
                
                // 翻译摘要
                const translatedDesc = await translateText(item.description);
                
                const category = classifyArticle(translatedTitle, translatedDesc);
                const tags = extractTags(translatedTitle, translatedDesc);
                
                allNews.push({
                    id: Date.now() + Math.random(),
                    title: translatedTitle,
                    titleEn: item.title, // 保留英文原文
                    summary: translatedDesc,
                    summaryEn: item.description, // 保留英文原文
                    category,
                    source: item.source,
                    sourceUrl: item.link,
                    url: item.link,
                    image: getEmoji(item.title),
                    date: item.pubDate.toISOString().split('T')[0],
                    time: formatTime(item.pubDate),
                    hot: Math.random() > 0.7,
                    tags,
                    content: translatedDesc + '\n\n（原文链接：' + item.link + '）'
                });
                
                // 显示进度
                process.stdout.write(`   ${i + 1}/${items.length} ✓\r`);
                await new Promise(r => setTimeout(r, 600)); // 翻译限流
            }
            
            console.log(`   ✅ 完成 ${items.length} 条翻译`);
            
            // 延迟避免请求过快
            await new Promise(r => setTimeout(r, 2000));
        } catch (err) {
            console.log(`   ❌ 失败: ${err.message}`);
        }
    }
    
    // 保存翻译缓存
    saveTranslationCache();
    
    // 去重
    const uniqueNews = [];
    const seen = new Set();
    
    allNews.forEach(news => {
        const key = (news.titleEn || news.title).toLowerCase().substring(0, 30);
        if (!seen.has(key)) {
            seen.add(key);
            uniqueNews.push(news);
        }
    });
    
    // 按时间排序
    uniqueNews.sort((a, b) => b.id - a.id);
    
    // 限制数量
    const finalNews = uniqueNews.slice(0, 20);
    
    console.log(`\n📊 汇总: 共 ${finalNews.length} 条资讯`);
    
    if (finalNews.length === 0) {
        console.log('\n⚠️ 未获取到新资讯，可能网络受限或RSS源暂不可用');
        console.log('💡 将保留现有数据');
        return;
    }
    
    // 保存到 JSON 文件
    const dataDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }
    
    const outputPath = path.join(dataDir, 'news.json');
    fs.writeFileSync(outputPath, JSON.stringify(finalNews, null, 2));
    
    console.log(`💾 已保存: ${outputPath}`);
    console.log(`💾 翻译缓存: ${Object.keys(translationCache).length} 条`);
    console.log('\n✅ 抓取完成！');
    
    // 输出摘要
    const byCategory = {};
    finalNews.forEach(n => {
        byCategory[n.category] = (byCategory[n.category] || 0) + 1;
    });
    
    console.log('\n📈 分类统计:');
    Object.entries(byCategory).forEach(([cat, count]) => {
        const catNames = { industry: '行业动态', product: '产品发布', tech: '技术突破', opinion: '深度观点' };
        console.log(`   ${catNames[cat] || cat}: ${count} 条`);
    });
}

main().catch(console.error);
