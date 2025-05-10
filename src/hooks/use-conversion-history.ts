
'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ConversionHistoryItem, UnitCategory } from '@/types';

const HISTORY_KEY = 'swapUnitsConversionHistory';
const MAX_HISTORY_ITEMS = 15;

export function useConversionHistory() {
  const [history, setHistory] = useState<ConversionHistoryItem[]>([]);

  useEffect(() => {
    // Load history from localStorage on initial mount
    if (typeof window !== 'undefined') {
      try {
        const storedHistory = localStorage.getItem(HISTORY_KEY);
        if (storedHistory) {
          setHistory(JSON.parse(storedHistory));
        }
      } catch (error) {
        console.error("Error reading conversion history from localStorage:", error);
        // Initialize with empty array if localStorage is corrupt or inaccessible
        setHistory([]);
      }
    }
  }, []);

  const addHistoryItem = useCallback((itemData: {
    category: UnitCategory;
    fromValue: number;
    fromUnit: string;
    toValue: number;
    toUnit: string;
  }) => {
    const newItem: ConversionHistoryItem = {
      ...itemData,
      id: crypto.randomUUID(), // Modern way to generate UUIDs
      timestamp: Date.now(),
    };

    setHistory(prevHistory => {
      const updatedHistory = [newItem, ...prevHistory].slice(0, MAX_HISTORY_ITEMS);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
        } catch (error) {
          console.error("Error saving conversion history to localStorage:", error);
          // Potentially handle quota exceeded errors here
        }
      }
      return updatedHistory;
    });
  }, []);
  
  const clearHistory = useCallback(() => {
    setHistory([]);
    if (typeof window !== 'undefined') {
        try {
            localStorage.removeItem(HISTORY_KEY);
        } catch (error) {
            console.error("Error clearing conversion history from localStorage:", error);
        }
    }
  }, []);


  return { history, addHistoryItem, clearHistory };
}
