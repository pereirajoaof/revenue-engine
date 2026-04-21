export type BusinessModel = "ecommerce" | "saas" | "leadgen" | "other";
export type Currency = "GBP" | "USD" | "EUR" | "OTHER";
export type EconomicsMode = "ga4" | "manual" | null;

export interface GscProperty {
  url: string;
  type: "domain" | "url-prefix";
  verified: true;
}

export interface PageType {
  id: string;
  label: string;
  pattern: string;
  pageCount: number;
  useGlobal: boolean;
  cvrOverride?: number;
  aovOverride?: number;
}

export interface OnboardingState {
  // Step 1
  gscConnected: boolean;
  // Step 2
  selectedProperty: string | null;
  // Step 3
  businessModel: BusinessModel | null;
  currency: Currency | null;
  customCurrency: string;
  primaryMarket: string;
  // Step 4
  brandedKeywords: string[];
  // Step 5
  economicsMode: EconomicsMode;
  ga4Connected: boolean;
  globalCvr: string;
  globalAov: string;
  // Step 7
  pageTypes: PageType[];
}

export const initialState: OnboardingState = {
  gscConnected: false,
  selectedProperty: null,
  businessModel: null,
  currency: null,
  customCurrency: "",
  primaryMarket: "",
  brandedKeywords: [],
  economicsMode: null,
  ga4Connected: false,
  globalCvr: "",
  globalAov: "",
  pageTypes: [],
};

export const MOCK_PROPERTIES: GscProperty[] = [
  { url: "sc-domain:acme.com", type: "domain", verified: true },
  { url: "https://www.acme.com/", type: "url-prefix", verified: true },
  { url: "https://shop.acme.com/", type: "url-prefix", verified: true },
  { url: "sc-domain:acme-blog.com", type: "domain", verified: true },
];

export const MOCK_PAGE_TYPES: PageType[] = [
  { id: "pdp", label: "Product pages", pattern: "/product/*", pageCount: 1247, useGlobal: true },
  { id: "plp", label: "Category pages", pattern: "/category/*", pageCount: 84, useGlobal: true },
  { id: "blog", label: "Blog posts", pattern: "/blog/*", pageCount: 312, useGlobal: true },
  { id: "guides", label: "Guides & resources", pattern: "/guides/*", pageCount: 47, useGlobal: true },
  { id: "home", label: "Homepage", pattern: "/", pageCount: 1, useGlobal: true },
];
