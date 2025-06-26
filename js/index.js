const form = document.querySelector("#github-form")
const userList = document.getElementById("user-list")
debugger;

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const log = document.getElementById("search").value;
    fetch("https://api.github.com/search/users?q=octocat", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/vnd.github.v3+json"
        },
    })
    .then(res => {
        if(!res.ok){
            throw new Error("NO rsp");
        }
        return res.json();
    })
    .then(data => {
        displayUsers(data.items);
    })
    .catch(error => {
        console.error("There has been a problem with your fetch operation:", error);
    });
})
  // username: li; avatar: img; link: a;

function displayUsers(users){
    userList.innerHTML = "";
    users.forEach(user => {
        const li = document.createElement("li");
        li.textContent = user.login;
        userList.appendChild(li);

        const img = document.createElement("img");
        img.src = user.avatar_url;
        img.alt = `${user.login}'s avatar`;
        img.style.width = "50px";
        li.appendChild(img);

        const username = document.createElement("p")
        username.textContent = user.login;
        li.appendChild(username);

        const link = document.createElement("a")
        link.href = user.html_url;
        link.textContent = "View Profile";
        link.target = "_blank";
        li.appendChild(link);

        username.addEventListener("click", () => {
            fetchUserRepos(user.login);
        });

        userList.appendChild(li);
    })
}


function fetchUserRepos(username) {
    fetch(`https://api.github.com/users/${username}/repos`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/vnd.github.v3+json"
        },
    })
    .then(res => {
        if(!res.ok){
            throw new Error("Failed to fetch user repositories.");
        }
        return res.json();
    })
    .then(reps => {
        displayRepos(repos, username);
    })
    .catch(error => {
        console.error("There has been a problem with fetching repositories:",  error);
    });
}

function displayRepos(repos, username){
    const repoList = document.createElement("ul");
    repoList.innerHTML = `<h3>${username}'s Repositories:</h3>`;

    repos.forEach(repo => {
        const repoItem = document.createElement("li");
        const repoLink = document.createElement("a");
        repoLink.href = repo.html_url;
        repoLink.textContent = repo.name;
        repoLink.target = "_blank";
        repoItem.appendChild(repoLink);
        repoList.appendChild(repoItem);
    });

    userList.appendChild(repoList);
}