function random() {
    const min = document.getElementById("minimum").value
    const max = document.getElementById("maximum").value

    sort = Math.floor(Math.random() * max)

    while (sort < min) {
        sort = Math.floor(Math.random() * max)
    }

    document.getElementById("result").innerHTML = sort
}

function open() {
    window.open("/result");
}


