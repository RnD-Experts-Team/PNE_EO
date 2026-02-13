<?php

namespace App\Services\EventConsume\Handlers;

use App\Models\Store;
use App\Services\EventConsume\EventHandlerInterface;
use Illuminate\Support\Facades\DB;

class StoreUpdatedHandler implements EventHandlerInterface
{
    public function handle(array $event): void
    {
        $storeId = $this->asInt(data_get($event, 'store_id'));
        if ($storeId <= 0) {
            throw new \Exception('StoreUpdatedHandler: missing/invalid store_id');
        }
        

        $changedFields = data_get($event, 'changed_fields', []);
        if (!is_array($changedFields)) {
            $changedFields = [];
        }

        DB::transaction(function () use ($storeId, $changedFields) {

            $store = Store::query()->find($storeId);

            if (!$store) {
                throw new \Exception("StoreUpdatedHandler: store not found (id={$storeId})");
            }

            $updateData = [];

            /*
             |--------------------------------------------
             | Direct columns from auth
             |--------------------------------------------
             */

            if (array_key_exists('name', $changedFields)) {
                $updateData['name'] = $changedFields['name']['new'] ?? '';
            }

            // if (array_key_exists('is_active', $changedFields)) {
            //     $updateData['is_active'] = (bool) ($changedFields['is_active']['new'] ?? true);
            // }

            /*
             |--------------------------------------------
             | Metadata handling (system B extra columns)
             |--------------------------------------------
             */

            if (array_key_exists('metadata', $changedFields)) {

                $metadata = $changedFields['metadata']['new'] ?? [];

                if (!is_array($metadata)) {
                    $metadata = [];
                }

                $updateData['manual_id']     = $storeId ;
                $updateData['address_line1'] = $metadata['address_line1'] ?? '';
                $updateData['address_line2'] = $metadata['address_line2'] ?? '';
                $updateData['city']          = $metadata['city']          ?? '';
                $updateData['state']         = $metadata['state']         ?? '';
                $updateData['country']       = $metadata['country']       ?? '';
                $updateData['postal_code']   = $metadata['postal_code']   ?? '';
            }

            if (!empty($updateData)) {
                $store->update($updateData);
            }
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
