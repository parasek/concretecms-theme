<?php

namespace Application\Theme\Theme;

use Concrete\Core\Area\Layout\Preset\Provider\ThemeProviderInterface;
use Concrete\Core\Page\Theme\Theme;

class PageTheme extends Theme implements ThemeProviderInterface
{
    public function getThemeName(): string
    {
        return t('Theme');
    }

    public function getThemeDescription(): string
    {
        return t('Custom Concrete CMS theme.');
    }

    public function getThemeSupportedFeatures(): array
    {
        return [];
    }

    public function getThemeAreaLayoutPresets(): array
    {
        $presets = [];

        return $presets;
    }
}
