let audio = new Audio("cancion.mp3");
let animacionIniciada = false;
let corazones = []; // Se mantiene la lista de corazones sin duplicarse

function iniciarAnimacion() {
    if (!animacionIniciada) {
        audio.play();
        animacionIniciada = true;
        animarGirasol();
    }
}

function animarGirasol() {
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    canvas.width = 400;
    canvas.height = 500;

    let centroX = canvas.width / 2;
    let baseTallo = canvas.height;
    let alturaTallo = 0;
    let numPetalos = 20;
    let radioPetalo = 30;
    let anguloOffset = Math.PI / numPetalos;
    let corazonesGenerados = false; // Evita que los corazones se creen varias veces

    function dibujarTallo() {
        let intervalo = setInterval(() => {
            ctx.beginPath();
            ctx.strokeStyle = "green";
            ctx.lineWidth = 10;
            ctx.moveTo(centroX, baseTallo);
            ctx.lineTo(centroX, baseTallo - alturaTallo);
            ctx.stroke();

            alturaTallo += 10;

            if (alturaTallo >= 150) {
                clearInterval(intervalo);
                dibujarPetalos();
            }
        }, 100);
    }

    function petalo(angulo) {
        let x = centroX + Math.cos(angulo) * 70;
        let y = baseTallo - 150 + Math.sin(angulo) * 70;

        ctx.beginPath();
        ctx.fillStyle = "yellow";
        ctx.ellipse(x, y, radioPetalo, radioPetalo / 2, angulo, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = "#8b5a2b";
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function centroFlor() {
        ctx.beginPath();
        ctx.arc(centroX, baseTallo - 150, 40, 0, Math.PI * 2);
        ctx.fillStyle = "#8b5a2b";
        ctx.fill();
    }

    function dibujarPetalos(i = 0) {
        if (i >= numPetalos) {
            centroFlor();
            setTimeout(lanzarCorazones, 500);
            return;
        }

        setTimeout(() => {
            let angulo = i * (Math.PI * 2 / numPetalos) + anguloOffset;
            petalo(angulo);
            dibujarPetalos(i + 1);
        }, 200);
    }

    function lanzarCorazones() {
        if (!corazonesGenerados) {
            corazonesGenerados = true;
            for (let i = 0; i < 20; i++) {
                corazones.push({
                    x: Math.random() * canvas.width,
                    y: canvas.height + Math.random() * 100,
                    velocidad: Math.random() * 2 + 1
                });
            }
        }

        function animarCorazones() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Redibujar la flor completa
            ctx.beginPath();
            ctx.strokeStyle = "green";
            ctx.lineWidth = 10;
            ctx.moveTo(centroX, baseTallo);
            ctx.lineTo(centroX, baseTallo - 150);
            ctx.stroke();

            for (let j = 0; j < numPetalos; j++) {
                let angulo = j * (Math.PI * 2 / numPetalos) + anguloOffset;
                petalo(angulo);
            }
            centroFlor();

            // Dibujar corazones
            corazones.forEach((corazon) => {
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.arc(corazon.x - 5, corazon.y - 5, 5, 0, Math.PI * 2);
                ctx.arc(corazon.x + 5, corazon.y - 5, 5, 0, Math.PI * 2);
                ctx.lineTo(corazon.x, corazon.y + 5);
                ctx.fill();

                corazon.y -= corazon.velocidad;
                if (corazon.y < -20) {
                    corazon.y = canvas.height + Math.random() * 100;
                }
            });

            requestAnimationFrame(animarCorazones);
        }

        animarCorazones();
    }

    dibujarTallo();
}
