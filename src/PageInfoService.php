<?php

namespace Application;

use Concrete\Core\Page\Page;
use Concrete\Core\Permission\Checker;
use Concrete\Core\User\User;

class PageInfoService
{
    private Page $c;
    private User $u;
    private static ?PageInfoService $instance = null;

    public function __construct(Page $c, User $u)
    {
        $this->c = $c;
        $this->u = $u;
    }

    /**
     * Get singleton instance.
     *
     * Example usage:
     *
     * echo \Application\PageInfoService::getInstance()->getHtmlClasses();
     *
     * Without singleton:
     *
     * $c = \Concrete\Core\Page\Page::getCurrentPage();
     * $u = new \Concrete\Core\User\User();
     * $pageInfoService = $app->make(\Application\PageInfoService::class, [$c, $u]);
     * echo $pageInfoService->getHtmlClasses();
     *
     * @return PageInfoService
     */
    public static function getInstance(): PageInfoService
    {
        $c = Page::getCurrentPage();
        $u = new User();

        if (null === self::$instance) {
            self::$instance = new self($c, $u);
        }

        return self::$instance;
    }

    /**
     * Display different CSS classes when user is logged in.
     *
     * <html class="<?php echo h(\Application\PageInfoService::getInstance()->getHtmlClasses()); ?>">
     *
     * @return string
     */
    public function getHtmlClasses(): string
    {
        $htmlClasses = [];

        $permissions = new Checker($this->c);

        if ($this->u->isRegistered()) {
            $htmlClasses[] = 'user-logged';
            $canViewToolbar = (isset($permissions) and ($permissions->canWrite() or $permissions->canAddSubContent() or $permissions->canAdminPage() or $permissions->canApproveCollection()));
            if ($canViewToolbar) {
                $htmlClasses[] = 'toolbar-visible';
            }
            if ($this->c->isEditMode()) {
                $htmlClasses[] = 'edit-mode';
            }
        }

        return implode(' ', $htmlClasses);
    }
}
