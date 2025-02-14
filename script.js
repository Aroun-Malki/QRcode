document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById('link');
    const button = document.getElementById('Gen');
    const qrContainer = document.getElementById('qr');

    const downloadIcon = document.createElement('span');
    downloadIcon.classList.add('material-icons', 'download-icon');
    downloadIcon.innerText = 'download';

    function isValidURL(url) {
        const pattern = /^(https?:\/\/)?([\w\-]+(\.[\w\-]+)+)([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/;
        return pattern.test(url);
    }

    // Nettoyage et création d'un QR Code par défaut une seule fois
    qrContainer.innerHTML = "";
    const defaultQR = new QRCode(qrContainer, {
        text: "https://example.com",
        width: 200,
        height: 200,
        colorDark: "#A0A0A0",
        colorLight: "#E0E0E0"
    });

    button.addEventListener('click', () => {
        const url = input.value.trim();

        if (!url || !isValidURL(url)) {
            input.classList.add('error');
            setTimeout(() => input.classList.remove('error'), 500);
            return;
        }

        input.classList.remove('error');

        // Supprimer tout sauf l'icône de téléchargement
        qrContainer.innerHTML = "";
        
        // Générer un nouveau QR Code
        new QRCode(qrContainer, {
            text: url,
            width: 200,
            height: 200
        });

        // Réajouter l'icône de téléchargement
        qrContainer.appendChild(downloadIcon);

        // Ajouter la logique pour télécharger le QR Code
        setTimeout(() => {
            const canvas = qrContainer.querySelector('canvas');
            if (canvas) {
                downloadIcon.onclick = () => {
                    const link = document.createElement('a');
                    link.href = canvas.toDataURL("image/png");
                    link.download = "QRCode.png";
                    link.click();

                    // Supprimer les anciens messages pour éviter la duplication
                    const oldMsg = document.querySelector('.download-message');
                    if (oldMsg) oldMsg.remove();

                    // Créer le message de confirmation
                    const msg = document.createElement('div');
                    msg.innerText = "QR Code téléchargé !";
                    msg.classList.add('download-message');

                    // Ajouter le message en dessous du QR Code
                    qrContainer.appendChild(msg);

                    setTimeout(() => msg.remove(), 2000);
                };
            }
        }, 500);
    });
});


document.addEventListener("DOMContentLoaded", function () {
    const fileInput = document.createElement('input');
    fileInput.type = "file";
    fileInput.id = "upload";
    fileInput.accept = "image/*";
    fileInput.style.display = "none"; // Caché pour utiliser un bouton personnalisé

    const customButton = document.createElement('button');
    customButton.id = "customUploadBtn";
    customButton.innerHTML = `<span class="material-icons">upload</span>`;

    const output = document.createElement('div');
    output.id = "output";
    output.classList.add('scan-output');

    const rightContainer = document.querySelector('.right');
    const title = document.createElement('h2');
    title.innerText = "Scan a QR Code";

    rightContainer.appendChild(title);
    rightContainer.appendChild(customButton);
    rightContainer.appendChild(fileInput);
    rightContainer.appendChild(output);

    customButton.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onload = function () {
                // Afficher l'image en petit
                const preview = document.createElement('img');
                preview.src = img.src;
                preview.classList.add('image-preview');
                output.innerHTML = ""; // Clear previous output
                output.appendChild(preview);

                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0, img.width, img.height);
                const imageData = ctx.getImageData(0, 0, img.width, img.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                if (code) {
                    output.innerHTML += `
                        <div class="qr-result">
                            <input type="text" id="qrLink" value="${code.data}" readonly>
                            <button id="copyBtn">
                                <span class="material-icons">content_copy</span>
                            </button>
                        </div>
                        <p class="success-message">QR Code détecté avec succès !</p>
                    `;

                    document.getElementById('copyBtn').addEventListener('click', function () {
                        const qrLink = document.getElementById('qrLink');
                        qrLink.select();
                        document.execCommand('copy');

                        qrLink.classList.add('copied');
                        setTimeout(() => qrLink.classList.remove('copied'), 1000);
                    });
                } else {
                    output.innerHTML += `<p class="error-message">Aucun QR Code détecté.</p>`;
                }
            };
            img.src = URL.createObjectURL(file);
        } else {
            output.innerHTML = `<p class="error-message">Veuillez choisir une image valide.</p>`;
        }
    });
});

