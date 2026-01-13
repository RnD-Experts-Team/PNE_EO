import InputError from '@/components/input-error';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { dashboard } from '@/routes';
import expenseTypes from '@/routes/expense-types';
import type { BreadcrumbItem } from '@/types';
import { Form, Link } from '@inertiajs/react';

export default function Create() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Expense Types', href: expenseTypes.index().url },
        { title: 'Create', href: expenseTypes.create().url },
    ];

    return (
        <PageShell title="Create Expense Type" breadcrumbs={breadcrumbs}>
            <div>
                <h1 className="text-xl font-semibold">Create Expense Type</h1>
            </div>

            <Form
                {...expenseTypes.store.form()}
                className="mt-6 max-w-xl space-y-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="type_name">Type name</Label>
                            <Input id="type_name" name="type_name" required />
                            <InputError message={errors.type_name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                rows={4}
                            />
                            <InputError message={errors.description} />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                Create
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
