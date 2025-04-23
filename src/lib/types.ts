import { ReactNode } from "react";

export type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean } | ClassValue[];

export interface AnalyzePageProps {
  children?: ReactNode;
}

export interface DashboardPageProps {
  children?: ReactNode;
}

export interface CardVariants {
  hidden: {
    opacity: number;
    y: number;
  };
  visible: (i: number) => {
    opacity: number;
    y: number;
    transition: {
      delay: number;
      duration: number;
    };
  };
}

export interface IntroductionPageProps {
  children?: ReactNode;
}

export interface LoginPageProps {
  children?: ReactNode;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface OptimizePageProps {
  children?: ReactNode;
}

export type OptimizationType = "hooks" | "readability" | "linting" | "bugs";

export interface CodeOptimizeButtonProps {
  onClick: () => void;
  isLoading: boolean;
  icon: string;
  label: string;
  description: string;
  index: number;
}

export interface StockAnalysisInput {
  companyName: string;
  currentPrice: number;
  volume: number;
  news?: string;
  peRatio?: number;
  eps?: number;
  marketCap?: number;
  dividend?: number;
  beta?: number;
}
  
export interface AnalysisResult {
  technicalTrends: string;
  volumePatterns: string;
  supportResistance: string;
  shortTermOutlook: string;
  stopLoss: number;
  text?: string;
}

export type ConversionType = 
  | "javascript-to-typescript"
  | "typescript-to-python"
  | "python-to-javascript"
  | "react-to-vue"
  | "vue-to-react"
  | "javascript-to-java";

export interface ConversionResponse {
  convertedCode: string;
  usedModel: string;
}

export interface ConvertRequest {
  code: string;
  conversionType: ConversionType;
}

export interface Task {
  name: string;
  subTasks: string[];
  hours: number;
  minutes: number;
}

export interface StandupFormData {
  tasks: Task[];
}

export interface StandupResult {
  yesterdayProgress: {
    tasks: Array<{
      name: string;
      duration: string;
      subTasks: Array<{
        description: string;
        duration: string;
      }>;
    }>;
  };
  learningsAndInsights: Array<{
    description: string;
    duration: string;
  }>;
  blockers: string[];
  todaysPlan: string[];
}