const fs = require('fs');
const path = require('path');

const replacements = [
  ["Zargigs Technologies", "DocsZar Technologies"],
  ["zargigstechnologies@gmail.com", "contactdocszar@gmail.com"],
  ["contactzargigs@gmail.com", "contactdocszar@gmail.com"],
  ["contactgigsflix@gmail.com", "contactdocszar@gmail.com"],
  ["gigsflixtechnologies@gmail.com", "contactdocszar@gmail.com"],
  ["ZARGIGS ENTERPRISE", "DOCSZAR ENTERPRISE"],
  ["ZARGIGS", "DOCSZAR"],
  ["Zargigs", "DocsZar"],
  ["zargigs", "docszar"],
  ["GigsFlix", "DocsZar"],
  ["Gigsflix", "DocsZar"],
  ["gigsflix.com", "docszar.com"],
  ["zargigs.com", "docszar.com"]
];

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        processDir(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jsx', '.js', '.html', '.json', '.sql', '.ts', '.md', '.css'].includes(ext)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let orig = content;
        for (const [oldVal, newVal] of replacements) {
          content = content.split(oldVal).join(newVal);
        }
        if (content !== orig) {
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Updated: ${fullPath}`);
        }
      }
    }
  }
}

['frontend', 'supabase'].forEach(dir => {
  if (fs.existsSync(dir)) processDir(dir);
});

console.log('Renaming to DocsZar completed!');
