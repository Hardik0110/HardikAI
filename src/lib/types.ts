import { ReactNode } from "react";
import { Control } from "react-hook-form";

export type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean } | ClassValue[];

// Common types
type PageProps = {
  children?: ReactNode;
};

export interface CardVariantTransition {
  delay: number;
  duration: number;
}

export interface CardVariant {
  opacity: number;
  y: number;
}

export interface CardVariants {
  [key: string]: any;
  hidden: { opacity: number; y: number };
  visible: (i: number) => {
    opacity: number;
    y: number;
    transition: { delay: number; duration: number };
  };
};

// Page Props
export type AnalyzePageProps = PageProps;
export type DashboardPageProps = PageProps;
export type IntroductionPageProps = PageProps;
export type LoginPageProps = PageProps;
export type OptimizePageProps = PageProps;

// Form Data
export interface LoginFormData {
  email: string;
  password: string;
}

export type OptimizationType = "hooks" | "readability" | "linting" | "bugs";

export interface CodeOptimizeButtonProps {
  onClick: () => void;
  isLoading: boolean;
  icon: string;
  label: string;
  description: string;
  index: number;
  className?: string;
  style?: React.CSSProperties;
}

export interface StockAnalysisInput {
  companyName: string;
  currentPrice?: number;
  volume?: number;
  news?: string;
  peRatio?: number;
  eps?: number;
  marketCap?: number;
  dividend?: number;
  beta?: number;
}

export interface AnalysisResult {
  text?: string;
  technicalTrends: string;
  volumePatterns: string;
  supportResistance: {
    support: number;
    resistance: number;
  };
  shortTermOutlook: string;
  stopLoss: number;
}

export type ConversionType = 
  | "javascript-to-typescript"
  | "typescript-to-python"
  | "python-to-javascript"
  | "react-to-vue"
  | "vue-to-react"
  | "javascript-to-java";

// Task Types
export interface Task {
  name: string;
  subTasks: string[];
  hours: number;
  minutes: number;
  blockers?: string;
}

export interface StandupFormData {
  tasks: Task[];
}

// API Response Types
export interface ModelResponse {
  usedModel: string;
}

export interface OptimizeResponse extends ModelResponse {
  optimizedCode: string;
}

export interface AnalyzeResponse extends ModelResponse {
  analysisResult: string;
  technicalTrends: string;
  volumePatterns: string;
  supportResistance: string;
  shortTermOutlook: string;
  stopLoss: number;
}

export interface ConversionResponse extends ModelResponse {
  convertedCode: string;
}

export interface StandupResult extends ModelResponse {
  formattedText: string;
}

export interface StandupFormattedResponse extends StandupResult {
}

export interface OptimizeRequest {
  code: string;
  optimizationType: OptimizationType;
}

export interface ConvertRequest {
  code: string;
  conversionType: ConversionType;
}

export interface StandupTextInput {
  rawText: string;
}

export interface StandupFormattedTextResponse {
  formattedText: string;
  standupData: StandupFormattedResponse;
}

export interface StandupAPIResponse extends ModelResponse {
  yesterdayProgress: {
    tasks: {
      name: string;
      duration: string;
      subTasks?: Array<{
        description: string;
        duration: string;
      }>;
    }[];
  };
  learningsAndInsights?: Array<{
    description: string;
    duration: string;
  }>;
  blockers?: string[];
  todaysPlan?: string[];
}

export type RequiredNumberInputProps = {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
}

export type TextInputProps = {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
  isTextarea?: boolean;
}

export type OptionalNumberInputProps = {
  control: Control<any>;
  name: string;
  label: string;
  placeholder?: string;
}

export interface ConversionPopupProps {
  convertedCode: string
  usedModel: string | null
  onClose: () => void
}
