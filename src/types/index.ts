/** Dynasty era classification */
export type Dynasty = '先秦' | '汉' | '魏晋南北朝' | '唐' | '宋' | '元' | '明' | '清' | '近现代';

/** Education stage */
export type Stage = '小学' | '初中' | '高中';

/** Genre category: poetry, ci poetry, or classical prose */
export type GenreCategory = '诗' | '词' | '文言文' | '曲';

/** Sub-genre classification */
export type SubGenre = '古体诗' | '近体诗' | '词' | '曲' | '记叙文' | '说理文' | '写景文' | '抒情文' | '豪放派' | '婉约派';

/** Theme tag for a work */
export type Theme = '爱国' | '山水' | '友情' | '思乡' | '哲理' | '田园' | '战争' | '咏物' | '咏史' | '送别' | '边塞' | '闺怨' | '节日' | '人生' | '爱情';

/** Visualization type */
export type VisualizationType = 'narrative' | 'scenic' | 'lyrical' | 'none';

/** Grade level information */
export interface GradeLevel {
  stage: Stage;
  grade: string;
}

/** Genre classification */
export interface Genre {
  category: GenreCategory;
  subGenre: SubGenre;
}

/** Text content with structural breakdown */
export interface WorkText {
  original: string;
  sentences: string[];
  rhymeScheme?: string[];
}

/** Annotation for a specific term */
export interface Annotation {
  term: string;
  note: string;
}

/** Literary context information */
export interface LiteraryInfo {
  authorBio: string;
  background: string;
  significance: string;
}

/** Narrative visualization data */
export interface NarrativeData {
  summary: string;
  timeline: Array<{
    event: string;
    order: number;
  }>;
}

/** Scenic visualization data */
export interface ScenicData {
  layers: Array<{
    level: string;
    content: string;
    keywords?: string[];
  }>;
}

/** Lyrical/emotion visualization data */
export interface LyricalData {
  emotionCurve: Array<{
    segment: string;
    emotion: string;
    intensity: number;
  }>;
}

/** Visualization configuration for a work */
export interface Visualization {
  type: VisualizationType;
  narrativeData?: NarrativeData;
  scenicData?: ScenicData;
  lyricalData?: LyricalData;
}

/** Statistical summary of a work */
export interface WorkStats {
  charCount: number;
  sentenceCount: number;
  rhymeCount: number;
}

/** Core work entity — a classical Chinese poem or prose */
export interface ClassicalWork {
  id: string;
  title: string;
  author: string;
  dynasty: Dynasty;
  gradeLevel: GradeLevel;
  genre: Genre;
  themes: Theme[];
  text: WorkText;
  annotations: Annotation[];
  translation: string;
  literaryInfo?: LiteraryInfo;
  visualization?: Visualization;
  stats?: WorkStats;
}

/** Author information */
export interface AuthorInfo {
  name: string;
  dynasty: Dynasty;
  bio: string;
  workCount: number;
  workIds: string[];
}

/** Filter state for work listing */
export interface FilterState {
  stage: Stage[];
  grade: string[];
  genreCategory: GenreCategory[];
  subGenre: SubGenre[];
  dynasty: Dynasty[];
  themes: Theme[];
}

/** Pagination state */
export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}

/** Search history item */
export interface SearchHistoryItem {
  keyword: string;
  timestamp: number;
}

/** Graph node for relationship visualization */
export interface GraphNode {
  id: string;
  name: string;
  type: 'author' | 'work' | 'theme' | 'dynasty';
  size?: number;
}

/** Graph edge for relationship visualization */
export interface GraphEdge {
  source: string;
  target: string;
  relation: '创作' | '同主题' | '同朝代';
}

/** Category entry for grouping */
export interface CategoryEntry {
  label: string;
  value: string;
  count: number;
  icon?: string;
}

/** Daily poem recommendation */
export interface DailyPoem {
  work: ClassicalWork;
  reason: string;
}

/** All possible dynasty values constant */
export const DYNASTIES: Dynasty[] = ['先秦', '汉', '魏晋南北朝', '唐', '宋', '元', '明', '清', '近现代'];

/** All possible stage values constant */
export const STAGES: Stage[] = ['小学', '初中', '高中'];

/** All possible theme values constant */
export const THEMES: Theme[] = ['爱国', '山水', '友情', '思乡', '哲理', '田园', '战争', '咏物', '咏史', '送别', '边塞', '闺怨', '节日', '人生', '爱情'];

/** All possible genre categories */
export const GENRE_CATEGORIES: GenreCategory[] = ['诗', '词', '文言文'];

/** All possible sub-genres */
export const SUB_GENRES: SubGenre[] = ['古体诗', '近体诗', '词', '曲', '记叙文', '说理文', '写景文', '抒情文'];

/** Grade options per stage */
export const GRADE_OPTIONS: Record<Stage, string[]> = {
  '小学': ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
  '初中': ['七年级', '八年级', '九年级'],
  '高中': ['必修上册', '必修下册', '选择性必修上册', '选择性必修中册', '选择性必修下册'],
};
