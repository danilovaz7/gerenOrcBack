import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pdfMake from 'pdfmake/build/pdfmake.js'
import pdfFonts from 'pdfmake/build/vfs_fonts.js'

pdfMake.vfs = pdfFonts.vfs

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function carregarTemplateDataUrl() {
  const templatePath = path.resolve(__dirname, '../../public/imgs/template.JPG')
  const arquivo = fs.readFileSync(templatePath)
  const base64 = arquivo.toString('base64')
  return `data:image/jpeg;base64,${base64}`
}

function formatarDataBrasileira(isoDate) {
  if (!isoDate) return '---'
  const d = new Date(isoDate)
  const dia = String(d.getDate()).padStart(2, '0')
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const ano = d.getFullYear()
  return `${dia}/${mes}/${ano}`
}

function capitalize(text) {
  if (!text) return ''
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export async function gerarPdfOrcamento(
  orcamento,
  procedimentos,
  nomeUsuario,
  dataCriacao,
  obs_pagamento
) {
  const templateDataUrl = carregarTemplateDataUrl()

  const formaPagCap = capitalize(orcamento?.forma_pagamento)

  // garante que procedimentos é uma array para evitar erro ao map
  const procedimentosList = Array.isArray(procedimentos) ? procedimentos : []

  // monta o conteúdo principal numa array que podemos modificar
  const content = [
    {
      text: 'Orçamento',
      style: 'header',
      alignment: 'center',
      margin: [0, 80, 0, 20]
    },
    { text: `Nome do paciente: ${nomeUsuario}`, margin: [0, 0, 0, 5] },
    { text: `Data de Criação: ${formatarDataBrasileira(dataCriacao)}`, margin: [0, 0, 0, 5] },
    { text: `Data de Validade: ${formatarDataBrasileira(orcamento?.validade)}`, margin: [0, 0, 0, 10] },

    { text: 'Procedimentos', style: 'subheader' },
    {
      style: 'procedimentosTable',
      table: {
        widths: ['*', 80, 'auto', '*'],
        body: [
          ['Nome', 'Valor', 'Data', 'Observações'],
          ...procedimentosList.map(p => {
            const valor = parseFloat(p?.valor_procedimento) || 0
            return [
              p?.nome_procedimento || '---',
              { text: `R$ ${valor.toFixed(2)}`, style: 'valorTable' },
              formatarDataBrasileira(p?.dt_realizacao),
              p?.obs_procedimento || '---'
            ]
          })
        ]
      }
    },

    { text: ' ', margin: [0, 10, 0, 0] },
    { text: `Forma de Pagamento: ${formaPagCap}`, margin: [0, 20, 0, 5], alignment: 'right' },
    {
      text: `Valor Total: R$ ${parseFloat(orcamento?.valor_total || 0).toFixed(2)}`,
      margin: [0, 5, 0, 5],
      alignment: 'right'
    },
    {
      text: `Valor Parcelado: R$ ${orcamento?.valor_parcelado ?? '---'}`,
      margin: [0, 5, 0, 10],
      alignment: 'right'
    }
  ]

  // adiciona observações apenas se houver conteúdo (não nulo/não vazio)
  if (obs_pagamento && String(obs_pagamento).trim() !== '') {
    content.push({
      text: `Observações: ${obs_pagamento}`,
      margin: [0, 5, 0, 10],
      alignment: 'right'
    })
  }

  const docDefinition = {
    pageSize: 'A4',
    background: [
      {
        image: templateDataUrl,
        width: 595.28,
        height: 841.89,
        absolutePosition: { x: 0, y: 0 }
      }
    ],
    content,
    styles: {
      header: { fontSize: 20, bold: true, margin: [0, 0, 0, 10] },
      subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] },
      procedimentosTable: { fontSize: 10 },
      valorTable: { fontSize: 12, bold: true }
    },
    defaultStyle: { font: 'Roboto' }
  }

  return new Promise(resolve => {
    const pdfGen = pdfMake.createPdf(docDefinition)
    pdfGen.getBuffer(buffer => resolve(buffer))
  })
}
