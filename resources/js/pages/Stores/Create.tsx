import InputError from '@/components/input-error';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import stores from '@/routes/stores';
import type { BreadcrumbItem } from '@/types';
import { Form, Link } from '@inertiajs/react';

export default function Create() {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Stores', href: stores.index().url },
        { title: 'Create', href: stores.create().url },
    ];

    return (
        <PageShell title="Create Store" breadcrumbs={breadcrumbs}>
            <div>
                <h1 className="text-xl font-semibold">Create Store</h1>
            </div>

            <Form {...stores.store.form()} className="mt-6 max-w-xl space-y-6">
                {({ processing, errors }) => (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="manual_id">Manual ID</Label>
                            <Input id="manual_id" name="manual_id" required />
                            <InputError message={errors.manual_id} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" required />
                            <InputError message={errors.name} />
                        </div>

                        <div className="pt-2">
                            <h2 className="text-sm font-medium">Location</h2>
                            <div className="mt-3 space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="address_line1">
                                        Address Line 1
                                    </Label>
                                    <Input
                                        id="address_line1"
                                        name="address_line1"
                                        required
                                    />
                                    <InputError
                                        message={errors.address_line1}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address_line2">
                                        Address Line 2 (optional)
                                    </Label>
                                    <Input
                                        id="address_line2"
                                        name="address_line2"
                                    />
                                    <InputError
                                        message={errors.address_line2}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input id="city" name="city" required />
                                    <InputError message={errors.city} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">State</Label>
                                    <Input id="state" name="state" required />
                                    <InputError message={errors.state} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        required
                                    />
                                    <InputError message={errors.country} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="postal_code">
                                        Postal Code
                                    </Label>
                                    <Input
                                        id="postal_code"
                                        name="postal_code"
                                        required
                                    />
                                    <InputError message={errors.postal_code} />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                Create
                            </Button>
                            <Button variant="outline" asChild type="button">
                                <Link href={stores.index().url}>Cancel</Link>
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </PageShell>
    );
}
