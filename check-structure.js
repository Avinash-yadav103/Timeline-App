const fs = require('fs');
const path = require('path');

const expectedFiles = [
  'app/page.tsx',
  'app/layout.tsx',
  'components/calendar-app.tsx',
  'components/dashboard.tsx',
  'components/app-sidebar.tsx',
  'components/calendar-view.tsx',
  'components/calendar-header.tsx',
  'components/month-view.tsx',
  'components/week-view.tsx',
  'components/day-view.tsx',
  'components/event-card.tsx',
  'components/event-dialog.tsx',
  'components/date-picker.tsx',
  'components/calendar-view-selector.tsx',
  'components/category-list.tsx',
  'components/notifications.tsx',
  'components/time-picker.tsx',
  'context/calendar-context.tsx',
  'context/theme-context.tsx',
  'hooks/use-calendar.ts',
  'lib/utils.ts',
  'types/index.ts',
  'tailwind.config.js',
  'app/globals.css',
  'components/ui/calendar.tsx',
  'components/ui/input.tsx'
];

function checkFileExists(filePath) {
  return fs.existsSync(path.join(process.cwd(), filePath));
}

console.log('Checking project structure...');

const missingFiles = expectedFiles.filter(file => !checkFileExists(file));

if (missingFiles.length === 0) {
  console.log('All expected files are present!');
} else {
  console.log('The following files are missing:');
  missingFiles.forEach(file => console.log(`- ${file}`));
}