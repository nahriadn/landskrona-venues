const fs = require('fs');
let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

const en = `
    "admin.tab_bookings": "Bookings",
    "admin.tab_venues": "Venues (CMS)",
    "admin.manage_venues": "Manage Venues (CMS)",
    "admin.add_venue": "Add new venue",
    "admin.create_venue": "Create new venue",
    "admin.edit_venue": "Edit venue",
    "admin.f_name": "Name",
    "admin.f_image": "Image URL",
    "admin.f_desc": "Description",
    "admin.f_capacity": "Capacity (people)",
    "admin.f_price": "Price (SEK)",
    "admin.btn_cancel": "Cancel",
    "admin.btn_saving": "Saving...",
    "admin.btn_save": "Save changes",
    "admin.lbl_capacity": "Capacity: ",
    "admin.lbl_pers": "people",
    "admin.btn_edit": "Edit",
    "admin.btn_delete": "Delete",
    "admin.block_desc": "Use this form to block selected times in the booking portal for maintenance or internal events.",
    "admin.b_select_venue": "Select Venue",
    "admin.b_select": "Select...",
    "admin.b_date": "Date",
    "admin.b_timeslot": "Time Slot",
    "admin.b_select_time": "Select time...",
    "admin.b_morning": "Morning (08:00 - 12:00)",
    "admin.b_afternoon": "Afternoon (13:00 - 17:00)",
    "admin.b_evening": "Evening (18:00 - 22:00)",
    "admin.b_fullday": "Full Day",
    "admin.b_reason": "Reason (Internal note)",
    "admin.b_reason_ph": "E.g. Renovation, internal meeting...",
    "admin.b_submit": "Block selected time",
    "admin.err_save": "Could not save venues.",
    "admin.confirm_delete": "Are you sure you want to delete this venue?",
    "admin.success_block": "Time has been blocked!",
    "admin.new_venue_name": "New Venue",
    "admin.new_venue_desc": "Description of the new venue...",
    "admin.block_tab": "Block Dates",
    "admin.block_title": "Block Dates / Maintenance",
`;

// Only add it if it's not already there
if (!content.includes('"admin.tab_bookings": "Bookings"')) {
    content = content.replace(/"admin\.title": "Staff Login",/g, en + '\n    "admin.title": "Staff Login",');
    fs.writeFileSync('src/lib/i18n.ts', content);
    console.log("Injected EN keys!");
} else {
    console.log("Already present?");
}
