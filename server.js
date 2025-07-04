const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 5000 });

const uzenetek = [];

wss.on('connection', (ws) => {
  console.log('Kliens csatlakozott');
  
  // Küldjük el az összes üzenetet
  ws.send(JSON.stringify(uzenetek));
  
  ws.on('message', (data) => {
    const uzenet = data.toString();
    uzenetek.push(uzenet);
    
    // Küldjük mindenkinek
    wss.clients.forEach((client) => {
      client.send(JSON.stringify(uzenetek));
    });
    
    console.log('Új üzenet:', uzenet);
  });
  
  ws.on('close', () => {
    console.log('Kliens lecsatlakozott');
  });
});

console.log('Szerver fut a 5000-es porton');
  
