<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeImportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                'file',
                // csv, xlsx, xls
                'mimes:csv,txt,xlsx,xls',
                'max:20480', // 20MB
            ],
            // optional behavior switches if you want them later
            // 'create_missing_tags' => ['nullable', 'boolean'],
        ];
    }
}
