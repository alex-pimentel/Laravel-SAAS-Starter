import CookieConsentBanner from '@/components/cookie-consent-banner';
import { useToast } from '@/components/ui/toast';
import { FeatureProvider } from '@/contexts/feature-context';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { router, usePage } from '@inertiajs/react';
import { useEcho } from '@laravel/echo-react';
import { type ReactNode } from 'react';
import { useTranslations } from '@/hooks/use-translations';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

function WorkspaceActivityListener({
    workspaceId,
}: {
    workspaceId?: number | string;
}) {
    const { addToast } = useToast();

    useEcho(
        workspaceId ? `workspace.${workspaceId}` : 'null-workspace',
        '.workspace.activity',
        (e: { message: string; type: 'success' | 'error' | 'info' }) => {
            addToast(e.message, e.type);
        },
    );

    return null;
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { currentWorkspace } = usePage<SharedData>().props;
    const { t } = useTranslations();

    const { auth } = usePage<SharedData>().props;

    return (
        <>
            {import.meta.env.VITE_REVERB_APP_KEY && (
                <WorkspaceActivityListener workspaceId={currentWorkspace?.id} />
            )}
            {auth.is_impersonating && (
                <div className="sticky top-0 z-50 flex items-center justify-center gap-4 bg-destructive px-4 py-2 text-center text-sm font-medium text-destructive-foreground">
                    <span>
                        {t(
                            'impersonation.warning',
                            'You are currently viewing the application as {{name}}.',
                            { name: auth.user?.name ?? '' },
                        )}
                    </span>
                    <button
                        onClick={() => router.post('/admin/impersonate/leave')}
                        className="rounded-md bg-white/20 px-3 py-1 transition-colors hover:bg-white/30"
                    >
                        {t('impersonation.leave', 'Leave Impersonation')}
                    </button>
                </div>
            )}
            <FeatureProvider>
                <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                    {children}
                </AppLayoutTemplate>
            </FeatureProvider>
            <CookieConsentBanner />
        </>
    );
};
