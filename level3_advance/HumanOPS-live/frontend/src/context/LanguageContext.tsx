import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Language } from '../i18n/translations';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof translations['en']) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguage] = useState<Language>('fr'); // Default to French as per original app, or 'en' if desired. User asked for switch, let's stick to 'fr' default or maybe 'en' since we just translated everything to En? 
    // Actually the user just translated everything to EN in the codebase. 
    // If I default to 'fr', I need to verify if the 't' function returns the FR string.
    // Since the codebase is now hardcoded to EN, using 'en' as default might match the current UI state, 
    // BUT the goal is to have a switch.
    // Reverting: The user previously translated "hardcoded strings". 
    // Now we are re-introducing dynamic strings.
    // If the previous step was "Update frontend hardcoded strings to English", checking `task.md`, it was done.
    // So the code IS in English. 
    // If I implement this, I should probably use 'en' as default to match the current text, OR 'fr' if we want to test the switch.
    // Let's use 'en' as default to match current state, or check if persistence is needed.
    // Adding persistence to localStorage is good practice.

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && (savedLang === 'fr' || savedLang === 'en')) {
            setLanguage(savedLang);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (key: keyof typeof translations['en']) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
