<?php

return [
    'debug' => [
        'display_errors' => true, // (true | false)
        'detail' => 'debug', // (message | debug)
        'hide_keys' => [
            // Hide database password and hostname in whoops output if supported
            '_ENV' => ['DB_PASSWORD', 'DB_HOSTNAME'],
            '_SERVER' => ['DB_PASSWORD', 'DB_HOSTNAME'],
        ],
    ],
    'cache' => [
        'enabled' => false, // Enabled (true | false)
        'overrides' => false, // Overrides Cache (true | false)
        'blocks' => false, // Block Output Cache (true | false)
        'assets' => false, // CSS and JavaScript Post-Processing (true | false)
        'theme_css' => false, // Theme CSS Cache (true | false)
        'pages' => false, // Full Page Caching (false | 'blocks' | 'all')
        'lifetime' => 21600, // Lifetime in seconds
        'full_page_lifetime' => 'default', // How long to cache full page
        'full_page_lifetime_value' => null, // Custom lifetime value, only used if concrete.cache.full_page_lifetime is 'custom'
        'doctrine_dev_mode' => false, // Use Doctrine development mode
    ],
    'theme' => [
        // Those are only used when using LESS files
        'compress_preprocessor_output' => true, // Compress LESS Output
        'generate_less_sourcemap' => true, // Enable source maps in generated CSS files
    ],
    'updates' => [
        // Skip the automatic check of new Concrete versions availability
        'skip_core' => true,
    ],
    'email' => [
        'enabled' => true,
        'default' => [
            'address' => !empty($_SERVER['SERVER_NAME']) ? 'noreply@'.$_SERVER['SERVER_NAME'] : null,
            'name' => null,
        ],
    ],
    'seo' => [
        'exclude_words' => '',
        'url_rewriting' => true,
        'url_rewriting_all' => true,
        'redirect_to_canonical_url' => true,
        'trailing_slash' => false,
        'title_format' => '%2$s :: %1$s',
        'title_segment_separator' => ' :: ',
    ],
];
