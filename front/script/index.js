document.getElementById('timesheetForm').addEventListener('submit', async function(event) {
    event.preventDefault(); 

    const messageDiv = document.getElementById('message');
    const submitButton = this.querySelector('button[type="submit"]'); // Pega o botão de submit
    
    
    submitButton.disabled = true;
    submitButton.textContent = 'Gerando...';
    messageDiv.style.display = 'none'; 
    messageDiv.textContent = '';

   
    const processo = document.getElementById('processo').value;
    const dtInicialValue = document.getElementById('dtInicial').value;
    const dtFinalValue = document.getElementById('dtFinal').value;
    
   
    if (!dtInicialValue || !dtFinalValue) {
        messageDiv.className = 'error';
        messageDiv.textContent = 'Os campos de data são obrigatórios.';
        messageDiv.style.display = 'block';
        submitButton.disabled = false;
        submitButton.textContent = 'Gerar Boletim';
        return;
    }
    
    const DtInicialISO = new Date(dtInicialValue).toISOString();
    const DtFinalISO = new Date(dtFinalValue).toISOString();

    const formData = {
        processo: processo,
        DtInicial: DtInicialISO,
        DtFinal: DtFinalISO,
    };
    
    
    const apiUrl = 'http://localhost:3000/ts/export'; 

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        
        if (!response.ok) {
            const errorResult = await response.json(); // Lê a mensagem de erro como JSON
            // Lança um erro para ser pego pelo bloco 'catch'
            throw new Error(errorResult.message || errorResult.error || 'Erro desconhecido retornado pelo servidor.');
        }

        // Se a resposta for OK (status 200), o corpo da resposta é o arquivo.
        const blob = await response.blob(); // Pega a resposta como um objeto binário (o arquivo)

        // Tenta extrair o nome do arquivo do header 'Content-Disposition' enviado pelo backend
        const contentDisposition = response.headers.get('content-disposition');
        let filename = 'boletim-horas.xlsx'; // Nome padrão caso o header não seja encontrado
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch && filenameMatch.length > 1) {
                filename = filenameMatch[1];
            }
        }

        // Cria um link temporário na memória do navegador
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none'; // O link não precisa ser visível
        a.href = url;
        a.download = filename; // O atributo 'download' instrui o navegador a baixar o arquivo

        // Adiciona o link ao corpo do documento e o "clica" programaticamente para iniciar o download
        document.body.appendChild(a);
        a.click();

        // Limpa o link da memória para evitar vazamento de memória
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        // Exibe uma mensagem de sucesso para o usuário
        messageDiv.className = 'success';
        messageDiv.textContent = 'Download iniciado com sucesso!';
        messageDiv.style.display = 'block';
        document.getElementById('timesheetForm').reset(); // Limpa o formulário

    } catch (error) {
        console.error('Erro na requisição ou no processamento do download:', error);
        messageDiv.className = 'error';
        messageDiv.textContent = error.message || 'Erro ao gerar o boletim. Verifique o console para mais detalhes.';
        messageDiv.style.display = 'block';
    } finally {
        // Este bloco 'finally' garante que o botão será reabilitado, ocorra sucesso ou erro.
        submitButton.disabled = false;
        submitButton.textContent = 'Gerar Boletim';
    }
});