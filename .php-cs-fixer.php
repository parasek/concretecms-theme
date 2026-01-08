<?php

$config = new PhpCsFixer\Config();

return $config
    ->setRules([
        '@Symfony' => true,
        '@PSR12' => true,
        'echo_tag_syntax' => ['format' => 'short'],
        'yoda_style' => false,
        'no_alternative_syntax' => ['fix_non_monolithic_code' => false],
        'concat_space' => ['spacing' => 'one'],
        'phpdoc_to_comment' => false,
        'phpdoc_align' => false,
    ])
    ->setFinder(
        PhpCsFixer\Finder::create()
            ->exclude('assets')
            ->exclude('backups')
            ->exclude('db')
            ->exclude('docker')
            ->exclude('node_modules')
            ->exclude('public/application/config/doctrine')
            ->exclude('public/application/config/generated_overrides')
            ->exclude('public/application/files')
            ->exclude('public/concrete')
            ->exclude('vendor')

            ->notPath('public/application/bootstrap/autoload.php')
            ->notPath('tests/bootstrap.php')

            ->in(__DIR__)
    );
