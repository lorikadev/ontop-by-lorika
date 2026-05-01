export function getLocaleFromLang(lang: string): string {
    let locale = '';

    switch (lang) {
        //IT
        case 'it':
            locale = 'it_IT';
            break;
        //EN & DEFAULT
        case 'en':
        default:
            locale = 'it_US';
            break;
    }

    return locale;
}