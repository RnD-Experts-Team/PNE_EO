import { ConfirmDialog } from '@/components/confirm-dialog';
import InputError from '@/components/input-error';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';
import expenseTypes from '@/routes/expense-types';
import type { BreadcrumbItem } from '@/types';
import { Form, Link, usePage } from '@inertiajs/react';

type ExpenseType = {
    id: number;
    type_name: string;
    description?: string | null;
    deleted_at?: string | null;
};

type Pagination<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

export default function Index() {
    const { expenseTypes: paged } = usePage<{
        expenseTypes: Pagination<ExpenseType>;
    }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Expense Types', href: expenseTypes.index().url },
    ];

    return (
        <PageShell title="Expense Types" breadcrumbs={breadcrumbs}>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold">Expense Types</h1>
                    <p className="text-sm text-muted-foreground">
                        Total: {paged.total}
                    </p>
                </div>

                <Button asChild>
                    <Link href={expenseTypes.create().url}>
                        Create Expense Type
                    </Link>
                </Button>
            </div>

            <div className="mt-4 rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="w-[1%] text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {paged.data.map((t) => {
                            const isDeleted = !!t.deleted_at;

                            return (
                                <TableRow
                                    key={t.id}
                                    className={isDeleted ? 'opacity-70' : ''}
                                >
                                    <TableCell className="font-medium">
                                        {t.type_name}
                                    </TableCell>

                                    <TableCell className="text-muted-foreground">
                                        {t.description ?? '—'}
                                    </TableCell>

                                    <TableCell>
                                        <span className="text-sm text-muted-foreground">
                                            {isDeleted ? 'Deleted' : 'Active'}
                                        </span>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                asChild
                                                disabled={isDeleted}
                                            >
                                                <Link
                                                    href={
                                                        expenseTypes.edit({
                                                            expense_type: t.id,
                                                        }).url
                                                    }
                                                >
                                                    Edit
                                                </Link>
                                            </Button>

                                            {!isDeleted ? (
                                                // Soft delete (confirm)
                                                <Form
                                                    {...expenseTypes.destroy.form(
                                                        { expense_type: t.id },
                                                    )}
                                                >
                                                    {({
                                                        processing,
                                                        errors,
                                                        submit,
                                                    }) => (
                                                        <>
                                                            <ConfirmDialog
                                                                title="Delete expense type?"
                                                                description={`This will hide “${t.type_name}” from use, but existing expenses will remain intact.`}
                                                                confirmText="Delete"
                                                                cancelText="Cancel"
                                                                confirmDisabled={
                                                                    processing
                                                                }
                                                                confirmVariant="destructive"
                                                                onConfirm={() =>
                                                                    submit()
                                                                }
                                                                trigger={
                                                                    <Button
                                                                        size="sm"
                                                                        variant="destructive"
                                                                        type="button"
                                                                        disabled={
                                                                            processing
                                                                        }
                                                                    >
                                                                        Delete
                                                                    </Button>
                                                                }
                                                            />

                                                            <InputError
                                                                message={
                                                                    (
                                                                        errors as any
                                                                    )?._ ??
                                                                    undefined
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </Form>
                                            ) : (
                                                // Restore (Wayfinder-style)
                                                <Form
                                                    {...expenseTypes.restore.form(
                                                        t.id,
                                                    )}
                                                >
                                                    {({
                                                        processing,
                                                        errors,
                                                    }) => (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                type="submit"
                                                                disabled={
                                                                    processing
                                                                }
                                                            >
                                                                Restore
                                                            </Button>

                                                            <InputError
                                                                message={
                                                                    (
                                                                        errors as any
                                                                    )?._ ??
                                                                    undefined
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </Form>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            );
                        })}

                        {paged.data.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="py-10 text-center text-sm text-muted-foreground"
                                >
                                    No expense types yet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {paged.links.map((l, idx) => (
                    <Button
                        key={idx}
                        variant={l.active ? 'default' : 'outline'}
                        size="sm"
                        asChild
                        disabled={!l.url}
                    >
                        <Link href={l.url ?? '#'} preserveScroll preserveState>
                            <span
                                dangerouslySetInnerHTML={{ __html: l.label }}
                            />
                        </Link>
                    </Button>
                ))}
            </div>
        </PageShell>
    );
}
