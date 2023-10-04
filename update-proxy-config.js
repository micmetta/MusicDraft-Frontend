const { exec } = require('child_process');
const fs = require('fs');

const child = require('child_process').exec('minikube service api-gateway --url');
child.stdout.on('data',(data)=>{
  const proxyConfig = {
    '/api/v1/': {
      target: data.slice(0,-1),
      secure: false
    }
  };

  // Scrivi il file proxy.conf.json con l'URL corrente
  fs.writeFileSync('proxy.conf.json', JSON.stringify(proxyConfig, null, 2));

  console.log(`Configurazione proxy aggiornata con successo con l'URL: ${data}`);

  const ngServeChild = require('child_process').exec('ng serve --proxy-config proxy.conf.json');

  ngServeChild.stdout.on('data', (ngServeData) => {
    console.log(`Output di 'ng serve': ${ngServeData}`);
  });

  ngServeChild.stderr.on('data', (ngServeError) => {
    console.error(`Errore di 'ng serve': ${ngServeError}`);
  });
});






