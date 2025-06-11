// Base types for the Kawasaki City Waste Sorting App

// Supported languages
export type Language = 'ja' | 'en' | 'zh' | 'ko';

// Waste categories (based on actual Kawasaki City garbage types)
export type WasteCategory = 
  | 'normalGarbage'      // 普通ゴミ (燃やすゴミ)
  | 'cansBottles'        // 空き缶・ペットボトル
  | 'glassBottles'       // 空きびん
  | 'usedBatteries'      // 使用済み乾電池
  | 'mixedPaper'         // ミックスペーパー
  | 'plasticPackaging'   // プラスチック製容器包装
  | 'smallMetal'         // 小物金属
  | 'oversizedWaste';    // 粗大ごみ (カレンダー表示なし)

// Days of the week (0 = Sunday, 1 = Monday, etc.)
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// Kawasaki city wards
export type Ward = 
  | '川崎区'
  | '幸区'
  | '中原区'
  | '高津区'
  | '宮前区'
  | '多摩区'
  | '麻生区';

// Area/District information
export interface Area {
  id: string;
  ward: Ward;
  area: string;
  schedule: CollectionSchedule;
}

// Collection schedule for each waste type
export interface CollectionSchedule {
  normalGarbage: DayOfWeek[];                           // 普通ゴミ (燃やすゴミ)
  cansBottles: DayOfWeek[];                            // 空き缶・ペットボトル
  glassBottles: DayOfWeek[];                           // 空きびん
  usedBatteries: DayOfWeek[];                          // 使用済み乾電池
  mixedPaper: DayOfWeek[];                             // ミックスペーパー
  plasticPackaging: DayOfWeek[];                       // プラスチック製容器包装 (毎週収集)
  smallMetal: { weekday: DayOfWeek; weeks: number[] };       // 小物金属 (第○・○回目)
  oversizedWaste?: { weekday: DayOfWeek; weeks: number[] };  // 粗大ごみ (カレンダー表示なし・オプショナル)
}

// Waste item information
export interface WasteItem {
  id: string;
  name: string;
  keywords: string[];
  category: WasteCategory;
  instructions: string;
  icon?: string;
  notes?: string;
}

// Holiday/Special collection dates
export interface Holiday {
  date: string;  // YYYY-MM-DD format
  name: string;
  alternativeDate?: string;  // If collection is moved
}

// Collection information for a specific date
export interface CollectionInfo {
  date: string;
  types: WasteCategory[];
  isAlternative?: boolean;
  note?: string;
}

// User settings
export interface UserSettings {
  language: Language;
  area: Area | null;
  notifications: NotificationSettings;
  firstLaunch: boolean;
}

// Notification settings
export interface NotificationSettings {
  enabled: boolean;
  reminderTime: 'evening' | 'morning';  // Previous evening or morning of collection
  types: WasteCategory[];  // Which types to notify for
}

// Camera recognition result
export interface RecognitionResult {
  confidence: number;
  item: WasteItem;
  suggestions?: WasteItem[];
}

// Search history item
export interface SearchHistoryItem {
  query: string;
  timestamp: number;
  result?: WasteItem;
}

// Navigation types
export type RootStackParamList = {
  LanguageSelection: undefined;
  DistrictSelection: undefined;
  Home: undefined;
  Calendar: undefined;
  Search: { query?: string };
  Camera: undefined;
  Settings: undefined;
  NotFound: undefined;
};

// Tab navigation types
export type TabParamList = {
  index: undefined;
  calendar: undefined;
  search: { query?: string };
  camera: undefined;
  settings: undefined;
};

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Firestore document types
export interface AreaDocument extends Area {
  createdAt: Date;
  updatedAt: Date;
}

export interface WasteItemDocument extends WasteItem {
  createdAt: Date;
  updatedAt: Date;
}

export interface HolidayDocument extends Holiday {
  createdAt: Date;
}

// Local storage keys
export const STORAGE_KEYS = {
  USER_SETTINGS: 'userSettings',
  SEARCH_HISTORY: 'searchHistory',
  ONBOARDING_COMPLETED: 'onboardingCompleted',
  NOTIFICATION_TOKEN: 'notificationToken',
} as const;

// Error types
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Theme types
export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeColors {
  text: string;
  textSecondary: string;
  background: string;
  surface: string;
  border: string;
  tint: string;
  icon: string;
  tabIconDefault: string;
  tabIconSelected: string;
  shadow: string;
}