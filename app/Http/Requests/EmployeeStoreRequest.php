<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class EmployeeStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Employee
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'preferred_name' => ['nullable', 'string', 'max:100'],
            'employee_status_id' => ['required', 'exists:employee_statuses,id'],
            'about_me' => ['nullable', 'string'],

            // hasOne: employment
            'employment' => ['nullable', 'array'],
            'employment.store_id' => ['nullable', 'integer', 'exists:stores,id'],
            'employment.hiring_date' => ['nullable', 'date'],

            // hasOne: demographics
            'demographics' => ['nullable', 'array'],
            'demographics.date_of_birth' => ['nullable', 'date'],
            'demographics.gender' => ['nullable', 'string', 'max:50'],
            'demographics.marital_status' => ['nullable', 'string', 'max:50'],
            'demographics.veteran_status' => ['nullable', 'boolean'],

            // hasOne: identifiers
            'identifiers' => ['nullable', 'array'],
            'identifiers.social_security_number' => ['nullable', 'string', 'max:50'],
            'identifiers.national_id_number' => ['nullable', 'string', 'max:50'],
            'identifiers.itin' => ['nullable', 'string', 'max:50'],

            // hasMany: contacts
            'contacts' => ['nullable', 'array'],
            'contacts.*.id' => ['nullable', 'integer', 'exists:employee_contacts,id'],
            'contacts.*.contact_type' => ['required_with:contacts.*.contact_value', 'nullable', 'string', 'max:50'],
            'contacts.*.contact_value' => ['required_with:contacts.*.contact_type', 'nullable', 'string', 'max:255'],
            'contacts.*.is_primary' => ['nullable', 'boolean'],

            // hasMany: addresses
            'addresses' => ['nullable', 'array'],
            'addresses.*.id' => ['nullable', 'integer', 'exists:employee_addresses,id'],
            'addresses.*.address_type' => ['required_with:addresses.*.address_line1', 'nullable', 'string', 'max:50'],
            'addresses.*.address_line1' => ['required_with:addresses.*.address_type', 'nullable', 'string', 'max:255'],
            'addresses.*.address_line2' => ['nullable', 'string', 'max:255'],
            'addresses.*.city' => ['nullable', 'string', 'max:100'],
            'addresses.*.state' => ['nullable', 'string', 'max:100'],
            'addresses.*.country' => ['nullable', 'string', 'max:100'],
            'addresses.*.postal_code' => ['nullable', 'string', 'max:20'],

            // tags (pivot)
            'tag_ids' => ['nullable', 'array'],
            'tag_ids.*' => ['integer', 'exists:tags,id'],
        ];
    }

    protected function prepareForValidation(): void
    {
        // Normalize tag_ids if it arrives as a single string
        if (is_string($this->input('tag_ids'))) {
            $this->merge(['tag_ids' => array_filter(explode(',', $this->input('tag_ids')))]);
        }
    }
}
