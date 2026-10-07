const fs = require('fs');
let content = fs.readFileSync('src/components/BookingWidget.tsx', 'utf8');
content = content.replace(
  "import { Calendar as CalendarIcon, Clock, User, CheckCircle, ChevronRight, ChevronLeft, Building, Mail } from 'lucide-react';",
  "import { Calendar as CalendarIcon, Clock, User, CheckCircle, ChevronRight, ChevronLeft, Building, Mail, XCircle } from 'lucide-react';"
);
fs.writeFileSync('src/components/BookingWidget.tsx', content);
