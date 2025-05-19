const postList: HTMLUListElement = document.querySelector("ul") as HTMLUListElement;

interface IPost {
    date: string;
    content: string;
    username: string;
}

interface IFormattedPost {
    date: string;
    content: string;
    username: string;
}

(async () => {
    const response = await fetch("/posts");
    const responseJson = await response.json();
    const posts: IFormattedPost[] = responseJson.formattedPosts;
    console.log(posts);
    for (const post of posts) {
        const postLi: HTMLLIElement = document.createElement("li");
        const usernameSpan: HTMLSpanElement = document.createElement("span");
        usernameSpan.textContent = `${post.username}`;
        usernameSpan.classList.add("username");

        const dateSpan: HTMLSpanElement = document.createElement("span");
        dateSpan.textContent = `${post.date}`;
        dateSpan.classList.add("date");
        
        postLi.appendChild(usernameSpan); postLi.appendChild(dateSpan);
        const content = document.createTextNode(`${post.content}`);
        const breakRow = document.createElement("br");

        postLi.appendChild(breakRow);
        postLi.appendChild(content);
        postList.appendChild(postLi);
    }
    postList.scrollTop = postList.scrollHeight;
})();

async function post(event?: KeyboardEvent): Promise<void> {
    if (event) {
        if (!(event.ctrlKey && event.key === "Enter")) return;
    }
    if (document.querySelector("textarea")!.value.length > 1000) return;
    const response = await fetch("/create", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: document.querySelector("textarea")!.value, username: document.querySelector("input")!.value })
    });
    document.querySelector("textarea")!.value = "";
    document.querySelector("input")!.value = "";
    console.log(response);
    if (!response.ok) alert("Erro ao postar: mensagem inválida");
}

document.querySelector("textarea")!.addEventListener("keydown", (event: any) => post(event));
document.querySelector("input")!.addEventListener("keydown", (event: any) => post(event));

const eventSource = new EventSource("/events");

eventSource.onmessage = (event): void => {
    const post: IPost = JSON.parse(event.data);
    const postLi: HTMLLIElement = document.createElement("li");

    const usernameSpan: HTMLSpanElement = document.createElement("span");
    usernameSpan.textContent = `${post.username}`;
    usernameSpan.classList.add("username");

    const dateSpan: HTMLSpanElement = document.createElement("span");
    dateSpan.textContent = `${post.date}`;
    dateSpan.classList.add("date");
    postLi.appendChild(usernameSpan); postLi.appendChild(dateSpan);

    const content = document.createTextNode(`${post.content}`);
    const breakRow = document.createElement("br");

    postLi.appendChild(breakRow);
    postLi.appendChild(content);

    postList.appendChild(postLi);
    postList.scrollTop = postList.scrollHeight;
};