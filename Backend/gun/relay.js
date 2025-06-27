const Gun = require('gun');
require('gun/lib/open.js');  // Add open API support
require('gun/lib/load.js');  // Add load API support
require('gun/lib/then.js');  // Add promise support

const setupGunRelay = (server) => {
  console.log('🔫 Setting up GunDB relay...');
  
  const gun = Gun({
    web: server,
    file: 'gundb',
    radisk: true,
    multicast: false,
    axe: false,
    peers: ['http://localhost:5000/gun'],  // Add self as peer
    localStorage: false  // Disable localStorage for server
  });

  // Debug logging for all incoming data
  gun.on('in', function(msg) {
    console.log('📥 GunDB Incoming:', msg.put || msg);
    this.to.next(msg);
  });

  // Debug logging for all outgoing data
  gun.on('out', function(msg) {
    console.log('📤 GunDB Outgoing:', msg.put || msg);
    this.to.next(msg);
  });

  // Handle any errors
  gun.on('error', function(err) {
    console.error('❌ GunDB Error:', err);
  });

  console.log('✅ GunDB relay setup complete');
  return gun;
};

// Export a test function to verify GunDB is working
const testGunDB = (gun) => {
  return new Promise((resolve, reject) => {
    try {
      const testData = { test: 'data', timestamp: Date.now() };
      gun.get('test').put(testData, (ack) => {
        if (ack.err) {
          reject(ack.err);
        } else {
          gun.get('test').once((data) => {
            resolve(data);
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { setupGunRelay, testGunDB };