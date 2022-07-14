<?php

namespace Application\Theme\Theme;

use Concrete\Core\Area\Layout\Preset\Provider\ThemeProviderInterface;
use Concrete\Core\Feature\Features;
use Concrete\Core\Page\Theme\Theme;

class PageTheme extends Theme implements ThemeProviderInterface
{

    public function getThemeName(): string
    {
        return t('Theme');
    }

    public function getThemeDescription(): string
    {
        return t('Custom Concrete5 theme.');
    }

    public function getThemeSupportedFeatures(): array
    {
        return [
//            Features::IMAGERY, // temporary, work on it later
        ];
    }

    public function getThemeAreaLayoutPresets(): array
    {
        $presets = [];

        return $presets;
    }

}
