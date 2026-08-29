
/**
 * AI 深观察 - 交互逻辑
 */

// ==========================================
// 数据存储
// ==========================================
let newsData = [];
let currentCategory = 'all';
let searchQuery = '';
let loadError = '';
let lastOpenedItemId = null;

// 模拟新闻数据（实际项目中会从API或JSON文件加载）
const defaultNews = [
    {
        id: 1,
        title: "OpenAI 发布 GPT-5 技术预览：多模态能力大幅提升",
        summary: "OpenAI 今日发布 GPT-5 技术预览版，新模型在图像理解、视频生成和代码编写方面表现显著提升。据悉，GPT-5 在处理复杂推理任务时的准确率比 GPT-4 提高了 40%。",
        category: "tech",
        source: "TechCrunch",
        sourceUrl: "https://techcrunch.com",
        url: "#",
        image: "🧠",
        date: "2026-02-27",
        time: "2小时前",
        hot: true,
        tags: ["OpenAI", "GPT-5", "大模型"],
        content: "OpenAI 今日正式发布了 GPT-5 的技术预览版本，这是继 GPT-4 之后又一次重大升级。据官方介绍，GPT-5 在以下几个方面实现了突破：\n\n1. **多模态理解**：可以同时处理文本、图像、音频和视频输入，实现真正的跨模态理解。\n\n2. **推理能力**：在复杂的逻辑推理任务中，准确率相比 GPT-4 提升了约 40%。\n\n3. **代码生成**：编程能力进一步增强，可以处理更大规模的代码库，并理解复杂的架构设计。\n\n4. **安全性**：引入了新的安全对齐机制，大幅降低了有害输出的概率。\n\nOpenAI 表示，GPT-5 的完整版本预计将在今年第二季度正式向公众开放。"
    },
    {
        id: 2,
        title: "Google DeepMind 新研究：AI 在蛋白质折叠预测上再获突破",
        summary: "DeepMind 团队发表最新研究成果，新一代 AlphaFold 模型能够预测蛋白质与其他分子的相互作用，有望加速新药研发进程。",
        category: "tech",
        source: "MIT Tech Review",
        sourceUrl: "https://www.technologyreview.com",
        url: "#",
        image: "🧬",
        date: "2026-02-27",
        time: "4小时前",
        hot: true,
        tags: ["DeepMind", "AlphaFold", "生物医药"],
        content: "Google DeepMind 团队今日在《自然》杂志上发表了关于 AlphaFold 3 的研究论文。新模型不仅能够预测蛋白质的三维结构，还能够预测蛋白质与其他分子（包括 DNA、RNA 和小分子药物）的相互作用。\n\n这一突破对于药物研发具有重要意义：\n\n- 可以大幅缩短新药发现的时间\n- 降低药物研发成本\n- 帮助科学家理解疾病机制\n\nDeepMind 已将此技术免费开放给全球科研机构使用。"
    },
    {
        id: 3,
        title: "Anthropic 获得 20 亿美元融资，估值突破 600 亿美元",
        summary: "AI 安全公司 Anthropic 宣布完成新一轮融资，由 Google 领投。资金将用于扩大 Claude 模型的计算能力和安全研究。",
        category: "industry",
        source: "The Verge",
        sourceUrl: "https://www.theverge.com",
        url: "#",
        image: "💰",
        date: "2026-02-27",
        time: "6小时前",
        hot: true,
        tags: ["Anthropic", "Claude", "融资"],
        content: "Anthropic 今日宣布完成 20 亿美元的 D 轮融资，公司估值达到 600 亿美元。本轮融资由 Google 领投，原有投资者跟投。\n\nAnthropic 表示，新资金将主要用于：\n\n1. 扩大计算基础设施，提升 Claude 的服务能力\n2. 加强 AI 安全研究，特别是可解释性和对齐技术\n3. 招聘顶尖 AI 研究人才\n4. 拓展国际市场\n\n值得注意的是，Anthropic 与 OpenAI 的竞争日益激烈，两家公司都在争夺企业级 AI 助手市场。"
    },
    {
        id: 4,
        title: "Meta 推出开源大模型 Llama 4：性能超越 GPT-4",
        summary: "Meta 正式发布 Llama 4 系列模型，包含 8B、70B 和 405B 三个版本。最大的 Llama 4 405B 在多项基准测试中超越了 GPT-4。",
        category: "product",
        source: "Ars Technica",
        sourceUrl: "https://arstechnica.com",
        url: "#",
        image: "🦙",
        date: "2026-02-26",
        time: "昨天",
        hot: false,
        tags: ["Meta", "Llama", "开源模型"],
        content: "Meta AI 研究团队今日正式发布了 Llama 4 系列大语言模型。这是 Llama 家族的最新成员，包含三个版本：\n\n- **Llama 4 8B**：轻量级模型，适合边缘设备部署\n- **Llama 4 70B**：平衡性能和效率的中等规模模型\n- **Llama 4 405B**：旗舰模型，参数规模达到 4050 亿\n\n在标准基准测试中，Llama 4 405B 在数学推理、代码生成和多语言理解等任务上均超过了 GPT-4。更重要的是，Meta 继续采用开源策略，所有模型权重均可免费下载用于研究和商业用途。"
    },
    {
        id: 5,
        title: "AI 芯片战争升温：英伟达发布新一代 H200 数据中心 GPU",
        summary: "NVIDIA 在 GTC 大会上发布 H200 GPU，配备 HBM3E 内存，AI 推理性能相比 H100 提升 90%。",
        category: "product",
        source: "Wired",
        sourceUrl: "https://www.wired.com",
        url: "#",
        image: "⚡",
        date: "2026-02-26",
        time: "昨天",
        hot: false,
        tags: ["NVIDIA", "AI芯片", "GPU"],
        content: "在本周的 GTC（GPU 技术大会）上，NVIDIA 首席执行官黄仁勋发布了新一代数据中心 GPU——H200。这款芯片是 H100 的升级版本，主要改进包括：\n\n- 配备 141GB HBM3E 高带宽内存\n- 内存带宽达到 4.8TB/s\n- AI 推理性能相比 H100 提升高达 90%\n- 支持更大的模型和更长的上下文\n\nH200 预计将于今年第三季度开始出货，亚马逊 AWS、谷歌云和微软 Azure 已宣布将成为首批云服务商。"
    },
    {
        id: 6,
        title: "专家观点：AGI 将在 2027 年实现？深度解析技术路线图",
        summary: "知名 AI 研究者在最新论文中提出 AGI 实现时间表，分析了当前技术瓶颈和突破路径。",
        category: "opinion",
        source: "MIT Tech Review",
        sourceUrl: "https://www.technologyreview.com",
        url: "#",
        image: "🎯",
        date: "2026-02-25",
        time: "2天前",
        hot: true,
        tags: ["AGI", "AI发展", "深度分析"],
        content: "在最新的研究论文中，几位顶尖 AI 研究者对 AGI（通用人工智能）的实现时间线进行了深入分析。他们认为，按照当前的技术发展速度，AGI 可能在 2027-2029 年间实现。\n\n关键判断依据：\n\n1. **算力增长**：AI 训练算力每 6-10 个月翻一番\n2. **算法效率**：新架构不断降低训练和推理成本\n3. **数据规模**：合成数据技术突破数据瓶颈\n4. **投资规模**：全球 AI 投资持续快速增长\n\n不过，研究者也指出，AGI 的定义仍存在争议，技术路线图仍有诸多不确定性。"
    },
    {
        id: 7,
        title: "欧盟 AI 法案正式生效：全球首部综合性 AI 监管法律",
        summary: "欧盟《人工智能法案》今日正式生效，对高风险 AI 系统实施严格监管，违规企业最高面临全球营业额 7% 的罚款。",
        category: "industry",
        source: "Ars Technica",
        sourceUrl: "https://arstechnica.com",
        url: "#",
        image: "⚖️",
        date: "2026-02-25",
        time: "2天前",
        hot: false,
        tags: ["欧盟", "AI监管", "法规"],
        content: "欧盟《人工智能法案》（EU AI Act）今日正式生效，这是全球首部针对人工智能的综合性法律框架。该法案将 AI 系统分为四个风险等级：\n\n- **不可接受风险**：禁止使用的 AI 应用（如社会信用评分）\n- **高风险**：需满足严格合规要求（如医疗、招聘领域）\n- **有限风险**：需遵守透明度义务（如聊天机器人）\n- **最小风险**：基本无限制\n\n对于违反规定的企业，最高可面临全球年营业额 7% 或 3500 万欧元的罚款。"
    },
    {
        id: 8,
        title: "Midjourney V7 发布：图像生成质量再次飞跃",
        summary: "Midjourney 发布 V7 版本，新增视频生成功能，图像真实度和提示词理解能力显著提升。",
        category: "product",
        source: "The Verge",
        sourceUrl: "https://www.theverge.com",
        url: "#",
        image: "🎨",
        date: "2026-02-24",
        time: "3天前",
        hot: false,
        tags: ["Midjourney", "AIGC", "图像生成"],
        content: "Midjourney 今日发布了 V7 大版本更新，这是自去年 V6 发布以来的最大升级。V7 版本的主要新特性包括：\n\n1. **视频生成**：用户可以将静态图像转换为 4 秒的短视频\n2. **真实度提升**：人物皮肤纹理、光影效果更加逼真\n3. **提示词理解**：对复杂描述的理解能力大幅增强\n4. **风格控制**：新增多种艺术风格预设\n\nMidjourney V7 现已向所有订阅用户开放。"
    }
];

