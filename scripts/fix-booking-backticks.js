const fs = require('fs');

let content = fs.readFileSync('src/components/BookingWidget.tsx', 'utf8');

// The write_to_file tool breaks backticks inside templates.
// We just remove all backticks and fix the string interpolations manually via this script.

content = content.replace(/\\\$\\{/g, '${');
content = content.replace(/\\`/g, '\`');

fs.writeFileSync('src/components/BookingWidget.tsx', content);
