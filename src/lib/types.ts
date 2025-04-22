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
    chartImage?: string;
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
    text?: string | null;
  }