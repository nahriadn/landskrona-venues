const fs = require('fs');

let content = fs.readFileSync('src/components/BookingWidget.tsx', 'utf8');

// Replace all instances of \${ with ${
content = content.replace(/\\\$\\{/g, '${');

fs.writeFileSync('src/components/BookingWidget.tsx', content);
