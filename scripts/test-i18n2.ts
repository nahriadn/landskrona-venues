import { getTranslation, translations } from '../src/lib/i18n';
const t = getTranslation('en');
console.log('EN translations keys:', Object.keys(translations.en).filter(k => k.startsWith('admin.tab')));
console.log('Result of t("admin.tab_bookings"):', t('admin.tab_bookings' as any));
