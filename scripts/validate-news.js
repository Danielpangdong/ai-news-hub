#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const ALLOWED_CATEGORIES = new Set(['industry', 'product', 'tech', 'opinion']);
const NEWS_PATH = path.join(__dirname, '..', 'data', 'news.json');
const STATUS_PATH = path.join(__dirname, '..', 'data', 'status.json');
const MAX_ITEMS = 40;
const MIN_ITEMS = 10;
const MIN_SOURCES = 4;

function fail(message) {
    console.error(`校验失败: ${message}`);
    process.exit(1);
}

function isHttpUrl(value) {
    try {
        const url = new URL(value);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

function isIsoDate(value) {
    return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function main() {
    if (!fs.existsSync(NEWS_PATH)) {
        fail(`找不到 ${NEWS_PATH}`);
    }

    let data;
    try {
        data = JSON.parse(fs.readFileSync(NEWS_PATH, 'utf8'));
    } catch (error) {
        fail(`JSON 无法解析: ${error.message}`);
    }

    if (!Array.isArray(data)) {
        fail('news.json 必须是数组');
    }

    if (data.length < MIN_ITEMS || data.length > MAX_ITEMS) {
        fail(`条目数量应在 ${MIN_ITEMS}-${MAX_ITEMS} 之间，当前 ${data.length}`);
    }

    const ids = new Set();
    const urls = new Set();

    data.forEach((item, index) => {
        const prefix = `第 ${index + 1} 条`;
        if (!item || typeof item !== 'object') {
            fail(`${prefix} 不是对象`);
        }

        const requiredStrings = ['title', 'summary', 'category', 'source', 'url', 'date'];
        requiredStrings.forEach((key) => {
            if (typeof item[key] !== 'string' || item[key].trim().length === 0) {
                fail(`${prefix} 缺少有效字段 ${key}`);
            }
        });

        if (!ALLOWED_CATEGORIES.has(item.category)) {
            fail(`${prefix} 分类非法: ${item.category}`);
        }

        if (!isHttpUrl(item.url)) {
            fail(`${prefix} url 非法: ${item.url}`);
        }

        if (item.sourceUrl && !isHttpUrl(item.sourceUrl)) {
            fail(`${prefix} sourceUrl 非法: ${item.sourceUrl}`);
        }

        if (item.cover && !isHttpUrl(item.cover)) {
            fail(`${prefix} cover 非法: ${item.cover}`);
        }

        if (!isIsoDate(item.date)) {
            fail(`${prefix} date 必须为 YYYY-MM-DD`);
        }

        if (/需翻译|MYMEMORY|¤BRAND_/.test(item.title) || /需翻译/.test(item.summary || '')) {
            fail(`${prefix} 标题或摘要含翻译失败残留`);
        }

        if (!Array.isArray(item.tags) || item.tags.some((tag) => typeof tag !== 'string' || tag.length === 0)) {
            fail(`${prefix} tags 必须是非空字符串数组`);
        }

        if (item.hot != null && typeof item.hot !== 'boolean') {
            fail(`${prefix} hot 必须是布尔值`);
        }

        const idKey = String(item.id);
        if (ids.has(idKey)) {
            fail(`${prefix} id 重复: ${item.id}`);
        }
        ids.add(idKey);

        if (urls.has(item.url)) {
            fail(`${prefix} url 重复: ${item.url}`);
        }
        urls.add(item.url);
    });

    const sourceNames = new Set(data.map((item) => item.source));
    if (sourceNames.size < MIN_SOURCES) {
        fail(`来源种类不足 ${MIN_SOURCES}，当前 ${sourceNames.size}`);
    }

    if (!fs.existsSync(STATUS_PATH)) {
        fail(`找不到 ${STATUS_PATH}`);
    }
    let status;
    try {
        status = JSON.parse(fs.readFileSync(STATUS_PATH, 'utf8'));
    } catch (error) {
        fail(`status.json 无法解析: ${error.message}`);
    }
    if (!status || status.itemCount !== data.length) {
        fail(`status.itemCount 必须等于资讯条数 ${data.length}`);
    }
    if (!Array.isArray(status.sources) || status.sources.length < MIN_SOURCES) {
        fail('status.sources 缺少足够的源记录');
    }

    console.log(`校验通过: ${data.length} 条资讯，${sourceNames.size} 个来源`);
}

main();
