<?php

namespace Application\Theme\Theme;

use Concrete\Core\Page\Theme\Theme;

class PageTheme extends Theme
{

    public function getThemeName(): string
    {
        return t('Theme');
    }

    public function getThemeDescription(): string
    {
        return t('Custom Concrete5 theme.');
    }

}