// 分类映射
const categoryMap = {
    all: '全部',
    industry: '行业动态',
    product: '产品发布',
    tech: '技术突破',
    opinion: '深度观点'
};

// 分类样式
const categoryStyles = {
    industry: 'industry',
    product: 'product',
    tech: 'tech',
    opinion: 'opinion'
};

// ==========================================
// 初始化
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
    initTheme();
    applyCategoryFromHash();
    await initData();
    initEventListeners();
    renderAll();
});

function applyCategoryFromHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash && categoryMap[hash]) {
        currentCategory = hash;
        document.querySelectorAll('.nav-link').forEach((link) => {
            link.classList.toggle('active', link.dataset.category === hash);
        });
    }
}

// 初始化主题
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function newsJsonUrl() {
    return new URL('data/news.json', window.location.href).toString();
}

function normalizeNewsList(payload) {
    if (!Array.isArray(payload)) {
        throw new Error('资讯数据格式无效');
    }
    return payload.filter((item) => item && typeof item.title === 'string' && typeof item.url === 'string');
}

function latestPublishedLabel(list) {
    const timestamps = list
        .map((item) => Date.parse(item.publishedAt || item.date || ''))
        .filter((value) => !Number.isNaN(value));
    if (timestamps.length === 0) {
        return new Date().toLocaleString('zh-CN');
    }
    return new Date(Math.max(...timestamps)).toLocaleString('zh-CN');
}

