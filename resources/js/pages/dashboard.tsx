import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import employees from '@/routes/employees';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import {
    CalendarBody,
    CalendarDate,
    CalendarDatePagination,
    CalendarHeader,
    CalendarMonthPicker,
    CalendarProvider,
    CalendarYearPicker,
    type Feature,
    type Status,
} from '@/components/kibo-ui/Index';

type DashboardEvent = {
    id: string;
    employee_id: number; // ✅ new
    date: string; // YYYY-MM-DD
    name: string;
    type: 'birthday' | 'anniversary';
};

type UpcomingEvent = DashboardEvent;

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

type FeatureWithEmployee = Feature & { employee_id: number };

function CalendarEventCard({ feature }: { feature: FeatureWithEmployee }) {
    const isBirthday = feature.status.id === 'birthday';

    return (
        <Link
            href={employees.show(feature.employee_id).url}
            className="block"
            title="Go to employee"
        >
            <div
                className="group flex w-full items-start gap-2 rounded-md border bg-background/60 p-1.5 text-[11px] leading-tight shadow-sm transition hover:bg-background"
                style={{
                    borderLeftWidth: 4,
                    borderLeftColor: feature.status.color,
                }}
            >
                <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-foreground">
                        {feature.name}
                    </div>

                    <div className="mt-0.5 flex items-center gap-1">
                        <Badge
                            variant="secondary"
                            className="h-5 px-1.5 text-[10px]"
                        >
                            {isBirthday ? 'Birthday' : 'Anniversary'}
                        </Badge>

                        <span className="text-[10px] text-muted-foreground opacity-0 transition group-hover:opacity-100">
                            Go to employee →
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default function Dashboard() {
    const { calendarEvents, upcomingEvents, yearWindow } = usePage<{
        calendarEvents: DashboardEvent[];
        upcomingEvents: UpcomingEvent[];
        yearWindow: { start: number; end: number };
    }>().props;

    const birthdayStatus: Status = {
        id: 'birthday',
        name: 'Birthday',
        color: '#22c55e',
    };

    const anniversaryStatus: Status = {
        id: 'anniversary',
        name: 'Anniversary',
        color: '#3b82f6',
    };

    const features: FeatureWithEmployee[] = (calendarEvents ?? []).map((e) => {
        const d = new Date(`${e.date}T00:00:00`);
        return {
            id: e.id,
            name: e.name,
            startAt: d,
            endAt: d,
            status: e.type === 'birthday' ? birthdayStatus : anniversaryStatus,
            employee_id: e.employee_id, // ✅ keep meta for linking
        };
    });

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Upcoming */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card className="md:col-span-3">
                        <CardHeader>
                            <CardTitle>Upcoming</CardTitle>
                        </CardHeader>

                        <CardContent className="space-y-2">
                            {(upcomingEvents ?? []).length === 0 ? (
                                <div className="text-sm text-muted-foreground">
                                    No upcoming birthdays / anniversaries found.
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {upcomingEvents.map((e) => (
                                        <div
                                            key={e.id}
                                            className="flex flex-col gap-1 rounded-md border p-3 md:flex-row md:items-center md:justify-between"
                                        >
                                            <div className="min-w-0">
                                                <div className="truncate font-medium">
                                                    {e.name}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    {e.date}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Badge variant="secondary">
                                                    {e.type === 'birthday'
                                                        ? 'Birthday'
                                                        : 'Anniversary'}
                                                </Badge>

                                                <Link
                                                    className="text-sm underline"
                                                    href={
                                                        employees.show(
                                                            e.employee_id,
                                                        ).url
                                                    }
                                                >
                                                    Go to employee
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Calendar */}
                <div className="relative flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 p-2 dark:border-sidebar-border">
                    <CalendarProvider className="h-full">
                        <div className="rounded-lg border">
                            <CalendarDate>
                                <div className="flex items-center gap-2">
                                    <CalendarMonthPicker />
                                    <CalendarYearPicker
                                        start={
                                            yearWindow?.start ??
                                            new Date().getFullYear() - 1
                                        }
                                        end={
                                            yearWindow?.end ??
                                            new Date().getFullYear() + 1
                                        }
                                    />
                                </div>

                                <CalendarDatePagination />
                            </CalendarDate>

                            <CalendarHeader />

                            {/* ✅ 3 cards per day, +X more popover (handled inside CalendarBody) */}
                            <CalendarBody features={features} maxVisible={3}>
                                {({ feature }) => (
                                    <CalendarEventCard
                                        feature={feature as FeatureWithEmployee}
                                    />
                                )}
                            </CalendarBody>
                        </div>
                    </CalendarProvider>
                </div>
            </div>
        </AppLayout>
    );
}
