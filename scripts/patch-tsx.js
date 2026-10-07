const fs = require('fs');

// 1. Patch page.tsx
let pageTsx = fs.readFileSync('src/app/page.tsx', 'utf8');
pageTsx = pageTsx.replace(/Officiell Bokningsportal/, '{t("hero.badge" as any, "Officiell Bokningsportal")}');
fs.writeFileSync('src/app/page.tsx', pageTsx);

// 2. Patch Profile Page
let profileTsx = fs.readFileSync('src/app/profile/page.tsx', 'utf8');
if (!profileTsx.includes("import { getTranslation }")) {
  profileTsx = profileTsx.replace("import { redirect } from 'next/navigation';", "import { redirect } from 'next/navigation';\\nimport { getTranslation } from '@/lib/i18n';");
  profileTsx = profileTsx.replace("const lang = cookieStore.get('lang')?.value || 'sv';", "const lang = cookieStore.get('lang')?.value || 'sv';\\n  const t = getTranslation(lang);");
  
  profileTsx = profileTsx.replace(">Mina Sidor<", ">{t('profile.title', 'Mina Sidor')}<");
  profileTsx = profileTsx.replace(">Organisation<", ">{t('profile.org', 'Organisation')}<");
  profileTsx = profileTsx.replace(">Användartyp<", ">{t('profile.type', 'Användartyp')}<");
  profileTsx = profileTsx.replace(">Redigera uppgifter<", ">{t('profile.edit', 'Redigera uppgifter')}<");
  profileTsx = profileTsx.replace(">Dina Kommande Bokningar<", ">{t('profile.bookings', 'Dina Kommande Bokningar')}<");
  profileTsx = profileTsx.replace(">Styrelsemöte<", ">{t('profile.b1_title', 'Styrelsemöte')}<");
  profileTsx = profileTsx.replace(">Mötesrum Konsthallen<", ">{t('profile.b1_venue', 'Mötesrum Konsthallen')}<");
  profileTsx = profileTsx.replace(">Godkänd<", ">{t('profile.approved', 'Godkänd')}<");
  profileTsx = profileTsx.replace(/12 Oktober 2026/g, "12 {t('profile.oct', 'Oktober')} 2026");
  profileTsx = profileTsx.replace(">Årsmöte<", ">{t('profile.b2_title', 'Årsmöte')}<");
  profileTsx = profileTsx.replace(">Hörsalen (Stadsbiblioteket)<", ">{t('profile.b2_venue', 'Hörsalen (Stadsbiblioteket)')}<");
  profileTsx = profileTsx.replace(">Granskas<", ">{t('profile.review', 'Granskas')}<");
  profileTsx = profileTsx.replace(/20 November 2026/g, "20 {t('profile.nov', 'November')} 2026");
  profileTsx = profileTsx.replace(">Behöver du avboka?<", ">{t('profile.cancel_title', 'Behöver du avboka?')}<");
  profileTsx = profileTsx.replace(">Avbokning måste ske senast 24 timmar innan hyrestillfället för att undvika avgift.<", ">{t('profile.cancel_desc', 'Avbokning måste ske senast 24 timmar innan hyrestillfället för att undvika avgift.')}<");
  profileTsx = profileTsx.replace(">Kontakta kundtjänst för avbokning<", ">{t('profile.cancel_btn', 'Kontakta kundtjänst för avbokning')}<");
  fs.writeFileSync('src/app/profile/page.tsx', profileTsx);
}

// 3. Patch Admin Dashboard
let adminTsx = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');
adminTsx = adminTsx.replace(/Spärra Tider \/ Blockera Datum/g, "{t('admin.block_title', 'Spärra Tider / Blockera Datum')}");
adminTsx = adminTsx.replace(/> Spärra Tider/g, "> {t('admin.block_tab', 'Spärra Tider')}");
adminTsx = adminTsx.replace(/>Spärra Tider</g, ">{t('admin.block_tab', 'Spärra Tider')}<");
fs.writeFileSync('src/components/AdminDashboard.tsx', adminTsx);

console.log("TSX Files patched successfully.");
