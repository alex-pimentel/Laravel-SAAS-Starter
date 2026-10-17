<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Subscription Plans
    |--------------------------------------------------------------------------
    |
    | Define your subscription plans here. Each plan should have a unique key,
    | a display name, price information, and feature limits.
    |
    | Note: The 'stripe_price_id' values should be replaced with your actual
    | Stripe Price IDs from your Stripe Dashboard.
    |
    */

    'plans' => [
        'free' => [
            'name' => 'Grátis',
            'description' => 'Para experimentar o editor e o agente',
            'price' => [
                'monthly' => 0,
                'yearly' => 0,
            ],
            'stripe_price_id' => [
                'monthly' => null, // No Stripe price for free plan
                'yearly' => null,
            ],
            'limits' => [
                'workspaces' => 1,
                'team_members' => 1,
                'api_keys' => 1,
                'webhooks' => 0,
            ],
            'features' => [
                '3 vídeos por mês',
                '720p com marca d\'água',
                'Agente prompt→vídeo (10 gerações/mês)',
                'Biblioteca completa de templates',
                'Suporte da comunidade',
            ],
        ],

        'pro' => [
            'name' => 'Pro',
            'description' => 'Para criadores e pequenos negócios',
            'price' => [
                'monthly' => 97,
                'yearly' => 970, // ~2 months free
            ],
            'stripe_price_id' => [
                'monthly' => env('STRIPE_PRO_MONTHLY_PRICE_ID', 'price_pro_monthly'),
                'yearly' => env('STRIPE_PRO_YEARLY_PRICE_ID', 'price_pro_yearly'),
            ],
            'limits' => [
                'workspaces' => 3,
                'team_members' => 5,
                'api_keys' => 5,
                'webhooks' => 3,
            ],
            'features' => [
                '30 vídeos por mês',
                '1080p sem marca d\'água',
                'Agente ilimitado',
                'Render prioritário',
                'Suporte por e-mail',
            ],
            'popular' => true,
        ],

        'business' => [
            'name' => 'Business',
            'description' => 'Para agências e equipes',
            'price' => [
                'monthly' => 297,
                'yearly' => 2970, // ~2 months free
            ],
            'stripe_price_id' => [
                'monthly' => env('STRIPE_BUSINESS_MONTHLY_PRICE_ID', 'price_business_monthly'),
                'yearly' => env('STRIPE_BUSINESS_YEARLY_PRICE_ID', 'price_business_yearly'),
            ],
            'limits' => [
                'workspaces' => -1, // Unlimited
                'team_members' => -1, // Unlimited
                'api_keys' => -1, // Unlimited
                'webhooks' => -1, // Unlimited
            ],
            'features' => [
                '150 vídeos por mês',
                '1080p/4K sem marca d\'água',
                'Workspaces e equipes',
                'API e marca própria',
                'Suporte prioritário',
            ],
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Trial Period
    |--------------------------------------------------------------------------
    |
    | The number of days to offer as a trial period for new subscriptions.
    | Set to 0 to disable trials.
    |
    */

    'trial_days' => 14,

    /*
    |--------------------------------------------------------------------------
    | Stripe Webhook Secret
    |--------------------------------------------------------------------------
    |
    | The webhook secret is used to verify that incoming webhooks are
    | actually from Stripe. Get this from your Stripe Dashboard.
    |
    */

    'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),

];
