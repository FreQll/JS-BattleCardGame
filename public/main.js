
function start() {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/");
    xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8")

    xhr.onload = () => {
        if (xhr.readyState == 4 && (xhr.status == 201 || xhr.status == 200)) {
            response = JSON.parse(xhr.response);
            document.getElementById("login").innerText = response.login;
            document.getElementById("user_avatar").src = "/avatar/" + response.login + ".jpg"
        } else {
            console.error(`Error: ${xhr.status}`);
        }
    };
    xhr.send();
}
start();

function submit() {
    location.href = '/';
}