import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { register } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CheckCircle,
    Globe,
    Sparkles,
    Users,
    Zap,
} from 'lucide-react';

export function LandingHero() {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslations();

    const stats = [
        {
            icon: Users,
            value: '1,600+',
            label: t('landing.hero.stats.developers', 'Templates'),
        },
        {
            icon: Zap,
            value: '1080p/4K',
            label: t('landing.hero.stats.features', 'Resolution'),
        },
        {
            icon: Globe,
            value: 'pt/en/es',
            label: t('landing.hero.stats.opensource', 'Support'),
        },
    ];

    const features = [
        t('landing.hero.features.auth', 'Prompt to video agent'),
        t('landing.hero.features.team', 'Teams & workspaces'),
        t('landing.hero.features.billing', 'Free, Pro & Business plans'),
        t('landing.hero.features.admin', '1,600+ templates'),
        t('landing.hero.features.flags', '1080p/4K render'),
        t('landing.hero.features.audit', 'Deterministic MP4'),
    ];

    return (
        <section className="relative overflow-hidden py-20 sm:py-28 lg:py-36">
            {/* Subtle background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30" />
            </div>

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-3xl text-center">
                    <div className="mb-6 inline-flex items-center gap-2 rounded-sm border border-accent/40 bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-foreground">
                        <Sparkles className="h-3.5 w-3.5 text-accent-foreground" />
                        <span>
                            {t(
                                'landing.hero.badge',
                                'Professional videos with AI in minutes',
                            )}
                        </span>
                    </div>

                    {/* Headline — clean, data-forward */}
                    <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                        <span className="block">
                            {t(
                                'landing.hero.title.part1',
                                'Create professional videos',
                            )}
                        </span>
                        <span className="block text-primary">
                            {t(
                                'landing.hero.title.part2',
                                'with AI in minutes',
                            )}
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
                        {t(
                            'landing.hero.description',
                            'Describe your video in a sentence and the AI agent does the rest: template, copy and an editable design. Export deterministic MP4 in 1080p or 4K.',
                        )}{' '}
                        <span className="font-semibold text-foreground">
                            {t(
                                'landing.hero.description_highlight',
                                'Ready in minutes.',
                            )}
                        </span>
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Button size="lg" asChild className="h-11 px-7 text-sm font-semibold">
                            <Link href={auth.user ? '/dashboard' : register()}>
                                {t(
                                    'landing.hero.cta.get_started',
                                    'Start Creating Free',
                                )}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>

                    {/* Quick Features */}
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                        {features.map((feature) => (
                            <div key={feature} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <CheckCircle className="h-3.5 w-3.5 text-primary" />
                                {feature}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mx-auto mt-14 grid max-w-2xl grid-cols-3 divide-x divide-border border-y">
                    {stats.map((stat) => (
                        <div key={stat.label} className="py-6 text-center">
                            <div className="text-2xl font-bold tabular-nums sm:text-3xl">
                                {stat.value}
                            </div>
                            <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Hero preview card — clean dark product UI mock */}
                <div className="relative mx-auto mt-12 max-w-5xl">
                    <div className="overflow-hidden rounded-lg border bg-foreground shadow-xl">
                        {/* Window chrome bar */}
                        <div className="flex items-center gap-1.5 border-b border-white/10 bg-foreground px-4 py-3">
                            <span className="h-3 w-3 rounded-full bg-red-500/70" />
                            <span className="h-3 w-3 rounded-full bg-yellow-500/70" />
                            <span className="h-3 w-3 rounded-full bg-green-500/70" />
                            <div className="ml-4 flex-1 rounded bg-white/10 py-1 px-3 text-xs text-white/40">
                                app.yoursaas.com/dashboard
                            </div>
                        </div>
                        <div className="flex h-64 items-center justify-center p-8 sm:h-80">
                            <div className="text-center">
                                <div className="mb-4 flex justify-center">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary/20">
                                        <Sparkles className="h-7 w-7 text-primary" />
                                    </div>
                                </div>
                                <p className="text-base font-semibold text-white">
                                    {t(
                                        'landing.hero.preview.title',
                                        'From a sentence to a video',
                                    )}
                                </p>
                                <p className="mt-2 text-sm text-white/50">
                                    {t(
                                        'landing.hero.preview.description',
                                        'Visual editor, multi-scene timeline and per-object animations',
                                    )}
                                </p>
                                <div className="mt-5 flex flex-wrap justify-center gap-2">
                                    {[
                                        t(
                                            'landing.hero.preview.tags.multi_tenant',
                                            'Multi-scene timeline',
                                        ),
                                        t(
                                            'landing.hero.preview.tags.stripe_billing',
                                            '1,600+ templates',
                                        ),
                                        t(
                                            'landing.hero.preview.tags.admin_panel',
                                            '1080p/4K',
                                        ),
                                        t(
                                            'landing.hero.preview.tags.team_roles',
                                            'Visual editor',
                                        ),
                                        t(
                                            'landing.hero.preview.tags.feature_flags',
                                            'Teams & workspaces',
                                        ),
                                    ].map((tag) => (
                                        <span key={tag} className="rounded-sm border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/70">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
