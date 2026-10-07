const fs = require('fs');
let c = fs.readFileSync('src/lib/i18n.ts', 'utf8');

const enProfile = `
    "profile.title": "My Pages",
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
    "profile.cancel_desc": "Cancellation must be made no later than 24 hours before the rental period to avoid charges.",
    "profile.cancel_btn": "Contact customer service to cancel",
`;

if (!c.includes('"profile.title": "My Pages"')) {
  c = c.replace(/"auth\.redirecting": "Redirecting you to the booking portal\.\.\.",/g, '"auth.redirecting": "Redirecting you to the booking portal...",\n' + enProfile);
  fs.writeFileSync('src/lib/i18n.ts', c);
  console.log("Injected EN profile keys!");
} else {
  console.log("Profile keys already present.");
}
