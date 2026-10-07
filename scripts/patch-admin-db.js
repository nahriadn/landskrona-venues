const fs = require('fs');

let admin = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

admin = admin.replace(
  /if \(booking\) \{\s*if \(newStatus === 'approved'\) \{\s*fetch\('\/api\/admin\/bookings', \{\s*method: 'POST',\s*headers: \{ 'Content-Type': 'application\/json' \},\s*body: JSON\.stringify\(\{ venueId: booking\.venueId, date: booking\.date, slotTime: booking\.slotTime, reason: booking\.user \+ ' \(Approved\)' \}\)\s*\}\)\.catch\(console\.error\);\s*\}\s*\}/g,
  `if (booking && booking.id.startsWith('REQ-')) {
        fetch('/api/admin/bookings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reqId: booking.id, status: newStatus })
        }).catch(console.error);
      }`
);

fs.writeFileSync('src/components/AdminDashboard.tsx', admin);
