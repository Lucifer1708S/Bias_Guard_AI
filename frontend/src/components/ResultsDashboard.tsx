import { motion } from 'framer-motion';
import type { AnalysisResponse } from '../types';
import BiasScoreGauge from './dashboard/BiasScoreGauge';
import PromptComparison from './dashboard/PromptComparison';
import ResponseTabs from './dashboard/ResponseTabs';
import AnalysisAccordion from './dashboard/AnalysisAccordion';
import ReasoningAccordion from './dashboard/ReasoningAccordion';
import ActionBar from './dashboard/ActionBar';

interface ResultsDashboardProps {
  data: AnalysisResponse;
  onAnalyzeAnother: () => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function ResultsDashboard({ data, onAnalyzeAnother }: ResultsDashboardProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="w-full max-w-5xl mx-auto px-4 mt-8 space-y-8"
    >
      <motion.div variants={item} className="flex justify-center">
        <BiasScoreGauge score={data.bias.bias_score} explanation={data.bias.explanation} />
      </motion.div>

      <motion.div variants={item}>
        <PromptComparison original={data.originalPrompt} improved={data.improvedPrompt} />
      </motion.div>

      <motion.div variants={item}>
        <ResponseTabs 
          originalResponse={data.originalResponse} 
          finalResponse={data.finalResponse}
          biasScore={data.bias.bias_score} 
        />
      </motion.div>

      <motion.div variants={item}>
        <AnalysisAccordion explanation={data.bias.explanation} />
      </motion.div>

      <motion.div variants={item}>
        <ReasoningAccordion reasoning={data.reasoning} />
      </motion.div>

      <motion.div variants={item}>
        <ActionBar onAnalyzeAnother={onAnalyzeAnother} data={data} />
      </motion.div>
    </motion.div>
  );
}
