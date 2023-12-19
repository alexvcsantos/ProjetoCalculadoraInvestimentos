// contrato (necessaŕios para usar o gerador de tables)
/* 
1- sistema dece usar o Tailwindcss
2- sistema deve ter um elemento html do tipo table (com id definido) preparado e sem informações dentro
3- são necessários dois arrays para a geração da tabela...
    3.1- um array de dados
    3.2- um array com objetos que caracterizam as colunas
    3.3- não é necessário, mas pode-se passar uma função de formatação dos dados daquela coluna
*/
const isNonEmptyArray = (arrayElement) => {
    return Array.isArray(arrayElement) && arrayElement.length > 0
}

export const createTable = (columnsArray, dataArray, tableId) => {
    if (!isNonEmptyArray(columnsArray) || !isNonEmptyArray(dataArray) || !tableId) {
        throw new Error(
            "Para a correta execução, precisamos de um array com as colunas, outro com as informações das linhas e também o id do elemento tabela selecionado"
        )
    }
    const tableElement = document.getElementById(tableId)
    if (!tableElement || tableElement.nodeName !== "TABLE") {
        throw new Error("Id informado não corresponde a nenhum elemento table")
    }

    createTableHeader(tableElement, columnsArray)
    createTableBody(tableElement, dataArray, columnsArray)
}

function createTableHeader(tableReference, columnsArray) {
    function createTheadElement(tableReference) {
        const thead = document.createElement("thead")
        tableReference.appendChild(thead)
        return thead
    }

    const tableHeaderReference = tableReference.querySelector("thead") ?? createTheadElement(tableReference)
    const headerRow = document.createElement("tr")
    const classListAdd = ["bg-teal-900", "text-slate-200", "sticky", "top-0"]
    classListAdd.forEach((cssClass) => headerRow.classList.add(cssClass))

    for (const tableColumnObject of columnsArray) {
        const headerElement = /*html*/ `<th class='text-center'>${tableColumnObject.columnLabel}</th>`
        headerRow.innerHTML += headerElement
    }
    tableHeaderReference.appendChild(headerRow)
}

function createTableBody(tableReference, tableItems, columnsArray) {
    function createTbodyElement(tableReference) {
        const tbody = document.createElement("tbody")
        tableReference.appendChild(tbody)
        return tbody
    }

    const tableBodyReference = tableReference.querySelector("tbody") ?? createTbodyElement(tableReference)

    for (const [itemIndex, tableItem] of tableItems.entries()) {
        const tableRow = document.createElement("tr")
        if (itemIndex % 2 !== 0) {
            tableRow.classList.add('bg-teal-200')
        }
        for (const tableColumn of columnsArray) {
            const formatFn = tableColumn.format ?? ((info) => info)
            tableRow.innerHTML += /*html*/ `<td class='text-center'>${formatFn(tableItem[tableColumn.accessor])}</td>`
        }
        tableBodyReference.appendChild(tableRow)
    }
}
