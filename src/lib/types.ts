import { ReactNode } from "react";
import { Control } from "react-hook-form";

// A utility type for defining class values, supporting various formats like strings, numbers, booleans, objects, or arrays.
export type ClassValue = string | number | boolean | undefined | null | { [key: string]: boolean } | ClassValue[];

// Common props for pages, typically used to pass children components.
type PageProps = {
  children?: ReactNode; // Optional React children nodes.
};

// Defines the transition properties for card animations (e.g., delay and duration).
export interface CardVariantTransition {
  delay: number; // Delay before the animation starts.
  duration: number; // Duration of the animation.
}

// Represents a single variant state for a card (e.g., opacity and vertical position).
export interface CardVariant {
  opacity: number; // Opacity level of the card.
  y: number; // Vertical position of the card.
}

// Defines multiple variants for a card, including hidden and visible states.
export interface CardVariants {
  [key: string]: any; // Allows additional custom keys for flexibility.
  hidden: { opacity: number; y: number }; // Hidden state of the card.
  visible: (i: number) => { // Visible state of the card, with dynamic properties based on an index.
    opacity: number;
    y: number;
    transition: { delay: number; duration: number }; // Transition properties for the visible state.
  };
};

// Page-specific props, extending the common `PageProps` type.
export type AnalyzePageProps = PageProps; // Props for the Analyze page.
export type DashboardPageProps = PageProps; // Props for the Dashboard page.
export type IntroductionPageProps = PageProps; // Props for the Introduction page.
export type LoginPageProps = PageProps; // Props for the Login page.
export type OptimizePageProps = PageProps; // Props for the Optimize page.

// Represents the data structure for login form inputs.
export interface LoginFormData {
  email: string; // User's email address.
  password: string; // User's password.
}

// Defines the types of optimizations that can be applied to code.
export type OptimizationType = "hooks" | "readability" | "linting" | "bugs";

// Props for a button used in code optimization.
export interface CodeOptimizeButtonProps {
  onClick: () => void; // Callback function triggered when the button is clicked.
  isLoading: boolean; // Indicates whether the button is in a loading state.
  icon: string; // Icon displayed on the button.
  label: string; // Text label for the button.
  description: string; // Description of the button's functionality.
  index: number; // Index or order of the button in a list.
  className?: string; // Optional CSS class for styling.
  style?: React.CSSProperties; // Inline styles for the button.
  variant?: 'default' | 'convert' | 'optimize'; // Add this line
}

// Represents input data for stock analysis.
export interface StockAnalysisInput {
  companyName: string; // Name of the company being analyzed.
  currentPrice?: number; // Current stock price (optional).
  volume?: number; // Trading volume (optional).
  news?: string; // Relevant news or updates (optional).
  peRatio?: number; // Price-to-earnings ratio (optional).
  eps?: number; // Earnings per share (optional).
  marketCap?: number; // Market capitalization (optional).
  dividend?: number; // Dividend yield (optional).
  beta?: number; // Beta value indicating volatility (optional).
}

// Represents the result of a stock analysis.
export interface AnalysisResult {
  technicalAnalysis: string; // Technical analysis insights.
  marketTrends: string; // Market trend observations.
  supportResistance: string; // Support and resistance levels.
  stopLoss: string; // Recommended stop-loss level.
  outlook: string; // Overall market outlook.
  usedModel?: string; // The model used for the analysis (optional).
}

// Defines the types of code conversions supported by the application.
export type ConversionType =
  | "javascript-to-typescript"
  | "typescript-to-python"
  | "python-to-javascript"
  | "react-to-vue"
  | "vue-to-react"
  | "javascript-to-java";

// Represents a task in a standup meeting.
export interface Task {
  name: string; // Name of the task.
  subTasks: string[]; // List of sub-tasks associated with the main task.
  hours: number; // Estimated hours required for the task.
  minutes: number; // Estimated minutes required for the task.
  blockers?: string; // Any blockers or issues related to the task (optional).
}

// Represents the data structure for standup form inputs.
export interface StandupFormData {
  tasks: Task[]; // List of tasks reported during the standup.
}

// Base response type for API calls, indicating the model used.
export interface ModelResponse {
  usedModel: string; // The model used to generate the response.
}

// Response type for code optimization API calls.
export interface OptimizeResponse extends ModelResponse {
  optimizedCode: string; // The optimized version of the input code.
}

