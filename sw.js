self.addEventListener("install", e => { // El evento "install" se dispara cuando el service worker se instala
    console.log("Instalando service worker");
});

self.addEventListener("activate", e => { // El evento "activate" se dispara cuando el service worker se activa
    console.log("Service worker activo");
});

self.addEventListener("message", e => {
    if(e.data.type === "getClients"){
        self.clients.matchAll().then(clients => {
            e.source.postMessage({ type: "clientList", clients: clients.map(client => ({ id: client.id, url: client.url })) });
        }).catch(err => {
            console.error("Error al obtener los clientes", err);
        });
    }
    else if(e.data.type === "message"){
        self.clients.matchAll().then(clients => {
            clients.forEach(client => {
                if(client.id != e.source.id){
                    client.postMessage({ type: "message", msg: e.data.msg });
                }
            });
        });
    }
});

self.addEventListener("message", e => {
    self.clients.matchAll().then(clients => {
        const clientNames = {};
        const names = ["Toto", "Nico"]; // Nombres personalizados

        clients.forEach((client, index) => {
            // Asigna nombres basados en la URL del cliente
            if (client.url.includes('index.html')) {
                clientNames[client.id] = names[index] || `Cliente ${index + 1}`;
            }
        });

        clients.forEach(client => {
            const name = clientNames[client.id];
            client.postMessage({ type: "setName", name: name });
        });
    }).catch(error => {
        console.error("Error al obtener los clientes: ", error);
    });
});