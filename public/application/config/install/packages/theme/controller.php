<?php

namespace Application\StartingPointPackage\Theme;

use Concrete\Core\Package\StartingPointPackage;

class Controller extends StartingPointPackage
{

    protected $pkgHandle = 'theme';
    protected $pkgContentProvidesFileThumbnails = true;

    public function getPackageName(): string
    {
        return t('Theme');
    }

    public function getPackageDescription(): string
    {
        return t('Custom Concrete CMS theme.');
    }

}
