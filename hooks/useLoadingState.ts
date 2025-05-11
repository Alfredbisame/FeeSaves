import { useState, useCallback } from 'react';

interface UseLoadingStateProps<T> {
  initialState?: T | null;
  initialLoading?: boolean;
}

export function useLoadingState<T>({ 
  initialState = null, 
  initialLoading = false 
}: UseLoadingStateProps<T> = {}) {
  // State for data, loading, and error
  const [data, setData] = useState<T | null>(initialState);
  const [isLoading, setIsLoading] = useState<boolean>(initialLoading);
  const [error, setError] = useState<Error | null>(null);

  // Function to start and track an async operation
  const execute = useCallback(async <R>(
    asyncFunction: () => Promise<R>,
    onSuccess?: (result: R) => void,
    onError?: (error: Error) => void
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate network delay for better UX with loading indicators
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      // Add a small delay to show the loading state
      const minDelay = 500 + Math.random() * 300; // 500-800ms
      await delay(minDelay);
      
      // Execute the actual async function
      const result = await asyncFunction();
      
      // Type assertion for TypeScript
      setData(result as unknown as T);
      
      // Call onSuccess callback if provided
      onSuccess?.(result);
      
      return result;
    } catch (catchError) {
      // Set error state
      const errorObject = catchError instanceof Error 
        ? catchError 
        : new Error(String(catchError));
      
      setError(errorObject);
      
      // Call onError callback if provided
      onError?.(errorObject);
      
      throw errorObject;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reset all state
  const reset = useCallback(() => {
    setData(initialState);
    setIsLoading(initialLoading);
    setError(null);
  }, [initialState, initialLoading]);

  return {
    data,
    isLoading,
    error,
    execute,
    setData,
    reset,
  };
}