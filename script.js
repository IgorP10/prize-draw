function validated (min, max) {
    console.log(min)
}

function random() {
    
    const min = document.getElementById("minimum").value
    const max = document.getElementById("maximum").value

    validated(min, max)
    throw new Error("my error message");
    sort = Math.floor(Math.random() * max)

    while (sort < min) {
        sort = Math.floor(Math.random() * max)
    }
    document.getElementById("result").innerHTML = sort
}
