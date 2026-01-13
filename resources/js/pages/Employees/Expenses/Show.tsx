import { PageShell } from '@/components/page-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import employees from '@/routes/employees';
import type { BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

type Employee = { id: number; first_name: string; last_name: string };

type Expense = {
    id: number;
    expense_date: string;
    value: string;
    expense_info?: string | null;
    notes?: string | null;
    expense_type?: { id: number; type_name: string } | null;
    attachments: { id: number; url: string; filename: string; path: string }[];
};

export default function Show() {
    const { employee, expense } = usePage<{
        employee: Employee;
        expense: Expense;
    }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Employees', href: employees.index().url },
        {
            title: `${employee.first_name} ${employee.last_name}`,
            href: employees.show(employee).url,
        },
        {
            title: `Expense #${expense.id}`,
            href: employees.expenses.show([employee.id, expense.id]).url,
        },
    ];

    return (
        <PageShell title="Employee Expense" breadcrumbs={breadcrumbs}>
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold">
                        Expense #{expense.id}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {employee.first_name} {employee.last_name}
                    </p>
                </div>

                <Button variant="outline" asChild>
                    <Link href={employees.show(employee).url}>Back</Link>
                </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Type
                            </div>
                            <div className="text-sm">
                                {expense.expense_type?.type_name ?? '—'}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Date
                            </div>
                            <div className="text-sm">
                                {expense.expense_date}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                Value
                            </div>
                            <Badge variant="secondary">${expense.value}</Badge>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                                Expense Info
                            </div>
                            <div className="text-sm whitespace-pre-wrap">
                                {expense.expense_info ?? '—'}
                            </div>
                        </div>

                        <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">
                                Notes
                            </div>
                            <div className="text-sm whitespace-pre-wrap">
                                {expense.notes ?? '—'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Attachments</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {expense.attachments.length ? (
                            <ul className="space-y-2">
                                {expense.attachments.map((a) => (
                                    <li
                                        key={a.id}
                                        className="flex items-center justify-between gap-3"
                                    >
                                        <div className="truncate text-sm">
                                            {a.filename}
                                        </div>
                                        <a
                                            className="text-sm underline"
                                            href={a.url}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Open
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                No attachments.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageShell>
    );
}
