import { isDate } from "util/types";
import TSrepo from "../repositories/TSrepositories.js";
import excel from "exceljs"
import fs from "fs"
import path from "path"
import { fileURLToPath } from 'url';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


 const TScontroller={
     importTS:async (req,res)=>{
        try{
            const{seguradora,segurado,sinistro,processo,DtInicial,DtFinal,desc,incidencia,executante}=req.body;
            const msgErrors=[];

            if(!processo) msgErrors.push("Processo não informado")
            if(!DtInicial) msgErrors.push("Data Inicial não informada")
            if(!DtFinal)msgErrors.push("Data Final não informada")
            if(!desc)msgErrors.push("Descrição não informada")
            if(!incidencia)msgErrors.push("Tipo de Incidência não informado")
            if(!executante)msgErrors.push("Perito não informado")

            if (msgErrors.length > 0) {
            return res.status(400).json({ ok: false, message: msgErrors.join(', ') });
            }
           
          const TSimportado=  await TSrepo.importTS(seguradora,segurado,sinistro,processo,DtInicial,DtFinal,desc,incidencia,executante)
            return res.status(200).json({ok:true, message:"Timesheets importados com sucesso",data:TSimportado})

        }catch(error){
            console.error("Erro ao importa TimeSheets",error);
            return res.status(500).json({ok:false, message:"Erro ao importa TimeSheets"}) 
        }
    },

    selectTS: async(req,res)=>{
       try{
            const{processo,DtInicial,DtFinal}=req.body;
            const msgErrors=[];

            if(!processo) msgErrors.push("Processo não informado")
            if(!DtInicial) msgErrors.push("Data Inicial não informada")
            if(!DtFinal)msgErrors.push("Data Final não informada")
            
                const DtInicialL= new Date(DtInicial)
                const DtFinalL= new Date(DtFinal)

            if (msgErrors.length > 0) {
            return res.status(400).json({ ok: false, message: msgErrors.join(', ') });
            }

            const TSfiltrado=await TSrepo.selectTS(processo,DtInicialL,DtFinalL)
              const array= TSfiltrado.length
            return res.status(200).json({ok:true, message:"Timesheets selecionados com sucesso!",data:TSfiltrado,array})
            
        }catch(error){
            console.error("Erro ao importa TimeSheets",error);
            return res.status(500).json({ok:false, message:"Erro ao importa TimeSheets"}) 
        }  
    },
    
        exportTS:async(req,res)=>{
            try{
                const{processo,DtInicial,DtFinal}=req.body;
                const msgErrors=[];

                if(!processo) msgErrors.push("Processo não informado")
                if(!DtInicial) msgErrors.push("Data Inicial não informada")
                if(!DtFinal)msgErrors.push("Data Final não informada")
                
                    const DtInicialL= new Date(DtInicial)
                    const DtFinalL= new Date(DtFinal)

                if (msgErrors.length > 0) {
                return res.status(400).json({ ok: false, message: msgErrors.join(', ') });
                }

                const TSfiltrado=await TSrepo.selectTS(processo,DtInicialL,DtFinalL)
                if (!TSfiltrado || TSfiltrado.length === 0) {
                    return res.status(404).json({ message: "Nenhum dado encontrado para os filtros fornecidos." });
                }
                console.log('DADOS DO BANCO (TSfiltrado):', JSON.stringify(TSfiltrado, null, 2));
                const firstItem = TSfiltrado[0];
                const workbook=new excel.Workbook();
                workbook.creator='Leonardo Monteiro';
                workbook.created=new Date()
                //sempre cirarei todas as sheets mas irão ser alimentadas de acordo com a incidencia por meio de um filter
                /**[Causa, Prejuízo Cívil, Prejuízo Mecânica, Prejuízo Química, Prejuízo Metalurgia, Prejuízo Elétrica/Eletrônica, 
                 * 3D,Prejuízo Transporte,Assistência Técnica Incêndio, Assistência Técnica Cívil, Assistência Técnica 
                 * Elétrica/Eletrônica, Assistência Técnica Mecânica, Assistência Técnica Química, 
                 * Assistência Técnica Metalurgia  ] */
                        const worksheetMap = {
                    'Causa': workbook.addWorksheet('Causa'),
                    'Civil': workbook.addWorksheet('Prejuizo Civil'),
                    'Mecanica': workbook.addWorksheet('Prejuizo Mecanica'),
                    'Quimica': workbook.addWorksheet('Prejuizo Quimica'),
                    'Metalurgia': workbook.addWorksheet('Prejuizo Metalurgia'),
                    'Eletrica': workbook.addWorksheet('Prejuizo Eletrica Eletronica'),
                    'Transporte': workbook.addWorksheet('Prejuizo Transporte'),
                    'ATincendio': workbook.addWorksheet('Assistencia Tecnica Incendio'),
                    'ATcivil': workbook.addWorksheet('Assitencia Tecnica Civil'),
                    'ATeletrica': workbook.addWorksheet('Assistencia Tecnica Eletrica'),
                    'ATmecanica': workbook.addWorksheet('Assistencia Tecnica Mecanica'),
                    'ATquimica': workbook.addWorksheet('Assistencia Quimica'),
                    'ATmetalurgia': workbook.addWorksheet('Assistencia Tecnica Metalurgia'),
                    '3D': workbook.addWorksheet('3D'),
                };

                    
                    const groupedData = TSfiltrado.reduce((acc, item) => {
                    const key = item.TpIncidencia;
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(item);
                    return acc;
                }, {});
                console.log('CHAVES AGRUPADAS (groupedData):', Object.keys(groupedData));
                //Função para incluir a logo    
                    const logoPath = path.join(__dirname, '..','..', 'front','img','logo.png'); // Ajuste o caminho se necessário
                if (!fs.existsSync(logoPath)) {
                    throw new Error(`Logo não encontrado em: ${logoPath}`);
                }
                const logoImage = workbook.addImage({
                    buffer: fs.readFileSync(logoPath),
                    extension: 'png',
                });

                // 3. FORMATAR CADA WORKSHEET QUE TEM DADOS
                console.log('CHAVES DO MAPA (worksheetMap):', Object.keys(worksheetMap));
                for (const incidencia in groupedData) {
                    const worksheet = worksheetMap[incidencia];
                    const dataForSheet = groupedData[incidencia];
                    
                    if (worksheet && dataForSheet.length > 0) {
                        
                        // --- CABEÇALHO PRINCIPAL (LINHA 1) ---
                        worksheet.mergeCells('A1:F1');
                        const headerCell = worksheet.getCell('A1');
                        worksheet.getRow(1).height = 121.5;

                        
                        headerCell.value = {
                            richText: [
                                { font: { bold: true, size: 12, name: 'Arial' }, text: 'Boletim de Horas Trabalhadas\n' },
                                { font: { bold: true, size: 11, name: 'Arial' }, text: `SEGURADORA: ${firstItem.Seguradora}\n` }, // Substitua pela variável correta
                                { font: { size: 11, name: 'Arial' }, text: `Sinistro: ${firstItem.Sinistro}\n` },
                                { font: { size: 11, name: 'Arial' }, text: `Segurado: ${firstItem.Segurado}\n` },
                                { font: { size: 11, name: 'Arial' }, text: `Nº Tradsul: ${firstItem.NTradsul}` },
                            ],
                        };
                        
                        headerCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                        headerCell.border = {
                            top: { style: 'thick' }, left: { style: 'thick' },
                            bottom: { style: 'thick' }, right: { style: 'thick' }
                        };

                        worksheet.addImage(logoImage, {
                            tl: { col: 0.1, row: 0.1 }, // Posição (coluna A, linha 1 com pequena margem)
                            ext: { width: 157, height: 120 } // Tamanho da imagem
                        });

                        // --- CABEÇALHO DA TABELA (LINHA 2) ---
                        const tableHeaders = ['Data', 'Serviço Executado', 'Hora Início', 'Hora Término', 'Horas', 'Executante'];
                        const headerRow = worksheet.getRow(2);
                        headerRow.values = tableHeaders;
                        headerRow.font = { bold: true, name: 'Arial', size: 11 };
                        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

                        // Ajustar largura das colunas
                        worksheet.columns = [
                            { key: 'data', width: 12 }, { key: 'servico', width: 45 },
                            { key: 'hInicio', width: 12 }, { key: 'hTermino', width: 12 },
                            { key: 'horas', width: 10 }, { key: 'executante', width: 25 },
                        ];
                        
                        // --- DADOS DA TABELA (A PARTIR DA LINHA 3) ---
                        dataForSheet.forEach((item, index) => {
                            const rowNumber = 3 + index;
                            const dtInicial = new Date(item.DtInicial);
                            const dtFinal = new Date(item.DtFinal);

                            worksheet.addRow({
                                data: dtInicial,
                                servico: item.Descricao,
                                hInicio: dtInicial,
                                hTermino: dtFinal,
                                horas: { formula: `=HORA(D${rowNumber}-C${rowNumber})+(MINUTO(D${rowNumber}-C${rowNumber})/60)` },
                                executante: item.Executante
                            });
                            
                            // Formatação das células na linha adicionada
                            worksheet.getCell(`A${rowNumber}`).numFmt = 'dd/mm/yyyy';
                            worksheet.getCell(`C${rowNumber}`).numFmt = 'hh:mm';
                            worksheet.getCell(`D${rowNumber}`).numFmt = 'hh:mm';
                            worksheet.getCell(`E${rowNumber}`).numFmt = '#,##0.00';
                            worksheet.getCell(`B${rowNumber}`).alignment = { wrapText: true };
                        });

                        // --- RODAPÉ DE TOTAIS (APÓS OS DADOS) ---
                        const lastDataRow = 2 + dataForSheet.length;
                        const totalHorasRow = worksheet.addRow([]);
                        totalHorasRow.getCell('B').value = "Horas Trabalhadas";
                        totalHorasRow.getCell('E').value = { formula: `=SUBTOTAL(9,E3:E${lastDataRow})` };
                        totalHorasRow.getCell('E').numFmt = '#,##0.00';
                        totalHorasRow.font = { bold: true };

                        const valorHoraRow = worksheet.addRow([]);
                        valorHoraRow.getCell('B').value = "Valor Hora Tradsul";

                        const totalFinalRow = worksheet.addRow([]);
                        totalFinalRow.getCell('B').value = "Total Cálculo Final";
                        totalFinalRow.getCell('B').font = { bold: true };
                            
                        // --- BORDAS DA TABELA E TOTAIS ---
                        const tableEndRow = totalFinalRow.number;
                        for (let i = 2; i <= tableEndRow; i++) {
                            ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => {
                                const cell = worksheet.getCell(`${col}${i}`);
                                const isOuterTop = i === 2;
                                const isOuterBottom = i === tableEndRow;
                                const isOuterLeft = col === 'A';
                                const isOuterRight = col === 'F';
                                
                                cell.border = {
                                    top: { style: isOuterTop ? 'thick' : 'thin' },
                                    left: { style: isOuterLeft ? 'thick' : 'thin' },
                                    bottom: { style: isOuterBottom ? 'thick' : 'thin' },
                                    right: { style: isOuterRight ? 'thick' : 'thin' }
                                };
                            });
                        }

                        // --- RODAPÉ FINAL ---
                        const finalFooterRowNumber = tableEndRow + 1;
                        
                        worksheet.getRow(finalFooterRowNumber).height = 45; // Defina a altura desejada. O valor é em pontos.

                        worksheet.mergeCells(`A${finalFooterRowNumber}:F${finalFooterRowNumber}`);
                        const footerCell = worksheet.getCell(`A${finalFooterRowNumber}`);
                        footerCell.value = 'Tradsul Consultoria e Pericias Técnicas\nCREA-RJ   184154-D';
                        footerCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
                        footerCell.border = {
                            top: { style: 'thick' }, left: { style: 'thick' },
                            bottom: { style: 'thick' }, right: { style: 'thick' }
                        };
                
                    }
                }

                // Remover abas que não foram utilizadas
                workbook.eachSheet(sheet => {
                    if (sheet.rowCount <= 1) { // Se tem apenas o cabeçalho (ou nada)
                    // Adicionar lógica para remover se necessário, mas por enquanto vamos manter todas.
                    }
                });


   
                const filename = `${firstItem.Sinistro || 'geral'}-${firstItem.Segurado || 'geral'}-${firstItem.NTradsul || 'geral'}.xlsx`;
                res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
                
                await workbook.xlsx.write(res);
                res.end();
               /*
                const filename = `${firstItem.Sinistro || 'geral'}-${firstItem.Segurado || 'geral'}-${firstItem.NTradsul || 'geral'}.xlsx`;
                const savePath = path.join(__dirname, '..', '..', 'public', filename);

                    // Salva o arquivo no caminho especificado
                    await workbook.xlsx.writeFile(savePath);

                    // Envia uma resposta JSON para o Postman confirmando o sucesso
                    res.status(200).json({ 
                        message: 'Arquivo Excel gerado e salvo com sucesso no servidor.',
                        path: savePath 
                });
                */
            }catch(error){
                console.error("Erro ao gerar o arquivo Excel:", error);
                res.status(500).json({ error: "Ocorreu um erro interno ao gerar o boletim." });
            } 
        },

    // Dentro do objeto TScontroller = { ... }

