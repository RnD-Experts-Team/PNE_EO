import InputError from '@/components/input-error';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import stores from '@/routes/stores';
import type { BreadcrumbItem } from '@/types';
import { Form, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

type ExpenseType = { id: number; type_name: string };
type Store = { id: number; name: string };

export default function Create() {
    const { store, expenseTypes } = usePage<{
        store: Store;
        expenseTypes: ExpenseType[];
    }>().props;

    const [expenseTypeId, setExpenseTypeId] = useState<string>('');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Stores', href: stores.index().url },
        { title: store.name, href: stores.show(store).url },
        { title: 'Add Expense', href: stores.expenses.create(store).url },
    ];

    return (
        <PageShell title="Add Store Expense" breadcrumbs={breadcrumbs}>
            <div>
                <h1 className="text-xl font-semibold">Add Store Expense</h1>
                <p className="text-sm text-muted-foreground">
                    For {store.name}
                </p>
            </div>

            <Form
                {...stores.expenses.store.form(store)}
                encType="multipart/form-data"
                className="mt-6 max-w-3xl"
            >
                {({ processing, errors }) => (
                    <Card>
                        <CardHeader>
                            <CardTitle>Expense</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Expense Type</Label>

                                <input
                                    type="hidden"
                                    name="expense_type_id"
                                    value={expenseTypeId}
                                />

                                <Select
                                    value={expenseTypeId}
                                    onValueChange={setExpenseTypeId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {expenseTypes.map((t) => (
                                            <SelectItem
                                                key={t.id}
                                                value={String(t.id)}
                                            >
                                                {t.type_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <InputError message={errors.expense_type_id} />
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="value">Value</Label>
                                    <Input
                                        id="value"
                                        name="value"
                                        inputMode="decimal"
                                        placeholder="0.00"
                                    />
                                    <InputError message={errors.value} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="expense_date">
                                        Expense date
                                    </Label>
                                    <Input
                                        id="expense_date"
                                        name="expense_date"
                                        type="date"
                                    />
                                    <InputError message={errors.expense_date} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expense_info">
                                    Expense Info
                                </Label>
                                <Textarea
                                    id="expense_info"
                                    name="expense_info"
                                    rows={3}
                                />
                                <InputError message={errors.expense_info} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea id="notes" name="notes" rows={3} />
                                <InputError message={errors.notes} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="attachments">Attachments</Label>
                                <Input
                                    id="attachments"
                                    name="attachments[]"
                                    type="file"
                                    multiple
                                />
                                <InputError
                                    message={(errors as any)['attachments']}
                                />
                                <InputError
                                    message={(errors as any)['attachments.0']}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Button type="submit" disabled={processing}>
                                    Save
                                </Button>
                                <Button variant="outline" asChild type="button">
                                    <Link href={stores.show(store).url}>
                                        Cancel
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </Form>
        </PageShell>
    );
}
