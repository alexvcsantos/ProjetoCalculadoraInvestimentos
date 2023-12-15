import { generateReturnsArray } from "./src/investmentGoals"
import { Chart } from "chart.js/auto"
import { createTable } from "./src/table"

// const calculateButton = document.getElementById('calculate-results')
const form = document.getElementById("investment-form")
const clearFormButton = document.getElementById("clear-form")
const finalMoneyChart = document.getElementById("final-money-distribution")
const progressionChart = document.getElementById("progression")
let doughnutCharReference = {}
let progressionChartReference = {}

const columnsArray = [
    { columnLabel: "Mês", accessor: "month" },
    {
        columnLabel: "Total Investido",
        accessor: "investedAmount",
        format: (numberInfo) => formatCurrencyToTable(numberInfo),
    },
    {
        columnLabel: "Rendimento Mensal",
        accessor: "interestReturns",
        format: (numberInfo) => formatCurrencyToTable(numberInfo),
    },
    {
        columnLabel: "Rendimento Total",
        accessor: "totalInterestReturns",
        format: (numberInfo) => formatCurrencyToTable(numberInfo),
    },
    {
        columnLabel: "Quantia Total",
        accessor: "totalAmount",
        format: (numberInfo) => formatCurrencyToTable(numberInfo),
    },
]

function formatCurrencyToTable(value) {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatCurrencyToGraph(value) {
    return value.toFixed(2)
}

function renderProgression(e) {
    e.preventDefault()
    if (document.querySelector(".error")) {
        return
    }
    resetCharts()
    // const startingAmount = Number(form["startingAmount"].value)
    const startingAmount = Number(document.getElementById("starting-amount").value.replace(",", "."))
    const additionalContribution = Number(document.getElementById("additional-contribution").value.replace(",", "."))
    const timeAmount = Number(document.getElementById("time-amount").value)
    const timeAmountPeriod = document.getElementById("time-amount-period").value
    const returnRate = Number(document.getElementById("return-rate").value.replace(",", "."))
    const returnRatePeriod = document.getElementById("evaluation-period").value
    const taxRate = Number(document.getElementById("tax-rate").value.replace(",", "."))

    const returnsArray = generateReturnsArray(
        startingAmount,
        timeAmount,
        timeAmountPeriod,
        additionalContribution,
        returnRate,
        returnRatePeriod
    )

    const finalInvestmentObject = returnsArray[returnsArray.length - 1]

    doughnutCharReference = new Chart(finalMoneyChart, {
        type: "doughnut",
        data: {
            labels: ["Total Investido", "Rendimento", "Imposto"],
            datasets: [
                {
                    data: [
                        formatCurrencyToGraph(finalInvestmentObject.investedAmount),
                        formatCurrencyToGraph(finalInvestmentObject.totalInterestReturns * (1 - taxRate / 100)),
                        formatCurrencyToGraph(finalInvestmentObject.totalInterestReturns * (taxRate / 100)),
                    ],
                    backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)", "rgb(255, 205, 86)"],
                    hoverOffset: 4,
                },
            ],
        },
    })

    progressionChartReference = new Chart(progressionChart, {
        type: "bar",
        data: {
            labels: returnsArray.map((investmentObject) => investmentObject.month),
            datasets: [
                {
                    label: "Total Investido",
                    data: returnsArray.map((investmentObject) =>
                        formatCurrencyToGraph(investmentObject.investedAmount)
                    ),
                    backgroundColor: "rgb(255, 99, 132)",
                },
                {
                    label: "Retorno do Investimento",
                    data: returnsArray.map((investmentObject) =>
                        formatCurrencyToGraph(investmentObject.interestReturns)
                    ),
                    backgroundColor: "rgb(54, 162, 235)",
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: { stacked: true },
                y: { stacked: true },
            },
        },
    })

    createTable(columnsArray, returnsArray, "results-table")
}

function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0
}

function resetCharts() {
    if (!isObjectEmpty(doughnutCharReference) && !isObjectEmpty(progressionChartReference)) {
        doughnutCharReference.destroy()
        progressionChartReference.destroy()
    }
}

function clearForm() {
    form["starting-amount"].value = ""
    form["additional-contribution"].value = ""
    form["time-amount"].value = ""
    form["return-rate"].value = ""
    form["tax-rate"].value = ""

    resetCharts()

    const errorInputsContainers = document.querySelectorAll(".error")
    for (const errorInput of errorInputsContainers) {
        errorInput.classList.remove("error")
        errorInput.parentElement.querySelector("p").remove()
    }
}

function validateInput(e) {
    // e.target => retorna o campo que recebeu o evento blur
    if (e.target.value === "") {
        return
    }

    const { parentElement } = e.target
    const grandParentElement = e.target.parentElement.parentElement
    const inputValue = e.target.value.replace(",", ".")

    if (isNaN(inputValue) || (Number(inputValue) <= 0 && !parentElement.classList.contains("error"))) {
        const errorTextElement = document.createElement("p")
        errorTextElement.classList.add("text-red-500")
        errorTextElement.innerText = "Insira um valor numérico e maior que zero"

        parentElement.classList.add("error")
        grandParentElement.appendChild(errorTextElement)
    } else if (parentElement.classList.contains("error") && !isNaN(inputValue) && Number(inputValue) > 0) {
        parentElement.classList.remove("error")
        grandParentElement.querySelector("p").remove()
    }
}

for (const formElement of form) {
    if (formElement.tagName === "INPUT" && formElement.hasAttribute("name")) {
        formElement.addEventListener("blur", validateInput)
    }
}

form.addEventListener("submit", renderProgression)
clearFormButton.addEventListener("click", clearForm)
