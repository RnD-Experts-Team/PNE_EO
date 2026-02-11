<?php

namespace App\Services\EventConsume\Handlers;

use App\Models\Store;
use App\Services\EventConsume\EventHandlerInterface;
use Illuminate\Support\Facades\DB;

class StoreCreatedHandler implements EventHandlerInterface
{
    public function handle(array $event): void
    {
        $storePayload = $this->extractStorePayload($event);

        $id = $this->asInt(data_get($storePayload, 'id'));
        if ($id <= 0) {
            throw new \Exception('StoreCreatedHandler: missing/invalid store.id');
        }

        $name = (string) data_get($storePayload, 'name', '');
        if ($name === '') {
            throw new \Exception('StoreCreatedHandler: missing store.name');
        }

        $metadata = data_get($storePayload, 'metadata', []);
        if (!is_array($metadata)) {
            $metadata = [];
        }

        $isActive = (bool) data_get($storePayload, 'is_active', true);

        DB::transaction(function () use ($id, $name, $metadata, $isActive) {

            Store::query()->updateOrCreate(
                ['id' => $id],
                [
                    'name'          => $name,
                    'manual_id'     => $metadata['manual_id']     ?? '',
                    'address_line1' => $metadata['address_line1'] ?? '',
                    'address_line2' => $metadata['address_line2'] ?? '',
                    'city'          => $metadata['city']          ?? '',
                    'state'         => $metadata['state']         ?? '',
                    'country'       => $metadata['country']       ?? '',
                    'postal_code'   => $metadata['postal_code']   ?? '',
                    //'is_active'     => $isActive,
                ]
            );
        });
    }

    private function extractStorePayload(array $event): array
    {
        $store = data_get($event, 'data.store');
        if (is_array($store)) return $store;

        $store = data_get($event, 'store');
        if (is_array($store)) return $store;

        $store = data_get($event, 'payload.store');
        if (is_array($store)) return $store;

        throw new \Exception('StoreCreatedHandler: store payload not found in event');
    }

    private function asInt(mixed $value): int
    {
        if (is_int($value)) return $value;
        if (is_string($value) && ctype_digit($value)) return (int) $value;
        if (is_numeric($value)) return (int) $value;

        return 0;
    }
}
