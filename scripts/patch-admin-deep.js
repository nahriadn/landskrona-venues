const fs = require('fs');

let c = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf8');

c = c.replace(/Bokningar/g, "{t('admin.tab_bookings', 'Bokningar')}");
c = c.replace(/Lokaler \(CMS\)/g, "{t('admin.tab_venues', 'Lokaler (CMS)')}");
c = c.replace(/Hantera Lokaler \(CMS\)/g, "{t('admin.manage_venues', 'Hantera Lokaler (CMS)')}");
c = c.replace(/Lägg till ny lokal/g, "{t('admin.add_venue', 'Lägg till ny lokal')}");
c = c.replace(/'Skapa ny lokal' : 'Redigera lokal'/g, "t('admin.create_venue', 'Skapa ny lokal') : t('admin.edit_venue', 'Redigera lokal')");
c = c.replace(/>Namn</g, ">{t('admin.f_name', 'Namn')}<");
c = c.replace(/>Bild-URL</g, ">{t('admin.f_image', 'Bild-URL')}<");
c = c.replace(/>Beskrivning</g, ">{t('admin.f_desc', 'Beskrivning')}<");
c = c.replace(/>Kapacitet \(antal pers\)</g, ">{t('admin.f_capacity', 'Kapacitet (antal pers)')}<");
c = c.replace(/>Pris \(kr\)</g, ">{t('admin.f_price', 'Pris (kr)')}<");
c = c.replace(/>Avbryt</g, ">{t('admin.btn_cancel', 'Avbryt')}<");
c = c.replace(/'Sparar\.\.\.' :/g, "t('admin.btn_saving', 'Sparar...') :");
c = c.replace(/> Spara ändringar</g, "> {t('admin.btn_save', 'Spara ändringar')}<");
c = c.replace(/Kapacitet: /g, "{t('admin.lbl_capacity', 'Kapacitet: ')}");
c = c.replace(/ pers/g, " {t('admin.lbl_pers', 'pers')}");
c = c.replace(/> Redigera</g, "> {t('admin.btn_edit', 'Redigera')}<");
c = c.replace(/> Ta bort</g, "> {t('admin.btn_delete', 'Ta bort')}<");

c = c.replace(/>Använd detta formulär för att spärra utvalda tider i bokningsportalen för underhåll eller interna evenemang\.</g, ">{t('admin.block_desc', 'Använd detta formulär för att spärra utvalda tider i bokningsportalen för underhåll eller interna evenemang.')}<");
c = c.replace(/>Välj Lokal</g, ">{t('admin.b_select_venue', 'Välj Lokal')}<");
c = c.replace(/>Välj\.\.\.</g, ">{t('admin.b_select', 'Välj...')}<");
c = c.replace(/>Datum</g, ">{t('admin.b_date', 'Datum')}<");
c = c.replace(/>Tidslucka</g, ">{t('admin.b_timeslot', 'Tidslucka')}<");
c = c.replace(/>Välj tid\.\.\.</g, ">{t('admin.b_select_time', 'Välj tid...')}<");
c = c.replace(/>Förmiddag \(08:00 - 12:00\)</g, ">{t('admin.b_morning', 'Förmiddag (08:00 - 12:00)')}<");
c = c.replace(/>Eftermiddag \(13:00 - 17:00\)</g, ">{t('admin.b_afternoon', 'Eftermiddag (13:00 - 17:00)')}<");
c = c.replace(/>Kväll \(18:00 - 22:00\)</g, ">{t('admin.b_evening', 'Kväll (18:00 - 22:00)')}<");
c = c.replace(/>Heldag</g, ">{t('admin.b_fullday', 'Heldag')}<");
c = c.replace(/>Anledning \(Intern anteckning\)</g, ">{t('admin.b_reason', 'Anledning (Intern anteckning)')}<");
c = c.replace(/placeholder="T\.ex\. Renovering, internt möte\.\.\."/g, "placeholder={t('admin.b_reason_ph', 'T.ex. Renovering, internt möte...') as string}");
c = c.replace(/> Spärra vald tid</g, "> {t('admin.b_submit', 'Spärra vald tid')}<");

// And fix the alert messages in component
c = c.replace(/"Kunde inte spara lokalerna\."/g, "t('admin.err_save', 'Kunde inte spara lokalerna.')");
c = c.replace(/"Är du säker på att du vill ta bort denna lokal\?"/g, "t('admin.confirm_delete', 'Är du säker på att du vill ta bort denna lokal?')");
c = c.replace(/'Tiden har spärrats!'/g, "t('admin.success_block', 'Tiden har spärrats!')");
c = c.replace(/"Ny Lokal"/g, "t('admin.new_venue_name', 'Ny Lokal') as string");
c = c.replace(/"Beskrivning av den nya lokalen\.\.\."/g, "t('admin.new_venue_desc', 'Beskrivning av den nya lokalen...') as string");

fs.writeFileSync('src/components/AdminDashboard.tsx', c);
