import { AlertCircle } from 'lucide-react'
import dayjs from "dayjs";
require("dayjs/locale/fr");

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "./table";
import { Expense } from "@/app/actions";
import { Badge } from "./badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';

const notAvailable = (<TooltipProvider>
    <Tooltip>
        <TooltipTrigger asChild>
            <div className='flex items-center w-fit'>N/A <AlertCircle className="text-destructive h-4 w-4 ml-2"/></div>
        </TooltipTrigger>
        <TooltipContent>
            <div className='max-w-[180px]'>
                <p className='text-yellow-800 font-bold'>Donnée invalide.</p>
                <p className="text-yellow-800/80">Veuillez modifier cette donnée directement sur bobbee</p>
            </div>
        </TooltipContent>
    </Tooltip>
</TooltipProvider>);

function formatAmount(amount: number) {
    if (!amount) return "N/A";
    return Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
    }).format(amount);
}

function formatDate(date: string) {
    if (!date) return notAvailable;
    return dayjs(date).locale("fr").format("ddd DD MMMM YYYY");
}

function getTypeOfReport(accountableAccount: string) {
    if (!accountableAccount) return notAvailable;
    let mappingTable = [
        { text: "Carburant", value: "606120" },
        { text: "Fournitures / documentation", value: "606300" }, // doublon Frais administratifs
        { text: "Frais de déplacement", value: "625100" }, // doublon Frais de déplacement
        { text: "Internet", value: "626200" },
        { text: "Poste", value: "626000" },
        { text: "Restaurant", value: "625700" },
        { text: "Téléphone", value: "626100" },
    ];

    const accountTitle = mappingTable.find(
        (item) => item.value === accountableAccount
    )?.text;

    if (!accountTitle) return notAvailable;

    return (
        <Badge variant="secondary">
            { accountTitle }
        </Badge>
    );
}

function redirectToDocument({expenseId, companyId}: {expenseId: string, companyId: string}) {
    window.open(`https://staging-app.bobbee.co/${companyId}/documents/${expenseId}`, "_blank");
}

export function ExpensesTable({ expenses, companyId }: { expenses: Expense[], companyId: string }) {
    let total = expenses.reduce((acc, exp) => (acc += exp.grossAmount), 0);
    return (
        <Table className="rounded overflow-hidden">
            {/* <TableCaption>Notes de frais</TableCaption> */}
            <TableHeader>
                <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[200px]">Date</TableHead>
                    <TableHead className="w-[100px] text-right">
                        Montant
                    </TableHead>
                    <TableHead className="text-right">Type</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {expenses.map((expense) => (
                    <TableRow key={expense.id} onClick={() => redirectToDocument({ expenseId: expense.id, companyId})}>
                        <TableCell className="font-medium">
                            {expense.name}
                        </TableCell>
                        <TableCell>{formatDate(expense.date)}</TableCell>
                        <TableCell className="text-right">
                            {formatAmount(expense.grossAmount)}
                        </TableCell>
                        <TableCell>
                            <div className="flex justify-end">
                                {getTypeOfReport(
                                    expense.accountableAccount?.name
                                ) || "N/A"}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell className="text-right">
                        {formatAmount(total)}
                    </TableCell>
                    <TableCell />
                </TableRow>
            </TableFooter>
        </Table>
    );
}
