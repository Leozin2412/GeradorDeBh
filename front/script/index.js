document.getElementById('timesheetForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const messageDiv = document.getElementById('message');
    messageDiv.style.display = 'none';
    messageDiv.textContent = ''; // Limpa mensagens anteriores

    // Coleta os valores dos campos do formulário
    const processo = document.getElementById('processo').value;
    const dtInicialValue = document.getElementById('dtInicial').value;
    const dtFinalValue = document.getElementById('dtFinal').value;

    // Converte os valores de data/hora para o formato ISO 8601 exigido pelo Prisma
    let DtInicialISO = '';
    let DtFinalISO = '';

    if (dtInicialValue) {
        DtInicialISO = new Date(dtInicialValue).toISOString();
        if (isNaN(new Date(DtInicialISO))) {
            messageDiv.className = 'error';
            messageDiv.textContent = 'Por favor, insira uma Data e Hora Inicial válidas.';
            messageDiv.style.display = 'block';
            return;
        }
    } else {
        messageDiv.className = 'error';
        messageDiv.textContent = 'O campo Data e Hora Inicial é obrigatório.';
        messageDiv.style.display = 'block';
        return;
    }

    if (dtFinalValue) {
        DtFinalISO = new Date(dtFinalValue).toISOString();
        if (isNaN(new Date(DtFinalISO))) {
            messageDiv.className = 'error';
            messageDiv.textContent = 'Por favor, insira uma Data e Hora Final válidas.';
            messageDiv.style.display = 'block';
            return;
        }
    } else {
        messageDiv.className = 'error';
        messageDiv.textContent = 'O campo Data e Hora Final é obrigatório.';
        messageDiv.style.display = 'block';
        return;
    }

    // Cria o objeto com os dados para enviar para a API (somente processo, DtInicial e DtFinal)
    const formData = {
        processo: processo,
        DtInicial: DtInicialISO,
        DtFinal: DtFinalISO,
        // Os campos 'desc', 'incidencia' e 'executante' foram removidos daqui
        // Se sua API exigir eles, mesmo que vazios ou com valores default,
        // você precisará adicioná-los de volta aqui com valores padrão.
        // Exemplo: desc: '', incidencia: '', executante: ''
    };

    // Ajuste a URL da sua API conforme necessário
    const apiUrl = 'http://localhost:3000/timesheet'; 

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const result = await response.json();

        if (response.ok) {
            messageDiv.className = 'success';
            messageDiv.textContent = result.message || 'Boletim de Hora gerado com sucesso!';
            messageDiv.style.display = 'block';
            document.getElementById('timesheetForm').reset(); // Limpa o formulário após o sucesso
        } else {
            messageDiv.className = 'error';
            messageDiv.textContent = result.error ? (typeof result.error === 'string' ? result.error : JSON.stringify(result.error)) : 'Erro ao gerar Boletim de Hora.';
            messageDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Erro ao conectar com a API:', error);
        messageDiv.className = 'error';
        messageDiv.textContent = 'Erro ao conectar com o servidor. Verifique a URL da API ou sua conexão.';
        messageDiv.style.display = 'block';
    }
});