import { Button } from '@/components/ui/button';
import { useTranslations } from '@/hooks/use-translations';
import { register } from '@/routes';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowRight, Sparkles } from 'lucide-react';

export function LandingCta() {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslations();

    return (
        <section className="py-16 sm:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-lg bg-foreground p-8 sm:p-12 lg:p-16">
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="mb-5 inline-flex items-center gap-2 rounded-sm bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/80">
                            <Sparkles className="h-3.5 w-3.5" />
                            {t('landing.cta.badge', 'AI video in minutes')}
                        </div>

                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
                            {t(
                                'landing.cta.title',
                                'Ready to create your first video?',
                            )}
                        </h2>

                        <p className="mt-4 text-lg text-white/60 sm:text-xl">
                            {t(
                                'landing.cta.description',
                                'Describe the video in a sentence and let the AI agent do the rest. Start free with 3 videos per month — no credit card required.',
                            )}
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button
                                size="lg"
                                asChild
                                className="h-11 bg-accent px-7 text-sm font-semibold text-foreground hover:bg-accent/90"
                            >
                                <Link href={auth.user ? '/dashboard' : register()}>
                                    {t(
                                        'landing.cta.get_started',
                                        'Start Creating Free',
                                    )}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
