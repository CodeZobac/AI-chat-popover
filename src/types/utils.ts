// Utility types for better type safety and developer experience

// Make all properties optional except specified ones
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Make all properties required except specified ones
export type RequiredExcept<T, K extends keyof T> = Required<T> &
  Partial<Pick<T, K>>;

// Extract keys of a type that are of a specific type
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];

// Create a type with only the properties that are of a specific type
export type PickByType<T, U> = Pick<T, KeysOfType<T, U>>;

// Omit properties that are of a specific type
export type OmitByType<T, U> = Omit<T, KeysOfType<T, U>>;

// Deep partial type
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Deep required type
export type DeepRequired<T> = {
  [P in keyof T]-?: T[P] extends object ? DeepRequired<T[P]> : T[P];
};

// Nullable type
export type Nullable<T> = T | null;

// Optional type
export type Optional<T> = T | undefined;

// Non-nullable type
export type NonNullable<T> = T extends null | undefined ? never : T;

// Array element type
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

// Promise value type
export type PromiseValue<T> = T extends Promise<infer U> ? U : never;

// Function parameters type
export type Parameters<T> = T extends (...args: infer P) => unknown ? P : never;

// Function return type
export type ReturnType<T> = T extends (...args: unknown[]) => infer R
  ? R
  : unknown;

// Create a union type from object values
export type ValueOf<T> = T[keyof T];

// Create a type that represents the keys of T as strings
export type StringKeys<T> = Extract<keyof T, string>;

// Create a type that represents the keys of T as numbers
export type NumberKeys<T> = Extract<keyof T, number>;

// Create a type that represents the keys of T as symbols
export type SymbolKeys<T> = Extract<keyof T, symbol>;

// Conditional type for checking if a type extends another
export type Extends<T, U> = T extends U ? true : false;

// Type-safe Object.keys
export type ObjectKeys<T> = keyof T;

// Type-safe Object.values
export type ObjectValues<T> = T[keyof T];

// Type-safe Object.entries
export type ObjectEntries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

// Brand type for creating nominal types
export type Brand<T, B> = T & { __brand: B };

// ID types for different entities
export type UserId = Brand<string, "UserId">;
export type SessionId = Brand<string, "SessionId">;
export type MessageId = Brand<string, "MessageId">;
export type SchedulingRequestId = Brand<string, "SchedulingRequestId">;
export type ProgramId = Brand<string, "ProgramId">;

// Timestamp type
export type Timestamp = Brand<number, "Timestamp">;

// Email type
export type Email = Brand<string, "Email">;

// Phone type
export type Phone = Brand<string, "Phone">;

// URL type
export type URL = Brand<string, "URL">;

// Color type (hex color)
export type HexColor = Brand<string, "HexColor">;

// CSS class name type
export type ClassName = Brand<string, "ClassName">;

// Event handler types with proper typing
export type EventHandler<T = Event> = (event: T) => void;
export type ChangeHandler<T = HTMLInputElement> = (
  event: React.ChangeEvent<T>
) => void;
export type ClickHandler<T = HTMLButtonElement> = (
  event: React.MouseEvent<T>
) => void;
export type SubmitHandler<T = HTMLFormElement> = (
  event: React.FormEvent<T>
) => void;
export type KeyboardHandler<T = HTMLElement> = (
  event: React.KeyboardEvent<T>
) => void;

// Form field types
export type FormFieldValue =
  | string
  | number
  | boolean
  | Date
  | null
  | undefined;
export type FormFieldError = string | null | undefined;
export type FormFieldTouched = boolean;

export interface FormField<T = FormFieldValue> {
  value: T;
  error: FormFieldError;
  touched: FormFieldTouched;
}

export type FormFields<T> = {
  [K in keyof T]: FormField<T[K]>;
};

// API response status types
export type ApiStatus = "idle" | "loading" | "success" | "error";

export interface AsyncState<T = unknown, E = Error> {
  status: ApiStatus;
  data: T | null;
  error: E | null;
}

// Pagination types
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
  filters?: Record<string, unknown>;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Search and filter types
export interface SearchParams {
  query: string;
  fields?: string[];
  fuzzy?: boolean;
  caseSensitive?: boolean;
}

export interface FilterParams {
  field: string;
  operator:
    | "eq"
    | "ne"
    | "gt"
    | "gte"
    | "lt"
    | "lte"
    | "in"
    | "nin"
    | "contains"
    | "startsWith"
    | "endsWith";
  value: unknown;
}

// Date range type
export interface DateRange {
  start: Date;
  end: Date;
}

// Time slot type
export interface TimeSlot {
  start: string; // HH:MM format
  end: string; // HH:MM format
  available: boolean;
}

// Geolocation type
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Location extends Coordinates {
  address?: string;
  city?: string;
  country?: string;
  timezone?: string;
}

// File upload types
export interface FileUpload {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  error?: string;
  url?: string;
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  border: string;
  input: string;
  ring: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeConfig {
  colors: ThemeColors;
  borderRadius: number;
  fontFamily: string;
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
  };
}
