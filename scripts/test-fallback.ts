import { getTranslation } from '../src/lib/i18n';
const t = getTranslation('en');
console.log('With fallback:', t('admin.tab_bookings' as any, 'Bokningar'));
console.log('Missing key fallback:', t('does_not_exist' as any, 'FallbackVal'));
