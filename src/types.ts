export interface AnalysisResult {
  itemName: string;
  lowPrice: number;
  highPrice: number;
  avgPrice: number;
  demandScore: number; // 0-100
  demandStatus: 'Extreme' | 'High' | 'Moderate' | 'Low';
  demandDescription: string;
  description: string;
  hashtags: string[];
  ebayListingReady: boolean;
  poshmarkListingReady: boolean;
  mercariListingReady: boolean;
  fbListingReady: boolean;
  keyKeywords: string[];
  tipsForSelling: string[];
}

export interface BlogArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  summary: string;
  content: string; // Markdown supported
  imageUrl: string;
}

export interface PlatformFeeResult {
  platformName: string;
  fee: number;
  shippingCharge: number;
  netProfit: number;
  margin: number;
  color: string;
}
