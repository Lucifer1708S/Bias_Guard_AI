export interface BiasAnalysis {
  bias_score: number;
  explanation: string;
}

export interface AnalysisResponse {
  originalPrompt: string;
  improvedPrompt: string;
  originalResponse: string;
  finalResponse: string;
  bias: BiasAnalysis;
  reasoning: string;
}
