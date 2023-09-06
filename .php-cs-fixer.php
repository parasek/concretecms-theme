<?php

$config = new PhpCsFixer\Config();

return $config
    ->setRules([
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
            ->exclude('vendor')
            ->in(__DIR__)
    );
