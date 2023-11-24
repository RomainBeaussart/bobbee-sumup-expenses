"use client";

import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/datepicker";
import { SelectUser } from "@/components/ui/select-user";
import { ReloadIcon } from "@radix-ui/react-icons";
import { FileDown, RotateCw } from "lucide-react";
import { useState } from "react";
import { DateRange } from "react-day-picker";

export default function Home() {
    const [rangeDate, setRangeDate] = useState<DateRange | undefined>(
        undefined
    );
    const [user, setUser] = useState<string | undefined>(undefined);

    const [loading, setLoading] = useState(false);

    const exportButtonDisabled =
        !rangeDate || !rangeDate.from || !rangeDate.to || loading;

    return (
        <main className="flex min-h-screen flex-col justify-between">
            <div className="mb-auto p-24">
                <div className="pb-24">
                    <h1 className="text-3xl">Exportez vos notes de frais</h1>
                </div>
                <div className="flex justify-between mb-auto">
                    <div className="mx-1">
                        <DatePicker range={rangeDate} setRange={setRangeDate} />
                    </div>
                    <div>
                        <SelectUser
                            defaultUser="me"
                            users={[
                                { id: "me", firstname: "Moi", lastname: "" },
                                {
                                    id: "someone-else",
                                    firstname: "Quelqu'un d'autre",
                                    lastname: "",
                                },
                            ]}
                            onUserChange={setUser}
                        />
                    </div>
                    <div className="mx-1">
                        <Button
                            disabled={exportButtonDisabled}
                            onClick={() => setLoading(true)}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                                    Exportation en cours...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <FileDown className="mr-2 h-4 w-4" />{" "}
                                    Exporter
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="bg-slate-200 text-slate-600 text-center py-2">
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
