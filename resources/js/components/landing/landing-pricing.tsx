import { Button } from '@/components/ui/button';
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';
import { register } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Check, Sparkles } from 'lucide-react';

export function LandingPricing() {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslations();

    return (
        <section id="pricing" className="bg-muted/30 py-20 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        {t('landing.pricing.title.part1', 'Choose')}{' '}
                        <span className="text-primary">
                            {t('landing.pricing.title.part2', 'your plan')}
                        </span>{' '}
                        & {t('landing.pricing.title.part3', 'start creating')}
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {t(
                            'landing.pricing.description',
                            'Start free and scale as you grow. Upgrade or downgrade anytime.',
                        )}
                    </p>
                </div>

                {/* Plans */}
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="relative border-border">
                        <CardHeader>
                            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-xl">
                                {t('landing.pricing.items.free.title', 'Free')}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'landing.pricing.items.free.description',
                                    '3 videos per month in 720p with watermark.',
                                )}
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="relative border-border">
                        <CardHeader>
                            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                                <Check className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-xl">
                                {t(
                                    'landing.pricing.items.license.title',
                                    'Pro',
                                )}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'landing.pricing.items.license.description',
                                    'R$ 97/month: 30 videos per month, 1080p without watermark and unlimited agent.',
                                )}
                            </CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="relative border-border">
                        <CardHeader>
                            <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                                <Sparkles className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-xl">
                                {t(
                                    'landing.pricing.items.production.title',
                                    'Business',
                                )}
                            </CardTitle>
                            <CardDescription>
                                {t(
                                    'landing.pricing.items.production.description',
                                    'R$ 297/month: 150 videos per month, 1080p/4K, workspaces/teams and API.',
                                )}
                            </CardDescription>
                        </CardHeader>
                    </Card>
                </div>

                {/* CTA */}
                <div className="mt-12 text-center">
                    <Button size="lg" asChild className="h-12 px-8 text-base">
                        <Link href={auth.user ? '/dashboard' : register()}>
                            {t(
                                'landing.pricing.cta.get_started',
                                'Start Creating Free',
                            )}
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
