const fs = require('fs');
let content = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

// 1. Import useRef
content = content.replace(
  "import { useState, useEffect } from 'react';",
  "import { useState, useEffect, useRef } from 'react';"
);

// 2. Add Export/Import Functions
const originalUseEffectBlock = `  useEffect(() => {
    fetch('/api/admin/bookings').then(res => res.json()).then(data => setBookings(data.bookings || [])).catch(err => console.error(err));
    fetch('/api/venues').then(res => res.json()).then(data => setVenues(data || [])).catch(console.error);
  }, []);`;

const newFuncBlock = `  const fileInputRef = useRef<HTMLInputElement>(null);

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
    fetch('/api/venues').then(res => res.json()).then(data => setVenues(data || [])).catch(console.error);
  }, []);`;

content = content.replace(originalUseEffectBlock, newFuncBlock);

// Replace CRLF in case it didn't match
if (content.indexOf('exportBookingsCSV') === -1) {
  const originalUseEffectBlockCRLF = originalUseEffectBlock.replace(/\\n/g, '\\r\\n');
  content = content.replace(originalUseEffectBlockCRLF, newFuncBlock);
}

// 3. Add Buttons UI
const originalButtons = \`<button onClick={() => setFilter('all')} className={\\\`px-4 py-2 rounded-lg text-sm font-bold transition-colors \\\${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\\\`}>
                {t('admin.filter_all', 'Alla')}
              </button>\`;

const newButtons = \`<input type="file" accept=".csv" ref={fileInputRef} onChange={handleImportCSV} className="hidden" />
              <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Importera
              </button>
              <button onClick={exportBookingsCSV} className="px-4 py-2 rounded-lg text-sm font-bold bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exportera
              </button>
              <button onClick={() => setFilter('all')} className={\\\`px-4 py-2 rounded-lg text-sm font-bold transition-colors \\\${filter === 'all' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\\\`}>
                {t('admin.filter_all', 'Alla')}
              </button>\`;

content = content.replace(originalButtons, newButtons);

// CRLF fallback
if (content.indexOf('exportBookingsCSV') !== -1 && content.indexOf('Exportera') === -1) {
    const originalButtonsCRLF = originalButtons.replace(/\\n/g, '\\r\\n');
    content = content.replace(originalButtonsCRLF, newButtons);
}

fs.writeFileSync('src/components/AdminDashboard.tsx', content);
