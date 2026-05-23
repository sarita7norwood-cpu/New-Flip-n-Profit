<?php
/**
 * Main theme file for Flip n Profit Theme
 * URI: https://www.flipnprofit.com
 * 
 * Automatically reads and serves the compiled React frontend from the /dist folder
 * and rewrites paths to use get_template_directory_uri().
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

$template_dir = get_template_directory();
$template_uri = get_template_directory_uri();
$build_html_path = $template_dir . '/dist/index.html';

if (file_exists($build_html_path)) {
    // Read the compiled html file
    $html_content = file_get_contents($build_html_path);
    
    // Dynamically replace relative build assets with absolute WordPress asset URLs
    $fixed_html = str_replace('src="/assets/', 'src="' . esc_url($template_uri) . '/dist/assets/', $html_content);
    $fixed_html = str_replace('href="/assets/', 'href="' . esc_url($template_uri) . '/dist/assets/', $fixed_html);
    
    // Also resolve other public assets (like icons, logos) if present in the markup
    $fixed_html = str_replace('src="/', 'src="' . esc_url($template_uri) . '/dist/', $fixed_html);
    $fixed_html = str_replace('href="/', 'href="' . esc_url($template_uri) . '/dist/', $fixed_html);
    
    // Output the fully resolved client bundle
    echo $fixed_html;
} else {
    // Elegant fallback/staging instructions if the user uploads the theme raw before running builder scripts
    ?>
    <!DOCTYPE html>
    <html <?php language_attributes(); ?>>
    <head>
        <meta charset="<?php bloginfo('charset'); ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Flip n Profit — WordPress Theme Activated</title>
        <style>
            body {
                background-color: #0A0A0A;
                color: #ffffff;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 24px;
                text-align: center;
            }
            .card {
                background: #0E0E0E;
                border: 1px solid #222;
                border-radius: 24px;
                padding: 48px 32px;
                max-width: 520px;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
            }
            h1 {
                font-size: 32px;
                font-weight: 900;
                margin: 0 0 12px 0;
                text-transform: uppercase;
                letter-spacing: -0.04em;
            }
            span.neon {
                color: #D1FF00;
            }
            p {
                color: #a1a1aa;
                font-size: 14px;
                line-height: 1.6;
                margin: 0 0 32px 0;
            }
            .code-box {
                background: #000000;
                border: 1px solid #1a1a1a;
                font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
                padding: 12px;
                border-radius: 8px;
                font-size: 13px;
                color: #D1FF00;
                margin-bottom: 32px;
            }
            .btn {
                background-color: #D1FF00;
                color: #000000;
                text-decoration: none;
                padding: 14px 28px;
                border-radius: 12px;
                font-weight: 800;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.15em;
                display: inline-block;
                transition: transform 0.2s ease, background-color 0.2s ease;
            }
            .btn:hover {
                background-color: #c2ed00;
                transform: scale(1.02);
            }
        </style>
    </head>
    <body>
        <div class="card">
            <h1>FLIP N <span class="neon">PROFIT.</span></h1>
            <p>Your custom workspace theme has been activated successfully on WordPress! To show your active appraisal workspace, ensure you compile your client build using the terminal command below before exporting your ZIP:</p>
            <div class="code-box">npm run build</div>
            <a href="<?php echo esc_url(admin_url()); ?>" class="btn">Go to WordPress Dashboard</a>
        </div>
    </body>
    </html>
    <?php
}
