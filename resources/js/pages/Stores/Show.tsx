import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';
import stores from '@/routes/stores';
import type { BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

type ExpenseType = { id: number; type_name: string };

type StoreExpense = {
    id: number;
    expense_date: string;
    value: string;
    expense_type?: ExpenseType | null;
};

type Store = {
    id: number;
    manual_id: string;
    name: string;
    expenses: StoreExpense[];
};

function formatDateSafe(dateStr: string): string {
    if (!dateStr) return '—';

    const m = dateStr.match(/^(\d{4}-\d{2}-\d{2})/);
    if (!m) return dateStr;

    const ymd = m[1];
    const [y, mo, d] = ymd.split('-').map((x) => Number(x));

    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];

    const mm = monthNames[(mo ?? 1) - 1] ?? '';
    return `${mm} ${d}, ${y}`;
}

export default function Show() {
    const { store } = usePage<{ store: Store }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Stores', href: stores.index().url },
        { title: store.name, href: stores.show(store).url },
    ];

    return (
        <PageShell title={`Store: ${store.name}`} breadcrumbs={breadcrumbs}>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold">{store.name}</h1>
                    <p className="text-sm text-muted-foreground">
                        Manual ID: {store.manual_id}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={stores.edit(store).url}>Edit</Link>
                    </Button>
                </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
                <Card className="flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Expenses</CardTitle>
                        <Button size="sm" asChild>
                            <Link href={stores.expenses.create(store).url}>
                                Add
                            </Link>
                        </Button>
                    </CardHeader>

                    {/* Fixed-height scroll area */}
                    <CardContent className="flex-1">
                        <div className="h-[360px] overflow-hidden rounded-lg border">
                            <div className="h-full overflow-x-auto">
                                <div className="h-full overflow-y-auto">
                                    <Table className="min-w-[520px]">
                                        <TableHeader className="sticky top-0 z-10 bg-background">
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead className="text-right">
                                                    Value
                                                </TableHead>
                                                <TableHead className="w-[1%] text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {store.expenses?.map((x) => (
                                                <TableRow key={x.id}>
                                                    <TableCell>
                                                        {formatDateSafe(
                                                            x.expense_date,
                                                        )}
                                                    </TableCell>

                                                    <TableCell>
                                                        {x.expense_type
                                                            ?.type_name ?? '—'}
                                                    </TableCell>

                                                    <TableCell className="text-right">
                                                        {x.value}
                                                    </TableCell>

                                                    <TableCell className="text-right">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            asChild
                                                        >
                                                            <Link
                                                                href={
                                                                    stores.expenses.show(
                                                                        [
                                                                            store.id,
                                                                            x.id,
                                                                        ],
                                                                    ).url
                                                                }
                                                            >
                                                                View
                                                            </Link>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}

                                            {(store.expenses?.length ?? 0) ===
                                                0 && (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan={4}
                                                        className="py-8 text-center text-sm text-muted-foreground"
                                                    >
                                                        No expenses yet.
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Details</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        <div className="grid gap-2">
                            <div>
                                <span className="font-medium text-foreground">
                                    Manual ID:
                                </span>{' '}
                                {store.manual_id}
                            </div>
                            <div>
                                <span className="font-medium text-foreground">
                                    Name:
                                </span>{' '}
                                {store.name}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </PageShell>
    );
}