function applyNewsData(list, sourceLabel) {
    newsData = list;
    loadError = '';
    const updateTime = latestPublishedLabel(list);
    document.getElementById('updateTime').textContent = `更新于：${updateTime}`;
    localStorage.setItem('aiNewsData', JSON.stringify(newsData));
    localStorage.setItem('aiNewsTime', updateTime);
    localStorage.setItem('aiNewsSource', sourceLabel);
}

async function loadNewsFromFile() {
    const response = await fetch(`${newsJsonUrl()}?t=${Date.now()}`, { cache: 'no-store' });
    if (!response.ok) {
        throw new Error(`资讯文件加载失败（${response.status}）`);
    }
    return normalizeNewsList(await response.json());
}

// 初始化数据
async function initData() {
    try {
        const list = await loadNewsFromFile();
        applyNewsData(list, 'file');
        return;
    } catch (error) {
        console.warn('从文件加载失败，尝试本地缓存', error);
    }

    const savedData = localStorage.getItem('aiNewsData');
    const savedTime = localStorage.getItem('aiNewsTime');

    if (savedData) {
        try {
            newsData = normalizeNewsList(JSON.parse(savedData));
            loadError = '正在显示本地缓存，最新源暂不可用';
            document.getElementById('updateTime').textContent = `缓存于：${savedTime || '未知时间'}`;
            return;
        } catch (error) {
            console.warn('缓存损坏', error);
        }
    }

    newsData = defaultNews;
    loadError = '未能加载线上资讯，当前为内置示例';
    document.getElementById('updateTime').textContent = `更新于：${new Date().toLocaleString('zh-CN')}`;
}

