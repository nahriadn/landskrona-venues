const fs = require('fs');

let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

const injection = `  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchBookings = () => {
    fetch('/api/admin/bookings').then(res => res.json()).then(data => setBookings(data.bookings || [])).catch(err => console.error(err));
  };

  const exportBookingsCSV = () => {
    const headers = ["ID", "Skapad", "Typ", "Lokal ID", "Datum", "Tid", "Bokare", "E-post", "OrgNummer", "Status"];
    const rows = bookings.map(b => [
      b.id,
      new Date(b.booked_at).toLocaleString('sv-SE').replace(',', ''),
      b.type || '',
      b.venue_id || '',
      b.date || '',
      b.slot_time || '',
      '"' + (b.name || '') + '"',
      '"' + (b.email || '') + '"',
      '"' + (b.orgNum || '') + '"',
      b.status || ''
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", 'Bokningar_' + new Date().toISOString().split('T')[0] + '.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split('\\n');
      let successCount = 0;
      
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',');
        if (cols.length >= 10) {
          const id = cols[0];
          let status = cols[9].replace(/\\r/g, '').trim();
          
          if (id && (status === 'approved' || status === 'rejected' || status === 'pending')) {
            const { error } = await supabase.from('bookings').update({ status }).eq('id', id);
            if (!error) successCount++;
          }
        }
      }
      showAlert('Importerade och uppdaterade ' + successCount + ' bokningar från CSV-filen.');
      fetchBookings(); 
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    fetchBookings();
    fetch('/api/admin/venues').then(res => res.json()).then(data => setVenues(data.venues || [])).catch(err => console.error(err));
  }, []);`;

// find the exact line to replace
content = content.replace(
  /const \[bookings, setBookings\] = useState<any\[\]>\(\[\]\);\n  const \[venues, setVenues\] = useState<any\[\]>\(\[\]\);\n\s*useEffect\(\(\) => \{\n\s*fetch\('\/api\/admin\/bookings'\)[\s\S]*?\}, \[\]\);/,
  `const [bookings, setBookings] = useState<any[]>([]);\n  const [venues, setVenues] = useState<any[]>([]);\n\n` + injection
);

// Add the buttons to the UI
const buttonUI = `<div className="flex gap-2">
                <input type="file" accept=".csv" ref={fileInputRef} onChange={handleImportCSV} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Importera (.csv)
                </button>
                <button onClick={exportBookingsCSV} className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Exportera (.csv)
                </button>
                <button onClick={() => setFilter('all')}`;

content = content.replace(
  /<button onClick=\{\(\) => setFilter\('all'\)/,
  buttonUI
);

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
