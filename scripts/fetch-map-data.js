const https = require('https');
const fs = require('fs');
const path = require('path');

const MAPS_DIR = path.join(__dirname, '../assets/maps');

// Ensure maps directory exists
if (!fs.existsSync(MAPS_DIR)) {
  fs.mkdirSync(MAPS_DIR, { recursive: true });
}

// URLs for Natural Earth Data (simplified versions)
const DATA_URLS = {
  states: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson',
  countries: 'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson'
};

// Download and process files
Object.entries(DATA_URLS).forEach(([key, url]) => {
  https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      try {
        const geojson = JSON.parse(data);
        console.log(`Processing ${key} data...`);
        
        // Filter and simplify the features
        const simplified = {
          type: "FeatureCollection",
          features: geojson.features.map(feature => ({
            type: "Feature",
            properties: {
              name: feature.properties.name || feature.properties.NAME || feature.properties.admin,
              admin: feature.properties.admin || feature.properties.ADMIN,
              postal: feature.properties.postal || feature.properties.POSTAL
            },
            geometry: {
              type: feature.geometry.type,
              coordinates: feature.geometry.coordinates
            }
          }))
        };

        if (key === 'states') {
          // Only keep US states
          console.log('Total states/provinces before filtering:', simplified.features.length);
          simplified.features = simplified.features.filter(f => 
            f.properties.admin === 'United States of America' || 
            f.properties.postal?.startsWith('US-')
          );
          console.log('US states after filtering:', simplified.features.length);
          
          // Clean up the names to just show state names
          simplified.features = simplified.features.map(f => ({
            ...f,
            properties: {
              name: f.properties.name.replace('US-', '').replace('United States of America', '')
            }
          }));
        }

        fs.writeFileSync(
          path.join(MAPS_DIR, `${key}.json`),
          JSON.stringify(simplified, null, 2)
        );
        console.log(`Downloaded and processed ${key} data`);
      } catch (err) {
        console.error(`Error processing ${key} data:`, err);
      }
    });
  }).on('error', (err) => {
    console.error(`Error downloading ${key} data:`, err);
  });
}); 