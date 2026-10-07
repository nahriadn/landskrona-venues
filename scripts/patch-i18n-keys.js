const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

const profileSv = `"profile.title": "Mina Sidor",
    "profile.org": "Organisation",
    "profile.type": "Användartyp",
    "profile.edit": "Redigera uppgifter",
    "profile.bookings": "Dina Kommande Bokningar",
    "profile.b1_title": "Styrelsemöte",
    "profile.b1_venue": "Mötesrum Konsthallen",
    "profile.approved": "Godkänd",
    "profile.oct": "Oktober",
    "profile.b2_title": "Årsmöte",
    "profile.b2_venue": "Hörsalen (Stadsbiblioteket)",
    "profile.review": "Granskas",
    "profile.nov": "November",
    "profile.cancel_title": "Behöver du avboka?",
    "profile.cancel_desc": "Avbokning måste ske senast 24 timmar innan hyrestillfället för att undvika avgift.",
    "profile.cancel_btn": "Kontakta kundtjänst för avbokning",
`;

const adminSv = `"admin.block_title": "Spärra Tider / Blockera Datum",
    "admin.block_tab": "Spärra Tider",
    "admin.select_venue": "Välj Lokal",
    "admin.date": "Datum",
    "admin.time_ph": "Tid (ex. 08:00 - 12:00)",
    "admin.reason": "Orsak (Valfritt)",
    "admin.create_block": "Skapa Spärr",
`;

// Add SV translations
content = content.replace(/"menu\.contact": "Kontakta oss",/g, profileSv + adminSv + '    "menu.contact": "Kontakta oss",');

// Add EN translations
const profileEn = `"profile.title": "My Pages",
    "profile.org": "Organization",
    "profile.type": "User Type",
    "profile.edit": "Edit details",
    "profile.bookings": "Your Upcoming Bookings",
    "profile.b1_title": "Board Meeting",
    "profile.b1_venue": "Meeting Room Art Gallery",
    "profile.approved": "Approved",
    "profile.oct": "October",
    "profile.b2_title": "Annual Meeting",
    "profile.b2_venue": "Auditorium (City Library)",
    "profile.review": "Under Review",
    "profile.nov": "November",
    "profile.cancel_title": "Need to cancel?",
    "profile.cancel_desc": "Cancellation must be made at least 24 hours before the rental period to avoid fees.",
    "profile.cancel_btn": "Contact customer service for cancellation",
`;

const adminEn = `"admin.block_title": "Block Times / Block Dates",
    "admin.block_tab": "Block Times",
    "admin.select_venue": "Select Venue",
    "admin.date": "Date",
    "admin.time_ph": "Time (e.g. 08:00 - 12:00)",
    "admin.reason": "Reason (Optional)",
    "admin.create_block": "Create Block",
`;

content = content.replace(/"menu\.contact": "Contact Us",/g, profileEn + adminEn + '    "menu.contact": "Contact Us",');

// Add DA translations
const profileDa = `"profile.title": "Mine Sider",
    "profile.org": "Organisation",
    "profile.type": "Brugertype",
    "profile.edit": "Rediger oplysninger",
    "profile.bookings": "Dine kommende bookinger",
    "profile.b1_title": "Bestyrelsesmøde",
    "profile.b1_venue": "Mødelokale Kunsthallen",
    "profile.approved": "Godkendt",
    "profile.oct": "Oktober",
    "profile.b2_title": "Årsmøde",
    "profile.b2_venue": "Foredragssalen (Stadsbiblioteket)",
    "profile.review": "Gennemgås",
    "profile.nov": "November",
    "profile.cancel_title": "Brug for at aflyse?",
    "profile.cancel_desc": "Afbestilling skal ske senest 24 timer før lejeperioden for at undgå gebyrer.",
    "profile.cancel_btn": "Kontakt kundeservice for afbestilling",
`;

const adminDa = `"admin.block_title": "Bloker Tider / Bloker Datoer",
    "admin.block_tab": "Bloker Tider",
    "admin.select_venue": "Vælg Lokale",
    "admin.date": "Dato",
    "admin.time_ph": "Tid (f.eks. 08:00 - 12:00)",
    "admin.reason": "Årsag (Valgfrit)",
    "admin.create_block": "Opret Blokering",
`;

content = content.replace(/"menu\.contact": "Kontakt os",/g, profileDa + adminDa + '    "menu.contact": "Kontakt os",');

fs.writeFileSync('src/lib/i18n.ts', content);
