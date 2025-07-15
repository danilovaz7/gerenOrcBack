import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';

pdfMake.vfs = pdfFonts.vfs;

function formatarDataBrasileira(isoDate) {
  if (!isoDate) return '---';
  const d = new Date(isoDate);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Gera um PDF de orçamento a partir dos dados recebidos.
 * @param {{ forma_pagamento: string, valor_total: number, logo?: string }} orcamento - logo no formato DataURL/Base64
 * @param {Array} procedimentos - Cada objeto pode ter foto_antes e foto_depois como DataURL/Base64
 * @param {string} nomeUsuario
 * @param {string} dataCriacao - data de criação do orçamento em ISO
 * @returns {Promise<Buffer>} Buffer do PDF gerado
 */
export function gerarPdfOrcamento(orcamento, procedimentos, nomeUsuario, dataCriacao) {
  const formaPagCap = capitalize(orcamento.forma_pagamento);

  const logoCenterBackground = orcamento.logo
    ? (currentPage, pageSize) => {
        const imgWidth = 350;
        const imgHeight = imgWidth;
        return {
          image: orcamento.logo,
          width: imgWidth,
          absolutePosition: {
            x: (pageSize.width - imgWidth) / 2,
            y: (pageSize.height - imgHeight) / 2
          },
          opacity: 0.4
        };
      }
    : null;

  const docDefinition = {
    background: logoCenterBackground,
    content: [
      { text: '\nOrçamento de Procedimentos', style: 'header', alignment: 'center' },
      { text: `Nome do paciente: ${nomeUsuario}`, margin: [0, 0, 0, 5] },
      { text: `Data de Criação: ${formatarDataBrasileira(dataCriacao)}`, margin: [0, 0, 0, 10] },

      { text: 'Procedimentos', style: 'subheader' },
      {
        style: 'procedimentosTable',
        table: {
          widths: ['*', 80, 'auto', '*'],
          body: [
            ['Nome', 'Valor', 'Data', 'Observações'],
            ...procedimentos.map(p => [
              p.nome_procedimento,
              { text: `R$ ${parseFloat(p.valor_procedimento).toFixed(2)}`, style: 'valorTable' },
              formatarDataBrasileira(p.dt_realizacao),
              p.obs_procedimento || '---'
            ])
          ]
        }
      },

      { text: ' ', margin: [0, 10, 0, 0] },
      { text: `Forma de Pagamento: ${formaPagCap}`, margin: [0, 20, 0, 5], alignment: 'right' },
      { text: `Valor Total: R$ ${parseFloat(orcamento.valor_total).toFixed(2)}`, margin: [0, 5, 0, 10], alignment: 'right' },
    ],
    styles: {
      header: { fontSize: 20, bold: true, margin: [0, 0, 0, 10] },
      subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] },
      procedimentosTable: { fontSize: 10 },
      valorTable: { fontSize: 12, bold: true }
    }
  };

  return new Promise((resolve) => {
    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBuffer(buffer => resolve(buffer));
  });
}
