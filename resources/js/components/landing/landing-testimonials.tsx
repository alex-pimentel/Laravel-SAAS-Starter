import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';
import { register } from '@/routes';
import { Link } from '@inertiajs/react';
import { Quote, Star } from 'lucide-react';

export function LandingTestimonials() {
    const { t } = useTranslations();

    const testimonials = [
        {
            quote: t(
                'landing.testimonials.items.sarah.quote',
                'AgentResolve saves us hours of video production every week. We describe the video, refine it in the editor and render in 1080p in minutes.',
            ),
            author: 'Sarah Chen',
            role: t('landing.testimonials.items.sarah.role', 'CTO at TechFlow'),
            avatar: null,
            rating: 5,
        },
        {
            quote: t(
                'landing.testimonials.items.michael.quote',
                'The AI agent gets you 90% there. Starting from a template with an editable design makes a huge difference for our social team.',
            ),
            author: 'Michael Rodriguez',
            role: t(
                'landing.testimonials.items.michael.role',
                'Founder at DataSync',
            ),
            avatar: null,
            rating: 5,
        },
        {
            quote: t(
                'landing.testimonials.items.emily.quote',
                'The visual editor is excellent: multi-scene timeline and per-object animations. And the render always comes out identical — perfect for our brand.',
            ),
            author: 'Emily Watson',
            role: t(
                'landing.testimonials.items.emily.role',
                'Head of Marketing at CloudBase',
            ),
            avatar: null,
            rating: 5,
        },
    ];

    const stats = [
        {
            value: '1,600+',
            label: t('landing.testimonials.stats.stars', 'Templates'),
        },
        {
            value: '1080p/4K',
            label: t('landing.testimonials.stats.features', 'Resolution'),
        },
        {
            value: '30+',
            label: t(
                'landing.testimonials.stats.opensource',
                'Videos per month',
            ),
        },
        {
            value: 'pt/en/es',
            label: t('landing.testimonials.stats.license', 'Support'),
        },
    ];

    return (
        <section id="testimonials" className="py-20 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        {t('landing.testimonials.title.part1', 'Loved by')}{' '}
                        <span className="text-primary">
                            {t('landing.testimonials.title.part2', 'creators')}
                        </span>{' '}
                        {t('landing.testimonials.title.part3', 'Worldwide')}
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {t(
                            'landing.testimonials.description',
                            'See what creators are saying about AgentResolve.',
                        )}
                    </p>
                </div>

                {/* Stats */}
                <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className="rounded-md border bg-card p-4 text-center"
                        >
                            <div className="text-2xl font-bold tabular-nums text-foreground sm:text-3xl">
                                {stat.value}
                            </div>
                            <div className="mt-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Testimonials */}
                <div className="mt-10 grid gap-4 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="relative">
                            <CardContent className="pt-5">
                                <Quote className="h-6 w-6 text-muted-foreground/30" />

                                {/* Stars */}
                                <div className="mt-3 flex gap-0.5">
                                    {Array.from({
                                        length: testimonial.rating,
                                    }).map((_, i) => (
                                        <Star
                                            key={i}
                                            className="h-3.5 w-3.5 fill-accent text-accent"
                                        />
                                    ))}
                                </div>

                                {/* Quote */}
                                <blockquote className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                    "{testimonial.quote}"
                                </blockquote>

                                {/* Author */}
                                <div className="mt-5 flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-foreground text-xs font-semibold text-background">
                                        {testimonial.author
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">
                                            {testimonial.author}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {testimonial.role}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <p className="text-sm text-muted-foreground">
                        {t(
                            'landing.testimonials.community.join',
                            'Join the community',
                        )}
                    </p>
                    <Button size="lg" asChild className="mt-5 h-11 px-7 text-sm">
                        <Link href={register()}>
                            {t('landing.cta.get_started', 'Start Creating Free')}
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
