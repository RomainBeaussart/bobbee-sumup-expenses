"use server";

import zod from "zod";
import redaxios from "redaxios";

const API_URL: string = process.env.BOBBEE_API_URL || "";
const API_LOGIN: string = process.env.BOBBEE_API_LOGIN || "";
const API_PASSWORD: string = process.env.BOBBEE_API_PASSWORD || "";

const retreiveToken = async () => {
    try {
        const result = await redaxios.post(`${API_URL}/v1/auth/access-token`, {
            "login": API_LOGIN,
            "password": API_PASSWORD
        })

        if (result?.data?.success === false) {
            throw new Error(result.data.message)
        }
        return result.data.token
    } catch (e) {
        return ''
    }
}

export const getUsers = async function getAllUsersOfCompany({ companyId }: GetUsersInput): Promise<User[]> {
    const token = await retreiveToken()
    if (!token) {
        return []
    }

    let users: User[] = []
    try {
        const { data } = await redaxios.get(`${API_URL}/v1/companies/${companyId}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (data?.success === false) {
            return []
        }
        users = data.data
    } catch (e) {
        console.log('error', e)
        return []
    }

    return users.sort((a: User, b: User) => {
        if (a.firstname < b.firstname) {
            return -1
        }
        if (a.firstname > b.firstname) {
            return 1
        }
        return 0
    })
}

export const getExpenses = async function getAllExpensesOfUser({ userId, companyId, rangeDate: { from, to } }: GetExpensesInput): Promise<Expense[]> {
    const token = await retreiveToken()
    if (!token) {
        return []
    }

    const fromString = from.toISOString().split('T')[0]
    const toString = to.toISOString().split('T')[0]

    let expenses: Expense[] = []

    try {
        const { data } = await redaxios.get(`${API_URL}/v1/accounting-data/company/${companyId}/documents`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Cache-Control': 'no-cache'
            },
            params: {
                take: 100,
                type: 'EXPENSE_REPORT_DOCUMENT',
                startDate: fromString,
                endDate: toString
            }
        })
        
        if (data?.success === false) {
            return []
        }
        expenses = data.data
    } catch (error) {
        debugger
    }
    return expenses.sort((a: Expense, b: Expense) => {
        if (a.date < b.date) {
            return -1
        }
        if (a.date > b.date) {
            return 1
        }
        return 0
    })
}

const getUsersInpout = zod.object({
    companyId: zod.string()
});

type GetUsersInput = zod.infer<typeof getUsersInpout>;

type User = {
    id: string;
    firstname: string;
    lastname: string;
}

const getExpensesInpout = zod.object({
    userId: zod.string(),
    companyId: zod.string(),
    rangeDate: zod.object({
        from: zod.date(),
        to: zod.date()
    })
});

type GetExpensesInput = zod.infer<typeof getExpensesInpout>;

export type Expense = {
    id: string,
    grossAmount: number,
    vatAmount: number,
    netAmount: number,
    date: string,
    name: string,
    type: "EXPENSE_REPORT_DOCUMENT",
    accountableAccount: {
        name: string,
    }
}
