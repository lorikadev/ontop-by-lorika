const LANGUAGES = ['it', 'en'];
const DEFAULT_LANG = 'en';

/**
 * @param url url to analyze
 * @returns the language found inside the url.
 * @note the languages are compared with a dataset of languages used in the project, if not present it will return the default 'en'.
 */
export function getLangFromUrl(url: URL) {
    const [, lang] = url.pathname.split('/');
    if (lang in LANGUAGES) return lang as keyof typeof LANGUAGES;
    return DEFAULT_LANG;
}
