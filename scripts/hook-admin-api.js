const fs = require('fs');
let c = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

c = c.replace(/const \[bookings, setBookings\] = useState\(mockBookingsData\);/, `
  const [bookings, setBookings] = useState<any[]>([]);
  useEffect(() => {
    fetch('/api/admin/bookings')
      .then(res => res.json())
      .then(data => setBookings(data.bookings || []))
      .catch(err => console.error(err));
  }, []);
`);

c = c.replace(/<form className="space-y-6" onSubmit=\{\(e\) => \{ e\.preventDefault\(\); alert\(t\('admin\.success_block', 'Tiden har spärrats!'\)\); \}\}>/, `
  <form className="space-y-6" onSubmit={async (e) => { 
    e.preventDefault(); 
    const form = e.target;
    const venueId = form.elements[0].value;
    const date = form.elements[1].value;
    const slotTime = form.elements[2].value;
    const reason = form.elements[3].value;
    
    if (!venueId || !date || !slotTime) {
      alert("Missing fields"); return;
    }
    
    await fetch('/api/admin/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ venueId, date, slotTime, reason })
    });
    
    alert(t('admin.success_block', 'Tiden har spärrats!')); 
    
    // Refresh bookings
    fetch('/api/admin/bookings')
      .then(res => res.json())
      .then(data => setBookings(data.bookings || []));
  }}>
`);

fs.writeFileSync('src/components/AdminDashboard.tsx', c);
