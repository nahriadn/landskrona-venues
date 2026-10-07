const fs = require('fs');

let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

// Strip out the mangled functions at the end
content = content.replace(/\};\r?\n    \}\r?\n    return venue;\r?\n  \}\);\r?\n\}/, '};\n');

// Add them back correctly
content += `
export function getTranslation(lang: string) {
  const dict = translations[lang as keyof typeof translations] || translations.sv;
  return (key: keyof typeof translations.sv, fallback?: string) => {
    return dict[key] || translations.sv[key] || fallback || key;
  };
}

export function getLocalizedVenues(venues: any[], lang: string) {
  if (lang === 'sv') return venues;
  
  return venues.map(venue => {
    const overrides = venueTranslations[venue.id]?.[lang];
    if (overrides) {
      return { ...venue, ...overrides };
    }
    return venue;
  });
}
`;

fs.writeFileSync('src/lib/i18n.ts', content);
