import { useTranslations } from '@/hooks/use-translations';
import { router } from '@inertiajs/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

export interface TourStep {
    target: string;
    title: string;
    description: string;
}

export function useTour() {
    const { t } = useTranslations();
    const [step, setStep] = useState(0);
    const [visible, setVisible] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const steps = useMemo<TourStep[]>(
        () => [
            {
                target: '#dashboard-main',
                title: t('tour.steps.dashboard.title', 'Your Dashboard'),
                description: t(
                    'tour.steps.dashboard.description',
                    'This is your workspace dashboard. Get a quick overview of your plan, team, and recent activity at a glance.',
                ),
            },
            {
                target: '[data-tour="workspace-switcher"]',
                title: t(
                    'tour.steps.workspace_switcher.title',
                    'Workspace Switcher',
                ),
                description: t(
                    'tour.steps.workspace_switcher.description',
                    'Switch between workspaces, create new ones, or access workspace settings from this menu.',
                ),
            },
            {
                target: '[data-tour="nav-usage"]',
                title: t('tour.steps.usage.title', 'Usage & Analytics'),
                description: t(
                    'tour.steps.usage.description',
                    'Track your workspace usage, view activity logs, and monitor your plan limits here.',
                ),
            },
            {
                target: '[data-tour="user-menu"]',
                title: t('tour.steps.account.title', 'Your Account'),
                description: t(
                    'tour.steps.account.description',
                    'Access your profile settings, billing, team management, and support tickets from this menu.',
                ),
            },
        ],
        [t],
    );

    const complete = useCallback(() => {
        router.post(
            '/tour/complete',
            {},
            { preserveState: true, preserveScroll: true },
        );
        setVisible(false);
    }, []);

    const next = useCallback(() => {
        if (step < steps.length - 1) {
            setStep((s) => s + 1);
        } else {
            complete();
        }
    }, [step, steps.length, complete]);

    const skip = useCallback(() => {
        complete();
    }, [complete]);

    // Get current step info
    const currentStep = steps[step];

    // Check if current step's target exists
    const currentTargetExists =
        mounted && typeof document !== 'undefined'
            ? document.querySelector(currentStep.target) !== null
            : false;

    return {
        step,
        steps,
        visible: visible && mounted,
        next,
        skip,
        complete,
        currentStep,
        currentTargetExists,
    };
}
