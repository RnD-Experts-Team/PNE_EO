import { ConfirmDialog } from '@/components/confirm-dialog';
import InputError from '@/components/input-error';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';
import tags from '@/routes/tags';
import type { BreadcrumbItem } from '@/types';
import { Form, Link, usePage } from '@inertiajs/react';
import * as React from 'react';

type Tag = { id: number; tag_name: string };
type Pagination<T> = {
    data: T[];
    links: { url: string | null; label: string; active: boolean }[];
    total: number;
};

export default function Index() {
    const { tags: paged } = usePage<{ tags: Pagination<Tag> }>().props;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: dashboard().url },
        { title: 'Tags', href: tags.index().url },
    ];

    const tagInputRef = React.useRef<HTMLInputElement | null>(null);

    // Local UI state: hides the error once the user edits the field
    const [hideTagNameError, setHideTagNameError] = React.useState(false);

    return (
        <PageShell title="Tags" breadcrumbs={breadcrumbs}>
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h1 className="text-xl font-semibold">Tags</h1>
                    <p className="text-sm text-muted-foreground">
                        Total: {paged.total}
                    </p>
                </div>

                <Form
                    {...tags.store.form()}
                    // NOTE: We don't use items-end here anymore.
                    // We control alignment with a small grid so the button lines up with the input.
                    className="flex flex-wrap gap-2"
                    onSuccess={() => {
                        // Clear input after successful create
                        if (tagInputRef.current) tagInputRef.current.value = '';

                        // Also hide any previous error display
                        setHideTagNameError(true);
                    }}
                    onError={() => {
                        // If server returns validation errors, show them
                        setHideTagNameError(false);
                    }}
                >
                    {({ processing, errors }) => (
                        <div className="grid grid-cols-[minmax(260px,1fr)_auto] items-end gap-2">
                            {/* Label row spans both columns */}
                            <div className="col-span-2">
                                <Label htmlFor="tag_name">New tag</Label>
                            </div>

                            {/* Input row (col 1) */}
                            <div className="col-span-1">
                                <Input
                                    ref={tagInputRef}
                                    id="tag_name"
                                    name="tag_name"
                                    placeholder="e.g. Manager"
                                    onChange={() => {
                                        // As soon as user edits, hide the old error message
                                        setHideTagNameError(true);
                                    }}
                                />
                            </div>

                            {/* Button row (col 2) aligned to input */}
                            <div className="col-span-1">
                                <Button type="submit" disabled={processing}>
                                    Add
                                </Button>
                            </div>

                            {/* Error row: under input only, does not affect button alignment */}
                            <div className="col-span-1 min-h-[20px]">
                                <InputError
                                    message={
                                        hideTagNameError
                                            ? undefined
                                            : errors.tag_name
                                    }
                                />
                            </div>

                            {/* Spacer under button to keep grid rows consistent */}
                            <div className="col-span-1" />
                        </div>
                    )}
                </Form>
            </div>

            <div className="mt-4 rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tag</TableHead>
                            <TableHead className="w-[1%] text-right">
                                Actions
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paged.data.map((t) => (
                            <TableRow key={t.id}>
                                <TableCell className="font-medium">
                                    {t.tag_name}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Form {...tags.destroy.form(t)}>
                                        {({ processing, submit }) => (
                                            <ConfirmDialog
                                                title="Delete tag?"
                                                description={`This will permanently delete “${t.tag_name}”.`}
                                                confirmText="Delete"
                                                cancelText="Cancel"
                                                confirmDisabled={processing}
                                                confirmVariant="destructive"
                                                onConfirm={() => submit()}
                                                trigger={
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        type="button"
                                                        disabled={processing}
                                                    >
                                                        Delete
                                                    </Button>
                                                }
                                            />
                                        )}
                                    </Form>
                                </TableCell>
                            </TableRow>
                        ))}

                        {paged.data.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className="py-10 text-center text-sm text-muted-foreground"
                                >
                                    No tags yet.
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
