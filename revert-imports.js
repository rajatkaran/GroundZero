const fs = require('fs');
const path = require('path');

const mappings = {
  'BrandSection': 'home',
  'VendorSection': 'home',
  'OrganizerSection': 'home',
  'OrganizerConnectionsSection': 'home',
  'OrganizerPricingSection': 'home',
  'GenericInfoSection': 'home',
  'BrandCluster': 'home',
  'StatsRowSection': 'home',
  
  'Navigation': 'layout',
  'Footer': 'layout',
  'PortalLayout': 'layout',
  
  'FestivalStallYieldEstimator': 'shared',
  'StallMap': 'shared'
};

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  for (const [component, folder] of Object.entries(mappings)) {
    const regex = new RegExp(`from\\s+['"]@/components/${folder}/${component}['"]`, 'g');
    if (regex.test(content)) {
      content = content.replace(regex, `from "@/components/${component}"`);
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Reverted imports in ' + file);
  }
});
