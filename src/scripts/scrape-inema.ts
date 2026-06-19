/* ==========================================================================
   scrape-inema.ts — Raspa TODOS os cursos e ferramentas do INEMA VIP
   Usa o scraper engine para extrair conteúdo completo de cada URL
   e salva em arquivos JSON individuais + index.json
   ========================================================================== */

import * as fs from 'fs';
import * as path from 'path';
import { scrape } from '../lib/scraper/scraper-engine';
import type { ScrapeResult } from '../lib/scraper/scraper-engine';

// ─── Configuração ───────────────────────────────────────────────────────────

const DATA_DIR = path.resolve(process.cwd(), 'data', 'inema');
const TIMEOUT_MS = 30000;
const CONCURRENCY = 3; // máximo de requisições simultâneas

interface UrlEntry {
  name: string;
  url: string;
  type: 'course' | 'tool';
}

const URLS: UrlEntry[] = [
  // ─── CURSOS (12) ──────────────────────────────────────────────────────
  { name: 'FEP',           url: 'https://inematds.github.io/FEP/',             type: 'course' },
  { name: 'FDF',           url: 'https://inematds.github.io/FDF/',             type: 'course' },
  { name: 'FEA-IA',        url: 'https://inematds.github.io/FEA-IA/',          type: 'course' },
  { name: 'BMAD-Academy',  url: 'https://inematds.github.io/BMAD-Academy/',    type: 'course' },
  { name: 'CLI-x',         url: 'https://inematds.github.io/CLI-x/',           type: 'course' },
  { name: 'deerflow',      url: 'https://inematds.github.io/deerflow/',        type: 'course' },
  { name: '6pilarccb',     url: 'https://inematds.github.io/6pilarccb/',       type: 'course' },
  { name: 'multiagentes',  url: 'https://inematds.github.io/multiagentes/',    type: 'course' },
  { name: 'ccguide2026',   url: 'https://inematds.github.io/ccguide2026/',     type: 'course' },
  { name: 'aiosagi',       url: 'https://inematds.github.io/aiosagi/',         type: 'course' },
  { name: 'claudecode-manual', url: 'https://github.com/inematds/claudecode-manual', type: 'course' },
  { name: 'remotion-skills',   url: 'https://github.com/inematds/remotion-skills',   type: 'course' },

  // ─── FERRAMENTAS (13) ─────────────────────────────────────────────────
  { name: 'intelecto',         url: 'https://github.com/inematds/intelecto',           type: 'tool' },
  { name: 'nanobot',           url: 'https://github.com/inematds/nanobot',             type: 'tool' },
  { name: 'nm82',              url: 'https://github.com/inematds/nm82',                type: 'tool' },
  { name: 'whatsapp-agentkit', url: 'https://github.com/inematds/whatsapp-agentkit',   type: 'tool' },
  { name: 'APIPXINTER',        url: 'https://github.com/inematds/APIPXINTER',          type: 'tool' },
  { name: 'yt-pub-livesx',     url: 'https://github.com/inematds/yt-pub-livesx',       type: 'tool' },
  { name: 'inemavox',          url: 'https://github.com/inematds/inemavox',             type: 'tool' },
  { name: 'ai-strategy-factory', url: 'https://github.com/inematds/ai-strategy-factory', type: 'tool' },
  { name: 'docker-moltbot',    url: 'https://github.com/inematds/docker-moltbot',       type: 'tool' },
  { name: 'docker-clawdbot',   url: 'https://github.com/inematds/docker-clawdbot',      type: 'tool' },
  { name: 'lk_agente_v3',      url: 'https://github.com/inematds/lk_agente_v3',         type: 'tool' },
  { name: 'openpcbot',         url: 'https://github.com/inematds/openpcbot',             type: 'tool' },
  { name: 'GIPM',              url: 'https://github.com/inematds/GIPM',                  type: 'tool' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

function sanitizeName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '');
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

function getStatusEmoji(result: ScrapeResult): string {
  if (result.error) return '❌';
  if (result.statusCode && result.statusCode >= 400) return '⚠️';
  return '✅';
}

function truncate(text: string, maxLen: number): string {
  if (!text) return '';
  return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
}

// ─── Raspagem com controle de concorrência ────────────────────────────────

async function scrapeWithRetry(entry: UrlEntry, maxRetries = 2): Promise<ScrapeResult> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[${attempt}/${maxRetries}] Raspando ${entry.name} — ${entry.url}`);
      const result = await scrape({
        url: entry.url,
        depth: 1,
        timeout: TIMEOUT_MS,
        extractImages: true,
        extractLinks: true,
        toMarkdown: true,
      });
      if (!result.error && result.statusCode && result.statusCode < 400) {
        return result;
      }
      // Se deu erro e ainda tem retry, espera e tenta de novo
      if (attempt < maxRetries) {
        const wait = attempt * 2000;
        console.log(`  ⏳ Erro: ${result.error || `HTTP ${result.statusCode}`}. Tentando novamente em ${wait}ms...`);
        await new Promise(r => setTimeout(r, wait));
      } else {
        return result;
      }
    } catch (err) {
      if (attempt < maxRetries) {
        const wait = attempt * 2000;
        console.log(`  ⏳ Exceção: ${err}. Tentando novamente em ${wait}ms...`);
        await new Promise(r => setTimeout(r, wait));
      } else {
        const result: ScrapeResult = {
          url: entry.url,
          title: '',
          description: '',
          markdown: '',
          techStack: { framework: null, cssFramework: null, cms: null, hosting: null, analytics: [], outros: [], versoes: {} },
          headings: [],
          images: [],
          links: [],
          metadata: { title: '', description: '' },
          wordCount: 0,
          duration: 0,
          depth: 1,
          error: err instanceof Error ? err.message : String(err),
        };
        return result;
      }
    }
  }
  // Should not reach here
  throw new Error('Unexpected exit from scrapeWithRetry');
}

// ─── Processamento em lotes ─────────────────────────────────────────────────

async function processBatch(items: UrlEntry[]): Promise<Map<string, ScrapeResult>> {
  const results = new Map<string, ScrapeResult>();
  const total = items.length;
  let completed = 0;

  // Processa em lotes de CONCURRENCY
  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.allSettled(
      batch.map(entry => scrapeWithRetry(entry))
    );

    for (let j = 0; j < batch.length; j++) {
      const entry = batch[j];
      const settled = batchResults[j];
      if (settled.status === 'fulfilled') {
        results.set(entry.name, settled.value);
      } else {
        const result: ScrapeResult = {
          url: entry.url,
          title: '',
          description: '',
          markdown: '',
          techStack: { framework: null, cssFramework: null, cms: null, hosting: null, analytics: [], outros: [], versoes: {} },
          headings: [],
          images: [],
          links: [],
          metadata: { title: '', description: '' },
          wordCount: 0,
          duration: 0,
          depth: 1,
          error: settled.reason instanceof Error ? settled.reason.message : String(settled.reason),
        };
        results.set(entry.name, result);
      }
      completed++;
      const result = results.get(entry.name)!;
      const emoji = getStatusEmoji(result);
      console.log(`[${completed}/${total}] ${emoji} ${entry.name} — ${result.title || '(sem título)'} — ${formatDuration(result.duration)}`);
    }
  }

  return results;
}

// ─── Salvar resultados ──────────────────────────────────────────────────────

function saveResults(results: Map<string, ScrapeResult>, entries: UrlEntry[]) {
  // Garantir que o diretório existe
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const summary: Array<{
    name: string;
    type: string;
    url: string;
    title: string;
    description: string;
    error: string | null;
    statusCode: number | null;
    wordCount: number;
    duration: number;
    headingsCount: number;
    linksCount: number;
    imagesCount: number;
    techStack: string[];
  }> = [];

  // Salvar arquivos individuais
  for (const entry of entries) {
    const result = results.get(entry.name);
    if (!result) continue;

    const fileName = sanitizeName(entry.name) + '.json';
    const filePath = path.join(DATA_DIR, fileName);

    // Salvar resultado completo (sem rawHtml para economizar espaço)
    const { rawHtml, ...data } = result;
    fs.writeFileSync(filePath, JSON.stringify({ ...data, name: entry.name, type: entry.type }, null, 2), 'utf-8');

    // Extrair tech stack como array legível
    const ts = result.techStack;
    const techList: string[] = [];
    if (ts.framework) techList.push(ts.framework);
    if (ts.cssFramework) techList.push(ts.cssFramework);
    if (ts.cms) techList.push(ts.cms);
    if (ts.hosting) techList.push(ts.hosting);
    techList.push(...ts.analytics);
    techList.push(...ts.outros);

    summary.push({
      name: entry.name,
      type: entry.type,
      url: entry.url,
      title: result.title,
      description: truncate(result.description, 200),
      error: result.error || null,
      statusCode: result.statusCode || null,
      wordCount: result.wordCount,
      duration: result.duration,
      headingsCount: result.headings.length,
      linksCount: result.links.length,
      imagesCount: result.images.length,
      techStack: techList,
    });
  }

  // Salvar index.json
  const indexData = {
    meta: {
      totalItems: entries.length,
      totalCourses: entries.filter(e => e.type === 'course').length,
      totalTools: entries.filter(e => e.type === 'tool').length,
      scrapedAt: new Date().toISOString(),
      dataDirectory: DATA_DIR,
    },
    items: summary,
  };

  const indexPath = path.join(DATA_DIR, 'index.json');
  fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2), 'utf-8');

  console.log(`\n📁 Index salvo: ${indexPath}`);
  console.log(`📦 Total de arquivos: ${summary.length}`);
}

// ─── Relatório Final ────────────────────────────────────────────────────────

function printReport(results: Map<string, ScrapeResult>, entries: UrlEntry[]) {
  const successful = entries.filter(e => {
    const r = results.get(e.name);
    return r && !r.error;
  }).length;
  const failed = entries.length - successful;

  console.log('\n' + '='.repeat(70));
  console.log('📊 RELATÓRIO FINAL — INEMA VIP SCRAPER');
  console.log('='.repeat(70));
  console.log(`Total de URLs:     ${entries.length}`);
  console.log(`  📚 Cursos:       ${entries.filter(e => e.type === 'course').length}`);
  console.log(`  🛠️  Ferramentas: ${entries.filter(e => e.type === 'tool').length}`);
  console.log(`✅ Sucesso:         ${successful}`);
  console.log(`❌ Falhas:          ${failed}`);
  console.log('');

  if (failed > 0) {
    console.log('❌ URLs com erro:');
    for (const entry of entries) {
      const r = results.get(entry.name);
      if (r && r.error) {
        console.log(`   ${entry.name.padEnd(20)} — ${truncate(r.error, 100)}`);
      }
    }
    console.log('');
  }

  // Estatísticas
  const durations = entries.map(e => results.get(e.name)?.duration || 0).filter(d => d > 0);
  const wordCounts = entries.map(e => results.get(e.name)?.wordCount || 0).filter(w => w > 0);
  const totalDuration = durations.reduce((a, b) => a + b, 0);

  console.log('⏱️  Tempo total de scraping: ' + formatDuration(totalDuration));
  if (durations.length > 0) {
    const avg = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
    console.log(`⏱️  Média por URL:           ${formatDuration(avg)}`);
  }
  if (wordCounts.length > 0) {
    const totalWords = wordCounts.reduce((a, b) => a + b, 0);
    console.log(`📝 Total de palavras:       ${totalWords.toLocaleString()}`);
    console.log(`📝 Média por URL:           ${Math.round(totalWords / wordCounts.length).toLocaleString()}`);
  }

  console.log('='.repeat(70));

  // Tabela resumo
  console.log('\n📋 RESUMO POR ITEM:');
  console.log('-'.repeat(70));
  console.log('  Nome'.padEnd(22) + 'Tipo'.padEnd(10) + 'Status'.padEnd(8) + 'Palavras'.padEnd(10) + 'Tempo');
  console.log('-'.repeat(70));

  for (const entry of entries) {
    const r = results.get(entry.name);
    if (!r) continue;
    const emoji = getStatusEmoji(r);
    const status = r.error ? '❌ Erro' : `${emoji} OK`;
    const words = r.wordCount ? r.wordCount.toLocaleString().padStart(7) : '      -';
    const dur = r.duration ? formatDuration(r.duration).padStart(8) : '       -';
    console.log(`  ${entry.name.padEnd(20)} ${entry.type.padEnd(8)} ${status.padEnd(8)} ${words}  ${dur}`);
  }

  console.log('-'.repeat(70));
  console.log(`\n📁 Dados salvos em: ${DATA_DIR}`);
}

// ─── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('');
  console.log('╔' + '═'.repeat(68) + '╗');
  console.log('║  🚀 INEMA VIP SCRAPER — Raspando 12 cursos + 13 ferramentas  ║');
  console.log('╚' + '═'.repeat(68) + '╝');
  console.log('');
  console.log(`📂 Diretório de saída: ${DATA_DIR}`);
  console.log(`⏱️  Timeout: ${TIMEOUT_MS}ms`);
  console.log(`🔄 Concorrência: ${CONCURRENCY} URLs simultâneas`);
  console.log('');

  const startTime = Date.now();

  // 1. Raspar todas as URLs
  console.log('🔍 INICIANDO RASPAGEM...\n');
  const results = await processBatch(URLS);

  // 2. Salvar resultados
  console.log('\n💾 SALVANDO RESULTADOS...\n');
  saveResults(results, URLS);

  // 3. Relatório
  printReport(results, URLS);

  const totalWallTime = Date.now() - startTime;
  console.log(`\n⏱️  Tempo total decorrido: ${formatDuration(totalWallTime)}`);
  console.log('✅ SCRAPING CONCLUÍDO!\n');
}

main().catch(err => {
  console.error('❌ Erro fatal no script:', err);
  process.exit(1);
});
