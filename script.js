
/**
 * AI 深观察 - 交互逻辑
 */

// ==========================================
// 数据存储
// ==========================================
let newsData = [];
let currentCategory = 'all';
let searchQuery = '';

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
    await initData();
    initEventListeners();
    renderAll();
});

// 初始化主题
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// 初始化数据
async function initData() {
    // 优先从 data/news.json 加载数据
    try {
        const response = await fetch('data/news.json');
        if (response.ok) {
            newsData = await response.json();
            const updateTime = new Date().toLocaleString('zh-CN');
            document.getElementById('updateTime').textContent = `更新于：${updateTime}`;
            localStorage.setItem('aiNewsData', JSON.stringify(newsData));
            localStorage.setItem('aiNewsTime', updateTime);
            return;
        }
    } catch (e) {
        console.log('从文件加载失败，使用缓存或默认数据');
    }
    
    // 如果文件加载失败，尝试从 localStorage 加载
    const savedData = localStorage.getItem('aiNewsData');
    const savedTime = localStorage.getItem('aiNewsTime');
    
    if (savedData) {
        try {
            newsData = JSON.parse(savedData);
        } catch (e) {
            newsData = defaultNews;
        }
    } else {
        newsData = defaultNews;
        saveData();
    }
    
    // 更新显示时间
    if (savedTime) {
        document.getElementById('updateTime').textContent = `更新于：${savedTime}`;
    } else {
        document.getElementById('updateTime').textContent = `更新于：${new Date().toLocaleString('zh-CN')}`;
    }
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
    searchInput.addEventListener('input', debounce((e) => {
        searchQuery = e.target.value.toLowerCase();
        renderNewsList();
    }, 300));
    
    // 弹窗关闭
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('detailModal').addEventListener('click', (e) => {
        if (e.target.id === 'detailModal') closeModal();
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
    
    // 过滤数据
    let filteredData = newsData;
    
    if (currentCategory !== 'all') {
        filteredData = filteredData.filter(item => item.category === currentCategory);
    }
    
    if (searchQuery) {
        filteredData = filteredData.filter(item => 
            item.title.toLowerCase().includes(searchQuery) ||
            item.summary.toLowerCase().includes(searchQuery) ||
            item.tags.some(tag => tag.toLowerCase().includes(searchQuery))
        );
    }
    
    // 按热度排序，再按时间
    filteredData.sort((a, b) => {
        if (a.hot !== b.hot) return b.hot ? 1 : -1;
        return b.id - a.id;
    });
    
    // 渲染
    if (filteredData.length === 0) {
        container.innerHTML = '';
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    container.innerHTML = filteredData.map(item => createNewsItem(item)).join('');
    
    // 绑定点击事件
    document.querySelectorAll('.news-item').forEach((item, index) => {
        item.addEventListener('click', () => showDetail(filteredData[index]));
    });
}

// 创建新闻项 HTML
function createNewsItem(item) {
    const categoryClass = categoryStyles[item.category] || '';
    const hotBadge = item.hot ? '<span class="news-hot">热门</span>' : '';
    const featuredClass = item.hot ? 'featured' : '';
    
    return `
        <article class="news-item ${featuredClass}" data-id="${item.id}">
            <div class="news-image placeholder">${item.image}</div>
            <div class="news-content">
                <div class="news-header">
                    <span class="news-category ${categoryClass}">${categoryMap[item.category]}</span>
                    ${hotBadge}
                </div>
                <h2 class="news-title">${escapeHtml(item.title)}</h2>
                <p class="news-summary">${escapeHtml(item.summary)}</p>
                <div class="news-meta">
                    <span class="news-source">${item.source}</span>
                    <span>${item.time}</span>
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
        item.tags.forEach(tag => {
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
    renderNewsList();
}

function showDetail(item) {
    const modal = document.getElementById('detailModal');
    const body = document.getElementById('modalBody');
    const categoryClass = categoryStyles[item.category] || '';
    
    // 将内容中的换行转换为段落
    const contentHtml = item.content
        .split('\n\n')
        .map(p => `<p>${escapeHtml(p).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`)
        .join('');
    
    body.innerHTML = `
        <div class="modal-header">
            <span class="modal-category ${categoryClass}">${categoryMap[item.category]}</span>
            <h1 class="modal-title">${escapeHtml(item.title)}</h1>
            <div class="modal-meta">
                <span>来源：${item.source}</span>
                <span>${item.date}</span>
                <span>${item.time}</span>
            </div>
        </div>
        <div class="modal-content-text">
            ${contentHtml}
        </div>
        <a href="${item.url}" class="modal-link" target="_blank" rel="noopener">
            阅读原文
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
        </a>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('detailModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function refreshData() {
    const btn = document.getElementById('refreshBtn');
    const loadingState = document.getElementById('loadingState');
    const newsList = document.getElementById('newsList');
    
    // 旋转动画
    btn.style.transform = 'rotate(360deg)';
    btn.style.transition = 'transform 0.6s ease';
    
    // 显示加载状态
    newsList.style.display = 'none';
    loadingState.style.display = 'block';
    
    // 模拟异步加载（实际项目中这里会请求API或fetch JSON文件）
    setTimeout(() => {
        // 这里可以添加实际的数据获取逻辑
        // 比如：fetch('data/news.json').then(...)
        
        // 模拟获取到一些新数据
        const newNews = generateMockNews();
        newsData = [...newNews, ...newsData].slice(0, 20); // 保留最新20条
        
        saveData();
        
        document.getElementById('updateTime').textContent = `更新于：${new Date().toLocaleString('zh-CN')}`;
        
        loadingState.style.display = 'none';
        newsList.style.display = 'flex';
        renderAll();
        
        // 恢复按钮
        setTimeout(() => {
            btn.style.transform = '';
            btn.style.transition = '';
        }, 300);
    }, 1500);
}

// 生成模拟新闻（实际项目中会替换为真实数据）
function generateMockNews() {
    const templates = [
        {
            title: "Stability AI 发布 Stable Diffusion 4：生成速度提升 3 倍",
            category: "product",
            source: "TechCrunch",
            image: "🖼️",
            tags: ["Stability AI", "图像生成", "开源"]
        },
        {
            title: "微软 Copilot 月活用户突破 2 亿，企业版增长迅猛",
            category: "industry",
            source: "The Verge",
            image: "📈",
            tags: ["微软", "Copilot", "生产力工具"]
        },
        {
            title: "研究表明：AI 编程助手可将开发效率提升 55%",
            category: "tech",
            source: "MIT Tech Review",
            image: "💻",
            tags: ["AI编程", "效率研究", "开发者工具"]
        }
    ];
    
    const now = new Date();
    return templates.map((template, index) => ({
        id: Date.now() + index,
        title: template.title,
        summary: `这是关于${template.title}的摘要描述，在实际项目中这里会显示真实的摘要内容...`,
        category: template.category,
        source: template.source,
        sourceUrl: "#",
        url: "#",
        image: template.image,
        date: now.toISOString().split('T')[0],
        time: "刚刚",
        hot: Math.random() > 0.7,
        tags: template.tags,
        content: `${template.title}的详细内容...在实际项目中这里会显示完整的文章内容。`
    }));
}

// ==========================================
// 工具函数
// ==========================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
