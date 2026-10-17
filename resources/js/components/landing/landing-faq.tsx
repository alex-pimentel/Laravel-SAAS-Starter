import { useTranslations } from '@/hooks/use-translations';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function LandingFaq() {
    const { t } = useTranslations();
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: t(
                'landing.faq.items.what_is.question',
                'What is AgentResolve?',
            ),
            answer: t(
                'landing.faq.items.what_is.answer',
                'AgentResolve creates professional videos with AI in minutes. Describe your video in a sentence and the agent picks a template, writes the copy and builds an editable design. You refine it in the visual editor and render a deterministic MP4 in 1080p or 4K.',
            ),
        },
        {
            question: t(
                'landing.faq.items.tech_stack.question',
                'What video quality can I export?',
            ),
            answer: t(
                'landing.faq.items.tech_stack.answer',
                'AgentResolve renders deterministic MP4 files: 720p on the Free plan, 1080p on Pro and up to 4K on Business.',
            ),
        },
        {
            question: t(
                'landing.faq.items.multiple_projects.question',
                'Can I create multiple videos and projects?',
            ),
            answer: t(
                'landing.faq.items.multiple_projects.answer',
                'Yes! The Free plan includes 3 videos per month, Pro includes 30 and Business includes 150, with workspaces for your team and API access on Business.',
            ),
        },
        {
            question: t(
                'landing.faq.items.production_ready.question',
                'Are the videos ready to publish?',
            ),
            answer: t(
                'landing.faq.items.production_ready.answer',
                'Absolutely. Paid plans export without watermark, in 1080p or 4K, and the deterministic render guarantees the same polished MP4 every time.',
            ),
        },
        {
            question: t(
                'landing.faq.items.customization.question',
                'How do I customize the design?',
            ),
            answer: t(
                'landing.faq.items.customization.answer',
                'Everything is editable. Use the visual editor to adjust scenes on the timeline and animate each object individually until the video looks exactly how you want.',
            ),
        },
        {
            question: t(
                'landing.faq.items.support.question',
                'Do you offer support?',
            ),
            answer: t(
                'landing.faq.items.support.answer',
                'Yes! We provide support in Portuguese, English and Spanish to help you make the most of AgentResolve.',
            ),
        },
        {
            question: t(
                'landing.faq.items.getting_started.question',
                'How do I get started?',
            ),
            answer: t(
                'landing.faq.items.getting_started.answer',
                "Sign up for free, describe the video you want in a sentence, and the AI agent delivers an editable draft in minutes. Refine it in the editor and render when you're ready.",
            ),
        },
    ];

    return (
        <section id="faq" className="bg-muted/30 py-20 sm:py-32">
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        {t('landing.faq.title.part1', 'Frequently Asked')}{' '}
                        <span className="text-primary">
                            {t('landing.faq.title.part2', 'Questions')}
                        </span>
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground">
                        {t(
                            'landing.faq.description',
                            "Everything you need to know about AgentResolve. Can't find the answer you're looking for? Contact our support team.",
                        )}
                    </p>
                </div>

                {/* FAQ Accordion */}
                <div className="mt-10 space-y-2">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="overflow-hidden rounded-md border bg-card"
                        >
                            <button
                                onClick={() =>
                                    setOpenIndex(
                                        openIndex === index ? null : index,
                                    )
                                }
                                className="flex w-full items-center justify-between p-4 text-left text-sm font-medium transition-colors hover:bg-muted/50 sm:px-5 sm:py-4"
                            >
                                <span>{faq.question}</span>
                                <ChevronDown
                                    className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                                        openIndex === index ? 'rotate-180' : ''
                                    }`}
                                />
                            </button>
                            <div
                                className={`grid transition-all duration-300 ease-in-out ${
                                    openIndex === index
                                        ? 'grid-rows-[1fr]'
                                        : 'grid-rows-[0fr]'
                                }`}
                            >
                                <div className="overflow-hidden">
                                    <p className="px-4 pb-4 text-muted-foreground sm:px-6 sm:pb-6">
                                        {faq.answer}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
