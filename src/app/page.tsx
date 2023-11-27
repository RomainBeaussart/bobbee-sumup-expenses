"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { SelectUser } from "@/components/ui/select-user";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import { Expense, getExpenses, getUsers } from "./actions";

import { FileDown, RotateCw, FileCog, FileCog2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { ThemeToggle } from "@/components/ui/select-theme";
import { ExpensesTable } from "@/components/ui/expenses-table";
import { generateCsvUri } from "@/lib/expenseExport";

export default function Home() {
    const [rangeDate, setRangeDate] = useState<DateRange | undefined>(
        undefined
    );
    const [user, setUser] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState(false);
    const [companyId, setCompanyId] = useState<string>("");

    const [users, setusers] = useState<
        { id: string; firstname: string; lastname: string }[]
    >([]);

    const [expenses, setExpenses] = useState<Expense[]>([]);

    const reloadUsersButtonDisabled = !companyId || loading;

    const exportButtonDisabled =
        !rangeDate?.from || !rangeDate?.to || !user || loading;

    useEffect(() => {
        setLoading(true);
        window.onmessage = (event) => {
            const { type, payload } = event.data;
            if (type === "company") {
                setCompanyId(payload.id);
                setLoading(false);
            }
        };

        return () => {
            window.onmessage = null;
        };
    });

    const fetchUsers = () => {
        setLoading(true);
        getUsers({ companyId }).then((users) => {
            setusers(users);
            setLoading(false);
        });
    };

    const fetchExpenses = () => {
        if (!rangeDate || !rangeDate?.from || !rangeDate?.to || !user) {
            return;
        }
        setLoading(true);
        getExpenses({
            companyId,
            userId: user || "",
            rangeDate: { from: rangeDate.from, to: rangeDate.to },
        }).then((expenses) => {
            setExpenses(expenses);
            setLoading(false);
        });
    };

    useEffect(() => {
        fetchUsers();
    }, [companyId]);

    return (
        <main className="flex min-h-screen flex-col justify-between">
            <div className="mb-auto p-24">
                <div className="pb-24 flex justify-between">
                    <h1 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
                        Exportez vos notes de frais
                    </h1>
                    <ThemeToggle />
                </div>
                <div className="justify-between mb-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <div className="m-1 flex justify-center">
                        <DatePicker range={rangeDate} setRange={setRangeDate} />
                    </div>
                    <div className="m-1 flex justify-center">
                        <SelectUser
                            defaultUser="me"
                            users={users}
                            onUserChange={setUser}
                        />
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="secondary"
                                        disabled={reloadUsersButtonDisabled}
                                        onClick={() => {
                                            fetchUsers();
                                        }}
                                        className="ml-2"
                                    >
                                        <RotateCw className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Recharger les utilisateurs</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                    <div className="m-1 flex justify-center">
                        <Button
                            disabled={exportButtonDisabled}
                            onClick={() => fetchExpenses()}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                    Exportation en cours...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <FileCog className="mr-2 h-4 w-4" />{" "}
                                    Exporter
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
                <div className="mt-4">
                    {expenses.length > 0 && (
                        <ExpensesTable
                            expenses={expenses}
                            companyId={companyId}
                        />
                    )}
                </div>
                {expenses.length !== 0 && (
                    <div className="mt-4 flex justify-end">
                        <a
                            href={generateCsvUri(expenses)}
                            download="notes-de-frais.csv"
                        >
                            <Button variant="secondary">
                                <FileDown className="mr-2 h-4 w-4" /> Générer le
                                fichier Excel
                            </Button>
                        </a>
                    </div>
                )}
            </div>
            <div className="bg-slate-200 text-slate-600 text-center py-2 dark:bg-slate-800 dark:text-slate-400">
                Developed by{" "}
                <a
                    href="https://softcode.fr/"
                    className="underline underline-offset-1"
                >
                    SoftCode.fr
                </a>
            </div>
        </main>
    );
}
