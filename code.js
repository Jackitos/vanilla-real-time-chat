"use strict";

const input = document.querySelector(".input");
const button = document.querySelector(".button");
const chatContainer = document.querySelector(".chat-container");

if (navigator.serviceWorker) {
    navigator.serviceWorker.register("sw.js");
}

// EVENTO: cuando se esta escribiendo en el input que aparezca el boton
input.addEventListener("input", () => {
    if (input.value) {
        button.classList.add("appear"); // agregar la clase "appear" al boton
        button.classList.remove("disappear"); // quitar la clase "disappear" al boton
    }
    else {
        button.classList.remove("appear"); // quitar la clase "appear" al boton
        button.classList.add("disappear"); // agregar la clase "disappear" al boton
    }
});

// EVENTO: cuando se hace click en el boton
button.addEventListener("click", () => {
    if(input.value){
        sendMessage(); // enviar el mensaje al Service Worker
        createElement(input.value, true); // crear y agregar el mensaje en la ventana del chat
        input.value = ""; // limpiar el input
        input.classList.remove("appear"); // quitar la clase "appear" al input
        button.classList.add("disappear"); // agregar la clase "disappear" al boton
    }
});

// EVENTO: cuando se presiona la tecla Enter
document.addEventListener("keydown", e => {
    if(e.key === "Enter"){
        if(input.value){
            e.preventDefault(); // prevenir el comportamiento por defecto de la tecla Enter
            sendMessage(); // enviar el mensaje al Service Worker
            createElement(input.value, true); // crear y agregar el mensaje en la ventana del chat
            input.value = ""; // limpiar el input
            input.classList.remove("appear"); // quitar la clase "appear" al input
            button.classList.add("disappear"); // agregar la clase "disappear" al boton
        }
    }
});

// Escuchar mensajes del Service Worker
navigator.serviceWorker.addEventListener("message", e => {
    if(e.data.type === "message"){ // Si el mensaje es de tipo "message" significa que es un mensaje de otra pestaña
        sendMessage(); // enviar el mensaje al Service Worker
        createElement(e.data.msg, false); // crear y agregar el mensaje en la ventana del chat
    }
    else if(e.data.type === "clientList"){ // Si el mensaje es de tipo "clientList" significa que quiero obtener la lista de clientes conectados
        console.log("Clientes conectados:", e.data.clients); // Mostrar en consola la lista de clientes conectados
    }
    else if(e.data.type === "setName"){ // Si el mensaje es de tipo "setName" significa que quiero poner el nombre del contacto en la ventana
        const contactNameElement = document.getElementById("contact-name"); // Obtener el elemento del nombre del contacto
        contactNameElement.textContent = e.data.name; // Poner el nombre del contacto en el elemento
    }
});

function createElement(msg, isUser){
    const msgContainer = document.createElement("div");
    msgContainer.classList.add(isUser ? "msg-data-container2" : "msg-data-container");

    const msgText = document.createElement("p");
    msgText.textContent = msg;

    const timeText = document.createElement("p");
    const now = new Date();
    timeText.textContent = `${now.getHours()}:${now.getMinutes() < 10 ? '0' : ''}${now.getMinutes()}`;
    timeText.classList.add("time");

    msgContainer.appendChild(msgText);
    msgContainer.appendChild(timeText);

    chatContainer.appendChild(msgContainer);

    scrollToBottom();
};

function sendMessage() {
    const msg = input.value;
    if(msg){
        navigator.serviceWorker.ready.then(res => {
            res.active.postMessage({type: "message", msg});
        });
    }
    // const msg = input.value;
    // if(msg){
    //     navigator.serviceWorker.ready.then(res => {
    //         res.active.postMessage(msg);
    //     });
    // }
};

function requestClients(){
    navigator.serviceWorker.ready.then(res => {
        res.active.postMessage({ type: "getClients" });
    });
};

function scrollToBottom(){
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

requestClients();