// Force English locale for date/time inputs
export const forceEnglishLocale = () => {
    // Override the default locale for date/time inputs
    if (typeof window !== 'undefined') {
        // Set document language
        document.documentElement.lang = 'en-US';
        document.documentElement.setAttribute('lang', 'en-US');

        // Override navigator language temporarily for date/time pickers
        Object.defineProperty(navigator, 'language', {
            get: function () { return 'en-US'; },
            configurable: true
        });

        Object.defineProperty(navigator, 'languages', {
            get: function () { return ['en-US', 'en']; },
            configurable: true
        });

        // Force all date/time inputs to use English
        const forceInputLocale = () => {
            const inputs = document.querySelectorAll('input[type="date"], input[type="time"], input[type="datetime-local"]');
            inputs.forEach(input => {
                const htmlInput = input as HTMLInputElement;
                htmlInput.setAttribute('lang', 'en-US');
                htmlInput.setAttribute('data-locale', 'en-US');
            });
        };

        // Apply immediately and on DOM changes
        forceInputLocale();

        // Use MutationObserver to apply to dynamically added inputs
        const observer = new MutationObserver(forceInputLocale);
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
};
