/**
 * @typedef {Object} OptimizeOptions
 * @property {boolean} [increaseReadability] - Improve code readability
 * @property {boolean} [useHighLevelFunctions] - Use modern functions and hooks
 * @property {boolean} [optimizeImports] - Organize and optimize imports
 * @property {boolean} [improveNaming] - Improve variable and function naming
 */

/**
 * @typedef {Object} OptimizeRequest
 * @property {string} code - The code to optimize
 * @property {OptimizeOptions} [options] - Optimization options
 */

/**
 * @typedef {Object} ConvertRequest
 * @property {string} code - The code to convert
 * @property {string} conversionType - The conversion type (e.g., "javascript-to-typescript")
 */

/**
 * @typedef {Object} StockAnalysisInput
 * @property {string} companyName - Company name
 * @property {number} currentPrice - Current stock price
 * @property {number} volume - Trading volume
 * @property {number} [peRatio] - Price to earnings ratio
 * @property {number} [eps] - Earnings per share
 * @property {number} [marketCap] - Market capitalization in crores
 */

/**
 * @typedef {Object} SubTask
 * @property {string} name - Subtask name
 * @property {number} duration - Subtask duration in hours
 */

/**
 * @typedef {Object} Task
 * @property {string} title - Task title
 * @property {number} duration - Task duration in hours
 * @property {Array<SubTask>} subTasks - List of subtasks
 * @property {string} [blockers] - Task blockers
 */

/**
 * @typedef {Object} StandupFormData
 * @property {Array<Task>} tasks - List of tasks
 */

export {};