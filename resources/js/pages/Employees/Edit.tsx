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
import { useMemo, useState } from 'react';

type EmployeeStatus = { id: number; value: string };
type Tag = { id: number; tag_name: string };

type Employment = {
    department?: string | null;
    location?: string | null;
    designation?: string | null;
    hiring_date?: string | null;
};

type Demographics = {
    date_of_birth?: string | null;
    gender?: string | null;
    marital_status?: string | null;
    veteran_status?: boolean | null;
};

type Identifiers = {
    social_security_number?: string | null;
    national_id_number?: string | null;
    itin?: string | null;
};

type ContactRow = {
    id: number;
    contact_type: string;
    contact_value: string;
    is_primary: boolean;
};

type AddressRow = {
    id: number;
    address_type: string;
    address_line1: string;
    address_line2?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    postal_code?: string | null;
};

type Employee = {
    id: number;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    preferred_name?: string | null;
    employee_status_id: number;
    about_me?: string | null;

    employment?: Employment | null;
    demographics?: Demographics | null;
    identifiers?: Identifiers | null;
    contacts?: ContactRow[];
    addresses?: AddressRow[];
    tags?: Tag[];
};

export default function Edit() {
    const { employee, statuses, tags } = usePage<{
        employee: Employee;
        statuses: EmployeeStatus[];
        tags: Tag[];
    }>().props;

    const [statusId, setStatusId] = useState<string>(
        String(employee.employee_status_id ?? ''),
    );

    const [contacts, setContacts] = useState<
        {
            id?: number;
            contact_type: string;
            contact_value: string;
            is_primary: boolean;
        }[]
    >(
        (employee.contacts?.length
            ? employee.contacts
            : [{ contact_type: 'email', contact_value: '', is_primary: true }]
        ).map((c) => ({
            id: (c as any).id,
            contact_type: c.contact_type ?? '',
            contact_value: c.contact_value ?? '',
            is_primary: !!c.is_primary,
        })),
    );

    const [addresses, setAddresses] = useState<
        {
            id?: number;
            address_type: string;
            address_line1: string;
            address_line2?: string;
            city?: string;
            state?: string;
            country?: string;
            postal_code?: string;
        }[]
    >(
        (employee.addresses?.length
            ? employee.addresses
            : [
                  {
                      address_type: 'home',
                      address_line1: '',
                      address_line2: '',
                      city: '',
                      state: '',
                      country: '',
                      postal_code: '',
                  },
              ]
        ).map((a: any) => ({
            id: a.id,
            address_type: a.address_type ?? '',
            address_line1: a.address_line1 ?? '',
            address_line2: a.address_line2 ?? '',
            city: a.city ?? '',
            state: a.state ?? '',
            country: a.country ?? '',
            postal_code: a.postal_code ?? '',
        })),
    );

    const initialTagIds = useMemo(
        () => (employee.tags ?? []).map((t) => t.id),
        [employee.tags],
    );
    const [tagIds, setTagIds] = useState<number[]>(initialTagIds);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Employees', href: employees.index().url },
        { title: 'Edit', href: employees.edit(employee).url },
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
        <PageShell title="Edit Employee" breadcrumbs={breadcrumbs}>
            <div>
                <h1 className="text-xl font-semibold">Edit Employee</h1>
            </div>

            <Form
                {...employees.update.form(employee)}
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
                                        defaultValue={employee.first_name ?? ''}
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
                                        defaultValue={
                                            employee.middle_name ?? ''
                                        }
                                    />
                                    <InputError message={errors.middle_name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last name</Label>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        required
                                        defaultValue={employee.last_name ?? ''}
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
                                        defaultValue={
                                            employee.preferred_name ?? ''
                                        }
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
                                    defaultValue={employee.about_me ?? ''}
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
                                <div className="space-y-2">
                                    <Label>Department</Label>
                                    <Input
                                        name="employment[department]"
                                        defaultValue={
                                            employee.employment?.department ??
                                            ''
                                        }
                                    />
                                    <InputError
                                        message={
                                            (errors as any)[
                                                'employment.department'
                                            ]
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input
                                        name="employment[location]"
                                        defaultValue={
                                            employee.employment?.location ?? ''
                                        }
                                    />
                                    <InputError
                                        message={
                                            (errors as any)[
                                                'employment.location'
                                            ]
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Designation</Label>
                                    <Input
                                        name="employment[designation]"
                                        defaultValue={
                                            employee.employment?.designation ??
                                            ''
                                        }
                                    />
                                    <InputError
                                        message={
                                            (errors as any)[
                                                'employment.designation'
                                            ]
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Hiring date</Label>
                                    <Input
                                        type="date"
                                        name="employment[hiring_date]"
                                        defaultValue={
                                            employee.employment?.hiring_date ??
                                            ''
                                        }
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

                        {/* Demographics */}
                        <section className="space-y-4">
                            <h2 className="text-sm font-medium text-muted-foreground">
                                Demographics
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Date of birth</Label>
                                    <Input
                                        type="date"
                                        name="demographics[date_of_birth]"
                                        defaultValue={
                                            employee.demographics
                                                ?.date_of_birth ?? ''
                                        }
                                    />
                                    <InputError
                                        message={
                                            (errors as any)[
                                                'demographics.date_of_birth'
                                            ]
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Gender</Label>
                                    <Input
                                        name="demographics[gender]"
                                        defaultValue={
                                            employee.demographics?.gender ?? ''
                                        }
                                    />
                                    <InputError
                                        message={
                                            (errors as any)[
                                                'demographics.gender'
                                            ]
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Marital status</Label>
                                    <Input
                                        name="demographics[marital_status]"
                                        defaultValue={
                                            employee.demographics
                                                ?.marital_status ?? ''
                                        }
                                    />
                                    <InputError
                                        message={
                                            (errors as any)[
                                                'demographics.marital_status'
                                            ]
                                        }
                                    />
                                </div>

                                <div className="flex items-center gap-2 pt-6">
                                    <input
                                        id="veteran"
                                        type="checkbox"
                                        name="demographics[veteran_status]"
                                        value="1"
                                        defaultChecked={
                                            !!employee.demographics
                                                ?.veteran_status
                                        }
                                    />
                                    <Label htmlFor="veteran">Veteran</Label>
                                </div>
                            </div>
                        </section>

                        {/* Identifiers */}
                        <section className="space-y-4">
                            <h2 className="text-sm font-medium text-muted-foreground">
                                Identifiers
                            </h2>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>SSN</Label>
                                    <Input
                                        name="identifiers[social_security_number]"
                                        defaultValue={
                                            employee.identifiers
                                                ?.social_security_number ?? ''
                                        }
                                    />
                                    <InputError
                                        message={
                                            (errors as any)[
                                                'identifiers.social_security_number'
                                            ]
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>National ID</Label>
                                    <Input
                                        name="identifiers[national_id_number]"
                                        defaultValue={
                                            employee.identifiers
                                                ?.national_id_number ?? ''
                                        }
                                    />
                                    <InputError
                                        message={
                                            (errors as any)[
                                                'identifiers.national_id_number'
                                            ]
                                        }
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>ITIN</Label>
                                    <Input
                                        name="identifiers[itin]"
                                        defaultValue={
                                            employee.identifiers?.itin ?? ''
                                        }
                                    />
                                    <InputError
                                        message={
                                            (errors as any)['identifiers.itin']
                                        }
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Contacts */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-medium text-muted-foreground">
                                    Contacts
                                </h2>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setContacts((prev) => [
                                            ...prev,
                                            {
                                                contact_type: '',
                                                contact_value: '',
                                                is_primary: false,
                                            },
                                        ])
                                    }
                                >
                                    Add contact
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {contacts.map((c, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-lg border p-4"
                                    >
                                        {!!c.id && (
                                            <input
                                                type="hidden"
                                                name={`contacts[${idx}][id]`}
                                                value={c.id}
                                            />
                                        )}

                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label>Type</Label>
                                                <Input
                                                    value={c.contact_type}
                                                    onChange={(e) =>
                                                        setContacts((prev) =>
                                                            prev.map((x, i) =>
                                                                i === idx
                                                                    ? {
                                                                          ...x,
                                                                          contact_type:
                                                                              e
                                                                                  .target
                                                                                  .value,
                                                                      }
                                                                    : x,
                                                            ),
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`contacts[${idx}][contact_type]`}
                                                    value={c.contact_type}
                                                />
                                                <InputError
                                                    message={
                                                        (errors as any)[
                                                            `contacts.${idx}.contact_type`
                                                        ]
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Value</Label>
                                                <Input
                                                    value={c.contact_value}
                                                    onChange={(e) =>
                                                        setContacts((prev) =>
                                                            prev.map((x, i) =>
                                                                i === idx
                                                                    ? {
                                                                          ...x,
                                                                          contact_value:
                                                                              e
                                                                                  .target
                                                                                  .value,
                                                                      }
                                                                    : x,
                                                            ),
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`contacts[${idx}][contact_value]`}
                                                    value={c.contact_value}
                                                />
                                                <InputError
                                                    message={
                                                        (errors as any)[
                                                            `contacts.${idx}.contact_value`
                                                        ]
                                                    }
                                                />
                                            </div>

                                            <div className="flex items-center gap-2 pt-6">
                                                <input
                                                    type="radio"
                                                    name="__primary_contact_radio"
                                                    checked={c.is_primary}
                                                    onChange={() =>
                                                        setPrimaryContact(idx)
                                                    }
                                                />
                                                <Label>Primary</Label>
                                                <input
                                                    type="hidden"
                                                    name={`contacts[${idx}][is_primary]`}
                                                    value={
                                                        c.is_primary ? '1' : '0'
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-3 flex justify-end">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setContacts((prev) =>
                                                        prev.filter(
                                                            (_, i) => i !== idx,
                                                        ),
                                                    )
                                                }
                                                disabled={contacts.length === 1}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Addresses */}
                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-medium text-muted-foreground">
                                    Addresses
                                </h2>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setAddresses((prev) => [
                                            ...prev,
                                            {
                                                address_type: '',
                                                address_line1: '',
                                                address_line2: '',
                                                city: '',
                                                state: '',
                                                country: '',
                                                postal_code: '',
                                            },
                                        ])
                                    }
                                >
                                    Add address
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {addresses.map((a, idx) => (
                                    <div
                                        key={idx}
                                        className="rounded-lg border p-4"
                                    >
                                        {!!a.id && (
                                            <input
                                                type="hidden"
                                                name={`addresses[${idx}][id]`}
                                                value={a.id}
                                            />
                                        )}

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Type</Label>
                                                <Input
                                                    value={a.address_type}
                                                    onChange={(e) =>
                                                        setAddresses((prev) =>
                                                            prev.map((x, i) =>
                                                                i === idx
                                                                    ? {
                                                                          ...x,
                                                                          address_type:
                                                                              e
                                                                                  .target
                                                                                  .value,
                                                                      }
                                                                    : x,
                                                            ),
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`addresses[${idx}][address_type]`}
                                                    value={a.address_type}
                                                />
                                                <InputError
                                                    message={
                                                        (errors as any)[
                                                            `addresses.${idx}.address_type`
                                                        ]
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Line 1</Label>
                                                <Input
                                                    value={a.address_line1}
                                                    onChange={(e) =>
                                                        setAddresses((prev) =>
                                                            prev.map((x, i) =>
                                                                i === idx
                                                                    ? {
                                                                          ...x,
                                                                          address_line1:
                                                                              e
                                                                                  .target
                                                                                  .value,
                                                                      }
                                                                    : x,
                                                            ),
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`addresses[${idx}][address_line1]`}
                                                    value={a.address_line1}
                                                />
                                                <InputError
                                                    message={
                                                        (errors as any)[
                                                            `addresses.${idx}.address_line1`
                                                        ]
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Line 2</Label>
                                                <Input
                                                    value={
                                                        a.address_line2 ?? ''
                                                    }
                                                    onChange={(e) =>
                                                        setAddresses((prev) =>
                                                            prev.map((x, i) =>
                                                                i === idx
                                                                    ? {
                                                                          ...x,
                                                                          address_line2:
                                                                              e
                                                                                  .target
                                                                                  .value,
                                                                      }
                                                                    : x,
                                                            ),
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`addresses[${idx}][address_line2]`}
                                                    value={
                                                        a.address_line2 ?? ''
                                                    }
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>City</Label>
                                                <Input
                                                    value={a.city ?? ''}
                                                    onChange={(e) =>
                                                        setAddresses((prev) =>
                                                            prev.map((x, i) =>
                                                                i === idx
                                                                    ? {
                                                                          ...x,
                                                                          city: e
                                                                              .target
                                                                              .value,
                                                                      }
                                                                    : x,
                                                            ),
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`addresses[${idx}][city]`}
                                                    value={a.city ?? ''}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>State</Label>
                                                <Input
                                                    value={a.state ?? ''}
                                                    onChange={(e) =>
                                                        setAddresses((prev) =>
                                                            prev.map((x, i) =>
                                                                i === idx
                                                                    ? {
                                                                          ...x,
                                                                          state: e
                                                                              .target
                                                                              .value,
                                                                      }
                                                                    : x,
                                                            ),
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`addresses[${idx}][state]`}
                                                    value={a.state ?? ''}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Country</Label>
                                                <Input
                                                    value={a.country ?? ''}
                                                    onChange={(e) =>
                                                        setAddresses((prev) =>
                                                            prev.map((x, i) =>
                                                                i === idx
                                                                    ? {
                                                                          ...x,
                                                                          country:
                                                                              e
                                                                                  .target
                                                                                  .value,
                                                                      }
                                                                    : x,
                                                            ),
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`addresses[${idx}][country]`}
                                                    value={a.country ?? ''}
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label>Postal code</Label>
                                                <Input
                                                    value={a.postal_code ?? ''}
                                                    onChange={(e) =>
                                                        setAddresses((prev) =>
                                                            prev.map((x, i) =>
                                                                i === idx
                                                                    ? {
                                                                          ...x,
                                                                          postal_code:
                                                                              e
                                                                                  .target
                                                                                  .value,
                                                                      }
                                                                    : x,
                                                            ),
                                                        )
                                                    }
                                                />
                                                <input
                                                    type="hidden"
                                                    name={`addresses[${idx}][postal_code]`}
                                                    value={a.postal_code ?? ''}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-3 flex justify-end">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    setAddresses((prev) =>
                                                        prev.filter(
                                                            (_, i) => i !== idx,
                                                        ),
                                                    )
                                                }
                                                disabled={
                                                    addresses.length === 1
                                                }
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Tags */}
                        <section className="space-y-4">
                            <h2 className="text-sm font-medium text-muted-foreground">
                                Tags
                            </h2>

                            <div className="grid gap-2 md:grid-cols-3">
                                {tags.map((t) => (
                                    <label
                                        key={t.id}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={tagIds.includes(t.id)}
                                            onChange={() => toggleTag(t.id)}
                                        />
                                        <span>{t.tag_name}</span>
                                        {tagIds.includes(t.id) && (
                                            <input
                                                type="hidden"
                                                name="tag_ids[]"
                                                value={t.id}
                                            />
                                        )}
                                    </label>
                                ))}
                            </div>
                            <InputError message={(errors as any)['tag_ids']} />
                        </section>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                Save
                            </Button>
                            <Button variant="outline" asChild type="button">
                                <Link href={employees.show(employee).url}>
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
