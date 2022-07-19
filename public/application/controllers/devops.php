<?php

namespace Application\Controller;

use Concrete\Core\Attribute\Exception\InvalidAttributeException;
use Concrete\Core\Controller\Controller;
use Concrete\Core\Http\ResponseFactoryInterface;
use Concrete\Core\Page\PageList;
use Illuminate\Contracts\Container\BindingResolutionException;
use Symfony\Component\HttpFoundation\JsonResponse;

class Devops extends Controller
{
    /**
     * Creates a list of pages and returns them as JSON.
     * This list is used in Gulp task that generates critical CSS:
     * gulp critical --url=https://yoursite.com/devops/critical-css
     *
     * You can modify this method/filter Page List as you wish
     * (for example when you want to generate critical CSS
     * only for specific pages).
     *
     * @return JsonResponse
     * @throws BindingResolutionException
     * @throws InvalidAttributeException
     */
    public function criticalCss(): JsonResponse
    {
        $list = new PageList();
        $list->filterByAttribute('disable_critical_css', true, '!=');
        $pages = $list->getResults();

        $output = [];

        foreach ($pages as $page) {
            $output[] = [
                'id' => $page->getCollectionID(),
                'url' => $page->getCollectionLink(),
            ];
        }

        $response = [
            'code' => 200,
            'status' => 'success',
            'pages' => $output,
        ];

        return $this->createJsonResponse($response);
    }

    /**
     * @throws BindingResolutionException
     */
    private function createJsonResponse($content): JsonResponse
    {
        $rf = $this->app->make(ResponseFactoryInterface::class);
        return $rf->json($content, 200);
    }
}
