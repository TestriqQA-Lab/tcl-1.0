import { useState, useEffect } from 'react';

/**
 * Custom hook to persist form data to localStorage.
 * 
 * @param key Unique key for localStorage
 * @param isOpen Boolean indicating if the form/modal is open
 * @param initialData Initial data for the form
 * @returns { data, setData, clearDraft }
 */
export function useFormPersistence<T>(
    key: string,
    isOpen: boolean,
    initialData: T
) {
    const [data, setData] = useState<T>(initialData);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load from localStorage when isOpen becomes true, or fallback to initialData
    useEffect(() => {
        if (isOpen) {
            const saved = localStorage.getItem(key);
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    setData(parsed);
                } catch (e) {
                    console.error("Failed to parse saved form data", e);
                    setData(initialData);
                }
            } else {
                setData(initialData);
            }
            setIsInitialized(true);
        } else {
            setIsInitialized(false);
        }
    }, [isOpen, key, JSON.stringify(initialData)]); // Use stringified initialData to avoid deep dependency issues

    // Save to localStorage whenever data changes (if initialized and open)
    useEffect(() => {
        if (isOpen && isInitialized) {
            localStorage.setItem(key, JSON.stringify(data));
        }
    }, [data, isOpen, key, isInitialized]);

    // Clear draft from localStorage
    const clearDraft = () => {
        localStorage.removeItem(key);
    };

    return { data, setData, clearDraft };
}
