"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const postList = document.querySelector("ul");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch("/posts");
    const responseJson = yield response.json();
    const posts = responseJson.formattedPosts;
    console.log(posts);
    for (const post of posts) {
        const postLi = document.createElement("li");
        const usernameSpan = document.createElement("span");
        usernameSpan.textContent = `${post.username}`;
        usernameSpan.classList.add("username");
        const dateSpan = document.createElement("span");
        dateSpan.textContent = `${post.date}`;
        dateSpan.classList.add("date");
        postLi.appendChild(usernameSpan);
        postLi.appendChild(dateSpan);
        const content = document.createTextNode(`${post.content}`);
        const breakRow = document.createElement("br");
        postLi.appendChild(breakRow);
        postLi.appendChild(content);
        postList.appendChild(postLi);
    }
    postList.scrollTop = postList.scrollHeight;
}))();
function post(event) {
    return __awaiter(this, void 0, void 0, function* () {
        if (event) {
            if (!(event.ctrlKey && event.key === "Enter"))
                return;
        }
        if (document.querySelector("textarea").value.length > 1000)
            return;
        const response = yield fetch("/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: document.querySelector("textarea").value, username: document.querySelector("input").value })
        });
        document.querySelector("textarea").value = "";
        document.querySelector("input").value = "";
        console.log(response);
        if (!response.ok)
            alert("Erro ao postar: mensagem inválida");
    });
}
document.querySelector("textarea").addEventListener("keydown", (event) => post(event));
document.querySelector("input").addEventListener("keydown", (event) => post(event));
const eventSource = new EventSource("/events");
eventSource.onmessage = (event) => {
    const post = JSON.parse(event.data);
    const postLi = document.createElement("li");
    const usernameSpan = document.createElement("span");
    usernameSpan.textContent = `${post.username}`;
    usernameSpan.classList.add("username");
    const dateSpan = document.createElement("span");
    dateSpan.textContent = `${post.date}`;
    dateSpan.classList.add("date");
    postLi.appendChild(usernameSpan);
    postLi.appendChild(dateSpan);
    const content = document.createTextNode(`${post.content}`);
    const breakRow = document.createElement("br");
    postLi.appendChild(breakRow);
    postLi.appendChild(content);
    postList.appendChild(postLi);
    postList.scrollTop = postList.scrollHeight;
};
