<?php

namespace App\Services\EventConsume\Handlers;

use App\Models\Store;
use App\Services\EventConsume\EventHandlerInterface;
use Illuminate\Support\Facades\DB;

class StoreDeletedHandler implements EventHandlerInterface
{
    public function handle(array $event): void
    {
        $storeId = $this->asInt(data_get($event, 'store_id'));
        if ($storeId <= 0) {
            throw new \Exception('StoreDeletedHandler: missing/invalid store_id');
        }

        DB::transaction(function () use ($storeId) {

            $store = Store::query()->find($storeId);

            if (!$store) {
                return;
            }

            $store->delete();
        });
    }

    private function asInt(mixed $value): int
    {
        if (is_int($value)) return $value;
        if (is_string($value) && ctype_digit($value)) return (int) $value;
        if (is_numeric($value)) return (int) $value;

        return 0;
    }
}
