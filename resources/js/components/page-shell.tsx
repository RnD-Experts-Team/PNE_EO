import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import * as React from 'react';

export function PageShell({
    title,
    breadcrumbs,
    children,
}: {
    title: string;
    breadcrumbs: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-4 md:min-h-min dark:border-sidebar-border">
                    {children}
                </div>
            </div>
        </AppLayout>
    );
}
