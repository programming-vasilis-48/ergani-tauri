import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the directories to create
const directories = [
  'releases',
  'releases/windows',
  'releases/macos',
  'releases/linux'
];

// Create each directory if it doesn't exist
directories.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    console.log(`Creating directory: ${fullPath}`);
    fs.mkdirSync(fullPath, { recursive: true });
  } else {
    console.log(`Directory already exists: ${fullPath}`);
  }
});

// Create placeholder files in each directory to ensure they are included in git
const placeholders = [
  'releases/windows/README.md',
  'releases/macos/README.md',
  'releases/linux/README.md'
];

const placeholderContent = 
`# Release files directory

This directory will contain release files for the application.

Please do not delete this directory.
`;

placeholders.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (!fs.existsSync(fullPath)) {
    console.log(`Creating placeholder file: ${fullPath}`);
    fs.writeFileSync(fullPath, placeholderContent);
  } else {
    console.log(`Placeholder file already exists: ${fullPath}`);
  }
});

console.log('Directory setup complete!'); 