// Base types for the Kawasaki City Waste Sorting App

// Supported languages
export type Language = 'ja' | 'en' | 'zh' | 'ko';

// Waste categories
export type WasteCategory = 'burnable' | 'recyclable' | 'nonBurnable' | 'oversized';

// Days of the week (0 = Sunday, 1 = Monday, etc.)
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

// Kawasaki city wards
export type Ward = 
  | 'kawasaki'
  | 'saiwai'
  | 'nakahara'
  | 'takatsu'
  | 'miyamae'
  | 'tama'
  | 'asao';

// Area/District information
export interface Area {
  id: string;
  ward: Ward;
  area: string;
  schedule: CollectionSchedule;
}

// Collection schedule for each waste type
export interface CollectionSchedule {
  burnable: DayOfWeek[];       // e.g., [1, 4] for Monday and Thursday
  recyclable: DayOfWeek[];     // e.g., [2] for Tuesday
  nonBurnable: DayOfWeek[];    // e.g., [3] for Wednesday (monthly)
  oversized?: string;          // Special collection info
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