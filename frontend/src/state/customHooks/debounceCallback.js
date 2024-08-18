import { useCallback, useRef } from 'react';

export default function useDebouncedCallback(callback, delay) {
    let timeoutRef = useRef(null);

    const debouncedFunction = useCallback((...args) => {
        if(timeoutRef.current) clearTimeout(timeoutRef.current);
        
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay)
    }, [callback, delay])

    return debouncedFunction;
}