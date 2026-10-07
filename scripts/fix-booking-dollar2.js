const fs = require('fs');

let content = fs.readFileSync('src/components/BookingWidget.tsx', 'utf8');

// Replace using split and join to avoid regex escape hell
content = content.split('\\\\${').join('${');
content = content.split('\\${').join('${');

fs.writeFileSync('src/components/BookingWidget.tsx', content);