// 保存数据到 localStorage
function saveData() {
    localStorage.setItem('aiNewsData', JSON.stringify(newsData));
    localStorage.setItem('aiNewsTime', new Date().toLocaleString('zh-CN'));
}

// 初始化事件监听
function initEventListeners() {
    // 主题切换
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // 刷新按钮
    document.getElementById('refreshBtn').addEventListener('click', refreshData);
    
    // 分类导航
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            setCategory(category);
            
            // 更新活跃状态
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // 搜索
    const searchInput = document.getElementById('searchInput');
    const searchForm = document.getElementById('searchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();
            searchQuery = searchInput.value.trim().toLowerCase();
            renderNewsList();
        });
    }
    searchInput.addEventListener('input', debounce((e) => {
        searchQuery = e.target.value.trim().toLowerCase();
        renderNewsList();
    }, 300));
    
    // 弹窗关闭
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('detailModal').addEventListener('click', (e) => {
        if (e.target.id === 'detailModal') closeModal();
    });
    
    // 语言切换
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            currentModalLang = btn.dataset.lang;
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderModalContent();
        });
    });
    
    // ESC 关闭弹窗
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });
}

// ==========================================
// 渲染函数
// ==========================================
function renderAll() {
    renderNewsList();
    renderTagCloud();
}

// 渲染新闻列表
function renderNewsList() {
    const container = document.getElementById('newsList');
    const emptyState = document.getElementById('emptyState');
    const errorState = document.getElementById('errorState');
    const emptyStateText = document.getElementById('emptyStateText');
    const errorStateText = document.getElementById('errorStateText');

    if (errorState && errorStateText) {
        if (loadError) {
            errorState.style.display = 'block';
            errorStateText.textContent = loadError;
        } else {
            errorState.style.display = 'none';
        }
    }
    
    // 过滤数据
    let filteredData = newsData;
    
    if (currentCategory !== 'all') {
        filteredData = filteredData.filter(item => item.category === currentCategory);
    }
    
    if (searchQuery) {
        filteredData = filteredData.filter(item => {
            const tags = Array.isArray(item.tags) ? item.tags : [];
            return (
                (item.title || '').toLowerCase().includes(searchQuery) ||
                (item.titleEn || '').toLowerCase().includes(searchQuery) ||
                (item.summary || '').toLowerCase().includes(searchQuery) ||
                (item.summaryEn || '').toLowerCase().includes(searchQuery) ||
                tags.some(tag => String(tag).toLowerCase().includes(searchQuery))
            );
        });
    }
    
    // 按热度排序，再按时间
    filteredData.sort((a, b) => {
        if (a.hot !== b.hot) return b.hot ? 1 : -1;
        const timeA = Date.parse(a.publishedAt || a.date || '') || 0;
        const timeB = Date.parse(b.publishedAt || b.date || '') || 0;
        return timeB - timeA;
    });
    
    // 渲染
    if (filteredData.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        if (emptyStateText) {
            emptyStateText.textContent = searchQuery ? '没有匹配的资讯' : '暂无该分类资讯';
        }
        return;
    }
    
    emptyState.style.display = 'none';
    container.innerHTML = filteredData.map(item => createNewsItem(item)).join('');
    
    // 绑定点击事件
    document.querySelectorAll('.news-item').forEach((item, index) => {
        const open = () => showDetail(filteredData[index]);
        item.addEventListener('click', open);
        item.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                open();
            }
        });
    });
}