// Response type for stock analysis API calls.
export interface AnalyzeResponse extends ModelResponse {
  analysisResult: string; // Summary of the analysis.
  technicalTrends: string; // Insights into technical trends.
  volumePatterns: string; // Observations about trading volume patterns.
  supportResistance: string; // Identified support and resistance levels.
  shortTermOutlook: string; // Short-term market outlook.
  stopLoss: number; // Recommended stop-loss level.
}

// Response type for code conversion API calls.
export interface ConversionResponse extends ModelResponse {
  convertedCode: string; // The converted version of the input code.
}

// Response type for standup formatting API calls.
export interface StandupResult extends ModelResponse {
  formattedText: string; // Formatted text summarizing the standup.
}

// Extended response type for standup formatting.
export interface StandupFormattedResponse extends StandupResult {}

// Request payload for code optimization API calls.
export interface OptimizeRequest {
  code: string; // The input code to be optimized.
  optimizationType: OptimizationType; // Type of optimization to apply.
  model?: string; // Optional model to use for optimization.
}

// Request payload for code conversion API calls.
export interface ConvertRequest {
  code: string; // The input code to be converted.
  conversionType: ConversionType; // Type of conversion to perform.
}

// Input data for standup text processing.
export interface StandupTextInput {
  rawText: string; // Raw text input from the user.
}

// Response type for standup text formatting API calls.
export interface StandupFormattedTextResponse {
  formattedText: string; // Formatted text summarizing the standup.
  standupData: StandupFormattedResponse; // Additional standup data.
}

// Detailed response type for standup API calls.
export interface StandupAPIResponse extends ModelResponse {
  yesterdayProgress: {
    tasks: {
      name: string; // Name of the task completed yesterday.
      duration: string; // Time spent on the task.
      subTasks?: Array<{
        description: string; // Description of the sub-task.
        duration: string; // Time spent on the sub-task.
      }>;
    }[];
  };
  learningsAndInsights?: Array<{
    description: string; // Description of the learning or insight.
    duration: string; // Time spent on the learning or insight.
  }>;
  blockers?: string[]; // List of blockers encountered.
  todaysPlan?: string[]; // List of tasks planned for today.
}

// Props for a required numeric input field.
export type RequiredNumberInputProps = {
  control: Control<any>; // React Hook Form control object.
  name: string; // Name of the input field.
  label: string; // Label for the input field.
  placeholder?: string; // Placeholder text (optional).
}

// Props for a text input field, optionally rendered as a textarea.
export type TextInputProps = {
  control: Control<any>; // React Hook Form control object.
  name: string; // Name of the input field.
  label: string; // Label for the input field.
  placeholder?: string; // Placeholder text (optional).
  isTextarea?: boolean; // Whether the input should be rendered as a textarea.
}

// Props for an optional numeric input field.
export type OptionalNumberInputProps = {
  control: Control<any>; // React Hook Form control object.
  name: string; // Name of the input field.
  label: string; // Label for the input field.
  placeholder?: string; // Placeholder text (optional).
}

// Props for a popup displaying converted code.
export interface ConversionPopupProps {
  convertedCode: string; // The converted code to display.
  usedModel: string | null; // The model used for the conversion (optional).
  onClose: () => void; // Callback function to close the popup.
}

// Data submitted for stock analysis.
export interface AnalysisSubmitData {
  companyName: string; // Name of the company being analyzed.
  currentPrice: number; // Current stock price.
  volume: number; // Trading volume.
  news?: string; // Relevant news or updates (optional).
  peRatio?: number | null; // Price-to-earnings ratio (optional).
  eps?: number | null; // Earnings per share (optional).
  marketCap?: number | null; // Market capitalization (optional).
  dividend?: number | null; // Dividend yield (optional).
  beta?: number | null; // Beta value indicating volatility (optional).
}

// State management for stock analysis.
export interface StockAnalysisState {
  isAnalyzing: boolean; // Indicates whether analysis is in progress.
  analysisResult: AnalysisResult | null; // Result of the analysis (optional).
  setIsAnalyzing: (value: boolean) => void; // Function to update the `isAnalyzing` state.
  setAnalysisResult: (result: AnalysisResult | null) => void; // Function to update the `analysisResult` state.
}

// Props for a popup displaying analysis results.
export interface PromptPopupProps {
  prompt: string;
  onClose: () => void;
}