import { useTranslations } from '@/hooks/use-translations';
import {
    Building2,
    CreditCard,
    Globe,
    LayoutDashboard,
    Lock,
    Megaphone,
    Moon,
    Palette,
    ScrollText,
    ToggleLeft,
    Users,
    Zap,
} from 'lucide-react';

export function LandingFeatures() {
    const { t } = useTranslations();

    const features = [
        {
            icon: Lock,
            title: t('landing.features.items.auth.title', 'Prompt to Video'),
            description: t(
                'landing.features.items.auth.description',
                'Describe the video in a sentence and the AI agent picks a template, writes the copy and builds an editable design.',
            ),
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            icon: Building2,
            title: t(
                'landing.features.items.workspaces.title',
                'Visual Editor',
            ),
            description: t(
                'landing.features.items.workspaces.description',
                'Refine everything on a multi-scene timeline with per-object animations for total creative control.',
            ),
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
        },
        {
            icon: Users,
            title: t('landing.features.items.team.title', 'Teams & Workspaces'),
            description: t(
                'landing.features.items.team.description',
                'Organize projects and collaborate with your team in shared workspaces.',
            ),
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
        },
        {
            icon: CreditCard,
            title: t('landing.features.items.billing.title', 'Plans & Billing'),
            description: t(
                'landing.features.items.billing.description',
                'Start free and upgrade to Pro or Business whenever you need more videos.',
            ),
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10',
        },
        {
            icon: LayoutDashboard,
            title: t(
                'landing.features.items.admin.title',
                'Unlimited AI Agent',
            ),
            description: t(
                'landing.features.items.admin.description',
                'On Pro, the AI agent is unlimited: go from idea to editable video in minutes.',
            ),
            color: 'text-rose-500',
            bgColor: 'bg-rose-500/10',
        },
        {
            icon: ToggleLeft,
            title: t(
                'landing.features.items.flags.title',
                'Multi-Scene Timeline',
            ),
            description: t(
                'landing.features.items.flags.description',
                'Arrange scenes, adjust timings and build your story scene by scene.',
            ),
            color: 'text-amber-500',
            bgColor: 'bg-amber-500/10',
        },
        {
            icon: ScrollText,
            title: t(
                'landing.features.items.audit.title',
                'Per-Object Animation',
            ),
            description: t(
                'landing.features.items.audit.description',
                'Animate texts, images and shapes individually for polished, dynamic videos.',
            ),
            color: 'text-teal-500',
            bgColor: 'bg-teal-500/10',
        },
        {
            icon: Megaphone,
            title: t(
                'landing.features.items.announcements.title',
                '1,600+ Templates',
            ),
            description: t(
                'landing.features.items.announcements.description',
                'Choose from a library of 1,600+ professional templates for any format.',
            ),
            color: 'text-indigo-500',
            bgColor: 'bg-indigo-500/10',
        },
        {
            icon: Globe,
            title: t('landing.features.items.i18n.title', '3 Languages'),
            description: t(
                'landing.features.items.i18n.description',
                'Interface and human support in Portuguese, English and Spanish.',
            ),
            color: 'text-cyan-500',
            bgColor: 'bg-cyan-500/10',
        },
        {
            icon: Moon,
            title: t('landing.features.items.dark_mode.title', 'Free to Start'),
            description: t(
                'landing.features.items.dark_mode.description',
                'Create 3 videos per month in 720p with watermark. No credit card required.',
            ),
            color: 'text-slate-500',
            bgColor: 'bg-slate-500/10',
        },
        {
            icon: Zap,
            title: t(
                'landing.features.items.stack.title',
                'Deterministic Render',
            ),
            description: t(
                'landing.features.items.stack.description',
                'The same MP4 every time, in 1080p on Pro and up to 4K on Business.',
            ),
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-500/10',
        },
        {
            icon: Palette,
            title: t('landing.features.items.ui.title', 'No Watermark'),
            description: t(
                'landing.features.items.ui.description',
                'Paid plans export in 1080p without watermark, ready to publish.',
            ),
            color: 'text-pink-500',
            bgColor: 'bg-pink-500/10',
        },
    ];

    return (
        <section id="features" className="py-20 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        {t(
                            'landing.features.title.part1',
                            'Everything you need to',
                        )}{' '}
                        <span className="text-primary">
                            {t('landing.features.title.part2', 'create faster')}
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {t(
                            'landing.features.description',
                            'From prompt to polished video. The AI agent, the visual editor and deterministic rendering work together so you can focus on the story.',
                        )}
                    </p>
                </div>

                {/* Features Grid */}
                <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="group relative rounded-md border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-card"
                        >
                            <div
                                className={`inline-flex h-10 w-10 items-center justify-center rounded-md ${feature.bgColor}`}
                            >
                                <feature.icon className={`h-5 w-5 ${feature.color}`} />
                            </div>
                            <h3 className="mt-3 text-sm font-semibold">
                                {feature.title}
                            </h3>
                            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
