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
import stores from '@/routes/stores';
import type { BreadcrumbItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

type StoreRow = {
    id: number;
    manual_id: string;
    name: string;
    city: string;
    state: string;
    country: string;
};

type Pagination<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

export default function Index() {
    const { stores: paged } = usePage<{ stores: Pagination<StoreRow> }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Stores', href: stores.index().url },
    ];

    return (
        <PageShell title="Stores" breadcrumbs={breadcrumbs}>
            <div className="flex items-center justify-between gap-2">
                <div>
                    <h1 className="text-xl font-semibold">Stores</h1>
                    <p className="text-sm text-muted-foreground">
                        Total: {paged.total}
                    </p>
                </div>

                <Button asChild>
                    <Link href={stores.create().url}>Create Store</Link>
                </Button>
            </div>

            <div className="mt-4 rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Manual ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="w-[1%] text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paged.data.map((s) => (
                            <TableRow key={s.id}>
                                <TableCell className="font-medium">
                                    {s.manual_id}
                                </TableCell>
                                <TableCell>{s.name}</TableCell>
                                <TableCell>
                                    {s.city}, {s.state} · {s.country}
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href={stores.show(s).url}>
                                                View
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            asChild
                                        >
                                            <Link href={stores.edit(s).url}>
                                                Edit
                                            </Link>
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}

                        {paged.data.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={4}
                                    className="py-10 text-center text-sm text-muted-foreground"
                                >
                                    No stores yet.
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
