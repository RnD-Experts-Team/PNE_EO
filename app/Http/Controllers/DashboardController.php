<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $today = Carbon::today();
        $year = (int) $today->year;

        $years = [$year - 1, $year, $year + 1];

        $employees = Employee::query()
            ->with([
                'employment:employee_id,hiring_date',
                'demographics:employee_id,date_of_birth',
            ])
            ->get([
                'id',
                'first_name',
                'middle_name',
                'last_name',
                'preferred_name',
            ]);

        $calendarEvents = [];
        $nextOccurrenceEvents = [];

        foreach ($employees as $emp) {
            $displayName = $this->employeeDisplayName($emp);

            // -------------------------
            // Birthdays
            // -------------------------
            $dob = optional($emp->demographics)->date_of_birth
                ? Carbon::parse($emp->demographics->date_of_birth)
                : null;

            if ($dob) {
                foreach ($years as $y) {
                    $eventDate = $this->safeMonthDayInYear($dob->month, $dob->day, $y);

                    $age = $y - (int) $dob->year;
                    if ($age < 0) continue;

                    $calendarEvents[] = [
                        'id' => "birthday-{$emp->id}-{$y}",
                        'employee_id' => $emp->id,
                        'date' => $eventDate->toDateString(),
                        'name' => "{$displayName} turns {$age}",
                        'type' => 'birthday',
                    ];
                }

                $nextBirthday = $this->nextOccurrenceFromMonthDay($dob->month, $dob->day, $today);
                $nextAge = (int) $nextBirthday->year - (int) $dob->year;

                $nextOccurrenceEvents[] = [
                    'id' => "next-birthday-{$emp->id}",
                    'employee_id' => $emp->id,
                    'date' => $nextBirthday->toDateString(),
                    'name' => "{$displayName} turns {$nextAge}",
                    'type' => 'birthday',
                ];
            }

            // -------------------------
            // Hiring anniversaries
            // -------------------------
            $hire = optional($emp->employment)->hiring_date
                ? Carbon::parse($emp->employment->hiring_date)
                : null;

            if ($hire) {
                foreach ($years as $y) {
                    if ($y < (int) $hire->year) continue;

                    $eventDate = $this->safeMonthDayInYear($hire->month, $hire->day, $y);

                    $yearsWithUs = $y - (int) $hire->year;
                    if ($yearsWithUs < 0) continue;

                    if ($yearsWithUs === 0 && $eventDate->isSameDay($hire)) {
                        // skip
                    } else {
                        $calendarEvents[] = [
                            'id' => "anniversary-{$emp->id}-{$y}",
                            'employee_id' => $emp->id,
                            'date' => $eventDate->toDateString(),
                            'name' => "{$displayName} • {$yearsWithUs} year" . ($yearsWithUs === 1 ? '' : 's') . " with us",
                            'type' => 'anniversary',
                        ];
                    }
                }

                $nextAnniversary = $this->nextOccurrenceFromMonthDay($hire->month, $hire->day, $today);
                if ($nextAnniversary->year >= (int) $hire->year) {
                    $yearsWithUsNext = (int) $nextAnniversary->year - (int) $hire->year;

                    if ($yearsWithUsNext > 0) {
                        $nextOccurrenceEvents[] = [
                            'id' => "next-anniversary-{$emp->id}",
                            'employee_id' => $emp->id,
                            'date' => $nextAnniversary->toDateString(),
                            'name' => "{$displayName} • {$yearsWithUsNext} year" . ($yearsWithUsNext === 1 ? '' : 's') . " with us",
                            'type' => 'anniversary',
                        ];
                    }
                }
            }
        }

        usort($nextOccurrenceEvents, function ($a, $b) {
            return strcmp($a['date'], $b['date']);
        });

        $within10 = array_values(array_filter($nextOccurrenceEvents, function ($e) use ($today) {
            $d = Carbon::parse($e['date']);
            return $d->greaterThanOrEqualTo($today) && $today->diffInDays($d) <= 10;
        }));

        $upcoming = count($within10) > 0
            ? $within10
            : array_slice(array_values(array_filter($nextOccurrenceEvents, function ($e) use ($today) {
                return Carbon::parse($e['date'])->greaterThanOrEqualTo($today);
            })), 0, 3);

        return Inertia::render('dashboard', [
            'calendarEvents' => $calendarEvents,
            'upcomingEvents' => $upcoming,
            'yearWindow' => [
                'start' => $year - 1,
                'end' => $year + 1,
            ],
        ]);
    }

    private function employeeDisplayName($emp): string
    {
        $preferred = trim((string) ($emp->preferred_name ?? ''));
        if ($preferred !== '') return $preferred;

        $parts = [
            $emp->first_name ?? null,
            $emp->middle_name ?? null,
            $emp->last_name ?? null,
        ];

        return trim(implode(' ', array_values(array_filter($parts))));
    }

    private function safeMonthDayInYear(int $month, int $day, int $year): Carbon
    {
        if ($month === 2 && $day === 29) {
            $isLeap = Carbon::create($year, 2, 1)->isLeapYear();
            $day = $isLeap ? 29 : 28;
        }

        return Carbon::create($year, $month, $day)->startOfDay();
    }

    private function nextOccurrenceFromMonthDay(int $month, int $day, Carbon $today): Carbon
    {
        $candidate = $this->safeMonthDayInYear($month, $day, (int) $today->year);

        if ($candidate->lessThan($today)) {
            $candidate = $this->safeMonthDayInYear($month, $day, (int) $today->year + 1);
        }

        return $candidate;
    }
}
