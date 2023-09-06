<?php

$config = new PhpCsFixer\Config();

return $config
    ->setRules([
        '@Symfony' => true,
        'echo_tag_syntax' => ['format' => 'short'],
        'yoda_style' => false,
        'no_alternative_syntax' => ['fix_non_monolithic_code' => false],
        'concat_space' => ['spacing' => 'one'],
        'phpdoc_to_comment' => false,
        'phpdoc_align' => false,
    ])
    ->setFinder(
        PhpCsFixer\Finder::create()
            ->exclude('vendor')
            ->exclude('node_modules')
            ->exclude('public/concrete')
            ->exclude('public/application/files')
            ->exclude('public/application/config/generated_overrides')
            ->exclude('public/application/config/doctrine')
            ->exclude('public/updates')
            ->exclude('backups')
            ->in(__DIR__)
    );
