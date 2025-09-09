(function() {
    // ----------------------------------------------------
    // Passo 1: Configuração (Edite apenas estas linhas)
    // ----------------------------------------------------
    const numeroWhatsApp = '551152832958'; // Seu número completo: código do país + DDD + número. Ex: '5547988887777'
    const webhookURL = 'https://webhook.hablla.com/v1/68b9920b6294b95892e33ec3'; // Sua URL do Webhook

    // ----------------------------------------------------
    // Passo 2: Código do Widget (Não altere nada abaixo)
    // ----------------------------------------------------
    const cssContent = `
        /* Botão flutuante do WhatsApp */
        .whatsapp-float {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: #25D366;
            color: #fff;
            border-radius: 50%;
            text-align: center;
            font-size: 30px;
            box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
            transition: all 0.3s ease;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
        }

        .whatsapp-float:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
        }

        .whatsapp-float svg {
            width: 30px;
            height: 30px;
            fill: white;
        }

        /* Modal do formulário */
        .whatsapp-modal {
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 350px;
            background: white;
            border-radius: 15px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            transform: scale(0) translateY(50px);
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            z-index: 999;
            overflow: hidden;
        }

        .whatsapp-modal.active {
            transform: scale(1) translateY(0);
            opacity: 1;
        }

        .modal-header {
            background: #0027D4;
            padding: 20px;
            color: white;
            position: relative;
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .modal-header h3 {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 5px;
        }

        .modal-header p {
            font-size: 14px;
            opacity: 0.9;
            margin: 0;
        }

        .modal-header div[style="overflow: hidden;"] {
            flex-grow: 1;
        }

        .close-btn {
            position: absolute;
            top: 15px;
            right: 15px;
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            width: 25px;
            height: 25px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background 0.2s;
        }

        .close-btn:hover {
            background: rgba(255,255,255,0.2);
        }

        .profile-pic {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            color: #0027D4;
            font-size: 16px;
            flex-shrink: 0;
        }

        .profile-pic img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: 50%;
        }

        .modal-body {
            padding: 25px;
        }

        .welcome-message {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
            font-size: 14px;
            color: #555;
            line-height: 1.4;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
            font-size: 14px;
        }

        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
            font-family: inherit;
        }

        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #25D366;
        }

        .form-group textarea {
            resize: vertical;
            min-height: 80px;
        }

        .phone-input {
            display: flex;
            align-items: center;
        }

        .country-code {
            background: #f8f9fa;
            border: 2px solid #e9ecef;
            border-right: none;
            padding: 0 15px;
            height: 48px;
            border-radius: 8px 0 0 8px;
            font-size: 14px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }

        .phone-input input {
            border-radius: 0 8px 8px 0;
            height: 48px;
            flex-grow: 1;
        }

        .send-btn {
            width: 100%;
            background: #25D366;
            color: white;
            padding: 15px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.3s;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .send-btn:hover {
            background: #128C7E;
        }

        .send-btn:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        /* Responsivo */
        @media (max-width: 480px) {
            .whatsapp-modal {
                right: 15px;
                left: 15px;
                width: auto;
                bottom: 85px;
            }
            
            .whatsapp-float {
                right: 20px;
                bottom: 20px;
            }
        }
    `;

    const buttonHtml = `
        <svg viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.106"/>
        </svg>
    `;

    const modalHtml = `
        <div class="modal-header">
            <div class="profile-pic"><img src="https://static.autodromo.com.br/uploads/eb9a6d5e-104f-4cbb-83d3-1f7a9853a535_LARA-IA-SDR-AUTOFORCE.png" alt="Foto de perfil"></div>
            <div class="modal-text">
                <h3>Fale com a Lara</h3>
                <p>Vamos acelerar seu negócio.</p>
            </div>
            <button class="close-btn">&times;</button>
        </div>
        <div class="modal-body">
            <div class="welcome-message">
                Pronto para dar o próximo passo? Preencha seus dados para conversarmos
            </div>
            <form id="whatsappForm">
                <div class="form-group">
                    <label for="name">Seu nome</label>
                    <input type="text" id="name" name="name" required placeholder="Digite seu nome completo">
                </div>
                <div class="form-group">
                    <label for="phone">WhatsApp</label>
                    <div class="phone-input">
                        <div class="country-code">
                            🇧🇷 +55
                        </div>
                        <input type="tel" id="phone" name="phone" required placeholder="(11) 99999-9999">
                    </div>
                </div>
                <div class="form-group">
                    <label for="company">Empresa</label>
                    <input type="text" id="company" name="company" required placeholder="Nome da empresa">
                </div>
                <div class="form-group">
                    <label for="howKnew">Como conheceu a Autoforce</label>
                    <input type="text" id="howKnew" name="howKnew" required placeholder="Ex.: Google, Instagram, indicação...">
                </div>
                <button type="submit" class="send-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                    Entrar em contato
                </button>
            </form>
        </div>
    `;

    let modalOpen = false;
    let modalElement;
    let floatBtnElement;

    function toggleModal() {
        if (!modalElement || !floatBtnElement) return;
        modalOpen = !modalOpen;
        if (modalOpen) {
            modalElement.classList.add('active');
        } else {
            modalElement.classList.remove('active');
        }
    }

    function getUtmParameters() {
        const urlParams = new URLSearchParams(window.location.search);
        const utm = {};
        for (const [key, value] of urlParams.entries()) {
            if (key.startsWith('utm_')) {
                utm[key] = value;
            }
        }
        return utm;
    }

    function sendToWhatsApp(event) {
        event.preventDefault();
    
        const form = event.target;
        const name = form.querySelector('#name').value;
        const phone = form.querySelector('#phone').value.replace(/\D/g, '');
        const company = form.querySelector('#company').value;
        const howKnew = form.querySelector('#howKnew').value;
    
        const formData = {
            name: name,
            phone: phone,
            company: company,
            howKnew: howKnew
        };
        
        const utmParameters = getUtmParameters();
        const dataForWebhook = { ...formData, ...utmParameters };
    
        fetch(webhookURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataForWebhook),
        })
        .then(response => {
            if (!response.ok) {
                console.error('Erro ao enviar dados para o webhook:', response.statusText);
            }
        })
        .catch(error => {
            console.error('Ocorreu um erro na requisição do webhook:', error);
        });
    
        const whatsappMessage = "Olá! Gostaria de conhecer mais sobre os serviços da Autoforce.";
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappURL = `https://wa.me/${numeroWhatsApp}?text=${encodedMessage}`;
    
        window.open(whatsappURL, '_blank');
    
        toggleModal();
        form.reset();
    }

    function applyPhoneMask(e) {
        let value = e.target.value.replace(/\D/g, '');
        let maskedValue = '';

        if (value.length > 2) {
            maskedValue = `(${value.substring(0, 2)}) `;
            value = value.substring(2);
        } else {
            e.target.value = value;
            return;
        }

        if (value.length > 9) {
            maskedValue += `${value.substring(0, 5)}-${value.substring(5, 9)}`;
        } else if (value.length > 4) {
            maskedValue += `${value.substring(0, 4)}-${value.substring(4, 8)}`;
        }
        
        e.target.value = maskedValue;
    }

    function init() {
        const style = document.createElement('style');
        style.textContent = cssContent;
        document.head.appendChild(style);

        floatBtnElement = document.createElement('div');
        floatBtnElement.className = 'whatsapp-float';
        floatBtnElement.innerHTML = buttonHtml;
        document.body.appendChild(floatBtnElement);
        floatBtnElement.addEventListener('click', toggleModal);

        modalElement = document.createElement('div');
        modalElement.className = 'whatsapp-modal';
        modalElement.id = 'whatsappModal';
        modalElement.innerHTML = modalHtml;
        document.body.appendChild(modalElement);

        const closeBtn = modalElement.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', toggleModal);
        }

        const form = modalElement.querySelector('#whatsappForm');
        if (form) {
            form.addEventListener('submit', sendToWhatsApp);
        }

        const phoneInput = modalElement.querySelector('#phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', applyPhoneMask);
        }

        document.addEventListener('click', function(event) {
            if (modalOpen && !modalElement.contains(event.target) && !floatBtnElement.contains(event.target)) {
                toggleModal();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
