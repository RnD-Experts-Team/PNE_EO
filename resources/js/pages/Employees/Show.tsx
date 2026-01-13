import { PageShell } from '@/components/page-shell';
import { Badge } from '@/components/ui/badge';
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
import employees from '@/routes/employees';
import type { BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

type ExpenseType = {
    id: number;
    type_name: string;
    description?: string | null;
};

type EmployeeExpense = {
    id: number;
    expense_date: string;
    value: string;
    expense_type?: ExpenseType | null;
    expense_info?: string | null;
    notes?: string | null;
};

type EmployeeStatus = { id: number; value: string };

type EmployeeContact = {
    id: number;
    contact_type: string;
    contact_value: string;
    is_primary: boolean;
};

type EmployeeEmployment = {
    employee_id: number;
    department?: string | null;
    location?: string | null;
    designation?: string | null;
    hiring_date?: string | null;
};

type EmployeeDemographics = {
    employee_id: number;
    date_of_birth?: string | null;
    gender?: string | null;
    marital_status?: string | null;
    veteran_status?: boolean | null;
};

type EmployeeIdentifiers = {
    employee_id: number;
    social_security_number?: string | null;
    national_id_number?: string | null;
    itin?: string | null;
};

type EmployeeAddress = {
    id: number;
    address_type?: string | null;
    address_line1?: string | null;
    address_line2?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    postal_code?: string | null;
};

type Tag = {
    id: number;
    tag_name: string;
};

type Employee = {
    id: number;
    first_name: string;
    middle_name?: string | null;
    last_name: string;
    preferred_name?: string | null;
    about_me?: string | null;

    status?: EmployeeStatus | null;

    contacts?: EmployeeContact[];
    employment?: EmployeeEmployment | null;
    demographics?: EmployeeDemographics | null;
    identifiers?: EmployeeIdentifiers | null;
    addresses?: EmployeeAddress[];
    tags?: Tag[];

    expenses: EmployeeExpense[];
};

function formatDateSafe(dateStr?: string | null): string {
    if (!dateStr) return '—';
    const m = dateStr.match(/^(\d{4}-\d{2}-\d{2})/);
    if (!m) return dateStr;

    const [y, mo, d] = m[1].split('-').map((x) => Number(x));
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

function yesNo(value?: boolean | null): string {
    if (value === true) return 'Yes';
    if (value === false) return 'No';
    return '—';
}

function displayTag(t: Tag): string {
    return t.tag_name ?? '—';
}

export default function Show() {
    const { employee } = usePage<{ employee: Employee }>().props;

    const fullName = [
        employee.first_name,
        employee.middle_name,
        employee.last_name,
    ]
        .filter(Boolean)
        .join(' ');

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Employees', href: employees.index().url },
        { title: fullName, href: employees.show(employee).url },
    ];

    const contacts = employee.contacts ?? [];
    const addresses = employee.addresses ?? [];
    const tags = employee.tags ?? [];

    return (
        <PageShell title={`Employee: ${fullName}`} breadcrumbs={breadcrumbs}>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                    <h1 className="text-xl font-semibold">{fullName}</h1>
                    <div className="flex flex-wrap items-center gap-2">
                        {employee.preferred_name ? (
                            <Badge variant="secondary">
                                Preferred: {employee.preferred_name}
                            </Badge>
                        ) : null}

                        {employee.status?.value ? (
                            <Badge>{employee.status.value}</Badge>
                        ) : null}
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button variant="outline" asChild>
                        <Link href={employees.edit(employee).url}>Edit</Link>
                    </Button>
                </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {/* About */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>About</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        {employee.about_me ? employee.about_me : '—'}
                    </CardContent>
                </Card>

                {/* Expenses */}
                <Card className="flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Expenses</CardTitle>
                        <Button size="sm" asChild>
                            <Link
                                href={employees.expenses.create(employee).url}
                            >
                                Add
                            </Link>
                        </Button>
                    </CardHeader>

                    {/* Fixed-height scroll area */}
                    <CardContent className="flex-1">
                        <div className="h-[320px] overflow-hidden rounded-lg border">
                            {/* horizontal scroll if table gets wide */}
                            <div className="h-full overflow-x-auto">
                                {/* vertical scroll inside */}
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
                                            {employee.expenses?.map((x) => (
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
                                                                    employees.expenses.show(
                                                                        [
                                                                            employee.id,
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

                                            {(employee.expenses?.length ??
                                                0) === 0 && (
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
            </div>

            {/* Details section */}
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
                {/* Employment */}
                <Card>
                    <CardHeader>
                        <CardTitle>Employment</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        <div className="grid gap-2">
                            <div>
                                <span className="font-medium text-foreground">
                                    Department:
                                </span>{' '}
                                {employee.employment?.department ?? '—'}
                            </div>
                            <div>
                                <span className="font-medium text-foreground">
                                    Location:
                                </span>{' '}
                                {employee.employment?.location ?? '—'}
                            </div>
                            <div>
                                <span className="font-medium text-foreground">
                                    Designation:
                                </span>{' '}
                                {employee.employment?.designation ?? '—'}
                            </div>
                            <div>
                                <span className="font-medium text-foreground">
                                    Hiring date:
                                </span>{' '}
                                {formatDateSafe(
                                    employee.employment?.hiring_date,
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Demographics */}
                <Card>
                    <CardHeader>
                        <CardTitle>Demographics</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        <div className="grid gap-2">
                            <div>
                                <span className="font-medium text-foreground">
                                    Date of birth:
                                </span>{' '}
                                {formatDateSafe(
                                    employee.demographics?.date_of_birth,
                                )}
                            </div>
                            <div>
                                <span className="font-medium text-foreground">
                                    Gender:
                                </span>{' '}
                                {employee.demographics?.gender ?? '—'}
                            </div>
                            <div>
                                <span className="font-medium text-foreground">
                                    Marital status:
                                </span>{' '}
                                {employee.demographics?.marital_status ?? '—'}
                            </div>
                            <div>
                                <span className="font-medium text-foreground">
                                    Veteran:
                                </span>{' '}
                                {yesNo(employee.demographics?.veteran_status)}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Identifiers */}
                <Card>
                    <CardHeader>
                        <CardTitle>Identifiers</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        <div className="grid gap-2">
                            <div>
                                <span className="font-medium text-foreground">
                                    SSN:
                                </span>{' '}
                                {employee.identifiers?.social_security_number ??
                                    '—'}
                            </div>
                            <div>
                                <span className="font-medium text-foreground">
                                    National ID:
                                </span>{' '}
                                {employee.identifiers?.national_id_number ??
                                    '—'}
                            </div>
                            <div>
                                <span className="font-medium text-foreground">
                                    ITIN:
                                </span>{' '}
                                {employee.identifiers?.itin ?? '—'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Contacts */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Contacts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead className="text-right">
                                            Primary
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contacts.map((c) => (
                                        <TableRow key={c.id}>
                                            <TableCell>
                                                {c.contact_type}
                                            </TableCell>
                                            <TableCell>
                                                {c.contact_value}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {c.is_primary ? (
                                                    <Badge variant="secondary">
                                                        Yes
                                                    </Badge>
                                                ) : (
                                                    '—'
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {contacts.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan={3}
                                                className="py-8 text-center text-sm text-muted-foreground"
                                            >
                                                No contacts yet.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Addresses */}
                <Card>
                    <CardHeader>
                        <CardTitle>Addresses</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        {addresses.length === 0 ? (
                            <div className="py-2">—</div>
                        ) : (
                            <div className="grid gap-3">
                                {addresses.map((a) => (
                                    <div
                                        key={a.id}
                                        className="rounded-md border p-3"
                                    >
                                        <div className="font-medium text-foreground">
                                            {a.address_type ?? 'Address'}
                                        </div>
                                        <div>{a.address_line1 ?? '—'}</div>
                                        {a.address_line2 ? (
                                            <div>{a.address_line2}</div>
                                        ) : null}
                                        <div>
                                            {[a.city, a.state, a.postal_code]
                                                .filter(Boolean)
                                                .join(', ') || '—'}
                                        </div>
                                        <div>{a.country ?? '—'}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Tags */}
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Tags</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {tags.length === 0 ? (
                            <div className="text-sm text-muted-foreground">
                                —
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {tags.map((t) => (
                                    <Badge key={t.id} variant="secondary">
                                        {displayTag(t)}
                                    </Badge>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageShell>
    );
}
