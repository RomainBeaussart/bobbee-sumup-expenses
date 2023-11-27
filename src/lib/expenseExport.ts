import { Expense } from "@/app/actions";
import dayjs from "dayjs";
import { groupBy } from "lodash";

export function generateCsvUri(expenses: Expense[]): string {

    const amountOfDayInMonth = dayjs(expenses[0].date).daysInMonth()

    let formated = expenses.map((er) => ({
        jour: dayjs(er.date).get("D"),
        type: getTypeOfReport(er.accountableAccount.name),
        vatAmount: er.vatAmount,
        netAmount: er.netAmount,
        grossAmount: er.grossAmount,
    }))

    let sorted = groupBy(formated, "jour")

    for (let day = 1; day <= amountOfDayInMonth; day++) {
        let depenses = sorted[day]
        let sortedDepenses = groupBy(depenses, "type")
        for (let type in sortedDepenses) {
            // @ts-ignore
            sortedDepenses[type] = sortedDepenses[type].reduce((acc, curr) => ({
                vatAmount: acc.vatAmount + curr.vatAmount,
                netAmount: acc.netAmount + curr.netAmount,
                grossAmount: acc.grossAmount + curr.grossAmount,
                jour: curr.jour,
                type: curr.type
            }), { grossAmount: 0, netAmount: 0, vatAmount: 0, jour: 0, type: "" })
        }
        // @ts-ignore
        sorted[day] = sortedDepenses
    }

    let csv = "data:text/csv;charset=utf-8," + "jour; Resto; T.V.A.; H.T.; Hotel / PD; T.V.A.; H.T.; Transport; T.V.A.; H.T.; Gas-oil \n"
    for (let day in sorted) {
        let depenses = sorted[day]
        // @ts-ignore
        csv += `${day}; ${formatAmount(depenses["Restaurant"]?.grossAmount) || ''}; ${formatAmount(depenses["Restaurant"]?.vatAmount) || ''}; ${formatAmount(depenses["Restaurant"]?.netAmount) || ''};`
        // @ts-ignore
        csv += `${formatAmount(depenses["Frais de déplacement"]?.grossAmount) || ''};${formatAmount(depenses["Frais de déplacement"]?.vatAmount) || ''};${formatAmount(depenses["Frais de déplacement"]?.netAmount) || ''};`
        // @ts-ignore
        csv += `${formatAmount(depenses["Frais de déplacement"]?.grossAmount) || ''};${formatAmount(depenses["Frais de déplacement"]?.vatAmount) || ''};${formatAmount(depenses["Frais de déplacement"]?.netAmount) || ''};`
        // @ts-ignore
        csv += `${formatAmount(depenses["Carburant"]?.grossAmount) || ''}\n`
    }

    return encodeURI(csv);
    // window.open(encodedUri);
}

function formatAmount(number: string | number) {
    if (!number) return ''
    return (number + "").replace(".", ",") || ''
}

function getTypeOfReport(accountableAccount: string) {
    let mappingTable = [
        { text: "Carburant", value: "606120" },
        { text: "Fournitures / documentation", value: "606300" }, // doublon Frais administratifs
        { text: "Frais de déplacement", value: "625100" }, // doublon Frais de déplacement
        { text: "Internet", value: "626200" },
        { text: "Poste", value: "626000" },
        { text: "Restaurant", value: "625700" },
        { text: "Téléphone", value: "626100" },
    ];
    return mappingTable.find((item) => item.value === accountableAccount)?.text || "Autre";
}