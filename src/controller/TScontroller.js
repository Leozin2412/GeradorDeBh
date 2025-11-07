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
            const TsFiltradoLength=TSfiltrado.length
            const finalItem=TSfiltrado[TsFiltradoLength-1]
            const workbook=new excel.Workbook();
            workbook.creator='Leonardo Monteiro';
            workbook.created=new Date()
            

                
            const resumo = workbook.addWorksheet('Resumo'); 
           

            const worksheetMap = {
            'Causa': workbook.addWorksheet('Causa'),
            'Prejuízo Cívil': workbook.addWorksheet('Prejuízo Cívil'),
            'Prejuízo Mecânica': workbook.addWorksheet('Prejuízo Mecânica'), 
            'Prejuízo Química': workbook.addWorksheet('Prejuízo Química'),   
            'Prejuízo Metalurgia': workbook.addWorksheet('Prejuízo Metalurgia'),
            'Prejuízo Elétrica Eletrônica': workbook.addWorksheet('Prejuízo Elétrica Eletrônica'), 
            'Prejuízo Transporte': workbook.addWorksheet('Prejuízo Transporte'),
            'Assistência Técnica Incêndio': workbook.addWorksheet('Assistência Técnica Incêndio'), 
            'Assistência Técnica Civil': workbook.addWorksheet('Assistência Técnica Civil'), 
            'Assistência Técnica Elétrica': workbook.addWorksheet('Assistência Técnica Elétrica'), // Corrigido para 'ATElétrica'
            'Assistência Técnica Mecânica': workbook.addWorksheet('Assistência Técnica Mecânica'), // Corrigido para 'ATMecânica'
            'Assistência Técnica Química': workbook.addWorksheet('Assistência Técnica Química'), // Corrigido para 'ATQuímica'
            'Assistência Técnica Metalurgia': workbook.addWorksheet('Assistência Técnica Metalurgia'), // Corrigido para 'ATMetalurgia'
            '3D': workbook.addWorksheet('3D'),
            'Massificados': workbook.addWorksheet('Massificados'),
            'Atividade Interna':workbook.addWorksheet('Atividade Interna'),
            'Análise de documentos':workbook.addWorksheet('Análise de documentos'),
            'Reunião':workbook.addWorksheet('Reunião'),
            'Relatório':workbook.addWorksheet('Relatório'),
            'Viagem':workbook.addWorksheet('Viagem'),
            'Vistoria':workbook.addWorksheet('Vistoria')
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
                const logoPath = path.join(__dirname, '..','..','img','logo.png'); 
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
                            horas: { formula: `=(D${rowNumber}-C${rowNumber})*24` },
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
                    valorHoraRow.getCell('E').numFmt = '"R$ "#,##0.00';

                    const totalFinalRow = worksheet.addRow([]);
                    totalFinalRow.getCell('B').value = "Total Cálculo Final";
                    totalFinalRow.getCell('B').font = { bold: true };
                    totalFinalRow.getCell('E').numFmt = '"R$ "#,##0.00';
                    
                        
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

        


                        // --- Início da Solução para Problema 2 ---
            // Remover abas que não foram utilizadas
            const populatedIncidenceKeys = new Set(Object.keys(groupedData));
            const sheetsToRemoveIds = [];

            // Itera sobre TODAS as chaves de incidência que poderiam ter sido criadas como abas
            for (const dbKey in worksheetMap) {
                const worksheet = worksheetMap[dbKey];
                // Se a incidência NÃO foi populada com dados E a worksheet de fato existe no workbook
                if (!populatedIncidenceKeys.has(dbKey) && worksheet) {
                    sheetsToRemoveIds.push(worksheet.id);
                }
            }
            sheetsToRemoveIds.forEach(sheetId => {
                workbook.removeWorksheet(sheetId);
            });
            // --- Fim da Solução para Problema 2 ---
               
            //Criação da Aba Resumo
            resumo.getColumn('D').width=13
            resumo.getColumn('C').width=15
            const cellD5 = resumo.getCell('D5');

            // Defina as propriedades da célula
            cellD5.value = 'Homem-Hora';
            cellD5.fill = {
                type: 'pattern',        // O tipo de preenchimento é um padrão
                pattern: 'solid',       // O padrão é sólido (cor única)
                // **MUDANÇA AQUI:** Usaremos bgColor (background color)
                bgColor: { argb: 'FFDEDEDE' } // 'FF' para 100% de opacidade + o código da cor
            };
            cellD5.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            }
                const MesInicial=firstItem.DtInicial.getMonth()
                const MesFinal=finalItem.DtFinal.getMonth()      
                const Mes={
                    0:"Jan",
                    1:"Fev",
                    2:"Mar",
                    3:"Abr",
                    4:"Mai",
                    5:"Jun",
                    6:"Jul",
                    7:"Ago",
                    8:"Set",
                    9:"Out",
                    10:"Nov",
                    11:"Dez"
                }
                console.log(MesFinal,MesInicial)
            const filename = `${!firstItem.Sinistro?'geral':firstItem.Sinistro}-Parcial de ${Mes[MesInicial]} a ${Mes[MesFinal]} de 2025 -${firstItem.Segurado || 'geral'}-${firstItem.NTradsul || 'geral'}.xlsx`;
            
            const sanitizedFilename = filename.replace(/[/\:*?"<>|\n–—]/g, '_'); // Remove aspas internas se houver
            
            const encodedFilenameForHeader = encodeURIComponent(sanitizedFilename);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader(
            'Content-Disposition',
            `attachment; filename="${sanitizedFilename};"`
            );

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

            // --- INÍCIO DA LÓGICA INTELIGENTE ---

            // 1. Mapear os cabeçalhos para seus números de coluna
            const headerRow = worksheet.getRow(1);
            if (!headerRow.values || headerRow.values.length === 1) { // .values[0] é sempre nulo
                return res.status(400).json({ message: 'A planilha não contém um cabeçalho válido.' });
            }

            const headerMap = {};
            headerRow.eachCell((cell, colNumber) => {
                if (cell.value) {
                    // Mapeia o nome do header (ex: "NTradsul") para o número da coluna (ex: 4)
                    headerMap[cell.value.toString().trim()] = colNumber;
                }
            });

            // 2. Validar se todos os cabeçalhos necessários existem
            const requiredHeaders = [
                'Seguradora', 'Segurado', 'Nro. Seguradora', 'Codigo do Sinistro', 
                'Dt. inicial', 'Dt. final', 'Descrição da tarefa', 'Tp. Incidência', 'Regulador/Prestador'
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
                const desc = row.getCell(headerMap['Descrição da tarefa']).value;
                const incidencia = row.getCell(headerMap['Tp. Incidência']).value;
                const executante = row.getCell(headerMap['Regulador/Prestador']).value;
                
                try {
                    if (!processo || !DtInicial || !DtFinal || !incidencia || !executante) {
                        console.log(processo)
                        console.log(DtInicial)
                        console.log(DtFinal)
                        //console.log(desc)
                        console.log(incidencia)
                        console.log(executante)
                        throw new Error(`Dados obrigatórios (Processo, Datas, Descrição, Incidência, Executante) estão faltando.`);
                    }
                      /*     const dataToInsert = {
                        seguradora: seguradora, // Já é null se vazio/opcional
                        segurado: segurado,
                        sinistro: sinistro, // Já é null se vazio/opcional
                        processo: processo,
                        DtInicial: DtInicial,
                        DtFinal: DtFinal,
                        desc: desc, // Já é null se vazio/opcional
                        incidencia: incidencia,
                        executante: executante,
                    };*/

                                                // No seu repositório ou controller, antes de chamar prisma.timesheet.create()
                       // console.log("Dados a serem inseridos:", dataToInsert); // 'dataToInsert' é o objeto que você passa para o create()

                      /*  // Para verificar o comprimento de cada string individualmente:
                        console.log("Seguradora length:", dataToInsert.Seguradora ? dataToInsert.Seguradora.length : 'N/A');
                        console.log("Segurado length:", dataToInsert.Segurado ? dataToInsert.Segurado.length : 'N/A');
                        console.log("Sinistro length:", dataToInsert.Sinistro ? dataToInsert.Sinistro.length : 'N/A');
                        console.log("NTradsul length:", dataToInsert.NTradsul ? dataToInsert.NTradsul.length : 'N/A');
                        console.log("TpIncidencia length:", dataToInsert.TpIncidencia ? dataToInsert.TpIncidencia.length : 'N/A');
                        console.log("Executante length:", dataToInsert.Executante ? dataToInsert.Executante.length : 'N/A');
                        console.log("Descricao length:", dataToInsert.Descricao ? dataToInsert.Descricao.length : 'N/A');
                                        */

                    // Chamada para o repositório com os dados extraídos
                    const sinistroString=String(sinistro)
                    const processoUp = processoString.toUpperCase();
                    //const descString=String(desc)

                    await TSrepo.importTS(seguradora, segurado, sinistroString, processoUp, DtInicial, DtFinal, desc, incidencia, executante);
                    successfulImports++;
                } catch (error) {
                    failedImports++;
                    errors.push(`Linha ${rowNumber}: ${error.message}`);
                    console.log(error)
                    
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

 

