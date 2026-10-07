const fs = require('fs');

let content = fs.readFileSync('src/lib/i18n.ts', 'utf8');

content = content.replace(
  /"widget\.select_date": "Välj datum & tid",/g,
  `"widget.select_date": "Välj datum & tid",\n    "widget.select_time": "Välj ledig tid",`
);

content = content.replace(
  /"widget\.select_date": "Select Date & Time",/g,
  `"widget.select_date": "Select Date & Time",\n    "widget.select_time": "Select an available time",`
);

content = content.replace(
  /"widget\.select_date": "Vælg dato og tid",/g,
  `"widget.select_date": "Vælg dato og tid",\n    "widget.select_time": "Vælg en ledig tid",`
);

fs.writeFileSync('src/lib/i18n.ts', content);
