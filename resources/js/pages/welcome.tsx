import {
    LandingCta,
    LandingFaq,
    LandingFeatures,
    LandingFooter,
    LandingHeader,
    LandingHero,
    LandingPricing,
    LandingTestimonials,
} from '@/components/landing';
import { useTranslations } from '@/hooks/use-translations';
import { Head } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { t } = useTranslations();

    return (
        <>
            <Head
                title={t(
                    'landing.meta.title',
                    'AgentResolve - Professional videos with AI in minutes',
                )}
            >
                <meta
                    name="description"
                    content={t(
                        'landing.meta.description',
                        'AgentResolve creates professional videos with AI in minutes. Describe your video in a sentence, refine it in the visual editor and render deterministic MP4 in 1080p or 4K.',
                    )}
                />
                <meta
                    name="keywords"
                    content={t(
                        'landing.meta.keywords',
                        'ai video, video generator, video editor, templates, ai agent, mp4, 1080p, 4k',
                    )}
                />
                <meta
                    property="og:title"
                    content={t(
                        'landing.meta.og_title',
                        'AgentResolve - Professional videos with AI in minutes',
                    )}
                />
                <meta
                    property="og:description"
                    content={t(
                        'landing.meta.og_description',
                        'Create professional videos with AI in minutes. From a one-sentence prompt to a deterministic MP4 in 1080p or 4K.',
                    )}
                />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content={t(
                        'landing.meta.twitter_title',
                        'AgentResolve - Professional videos with AI in minutes',
                    )}
                />
                <meta
                    name="twitter:description"
                    content={t(
                        'landing.meta.twitter_description',
                        'Professional AI videos in minutes: prompt, edit and render in 1080p or 4K.',
                    )}
                />
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600,700,800"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen bg-background text-foreground">
                <LandingHeader canRegister={canRegister} />
                <main>
                    <LandingHero />
                    <LandingFeatures />
                    <LandingPricing />
                    <LandingTestimonials />
                    <LandingFaq />
                    <LandingCta />
                </main>
                <LandingFooter />
            </div>
        </>
    );
}
