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
     * gulp critical --clear
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

        // Array of regular expressions to keep in critical css, even if not appearing in critical viewport.
        // Example: ['/test/', '/some-class-name/']
        $forceInclude = [];

        $response = [
            'code' => 200,
            'status' => 'success',
            'options' => [
                'width' => 400,
                'height' => 700,
                'keepLargerMediaQueries' => true,
                'forceInclude' => $forceInclude,
            ],
            'pages' => $output,
        ];

        return $this->createJsonResponse($response);
    }

    /**
     * Creates a list of pages and returns them as JSON.
     * This list is used in Gulp task that generates purged CSS:
     * gulp purge --url=https://yoursite.com/devops/purge-css
     * gulp purge --clear
     *
     * You can modify this method as you wish
     * (for example when you want to generate purge CSS
     * only for specific pages).
     *
     * @return JsonResponse
     * @throws BindingResolutionException
     */
    public function purgeCss(): JsonResponse
    {
        // Safe list
        // You want to add here classes that are added by js after initial load.
        //
        // https://purgecss.com/configuration.html
        //
        // Arrays of regular expressions, like:
        // ['/test/', '/some-class-name/']
        //
        // a) standard - selector matches a regular expression
        //    .test { background: red; }
        //    .another-test-item { background: blue; }
        // b) deep - selector that matches a regular expression and its children
        //    .test-item .something { background: orange; }
        //    .another-test-item.something {  background: black; }
        // c) greedy - when any part of selector matches a regular expression
        //    .parent .test-item { background: yellow; }
        //
        // If you don't know where to add regular expressions, add it to $greedySafeList

        $standardSafeList = [];
        $deepSafeList = [];
        $greedySafeList = [];
        $keyframesSafeList = [];
        $variablesSafeList = [];

        // Array of pages (id of page and url are required)
        $output = [
            [
                'id' => 1,
                'url' => BASE_URL,
                'options' => [
                    'safelist' => [
                        'standard' => $standardSafeList,
                        'deep' => $deepSafeList,
                        'greedy' => $greedySafeList,
                        'keyframes' => $keyframesSafeList,
                        'variables' => $variablesSafeList,
                    ],
                ],
            ],
        ];

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
