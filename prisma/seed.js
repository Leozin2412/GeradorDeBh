// seed.js (ou prisma/seed.js)

// Importa o PrismaClient a partir do caminho especificado
import prisma from "../src/util/prismaclient.js";


// Função para gerar um número aleatório de 4 dígitos
function generateRandomNumber() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Array de opções para Incidência
const incidenciaOptions = [
  'Causa',
  'Prejuízo Cívil',
  'Prejuízo Mecânica',
  'Danos Materiais',
  'Incêndio',
  'Roubo',
  'Prejuízo Elétrica',
  'Prejuízo Transporte',
  'Outros',
];

// Array de opções para Executante
const executanteOptions = [
  'Carlos Souza',
  'Ana Paula',
  'Pedro Pádua',
  'João Périco',
  'Isabella Ferraz',
  'Mariana',
  'Ricardo Guedes',
];

async function main() {
  const currentYear = new Date().getFullYear();

  console.log('Iniciando o seeding com mais de 10 atividades/sinistros...');

  // --- DEFININDO NÚMEROS DE PROCESSO PARA REUTILIZAÇÃO ---
  const nTradsul1 = `TOK${currentYear}${generateRandomNumber()}`;
  const nTradsul2 = `TOK${currentYear}${generateRandomNumber()}`;
  const nTradsul3 = `TOK${currentYear}${generateRandomNumber()}`;
  const nTradsul4 = `TOK${currentYear}${generateRandomNumber()}`;
  const nTradsul5 = `TOK${currentYear}${generateRandomNumber()}`;
  const nTradsul6 = `TOK${currentYear}${generateRandomNumber()}`;
  const nTradsul7 = `TOK${currentYear}${generateRandomNumber()}`;


  // --- Inserindo dados de exemplo para Sinistros e Atividades ---

  // 1. Sinistro de Incêndio (Atividade Inicial)
  const atividade1_1 = await prisma.timesheet.create({
    data: {
      Segurado: 'Indústrias Químicas BR',
      Sinistro: 'SEG-2024-001',
      NTradsul: nTradsul1,
      DtInicial: new Date('2024-03-10T09:00:00Z'),
      DtFinal: new Date('2024-03-12T18:00:00Z'),
      Descricao: 'Vistoria inicial e investigação da causa de incêndio em armazém.',
      TpIncidencia: 'Causa',
      Executante: 'Pedro Pádua',
    },
  });

  // 2. Atividade de Acompanhamento para o mesmo Incêndio
  const atividade1_2 = await prisma.timesheet.create({
    data: {
      Segurado: 'Indústrias Químicas BR',
      Sinistro: 'SEG-2024-001',
      NTradsul: nTradsul1, // MESMO NTradsul
      DtInicial: new Date('2024-03-20T10:00:00Z'),
      DtFinal: new Date('2024-03-22T17:00:00Z'),
      Descricao: 'Análise laboratorial de materiais e elaboração de laudo técnico.',
      TpIncidencia: 'Incêndio',
      Executante: 'Isabella Ferraz',
    },
  });

  // 3. Sinistro de Transporte
  const atividade2_1 = await prisma.timesheet.create({
    data: {
      Segurado: 'Logística Rápida Ltda.',
      Sinistro: 'SEG-2024-002',
      NTradsul: nTradsul2,
      DtInicial: new Date('2024-04-01T14:00:00Z'),
      DtFinal: new Date('2024-04-02T11:00:00Z'),
      Descricao: 'Perícia de avaria em carga de eletrônicos após acidente rodoviário.',
      TpIncidencia: 'Prejuízo Transporte',
      Executante: 'Isabella Ferraz',
    },
  });

  // 4. Sinistro de Engenharia Civil
  const atividade3_1 = await prisma.timesheet.create({
    data: {
      Segurado: 'Shopping Center Urbano',
      Sinistro: 'SEG-2024-003',
      NTradsul: nTradsul3,
      DtInicial: new Date('2024-04-15T08:30:00Z'),
      DtFinal: new Date('2024-04-16T16:00:00Z'),
      Descricao: 'Análise de danos estruturais em estacionamento subterrâneo após infiltração.',
      TpIncidencia: 'Prejuízo Cívil',
      Executante: 'Mariana',
    },
  });
  
  // 5. Atividade de Acompanhamento para o Sinistro Civil
    const atividade3_2 = await prisma.timesheet.create({
    data: {
      Segurado: 'Shopping Center Urbano',
      Sinistro: 'SEG-2024-003',
      NTradsul: nTradsul3, // MESMO NTradsul
      DtInicial: new Date('2024-05-02T09:00:00Z'),
      DtFinal: new Date('2024-05-04T17:00:00Z'),
      Descricao: 'Acompanhamento dos reparos e elaboração de parecer técnico final.',
      TpIncidencia: 'Prejuízo Cívil',
      Executante: 'Mariana',
    },
  });

  // 6. Sinistro de Falha em Equipamento Mecânico
  const atividade4_1 = await prisma.timesheet.create({
    data: {
      Segurado: 'Siderúrgica Aço Forte',
      Sinistro: 'SEG-2024-004',
      NTradsul: nTradsul4,
      DtInicial: new Date('2024-05-01T10:00:00Z'),
      DtFinal: new Date('2024-05-03T18:00:00Z'),
      Descricao: 'Investigação de falha catastrófica em redutor de laminador a quente.',
      TpIncidencia: 'Prejuízo Mecânica',
      Executante: 'João Périco',
    },
  });

  // 7. Sinistro de Dano Elétrico
  const atividade5_1 = await prisma.timesheet.create({
    data: {
      Segurado: 'Hospital Vida Plena',
      Sinistro: 'SEG-2024-005',
      NTradsul: nTradsul5,
      DtInicial: new Date('2024-05-10T13:00:00Z'),
      DtFinal: new Date('2024-05-10T19:00:00Z'),
      Descricao: 'Análise de queima de transformador de energia principal.',
      TpIncidencia: 'Prejuízo Elétrica',
      Executante: 'João Périco',
    },
  });

  // 8. Sinistro de Roubo de Carga
  const atividade6_1 = await prisma.timesheet.create({
    data: {
      Segurado: 'Transportadora Carga Segura',
      Sinistro: 'SEG-2024-006',
      NTradsul: nTradsul6,
      DtInicial: new Date('2024-06-05T09:00:00Z'),
      DtFinal: new Date('2024-06-06T12:00:00Z'),
      Descricao: 'Apuração de roubo de carga de defensivos agrícolas.',
      TpIncidencia: 'Roubo',
      Executante: 'Isabella Ferraz',
    },
  });

  // 9. Atividade de Consultoria em Prevenção de Perdas
  const atividade7_1 = await prisma.timesheet.create({
    data: {
      Segurado: 'Fábrica de Alimentos NutriBem',
      Sinistro: 'CONSULT-2024-001',
      NTradsul: nTradsul7,
      DtInicial: new Date('2024-06-15T09:00:00Z'),
      DtFinal: new Date('2024-06-20T17:00:00Z'),
      Descricao: 'Análise de risco e recomendações para prevenção de incêndios na planta.',
      TpIncidencia: 'Outros',
      Executante: 'Pedro Pádua',
    },
  });

  // 10. Sinistro Massificado - Dano Elétrico Residencial
   const atividade8_1 = await prisma.timesheet.create({
    data: {
      Segurado: 'Cliente Residencial XYZ',
      Sinistro: 'MASS-2024-10521',
      NTradsul: `TOK${currentYear}${generateRandomNumber()}`,
      DtInicial: new Date('2024-06-18T14:00:00Z'),
      DtFinal: new Date('2024-06-18T16:00:00Z'),
      Descricao: 'Regulação de sinistro por queima de eletrodomésticos após sobrecarga.',
      TpIncidencia: 'Prejuízo Elétrica',
      Executante: 'Ricardo Guedes',
    },
  });

  // 11. Sinistro de Prejuízo Mecânico em Máquina Agrícola
  const atividade9_1 = await prisma.timesheet.create({
    data: {
      Segurado: 'Fazenda Terra Fértil',
      Sinistro: 'AGRO-2024-078',
      NTradsul: `TOK${currentYear}${generateRandomNumber()}`,
      DtInicial: new Date('2024-07-01T08:00:00Z'),
      DtFinal: new Date('2024-07-03T17:00:00Z'),
      Descricao: 'Perícia de falha no motor de colheitadeira durante a safra.',
      TpIncidencia: 'Prejuízo Mecânica',
      Executante: 'João Périco',
    },
  });

  console.log('✅ Seeding concluído com sucesso! (11 registros inseridos)');
}

// Executa a função principal e lida com erros
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });