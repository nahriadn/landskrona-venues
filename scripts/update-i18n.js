const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

const svKeys = {
    'admin.title': 'Personalinloggning',
    'admin.logged_in': 'Inloggad som Handläggare (Kulturförvaltningen)',
    'admin.export': 'Exportera CSV',
    'admin.block': 'Blockera lokal',
    'admin.kpi_new': 'Nya förfrågningar',
    'admin.kpi_approved': 'Godkända (Veckan)',
    'admin.kpi_occupancy': 'Beläggningsgrad',
    'admin.table_title': 'Hantering av bokningar',
    'admin.search': 'Sök namn eller ID...',
    'admin.filter_all': 'Alla',
    'admin.filter_pending': 'Väntande',
    'admin.col_booking': 'Bokning / Tid',
    'admin.col_user': 'Användare / Organisation',
    'admin.col_venue': 'Lokal',
    'admin.col_status': 'Status',
    'admin.col_action': 'Åtgärd',
    'admin.status_pending': 'Granskas',
    'admin.status_approved': 'Godkänd',
    'admin.status_rejected': 'Avslagen',
    'admin.action_approve': 'Godkänn bokning',
    'admin.action_reject': 'Avslå bokning',
    'admin.action_manage': 'Hantera',
    'admin.no_results': 'Inga resultat',
    'admin.no_results_desc': 'Kunde inte hitta några bokningar som matchar ditt valda filter.'
};

const enKeys = {
    'admin.title': 'Staff Login',
    'admin.logged_in': 'Logged in as Officer (Cultural Administration)',
    'admin.export': 'Export CSV',
    'admin.block': 'Block venue',
    'admin.kpi_new': 'New requests',
    'admin.kpi_approved': 'Approved (This week)',
    'admin.kpi_occupancy': 'Occupancy rate',
    'admin.table_title': 'Booking Management',
    'admin.search': 'Search name or ID...',
    'admin.filter_all': 'All',
    'admin.filter_pending': 'Pending',
    'admin.col_booking': 'Booking / Time',
    'admin.col_user': 'User / Organization',
    'admin.col_venue': 'Venue',
    'admin.col_status': 'Status',
    'admin.col_action': 'Action',
    'admin.status_pending': 'Under review',
    'admin.status_approved': 'Approved',
    'admin.status_rejected': 'Rejected',
    'admin.action_approve': 'Approve booking',
    'admin.action_reject': 'Reject booking',
    'admin.action_manage': 'Manage',
    'admin.no_results': 'No results',
    'admin.no_results_desc': 'Could not find any bookings matching your selected filter.'
};

const daKeys = {
    'admin.title': 'Personalelogin',
    'admin.logged_in': 'Logget ind som Sagsbehandler (Kulturforvaltningen)',
    'admin.export': 'Eksporter CSV',
    'admin.block': 'Bloker lokale',
    'admin.kpi_new': 'Nye anmodninger',
    'admin.kpi_approved': 'Godkendte (Denne uge)',
    'admin.kpi_occupancy': 'Belægningsgrad',
    'admin.table_title': 'Håndtering af bookinger',
    'admin.search': 'Søg navn eller ID...',
    'admin.filter_all': 'Alle',
    'admin.filter_pending': 'Afventende',
    'admin.col_booking': 'Booking / Tid',
    'admin.col_user': 'Bruger / Organisation',
    'admin.col_venue': 'Lokale',
    'admin.col_status': 'Status',
    'admin.col_action': 'Handling',
    'admin.status_pending': 'Gennemgås',
    'admin.status_approved': 'Godkendt',
    'admin.status_rejected': 'Afvist',
    'admin.action_approve': 'Godkend booking',
    'admin.action_reject': 'Afvis booking',
    'admin.action_manage': 'Håndter',
    'admin.no_results': 'Ingen resultater',
    'admin.no_results_desc': 'Kunne ikke finde nogen bookinger, der matcher dit valgte filter.'
};

function inject(langContent, blockStr) {
    return langContent.replace(/(\"auth\.redirecting\": \"[^\"]+\")/, "$1,\n" + blockStr);
}

const buildBlock = (dict) => Object.entries(dict).map(([k, v]) => '    "' + k + '": "' + v + '"').join(',\n');

content = content.replace(/sv: \{[\s\S]*?\},/g, (match) => inject(match, buildBlock(svKeys)));
content = content.replace(/en: \{[\s\S]*?\},/g, (match) => inject(match, buildBlock(enKeys)));
content = content.replace(/da: \{[\s\S]*?\}\n/g, (match) => inject(match, buildBlock(daKeys)));

fs.writeFileSync('src/lib/i18n.ts', content);
