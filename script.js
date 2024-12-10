const startDrawBtn = document.getElementById("start-draw");
const modal = document.getElementById("modal");
const resultNumber = document.getElementById("result-number");
const closeModalBtn = document.getElementById("close-modal");
const confettiCanvas = document.getElementById("confetti-canvas");

const maxConfettis = 150;
const particles = [];
const possibleColors = [
    "DodgerBlue",
    "OliveDrab",
    "Gold",
    "Pink",
    "SlateBlue",
    "LightBlue",
    "Gold",
    "Violet",
    "PaleGreen",
    "SteelBlue",
    "SandyBrown",
    "Chocolate",
    "Crimson"
];

let confettiAnimation; // Para guardar o requestAnimationFrame

function randomFromTo(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
}

function confettiParticle() {
    this.x = Math.random() * confettiCanvas.width;
    this.y = Math.random() * confettiCanvas.height - confettiCanvas.height;
    this.r = randomFromTo(11, 33);
    this.d = Math.random() * maxConfettis + 11;
    this.color =
        possibleColors[Math.floor(Math.random() * possibleColors.length)];
    this.tilt = Math.floor(Math.random() * 33) - 11;
    this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
    this.tiltAngle = 0;

    this.draw = function (context) {
        context.beginPath();
        context.lineWidth = this.r / 2;
        context.strokeStyle = this.color;
        context.moveTo(this.x + this.tilt + this.r / 3, this.y);
        context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
        context.stroke();
    };
}

function drawConfetti(context) {
    context.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    particles.forEach((particle) => {
        particle.draw(context);
        particle.tiltAngle += particle.tiltAngleIncremental;
        particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
        particle.tilt = Math.sin(particle.tiltAngle) * 15;

        if (particle.y > confettiCanvas.height) {
            particle.y = -30;
            particle.x = Math.random() * confettiCanvas.width;
        }
    });

    confettiAnimation = requestAnimationFrame(() => drawConfetti(context));
}

function startConfetti() {
    const context = confettiCanvas.getContext("2d");
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    particles.length = 0; // Limpa partículas antigas
    for (let i = 0; i < maxConfettis; i++) {
        particles.push(new confettiParticle());
    }

    drawConfetti(context);
}

function stopConfetti() {
    const context = confettiCanvas.getContext("2d");
    let opacity = 1; // Inicia com a opacidade total (1)

    // Função para reduzir gradualmente a opacidade
    const fadeOut = () => {
        opacity -= 0.05; // Diminui a opacidade gradualmente
        if (opacity <= 0) {
            // Se a opacidade chegar a 0, para a animação e limpa o canvas
            context.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            cancelAnimationFrame(confettiAnimation); // Para o loop de animação
            return;
        }

        // Limpa o canvas e redesenha os confetes com a nova opacidade
        context.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        context.globalAlpha = opacity; // Aplica a opacidade ao contexto
        particles.forEach((particle) => {
            particle.draw(context); // Passa o contexto para cada partícula
        });

        // Continua o loop
        requestAnimationFrame(fadeOut);
    };

    fadeOut(); // Inicia a animação de desaparecimento
}


startDrawBtn.addEventListener("click", () => {
    const start = parseInt(document.getElementById("start").value);
    const end = parseInt(document.getElementById("end").value);

    if (isNaN(start) || isNaN(end) || start >= end) {
        alert("Por favor, insira valores válidos!");
        return;
    }

    // Desativa o botão para evitar múltiplos cliques
    startDrawBtn.disabled = true;

    // Reseta o estado do modal e do número
    resultNumber.textContent = "--";
    resultNumber.classList.remove("final");
    modal.classList.add("active");

    let suspenseInterval;

    // Inicia a "pipocagem" de números
    const startSuspense = () => {
        suspenseInterval = setInterval(() => {
            const randomNum = Math.floor(Math.random() * (end - start + 1)) + start;
            resultNumber.textContent = randomNum;
        }, 100);
    };

    // Exibe o número final
    const showFinalResult = () => {
        clearInterval(suspenseInterval); // Para a pipocagem
        const finalNumber = Math.floor(Math.random() * (end - start + 1)) + start;
        resultNumber.textContent = finalNumber;
        resultNumber.classList.add("final");

        // Inicia os confetes
        startConfetti();

        // Para os confetes após 5 segundos
        setTimeout(() => {
            stopConfetti();
            startDrawBtn.disabled = false; // Reativa o botão
        }, 5000);
    };

    // Começa o suspense e exibe o número final após 5 segundos
    startSuspense();
    setTimeout(showFinalResult, 5000);
});

closeModalBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    startDrawBtn.disabled = false; // Reativa o botão
});
