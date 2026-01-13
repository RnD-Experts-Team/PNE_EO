<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // Same rules as store for a "single request payload" approach
        return (new EmployeeStoreRequest())->rules();
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('tag_ids'))) {
            $this->merge(['tag_ids' => array_filter(explode(',', $this->input('tag_ids')))]);
        }
    }
}
