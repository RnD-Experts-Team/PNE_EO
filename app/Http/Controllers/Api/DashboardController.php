<?php
// app/Http/Controllers/Api/DashboardController.php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DayNote;
use App\Models\Employee;
use App\Services\CalendarEventService;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __construct(private CalendarEventService $calendarService) {}

    public function index(Request $request)
    {//yes
        $today = Carbon::today();
        $year = (int) $today->year;

        $startDate = Carbon::create($year - 1, 1, 1)->startOfDay();
        $endDate   = Carbon::create($year + 1, 12, 31)->endOfDay();

        $calendarEvents = $this->calendarService
            ->generateEventsForDateRange($startDate, $endDate);

        $upcomingEvents = $this->getUpcomingEvents($calendarEvents, $today);

        $notes = DayNote::whereBetween('note_date', [$startDate, $endDate])
            ->with(['creator', 'updater'])
            ->get()
            ->keyBy(fn ($n) => $n->note_date->toDateString())
            ->map(fn ($note) => [
                'id'         => $note->id,
                'date'       => $note->note_date->toDateString(),
                'content'    => $note->content,
                'created_by' => optional($note->creator)->name,
                'updated_at' => $note->updated_at?->toDateTimeString(),
            ])
            ->values();

        $employees = Employee::select(
                'id',
                'first_name',
                'middle_name',
                'last_name',
                'preferred_name'
            )
            ->orderBy('first_name')
            ->get()
            ->map(fn ($e) => [
                'id'   => $e->id,
                'name' => trim(implode(' ', array_filter([
                    $e->preferred_name ?: $e->first_name,
                    $e->last_name
                ]))),
            ]);

        return response()->json([
            'calendar_events' => $calendarEvents,
            'upcoming_events' => $upcomingEvents,
            'day_notes'       => $notes,
            'employees'       => $employees,
            'year_window'     => [
                'start' => $year - 1,
                'end'   => $year + 1,
            ],
        ]);
    }

    private function getUpcomingEvents(array $events, Carbon $today): array
    {
        $futureEvents = array_values(array_filter(
            $events,
            fn ($e) => Carbon::parse($e['date'])->greaterThanOrEqualTo($today)
        ));

        $within10Days = array_filter(
            $futureEvents,
            fn ($e) => $today->diffInDays(Carbon::parse($e['date'])) <= 10
        );

        return count($within10Days) > 0
            ? array_values($within10Days)
            : array_slice($futureEvents, 0, 3);
    }
}
