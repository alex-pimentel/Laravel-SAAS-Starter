import { useTranslations } from '@/hooks/use-translations';
import { Link } from '@inertiajs/react';
import { Sparkles } from 'lucide-react';

export function LandingFooter() {
    const { t } = useTranslations();

    const footerLinks = {
        product: {
            title: t('landing.footer.cols.product.title', 'Produto'),
            links: [
                {
                    label: t(
                        'landing.footer.cols.product.features',
                        'Recursos',
                    ),
                    href: '#features',
                },
                {
                    label: t('landing.footer.cols.product.faq', 'FAQ'),
                    href: '#faq',
                },
                {
                    label: t('landing.footer.pricing', 'Preços'),
                    href: '#pricing',
                },
            ],
        },
        account: {
            title: t('navigation.platform', 'Plataforma'),
            links: [
                {
                    label: t('navigation.dashboard', 'Painel'),
                    href: '/dashboard',
                },
                {
                    label: t('auth.log_in', 'Entrar'),
                    href: '/login',
                },
                {
                    label: t('auth.create_account', 'Criar conta'),
                    href: '/register',
                },
            ],
        },
        legal: {
            title: t('landing.footer.cols.legal.title', 'Legal'),
            links: [
                {
                    label: t(
                        'landing.footer.cols.legal.privacy',
                        'Política de Privacidade',
                    ),
                    href: '/privacy',
                },
            ],
        },
    };
    return (
        <footer className="border-t border-white/10 bg-foreground text-white">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
                {/* Top section */}
                <div className="grid gap-8 lg:grid-cols-6">
                    {/* Logo & Description */}
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-accent">
                                <Sparkles className="h-4 w-4 text-foreground" />
                            </div>
                            <span className="text-base font-bold tracking-tight text-white">
                                {t('landing.footer.brand', 'AgentResolve')}
                            </span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm text-white/50">
                            {t(
                                'landing.footer.description',
                                'AgentResolve creates professional videos with AI in minutes: describe, refine and render.',
                            )}
                        </p>
                    </div>

                    {/* Links */}
                    {Object.values(footerLinks).map((section) => (
                        <div key={section.title}>
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/70">{section.title}</h3>
                            <ul className="mt-4 space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            className="text-sm text-white/40 transition-colors hover:text-white"
                                            target={
                                                link.href.startsWith('http')
                                                    ? '_blank'
                                                    : undefined
                                            }
                                            rel={
                                                link.href.startsWith('http')
                                                    ? 'noopener noreferrer'
                                                    : undefined
                                            }
                                        >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom section */}
                <div className="mt-12 border-t border-white/10 pt-8">
                    <p className="text-center text-sm text-white/30">
                        © {new Date().getFullYear()}{' '}
                        {t(
                            'landing.footer.copyright',
                            'AgentResolve. All rights reserved.',
                        )}
                    </p>
                </div>
            </div>
        </footer>
    );
}
