import Link from 'next/link';

export default function SiteFooter({ tDesc, tRights, tAdmin }: { tDesc: string, tRights: string, tAdmin: string }) {
  return (
    <footer className="bg-morkbla-900 text-white relative pt-12 pb-10 mt-auto overflow-hidden border-t-8 border-morkbla-300 w-full shrink-0">
      <div className="absolute top-0 w-full h-8 opacity-20 pointer-events-none" style={{ background: "url('https://www.landskrona.se/static/Krona-a64d03cf5f50a5558970d089cc0048de.png') repeat-x center top / contain" }}></div>
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl relative z-10 flex flex-col md:flex-row justify-between items-center mt-6 gap-6">
        <img src="https://www.landskrona.se/static/Logo_footer_VIT-964995edea06d56fc57a5b142fb032a5.svg" alt="Landskrona stad footer logo" className="h-16" />
        <div className="text-center md:text-right text-sm text-morkbla-200">
          <p className="font-semibold text-white mb-1">Landskrona stad</p>
          <p className="mb-1">{tDesc}</p>
          <div className="flex items-center justify-center md:justify-end gap-4 mt-4">
            <p className="text-xs opacity-60">&copy; 2026 Landskrona stad. {tRights}</p>
            <Link href="/admin" className="text-xs opacity-30 hover:opacity-100 transition-opacity focus:outline-none focus:underline">
              {tAdmin}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
