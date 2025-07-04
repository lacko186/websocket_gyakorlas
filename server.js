const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const port = 5000;

const uzenetek = [];

wss.on('connection', (ws) => {
    console.log('Kliens csatlakozott');
    
  
    ws.send(JSON.stringify({
      tipus: 'elozo_uzenetek',
      uzenetek: uzenetek
    }));
    
    ws.on('message', (data) => {
      try {
        const uzenet = JSON.parse(data);
        
        if (uzenet.tipus === 'uj_uzenet') {
          const ujUzenet = {
            id: Date.now(),
            szoveg: uzenet.szoveg,
            felhasznalo: uzenet.felhasznalo || 'Anonim'
          };
          
       
          uzenetek.push(ujUzenet);
          
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                tipus: 'uj_uzenet',
                uzenet: ujUzenet
              }));
            }
          });
          
          console.log('Új üzenet:', ujUzenet.szoveg);
        }
      } catch (error) {
        console.error('Hiba:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('Kliens lecsatlakozott');
    });
  });
  
  
  
  server.listen(port, () => {
    console.log(`Szerver fut a ${port}-es porton`);
  });
  