// 创建新闻项 HTML
function createNewsItem(item) {
    const categoryClass = categoryStyles[item.category] || '';
    const hotBadge = item.hot ? '<span class="news-hot">热门</span>' : '';
    const featuredClass = item.hot ? 'featured' : '';
    const cover = safeHttpUrl(item.cover);
    const fallback = escapeHtml(item.image || '📰');
    const media = cover !== '#'
        ? `<div class="news-image-wrap"><img class="news-image" src="${cover}" alt="" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.hidden=false;"><div class="news-image placeholder" hidden>${fallback}</div></div>`
        : `<div class="news-image placeholder">${fallback}</div>`;
    
    return `
        <article class="news-item ${featuredClass}" data-id="${item.id}" tabindex="0" role="button" aria-label="${escapeHtml(item.title)}">
            ${media}
            <div class="news-content">
                <div class="news-header">
                    <span class="news-category ${categoryClass}">${categoryMap[item.category]}</span>
                    ${hotBadge}
                </div>
                <h2 class="news-title">${escapeHtml(item.title)}</h2>
                <p class="news-summary">${escapeHtml(item.summary)}</p>
                <div class="news-meta">
                    <span class="news-source">${escapeHtml(item.source)}</span>
                    <span>${escapeHtml(relativeTime(item))}</span>
                </div>
            </div>
        </article>
    `;
}

// 渲染标签云
function renderTagCloud() {
    const container = document.getElementById('tagCloud');
    
    // 统计所有标签
    const tagCount = {};
    newsData.forEach(item => {
        const tags = Array.isArray(item.tags) ? item.tags : [];
        tags.forEach(tag => {
            tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
    });
    
    // 排序并取前20个
    const sortedTags = Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20);
    
    // 热门标签（出现次数>1）
    const hotTags = new Set(sortedTags.filter(([, count]) => count > 1).map(([tag]) => tag));
    
    container.innerHTML = sortedTags.map(([tag, count]) => {
        const hotClass = hotTags.has(tag) ? 'hot' : '';
        return `<span class="tag ${hotClass}" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)} (${count})</span>`;
    }).join('');
    
    // 绑定点击事件
    document.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            const tagName = tag.dataset.tag;
            document.getElementById('searchInput').value = tagName;
            searchQuery = tagName.toLowerCase();
            renderNewsList();
            
            // 滚动到新闻列表
            document.querySelector('.news-section').scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ==========================================
// 交互功能
// ==========================================

// 当前弹窗显示的新闻和语言
let currentModalItem = null;
let currentModalLang = 'zh';

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    icon.textContent = theme === 'dark' ? '☀️' : '🌙';
}

function setCategory(category) {
    currentCategory = category;
    if (categoryMap[category]) {
        window.history.replaceState(null, '', `#${category}`);
    }
    renderNewsList();
}

function showDetail(item) {
    currentModalItem = item;
    lastOpenedItemId = item.id;
    currentModalLang = 'zh';
    
    const modal = document.getElementById('detailModal');
    const langToggle = document.getElementById('langToggle');
    
    // 如果有英文原文，显示语言切换按钮
    if (item.titleEn || item.summaryEn) {
        langToggle.style.display = 'flex';
        // 重置按钮状态
        langToggle.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === 'zh');
        });
    } else {
        langToggle.style.display = 'none';
    }
    
    renderModalContent();
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function renderModalContent() {
    const item = currentModalItem;
    const body = document.getElementById('modalBody');
    const categoryClass = categoryStyles[item.category] || '';
    
    // 根据当前语言选择内容
    const isZh = currentModalLang === 'zh';
    const title = isZh ? item.title : (item.titleEn || item.title);
    const content = isZh
        ? (item.content || item.summary || '')
        : (item.summaryEn || item.content || item.summary || '');
    
    // 将内容中的换行转换为段落
    const contentHtml = content
        .split('\n\n')
        .map(p => `<p>${escapeHtml(p).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`)
        .join('');
    
    // 如果有英文，显示翻译提示
    const langTip = (item.titleEn && isZh) ? '<p class="lang-tip">💡 点击下方按钮查看英文原文</p>' : '';
    
    body.innerHTML = `
        <div class="modal-header">
            <span class="modal-category ${categoryClass}">${categoryMap[item.category]}</span>
            <h1 class="modal-title" id="modalTitle">${escapeHtml(title)}</h1>
            <div class="modal-meta">
                <span>来源：${escapeHtml(item.source)}</span>
                <span>${escapeHtml(item.date || '')}</span>
                <span>${escapeHtml(relativeTime(item))}</span>
            </div>
        </div>
        <div class="modal-content-text">
            ${langTip}
            ${contentHtml}
        </div>
        <a href="${safeHttpUrl(item.url)}" class="modal-link" target="_blank" rel="noopener noreferrer">
            阅读原文
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
        </a>
    `;
}

