export const backendUrl = import.meta.env.VITE_BACKEND_URL;

export default function debounce (func, delay) {
    let timeoutId;

    return function(...args) {
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args)   
        }, delay)
    }
}