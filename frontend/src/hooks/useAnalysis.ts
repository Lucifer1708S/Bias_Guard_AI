import { useState, useCallback, useRef, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import type { AnalysisResponse } from '../types';

const API_BASE_URL = 'https://bias-guard-ai.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60s timeout
});

export function useAnalysis() {
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const analyze = useCallback(async (prompt: string) => {
    // Abort previous request if still running
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await api.post<AnalysisResponse>(
        '/api/analyze',
        { prompt },
        { signal: abortControllerRef.current.signal }
      );
      
      setData(response.data);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log('Request canceled', err.message);
      } else {
        const error = err as AxiosError<{detail?: string}>;
        const message = error.response?.data?.detail 
          || error.message 
          || 'An unexpected error occurred during analysis.';
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const clearData = useCallback(() => {
    setData(null);
    setError(null);
  }, []);

  return { data, loading, error, analyze, clearData };
}
