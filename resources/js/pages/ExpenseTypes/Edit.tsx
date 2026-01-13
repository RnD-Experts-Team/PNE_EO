import InputError from '@/components/input-error';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import expenseTypes from '@/routes/expense-types';
import type { BreadcrumbItem } from '@/types';
import { Form, Link, usePage } from '@inertiajs/react';

type ExpenseType = {
    id: number;
    type_name: string;
    description?: string | null;
};

export default function Edit() {
    const { expenseType } = usePage<{ expenseType: ExpenseType }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Expense Types', href: expenseTypes.index().url },
        {
            title: 'Edit',
            href: expenseTypes.edit({ expense_type: expenseType.id }).url,
        },
    ];

    return (
        <PageShell title="Edit Expense Type" breadcrumbs={breadcrumbs}>
            <div>
                <h1 className="text-xl font-semibold">Edit Expense Type</h1>
            </div>

            <Form
                {...expenseTypes.update.form({ expense_type: expenseType.id })}
                className="mt-6 max-w-xl space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="type_name">Type name</Label>
                            <Input
                                id="type_name"
                                name="type_name"
                                required
                                defaultValue={expenseType.type_name}
                            />
                            <InputError message={errors.type_name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={4}
                                defaultValue={expenseType.description ?? ''}
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                Save
                            </Button>
                            <Button variant="outline" asChild type="button">
                                <Link href={expenseTypes.index().url}>
                                    Cancel
                                </Link>
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </PageShell>
    );
}
