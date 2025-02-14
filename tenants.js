    // const url = 'https://api.gerenciapp.online/outbound/nfse/em_processo_cliente?';

    async function buscarDados() {
        const loadingDiv = document.getElementById('loading');
        const tabelaContainer = document.getElementById('dadosTabelaContainer');
        const tbody = document.getElementById('dadosTabela');

        try {
            // Exibe o loading e esconde a tabela
            loadingDiv.style.display = 'block';
            tabelaContainer.style.display = 'none';

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro ao buscar dados: ${response.statusText}`);
            }

            const textData = await response.text();

            // Criar um elemento temporário para parsear o HTML e extrair o conteúdo da tag <body>
            const parser = new DOMParser();
            const doc = parser.parseFromString(textData, 'text/html');
            const bodyTag = doc.querySelector('body');

            if (!bodyTag) {
                throw new Error('Tag <body> não encontrada na resposta');
            }

            const jsonData = JSON.parse(bodyTag.textContent);

            // Limpa os dados da tabela
            //tbody.innerHTML = '';

            // Ordena os dados em ordem decrescente com base em 'nfse'
            const dadosOrdenados = jsonData.sort((a, b) => b.nfse - a.nfse);

            if (dadosOrdenados.length > 0) {
                dadosOrdenados.forEach(cliente => {
                    // Ignorar entradas vazias (com código_municipio vazio, por exemplo)
                    if (!cliente.cliente) return;

                    const tr = document.createElement('tr');
                    tr.innerHTML = `
                        <td>${cliente.cliente}</td>
                        <td>${cliente.conector}</td>
                        <td>${cliente.nfse}</td>
                    `;
                    tbody.appendChild(tr);
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="3">Nenhum cliente encontrado</td></tr>';
            }

            // Esconde o loading e exibe a tabela
            loadingDiv.style.display = 'none';
            tabelaContainer.style.display = 'table';
        } catch (error) {
            console.error('Erro:', error);
            tbody.innerHTML = `<tr><td colspan="3">Erro ao carregar dados: ${error.message}</td></tr>`;
            loadingDiv.style.display = 'none';
            tabelaContainer.style.display = 'table';
        }
    }

    // Primeira chamada ao carregar a página
    document.addEventListener('DOMContentLoaded', buscarDados);

    // Atualizar a cada 30 minutos (1800000 ms)
    setInterval(buscarDados, 1800000);