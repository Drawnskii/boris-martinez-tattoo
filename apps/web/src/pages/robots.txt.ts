import type { APIRoute } from 'astro';
import { BASE_URL } from '@config/site';

// Posture: OPEN — maximum visibility in search and generative engines.
// Search, AI retrieval (RAG/grounding), and AI training are all allowed.
// To switch to "visibility-only" (block training, keep citations), flip the
// training-bot groups below from `Allow: /` to `Disallow: /` and set
// Content-Signal `ai-train=no`.
const REVIEWED = '2026-09-19';

const SEARCH_BOTS = ['Googlebot', 'Bingbot', 'DuckDuckBot', 'Applebot', 'YandexBot', 'Baiduspider'];

const RETRIEVAL_BOTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Amzn-SearchBot',
  'Amzn-User',
  'DuckAssistBot',
  'MistralAI-User',
];

const TRAINING_BOTS = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
  'Meta-ExternalAgent',
  'meta-externalfetcher',
  'Bytespider',
  'CCBot',
  'Amazonbot',
  'cohere-ai',
  'AI2Bot',
  'DeepSeekBot',
];

const group = (bots: string[]) =>
  bots.flatMap((bot) => [`User-agent: ${bot}`, 'Allow: /', '']).join('\n');

const CONTENT_SIGNALS_POLICY = `# As a condition of accessing this website, you agree to abide by the following content signals:
# (a) If a content-signal = yes, you may collect content for the corresponding use.
# (b) If a content-signal = no, you may not collect content for the corresponding use.
# (c) If the website operator does not include a content signal for a corresponding use, the website operator neither grants nor restricts permission via content signal with respect to the corresponding use.
# The content signals and their meanings are:
# search: building a search index and providing search results (e.g., returning hyperlinks and short excerpts from your website's contents). Search does not include providing AI-generated search summaries.
# ai-input: inputting content into one or more AI models (e.g., retrieval augmented generation, grounding, or other real-time taking of content for generative AI search answers).
# ai-train: training or fine-tuning AI models.
# ANY RESTRICTIONS EXPRESSED VIA CONTENT SIGNALS ARE EXPRESS RESERVATIONS OF RIGHTS UNDER ARTICLE 4 OF THE EUROPEAN UNION DIRECTIVE 2019/790 ON COPYRIGHT AND RELATED RIGHTS IN THE DIGITAL SINGLE MARKET.`;

export const GET: APIRoute = ({ site }) => {
  const origin = site ?? new URL('http://localhost:4321');
  const sitemap = new URL(`${BASE_URL}/sitemap.xml`, origin).href;

  const body = `# =============================================================
# robots.txt — Boris Martínez Tattoo
# Posture: OPEN (search + AI retrieval + AI training all allowed)
# Reviewed: ${REVIEWED}
# =============================================================

${CONTENT_SIGNALS_POLICY}

User-Agent: *
Content-Signal: search=yes, ai-input=yes, ai-train=yes
Allow: /

# --- Traditional search engines ---
${group(SEARCH_BOTS)}
# --- AI search & retrieval (answers, citations) ---
${group(RETRIEVAL_BOTS)}
# --- AI training & bulk indexing ---
${group(TRAINING_BOTS)}
Sitemap: ${sitemap}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