importActivities: async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    try {
        const workbook = new excel.Workbook();
        await workbook.xlsx.load(req.file.buffer);
        
        const worksheet = workbook.worksheets[0];
        if (!worksheet) {
            return res.status(400).json({ message: 'A planilha está vazia ou corrompida.' });
        }

      
        const headerRow = worksheet.getRow(1);
        if (!headerRow.values || headerRow.values.length === 1) { 
            return res.status(400).json({ message: 'A planilha não contém um cabeçalho válido.' });
        }

        const headerMap = {};
        headerRow.eachCell((cell, colNumber) => {
            if (cell.value) {
                
                headerMap[cell.value.toString().trim()] = colNumber;
            }
        });

        
        const requiredHeaders = [
            'Seguradora', 'Segurado', 'Nro. Seguradora', 'Codigo do Sinistro', 
            'Dt. inicial', 'Dt. final', 'Descrição', 'Tp. Incidência', 'Regulador'
        ];
        
        const missingHeaders = requiredHeaders.filter(h => !headerMap[h]);
        if (missingHeaders.length > 0) {
            return res.status(400).json({ 
                message: `Os seguintes cabeçalhos obrigatórios não foram encontrados na planilha: ${missingHeaders.join(', ')}` 
            });
        }

        // --- FIM DA LÓGICA INTELIGENTE ---

        let successfulImports = 0;
        let failedImports = 0;
        const errors = [];

        // 3. Iterar sobre as linhas e usar o mapa de cabeçalhos para pegar os dados
        for (let rowNumber = 2; rowNumber <= worksheet.rowCount; rowNumber++) {
            const row = worksheet.getRow(rowNumber);

            // Agora pegamos os valores pelo nome da coluna, não pela posição!
            const seguradora = row.getCell(headerMap['Seguradora']).value;
            const segurado = row.getCell(headerMap['Segurado']).value;
            const sinistro = row.getCell(headerMap['Nro. Seguradora']).value;
            const processo = row.getCell(headerMap['Codigo do Sinistro']).value;
            const DtInicial = row.getCell(headerMap['Dt. inicial']).value;
            const DtFinal = row.getCell(headerMap['Dt. final']).value;
            const desc = row.getCell(headerMap['Descrição']).value;
            const incidencia = row.getCell(headerMap['Tp. Incidência']).value;
            const executante = row.getCell(headerMap['Regulador']).value;
            
            try {
                if (!processo || !DtInicial || !DtFinal || !desc || !incidencia || !executante) {
                    throw new Error(`Dados obrigatórios (Processo, Datas, Descrição, Incidência, Executante) estão faltando.`);
                }
                
                // Chamada para o repositório com os dados extraídos
                await TSrepo.importTS(seguradora, segurado,sinistro, processo, DtInicial, DtFinal, desc, incidencia, executante);
                successfulImports++;
            } catch (error) {
                failedImports++;
                errors.push(`Linha ${rowNumber}: ${error.message}`);
            }
        }

        if (successfulImports === 0 && failedImports > 0) {
            return res.status(400).json({
                message: `Falha ao importar todas as ${failedImports} linhas.`,
                errors: errors
            });
        }
        
        return res.status(200).json({
            message: `Importação concluída! ${successfulImports} atividades salvas. ${failedImports} falhas.`,
            errors: errors
        });

    } catch (error) {
        console.error("Erro geral na importação da planilha:", error);
        return res.status(500).json({ message: error.message || 'Ocorreu um erro inesperado ao processar a planilha.' });
    }
}

}
export default TScontroller

 

