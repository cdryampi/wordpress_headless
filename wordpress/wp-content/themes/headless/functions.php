<?php

declare(strict_types=1);

add_theme_support('post-thumbnails');
add_theme_support('title-tag');

add_action('template_redirect', function () {
    if (is_admin() || defined('WP_CLI') || defined('GRAPHQL_REQUEST') || defined('REST_REQUEST')) {
        return;
    }

    status_header(404);
    nocache_headers();
    echo '<!doctype html><html><head><meta charset="utf-8"><title>Headless</title></head>';
    echo '<body style="font-family: sans-serif; padding: 2rem;"><h1>Headless only</h1>';
    echo '<p>This WordPress instance serves content via WPGraphQL.</p></body></html>';
    exit;
});