function closeModal() {
    const modal = document.getElementById('detailModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentModalItem = null;
    if (lastOpenedItemId != null) {
        const trigger = document.querySelector(`.news-item[data-id="${lastOpenedItemId}"]`);
        if (trigger) {
            trigger.focus();
        }
    }
}

async function refreshData() {
    const btn = document.getElementById('refreshBtn');
    const loadingState = document.getElementById('loadingState');
    const newsList = document.getElementById('newsList');

    btn.disabled = true;
    btn.style.transform = 'rotate(360deg)';
    btn.style.transition = 'transform 0.6s ease';
    newsList.style.display = 'none';
    loadingState.style.display = 'block';

    try {
        const list = await loadNewsFromFile();
        applyNewsData(list, 'file');
    } catch (error) {
        loadError = error.message || '刷新失败，请稍后重试';
    } finally {
        loadingState.style.display = 'none';
        newsList.style.display = 'flex';
        renderAll();
        btn.disabled = false;
        window.setTimeout(() => {
            btn.style.transform = '';
            btn.style.transition = '';
        }, 300);
    }
}

function relativeTime(item) {
    const timestamp = Date.parse(item.publishedAt || item.date || '');
    if (Number.isNaN(timestamp)) {
        return item.time || '';
    }
    const diffHours = (Date.now() - timestamp) / (1000 * 60 * 60);
    if (diffHours < 1) {
        return '刚刚';
    }
    if (diffHours < 24) {
        return `${Math.floor(diffHours)}小时前`;
    }
    return `${Math.floor(diffHours / 24)}天前`;
}

// ==========================================
// 工具函数
// ==========================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text == null ? '' : String(text);
    return div.innerHTML;
}

function safeHttpUrl(value) {
    try {
        const url = new URL(value, window.location.href);
        if (url.protocol === 'http:' || url.protocol === 'https:') {
            return url.toString();
        }
    } catch {
        return '#';
    }
    return '#';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==========================================
// 数据更新 API（供外部调用）
// ==========================================

/**
 * 更新新闻数据（可由定时任务或外部脚本调用）
 * @param {Array} newData - 新的新闻数据数组
 */
function updateNewsData(newData) {
    newsData = newData;
    saveData();
    renderAll();
    
    // 如果页面是打开状态，可以显示通知
    if (document.visibilityState === 'visible') {
        console.log('🤖 AI 深观察：已更新 ' + newData.length + ' 条资讯');
    }
}

/**
 * 获取当前新闻数据
 */
function getNewsData() {
    return newsData;
}

// 暴露全局 API（供其他脚本使用）
window.AiNewsHub = {
    updateNewsData,
    getNewsData,
    refreshData
};

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(new URL('sw.js', window.location.href)).catch(() => {
            // 离线缓存失败不影响阅读
        });
    });
}
