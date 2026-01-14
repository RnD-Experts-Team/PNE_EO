import InputError from '@/components/input-error';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
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
import employees from '@/routes/employees';
import type { BreadcrumbItem } from '@/types';
import { Form, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

type EmployeeStatus = { id: number; value: string };
type Tag = { id: number; tag_name: string };
type Store = { id: number; name: string; manual_id: string };

type ContactRow = {
    id?: number;
    contact_type: string;
    contact_value: string;
    is_primary: boolean;
};

type AddressRow = {
    id?: number;
    address_type: string;
    address_line1: string;
    address_line2?: string;
    city?: string;
    state?: string;
    country?: string;
    postal_code?: string;
};

export default function Create() {
    const { statuses, tags, stores } = usePage<{
        statuses: EmployeeStatus[];
        tags: Tag[];
        stores: Store[];
    }>().props;

    const [statusId, setStatusId] = useState<string>('');
    const [employmentStoreId, setEmploymentStoreId] = useState<string>('');

    // Dynamic collections
    const [contacts, setContacts] = useState<ContactRow[]>([
        { contact_type: 'email', contact_value: '', is_primary: true },
    ]);

    const [addresses, setAddresses] = useState<AddressRow[]>([
        {
            address_type: 'home',
            address_line1: '',
            address_line2: '',
            city: '',
            state: '',
            country: '',
            postal_code: '',
        },
    ]);

    // Tags (checkboxes)
    const [tagIds, setTagIds] = useState<number[]>([]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Employees', href: employees.index().url },
        { title: 'Create', href: employees.create().url },
    ];

    const toggleTag = (id: number) => {
        setTagIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    const setPrimaryContact = (idx: number) => {
        setContacts((prev) =>
            prev.map((c, i) => ({ ...c, is_primary: i === idx })),
        );
    };

    return (
        <PageShell title="Create Employee" breadcrumbs={breadcrumbs}>
            <div>
                <h1 className="text-xl font-semibold">Create Employee</h1>
                <p className="text-sm text-muted-foreground">
                    Employee + related records in one request.
                </p>
            </div>

            <Form
                {...employees.store.form()}
                className="mt-6 max-w-3xl space-y-8"
            >
                {({ processing, errors }) => (
                    <>
                        {/* Basic */}
                        <section className="space-y-4">
                            <h2 className="text-sm font-medium text-muted-foreground">
                                Basic
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">
                                        First name
                                    </Label>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        required
                                    />
                                    <InputError message={errors.first_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="middle_name">
                                        Middle name
                                    </Label>
                                    <Input
                                        id="middle_name"
                                        name="middle_name"
                                    />
                                    <InputError message={errors.middle_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last name</Label>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        required
                                    />
                                    <InputError message={errors.last_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="preferred_name">
                                        Preferred name
                                    </Label>
                                    <Input
                                        id="preferred_name"
                                        name="preferred_name"
                                    />
                                    <InputError
                                        message={errors.preferred_name}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <input
                                    type="hidden"
                                    name="employee_status_id"
                                    value={statusId}
                                />
                                <Select
                                    value={statusId}
                                    onValueChange={setStatusId}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {statuses.map((s) => (
                                            <SelectItem
                                                key={s.id}
                                                value={String(s.id)}
                                            >
                                                {s.value}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError
                                    message={errors.employee_status_id}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="about_me">About</Label>
                                <Textarea
                                    id="about_me"
                                    name="about_me"
                                    rows={4}
                                />
                                <InputError message={errors.about_me} />
                            </div>
                        </section>

                        {/* Employment */}
                        <section className="space-y-4">
                            <h2 className="text-sm font-medium text-muted-foreground">
                                Employment
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2 md:col-span-2">
                                    <Label>Store</Label>

                                    <input
                                        type="hidden"
                                        name="employment[store_id]"
                                        value={employmentStoreId}
                                    />

                                    <Select
                                        value={employmentStoreId || 'none'}
                                        onValueChange={(v) =>
                                            setEmploymentStoreId(
                                                v === 'none' ? '' : v,
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select store" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">
                                                —
                                            </SelectItem>
                                            {stores.map((s) => (
                                                <SelectItem
                                                    key={s.id}
                                                    value={String(s.id)}
                                                >
                                                    {s.name} (#{s.manual_id})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <InputError
                                        message={
                                            (errors as any)[
                                                'employment.store_id'
                                            ]
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="employment_hiring_date">
                                        Hiring date
                                    </Label>
                                    <Input
                                        id="employment_hiring_date"
                                        name="employment[hiring_date]"
                                        type="date"
                                    />
                                    <InputError
                                        message={
                                            (errors as any)[
                                                'employment.hiring_date'
                                            ]
                                        }
                                    />
                                </div>
                            </div>
                        </section>

                        {/* The rest of your Create file stays the same below (Demographics, Identifiers, Contacts, Addresses, Tags) */}

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                Create
                            </Button>
                            <Button variant="outline" asChild type="button">
                                <Link href={employees.index().url}>Cancel</Link>
                            </Button>
                        </div>
                    </>
                )}
            </Form>
        </PageShell>
    );
}
