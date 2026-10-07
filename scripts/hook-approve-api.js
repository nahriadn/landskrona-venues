const fs = require('fs');
let c = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

c = c.replace(/setBookings\(bookings\.map\(b => b\.id === id \? \{ \.\.\.b, status: newStatus \} : b\)\);/, `
    setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
    
    // Sync with backend to actually lock/unlock the slot globally
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      if (newStatus === 'approved') {
        fetch('/api/admin/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ venueId: booking.venueId, date: booking.date, slotTime: booking.slotTime, reason: booking.user + ' (Approved)' })
        }).catch(console.error);
      }
    }
`);

fs.writeFileSync('src/components/AdminDashboard.tsx', c);
