import { R2_URL } from '@config/site';

export type PortfolioCategory =
  | 'blackwork'
  | 'micro-realism'
  | 'fine-line'
  | 'lettering'
  | 'anime-cartoon'
  | 'studio'
  | 'tattoo';

export type MediaType = 'image' | 'video';

export interface PortfolioItem {
  id: string;         // Assay Catalog Serial (e.g., 001)
  fileName: string;   // Exact name in Cloudflare R2
  title: string;      // Descriptive title for the UI and alt attribute (SEO)
  category: PortfolioCategory;
  type: MediaType;
  placement: string;  // Body placement
  featured?: boolean; // Flag to highlight pieces on the homepage
}

export const getMediaUrl = (fileName: string, type: MediaType): string => {
  return `${R2_URL}/portfolio/${type}s/${fileName}`;
};

export const PORTFOLIO_CATALOG: readonly PortfolioItem[] = [
  {
    id: '001',
    fileName: 'IMG_0543.jpg',
    title: 'Dotwork and micro-realism wolf',
    category: 'micro-realism',
    type: 'image',
    placement: 'Upper arm',
  },
  {
    id: '002',
    fileName: 'IMG_0544.jpg',
    title: 'Animated car (Cartoon)',
    category: 'anime-cartoon',
    type: 'image',
    placement: 'Calf',
  },
  {
    id: '003',
    fileName: 'IMG_0545.jpg',
    title: 'Animated cyclops character',
    category: 'anime-cartoon',
    type: 'image',
    placement: 'Calf',
  },
  {
    id: '004',
    fileName: 'IMG_0715.jpg',
    title: 'Blackwork flames',
    category: 'blackwork',
    type: 'image',
    placement: 'Back of the hand',
    featured: true,
  },
  {
    id: '005',
    fileName: 'IMG_1103.jpg',
    title: 'Praying Virgin Mary in micro-realism',
    category: 'micro-realism',
    type: 'image',
    placement: 'Forearm',
    featured: true,
  },
  {
    id: '006',
    fileName: 'IMG_1256.jpg',
    title: 'Session in progress - Back piece',
    category: 'studio',
    type: 'image',
    placement: 'Back',
  },
  {
    id: '007',
    fileName: 'IMG_2583.jpg',
    title: 'Animated car (Alternate angle)',
    category: 'anime-cartoon',
    type: 'image',
    placement: 'Calf',
  },
  {
    id: '008',
    fileName: 'IMG_3728.jpg',
    title: 'Winged Anime Character',
    category: 'anime-cartoon',
    type: 'image',
    placement: 'Forearm',
  },
  {
    id: '009',
    fileName: 'IMG_4237.jpg',
    title: 'Jesus and the Virgin Mary - Realistic composition',
    category: 'micro-realism',
    type: 'image',
    placement: 'Upper arm',
  },
  {
    id: '010',
    fileName: 'IMG_5076.jpg',
    title: 'Chess knight and patchwork',
    category: 'blackwork',
    type: 'image',
    placement: 'Upper arm',
  },
  {
    id: '011',
    fileName: 'IMG_5185.jpg',
    title: 'Cowboy on horseback - Fine-line',
    category: 'fine-line',
    type: 'image',
    placement: 'Torso / Ribs',
  },
  {
    id: '012',
    fileName: 'IMG_5706.jpg',
    title: 'Classic angel statue',
    category: 'micro-realism',
    type: 'image',
    placement: 'Forearm',
    featured: true,
  },
  {
    id: '013',
    fileName: 'IMG_6368.jpg',
    title: 'Lettering "Grateful"',
    category: 'lettering',
    type: 'image',
    placement: 'Shoulder / Upper back',
  },
  {
    id: '014',
    fileName: 'IMG_6525.jpg',
    title: 'Courage the Cowardly Dog',
    category: 'anime-cartoon',
    type: 'image',
    placement: 'Calf',
  },
  {
    id: '015',
    fileName: 'IMG_6769.jpg',
    title: 'Miniature dog portrait',
    category: 'micro-realism',
    type: 'image',
    placement: 'Inner arm',
  },
  {
    id: '016',
    fileName: 'IMG_7278.jpg',
    title: 'Fine-line bee',
    category: 'fine-line',
    type: 'image',
    placement: 'Forearm',
  },
  {
    id: '017',
    fileName: 'IMG_7732.jpg',
    title: 'Cherub with bow - Ignorant/Fine-line style',
    category: 'fine-line',
    type: 'image',
    placement: 'Upper arm',
  },
  {
    id: '018',
    fileName: 'IMG_7844.jpg',
    title: 'Ornamental ear detail',
    category: 'fine-line',
    type: 'image',
    placement: 'Ear',
  },
  {
    id: '019',
    fileName: 'IMG_8445.jpg',
    title: 'Dove and biblical scripture',
    category: 'micro-realism',
    type: 'image',
    placement: 'Chest',
    featured: true,
  },
  {
    id: '020',
    fileName: 'IMG_8604.jpg',
    title: 'Cowboy on horseback (Detail)',
    category: 'fine-line',
    type: 'image',
    placement: 'Calf',
  },
  {
    id: '021',
    fileName: 'IMG_9643.jpg',
    title: 'Full-body Greek statue',
    category: 'micro-realism',
    type: 'image',
    placement: 'Forearm',
    featured: true,
  },
] as const;