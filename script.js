// ================= DATOS =================

let movements = JSON.parse(localStorage.getItem("movements")) || []


// ================= ELEMENTOS =================

const form = document.getElementById("movementForm")
const table = document.getElementById("movementTable")

const cashEl = document.getElementById("cash")
const salesEl = document.getElementById("sales")
const expensesEl = document.getElementById("expenses")
const profitEl = document.getElementById("profit")

const plIncome = document.getElementById("plIncome")
const plExpenses = document.getElementById("plExpenses")
const plResult = document.getElementById("plResult")

const typeInput = document.getElementById("type")


// ================= FECHA AUTOMATICA =================

const dateInput = document.getElementById("date")

if(dateInput){
dateInput.value = new Date().toISOString().split("T")[0]
}


// ================= BOTONES DE TIPO =================

const typeButtons = document.querySelectorAll(".tipo")

typeButtons.forEach(btn => {

btn.addEventListener("click", () => {

typeButtons.forEach(b => b.classList.remove("active"))

btn.classList.add("active")

typeInput.value = btn.dataset.type

})

})


// ================= GUARDAR MOVIMIENTO =================

if(form){

form.addEventListener("submit", function(e){

e.preventDefault()

const date = document.getElementById("date").value
const type = document.getElementById("type").value
const concept = document.getElementById("concept").value
const amount = parseFloat(document.getElementById("amount").value)

if(!type || !amount){
alert("Completa los datos")
return
}

const movement = {
date: date,
type: type,
concept: concept,
amount: amount
}

movements.push(movement)

localStorage.setItem("movements", JSON.stringify(movements))

form.reset()

dateInput.value = new Date().toISOString().split("T")[0]

render()

})

}


// ================= CALCULO DE SALDO =================

function calculateBalance(index){

let balance = 0

for(let i = 0; i <= index; i++){

let m = movements[i]

if(m.type === "income" || m.type === "loan" || m.type === "investment"){
balance += m.amount
}

if(m.type === "expense" || m.type === "asset"){
balance -= m.amount
}

}

return balance

}


// ================= RENDER TABLA =================

function render(){

if(!table) return

table.innerHTML = ""

let cash = 0
let sales = 0
let expenses = 0

movements.forEach((m,index) => {

let balance = calculateBalance(index)

if(m.type === "income") sales += m.amount

if(m.type === "expense") expenses += m.amount

cash = balance

let row = document.createElement("tr")

row.innerHTML = `
<td>${m.date}</td>
<td>${m.type}</td>
<td>${m.concept}</td>
<td>${m.amount}</td>
<td>${balance}</td>
`

table.appendChild(row)

})

let profit = sales - expenses

if(cashEl) cashEl.textContent = cash
if(salesEl) salesEl.textContent = sales
if(expensesEl) expensesEl.textContent = expenses
if(profitEl) profitEl.textContent = profit

if(plIncome) plIncome.textContent = sales
if(plExpenses) plExpenses.textContent = expenses
if(plResult) plResult.textContent = profit

}


// ================= TABS =================

const tabs = document.querySelectorAll(".tab")
const tabBtns = document.querySelectorAll(".tab-btn")

tabBtns.forEach(btn => {

btn.addEventListener("click", () => {

tabBtns.forEach(b => b.classList.remove("active"))
tabs.forEach(t => t.classList.remove("active"))

btn.classList.add("active")

const tab = document.getElementById(btn.dataset.tab)

if(tab) tab.classList.add("active")

})

})


// ================= EXPORTAR CAJA =================

const downloadCaja = document.getElementById("downloadCaja")

if(downloadCaja){

downloadCaja.addEventListener("click", () => {

let csv = "Fecha,Tipo,Concepto,Monto\n"

movements.forEach(m => {

csv += m.date + "," + m.type + "," + m.concept + "," + m.amount + "\n"

})

downloadCSV(csv,"caja_negocio.csv")

})

}


// ================= EXPORTAR P&L =================

const downloadPL = document.getElementById("downloadPL")

if(downloadPL){

downloadPL.addEventListener("click", () => {

let income = 0
let expenses = 0

movements.forEach(m => {

if(m.type === "income") income += m.amount
if(m.type === "expense") expenses += m.amount

})

let profit = income - expenses

let csv = "Concepto,Monto\n"
csv += "Ingresos," + income + "\n"
csv += "Gastos," + expenses + "\n"
csv += "Resultado," + profit + "\n"

downloadCSV(csv,"perdidas_ganancias.csv")

})

}


// ================= EXPORTAR BALANCE =================

const downloadBalance = document.getElementById("downloadBalance")

if(downloadBalance){

downloadBalance.addEventListener("click", () => {

let cash = 0
let debt = 0
let capital = 0

movements.forEach(m => {

if(m.type === "income") cash += m.amount
if(m.type === "expense") cash -= m.amount
if(m.type === "asset") cash -= m.amount
if(m.type === "loan") debt += m.amount
if(m.type === "investment") capital += m.amount

})

let csv = "Tipo,Monto\n"
csv += "Activos," + cash + "\n"
csv += "Pasivos," + debt + "\n"
csv += "Capital," + capital + "\n"

downloadCSV(csv,"balance.csv")

})

}


// ================= EXPORTAR FLUJO =================

const downloadFlujo = document.getElementById("downloadFlujo")

if(downloadFlujo){

downloadFlujo.addEventListener("click", () => {

let inflow = 0
let outflow = 0

movements.forEach(m => {

if(m.type === "income" || m.type === "loan" || m.type === "investment"){
inflow += m.amount
}

if(m.type === "expense" || m.type === "asset"){
outflow += m.amount
}

})

let final = inflow - outflow

let csv = "Concepto,Monto\n"
csv += "Entradas," + inflow + "\n"
csv += "Salidas," + outflow + "\n"
csv += "Dinero final," + final + "\n"

downloadCSV(csv,"flujo_caja.csv")

})

}


// ================= FUNCION DESCARGA =================

function downloadCSV(content,filename){

const blob = new Blob([content], {type:"text/csv"})

const link = document.createElement("a")

link.href = URL.createObjectURL(blob)

link.download = filename

link.click()

}


// ================= INICIO =================

render()