<?php

namespace Application;

class EncoreHelper
{
    public static function getEntryTags(string $entryName, string $key): string
    {
        $html = '';

        if (!in_array($key, ['js', 'css'])) {
            return $html;
        }

        $files = self::getEntryList($entryName, $key);

        foreach ($files as $file) {
            $integrity = '';
            if (isset($entryPoints['integrity'][$file])) {
                $integrity = ' integrity="' . $entryPoints['integrity'][$file] . '"';
            }
            if ($key === 'js') {
                $html .= '<script src="' . h($file) . '"' . h($integrity) . '></script>';
            } elseif ($key === 'css') {
                $html .= '<link href="' . h($file) . '"' . $integrity . ' rel="stylesheet" type="text/css" media="all">';
            }
            $html .= PHP_EOL;
        }

        return $html;
    }

    public static function getEntryList(string $entryName, string $key): array
    {
        $list = [];

        if (!in_array($key, ['js', 'css'])) {
            return $list;
        }

        $entryPointsPath = __DIR__ . '/../public/application/themes/theme/dist/build/entrypoints.json';

        if (file_exists($entryPointsPath)) {
            $entryPoints = json_decode(rtrim(file_get_contents($entryPointsPath)), true);
            if (isset($entryPoints['entrypoints'][$entryName][$key])) {
                $list = $entryPoints['entrypoints'][$entryName][$key];
            }
        }

        return $list;
    }
}
