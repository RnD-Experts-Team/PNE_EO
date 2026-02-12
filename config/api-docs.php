<?php

return [
    // مسار ملف الـ OpenAPI داخل المشروع
    'spec_path' => storage_path('app/api-docs/openapi.json'),

    // عنوان صفحة الدوكس
    'title' => env('API_DOCS_TITLE', 'PNE EO API Docs'),

    // رابط الـ spec (إذا حاب تجبره) - غالبًا خليه null وخليه يتولد تلقائي
    'spec_url' => env('API_DOCS_SPEC_URL', null),

    // إعدادات Scalar
    'scalar' => [
        'theme'  => env('SCALAR_THEME', 'default'),
        'layout' => env('SCALAR_LAYOUT', 'modern'),
        'dark'   => env('SCALAR_DARK', 'false'), // "true" أو "false" كنص
    ],
];
