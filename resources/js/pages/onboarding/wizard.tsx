import AppLogo from '@/components/app-logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useTranslations } from '@/hooks/use-translations';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import {
    Building2,
    Check,
    CheckCircle,
    ChevronRight,
    Infinity as InfinityIcon,
    Sparkles,
    Store,
} from 'lucide-react';
import { useState } from 'react';

const trackStep = (step: string, action: string) => {
    router.post(
        '/onboarding/track-step',
        { step, action },
        { preserveState: true, preserveScroll: true },
    );
};

interface Plan {
    id: string;
    name: string;
    description: string;
    monthlyPrice: number;
    yearlyPrice: number;
    features: string[];
    popular?: boolean;
    limits: {
        workspaces: number;
        team_members: number;
    };
}

const PLANS: Plan[] = [
    {
        id: 'free',
        name: 'Free',
        description: 'Perfect for getting started',
        monthlyPrice: 0,
        yearlyPrice: 0,
        features: [
            '1 Workspace',
            '2 Team Members',
            '2 API Keys',
            '1 Webhook',
            'Basic Features',
            'Community Support',
        ],
        limits: { workspaces: 1, team_members: 2 },
    },
    {
        id: 'pro',
        name: 'Pro',
        description: 'For growing teams',
        monthlyPrice: 19,
        yearlyPrice: 190,
        features: [
            '5 Workspaces',
            '10 Team Members',
            '10 API Keys',
            '5 Webhooks',
            'All Features',
            'Priority Support',
            'Advanced Analytics',
        ],
        popular: true,
        limits: { workspaces: 5, team_members: 10 },
    },
    {
        id: 'business',
        name: 'Business',
        description: 'For larger organizations',
        monthlyPrice: 49,
        yearlyPrice: 490,
        features: [
            'Unlimited Workspaces',
            'Unlimited Team Members',
            'Unlimited API Keys',
            'Unlimited Webhooks',
            'All Features',
            'Dedicated Support',
            'Advanced Analytics',
            'Custom Integrations',
        ],
        limits: { workspaces: -1, team_members: -1 },
    },
];

function PlanCard({
    plan,
    isSelected,
    billingPeriod,
    onSelect,
}: {
    plan: Plan;
    isSelected: boolean;
    billingPeriod: 'monthly' | 'yearly';
    onSelect: () => void;
}) {
    const { t } = useTranslations();
    const price =
        billingPeriod === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
    const isFree = price === 0;

    return (
        <div
            onClick={onSelect}
            className={cn(
                'relative cursor-pointer rounded-md border-2 p-6 transition-all duration-200 hover:shadow-lg',
                isSelected
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'border-border bg-card hover:border-primary/50',
            )}
        >
            {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground">
                        <Sparkles className="mr-1 h-3 w-3" />
                        {t(
                            'onboarding.wizard.plans.most_popular',
                            'Most Popular',
                        )}
                    </Badge>
                </div>
            )}

            <div className="mb-4">
                <h3 className="text-xl font-bold">
                    {t(`onboarding.wizard.plans.${plan.id}.name`, plan.name)}
                </h3>
                <p className="text-sm text-muted-foreground">
                    {t(
                        `onboarding.wizard.plans.${plan.id}.description`,
                        plan.description,
                    )}
                </p>
            </div>

            <div className="mb-4">
                <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold">
                        {isFree
                            ? t('onboarding.wizard.plans.free_price', 'Free')
                            : `$${price}`}
                    </span>
                    {!isFree && (
                        <span className="text-muted-foreground">
                            {billingPeriod === 'monthly'
                                ? `/${t('onboarding.wizard.plans.mo', 'mo')}`
                                : `/${t('onboarding.wizard.plans.yr', 'yr')}`}
                        </span>
                    )}
                </div>
                {!isFree && billingPeriod === 'yearly' && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                        {t(
                            'onboarding.wizard.plans.save_per_year',
                            'Save ${{amount}} per year',
                            {
                                amount:
                                    plan.monthlyPrice * 12 - plan.yearlyPrice,
                            },
                        )}
                    </p>
                )}
            </div>

            <ul className="mb-6 space-y-2">
                {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 shrink-0 text-green-600 dark:text-green-400" />
                        <span>
                            {t(
                                `onboarding.wizard.plans.${plan.id}.features.${index}`,
                                feature,
                            )}
                        </span>
                    </li>
                ))}
            </ul>

            <Button
                variant={isSelected ? 'default' : 'outline'}
                className="w-full"
                onClick={(e) => {
                    e.stopPropagation();
                    onSelect();
                }}
            >
                {isSelected
                    ? t('onboarding.wizard.plans.selected', 'Selected')
                    : t('onboarding.wizard.plans.choose', 'Choose {{plan}}', {
                          plan: t(
                              `onboarding.wizard.plans.${plan.id}.name`,
                              plan.name,
                          ),
                      })}
            </Button>
        </div>
    );
}

export default function OnboardingWizard() {
    const { auth } = usePage<SharedData>().props;
    const { t } = useTranslations();
    const [step, setStep] = useState(1);

    const { data, setData, post, processing, errors } = useForm({
        workspace_name: '',
        onboarding_plan: 'pro' as 'free' | 'pro' | 'business',
        onboarding_billing_period: 'monthly' as 'monthly' | 'yearly',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/onboarding');
    };

    const nextStep = () => {
        trackStep('welcome', 'completed');
        trackStep('workspace', 'viewed');
        setStep(2);
    };

    const nextToBillingStep = () => {
        if (!data.workspace_name.trim()) return;
        trackStep('workspace', 'completed');
        trackStep('plan', 'viewed');
        setStep(3);
    };

    const selectedPlan =
        PLANS.find((p) => p.id === data.onboarding_plan) || PLANS[1];

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4 md:p-8">
            <Head
                title={t(
                    'onboarding.wizard.page_title',
                    'Welcome to AgentResolve',
                )}
            />

            <div className="mb-8 flex items-center gap-2">
                <div className="h-10 text-primary">
                    <AppLogo />
                </div>
            </div>

            <div className="w-full max-w-5xl">
                {/* Progress Indicator */}
                <div className="mb-8 flex items-center justify-between px-4 md:px-16">
                    <div className="flex flex-col items-center">
                        <div
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                                step >= 1
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground',
                            )}
                        >
                            1
                        </div>
                        <span className="mt-2 text-xs font-medium text-muted-foreground">
                            {t('onboarding.wizard.steps.welcome', 'Welcome')}
                        </span>
                    </div>
                    <div
                        className={cn(
                            'mx-4 h-px flex-1 transition-colors',
                            step >= 2 ? 'bg-primary' : 'bg-border',
                        )}
                    />
                    <div className="flex flex-col items-center">
                        <div
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                                step >= 2
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground',
                            )}
                        >
                            2
                        </div>
                        <span className="mt-2 text-xs font-medium text-muted-foreground">
                            {t(
                                'onboarding.wizard.steps.workspace',
                                'Workspace',
                            )}
                        </span>
                    </div>
                    <div
                        className={cn(
                            'mx-4 h-px flex-1 transition-colors',
                            step >= 3 ? 'bg-primary' : 'bg-border',
                        )}
                    />
                    <div className="flex flex-col items-center">
                        <div
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors',
                                step >= 3
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground',
                            )}
                        >
                            3
                        </div>
                        <span className="mt-2 text-xs font-medium text-muted-foreground">
                            {t('onboarding.wizard.steps.plan', 'Plan')}
                        </span>
                    </div>
                </div>

                <div className="relative overflow-hidden">
                    {/* Step 1: Welcome & Overview */}
                    {step === 1 && (
                        <Card className="mx-auto max-w-md animate-in border-none shadow-lg duration-500 fade-in slide-in-from-right-4">
                            <CardHeader className="text-center">
                                <CardTitle className="text-2xl">
                                    {t(
                                        'onboarding.wizard.welcome.title',
                                        'Welcome, {{name}}!',
                                        { name: auth.user.name },
                                    )}
                                </CardTitle>
                                <CardDescription>
                                    {t(
                                        'onboarding.wizard.welcome.description',
                                        "Let's get your account set up. This will only take a minute.",
                                    )}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid gap-4">
                                    <div className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                                        <div className="mt-1 rounded-full bg-primary/10 p-2">
                                            <Building2 className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="flex items-center gap-2 font-medium">
                                                {t(
                                                    'onboarding.wizard.welcome.create_organization.title',
                                                    'Create your organization',
                                                )}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {t(
                                                    'onboarding.wizard.welcome.create_organization.description',
                                                    'Set up your primary workspace to collaborate with your team.',
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50">
                                        <div className="mt-1 rounded-full bg-primary/10 p-2">
                                            <CheckCircle className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <h4 className="flex items-center gap-2 font-medium">
                                                {t(
                                                    'onboarding.wizard.welcome.start_collaborating.title',
                                                    'Start collaborating',
                                                )}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {t(
                                                    'onboarding.wizard.welcome.start_collaborating.description',
                                                    'Invite team members and start utilizing the platform together.',
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button
                                    className="w-full"
                                    size="lg"
                                    onClick={nextStep}
                                >
                                    {t(
                                        'onboarding.wizard.welcome.get_started',
                                        'Get Started',
                                    )}
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Step 2: Workspace Blueprint */}
                    {step === 2 && (
                        <Card className="mx-auto max-w-md animate-in border-none shadow-lg duration-500 fade-in slide-in-from-right-4">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    nextToBillingStep();
                                }}
                            >
                                <CardHeader>
                                    <CardTitle className="text-2xl">
                                        {t(
                                            'onboarding.wizard.workspace.title',
                                            'Name your Workspace',
                                        )}
                                    </CardTitle>
                                    <CardDescription>
                                        {t(
                                            'onboarding.wizard.workspace.description',
                                            "What's the name of your company or organization? You can change this later.",
                                        )}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="workspace_name">
                                            {t(
                                                'onboarding.wizard.workspace.name_label',
                                                'Workspace Name',
                                            )}
                                        </Label>
                                        <Input
                                            id="workspace_name"
                                            placeholder={t(
                                                'onboarding.wizard.workspace.name_placeholder',
                                                'e.g. Acme Corporation',
                                            )}
                                            value={data.workspace_name}
                                            onChange={(e) =>
                                                setData(
                                                    'workspace_name',
                                                    e.target.value,
                                                )
                                            }
                                            autoFocus
                                            required
                                        />
                                        {errors.workspace_name && (
                                            <p className="text-sm text-destructive">
                                                {errors.workspace_name}
                                            </p>
                                        )}
                                    </div>

                                    <div className="rounded-lg bg-muted/50 p-4">
                                        <h4 className="mb-2 flex items-center gap-2 text-sm font-medium">
                                            <Store className="h-4 w-4 text-muted-foreground" />
                                            {t(
                                                'onboarding.wizard.workspace.info.title',
                                                'What is a Workspace?',
                                            )}
                                        </h4>
                                        <p className="text-xs leading-relaxed text-muted-foreground">
                                            {t(
                                                'onboarding.wizard.workspace.info.description',
                                                'A workspace is a dedicated environment where you and your team can collaborate securely. You are designated as the owner.',
                                            )}
                                        </p>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setStep(1)}
                                    >
                                        {t('onboarding.wizard.back', 'Back')}
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={!data.workspace_name.trim()}
                                        className="min-w-32"
                                    >
                                        {t(
                                            'onboarding.wizard.continue',
                                            'Continue',
                                        )}
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    )}

                    {/* Step 3: Plan Selection with Cards */}
                    {step === 3 && (
                        <div className="animate-in duration-500 fade-in slide-in-from-right-4">
                            <div className="mb-8 text-center">
                                <h2 className="mb-2 text-3xl font-bold">
                                    {t(
                                        'onboarding.wizard.plan.title',
                                        'Choose your plan',
                                    )}
                                </h2>
                                <p className="text-muted-foreground">
                                    {t(
                                        'onboarding.wizard.plan.description',
                                        'Select the plan that fits your needs. You can upgrade or downgrade at any time.',
                                    )}
                                </p>
                            </div>

                            {/* Billing Period Toggle */}
                            <div className="mb-8 flex items-center justify-center gap-4">
                                <span
                                    className={cn(
                                        'text-sm',
                                        data.onboarding_billing_period ===
                                            'monthly'
                                            ? 'font-medium text-foreground'
                                            : 'text-muted-foreground',
                                    )}
                                >
                                    {t(
                                        'onboarding.wizard.billing.monthly',
                                        'Monthly',
                                    )}
                                </span>
                                <Switch
                                    checked={
                                        data.onboarding_billing_period ===
                                        'yearly'
                                    }
                                    onCheckedChange={(checked) =>
                                        setData(
                                            'onboarding_billing_period',
                                            checked ? 'yearly' : 'monthly',
                                        )
                                    }
                                />
                                <span
                                    className={cn(
                                        'text-sm',
                                        data.onboarding_billing_period ===
                                            'yearly'
                                            ? 'font-medium text-foreground'
                                            : 'text-muted-foreground',
                                    )}
                                >
                                    {t(
                                        'onboarding.wizard.billing.yearly',
                                        'Yearly',
                                    )}
                                </span>
                                <Badge variant="secondary" className="ml-2">
                                    {t(
                                        'onboarding.wizard.billing.save_badge',
                                        'Save up to 17%',
                                    )}
                                </Badge>
                            </div>

                            {/* Plan Cards */}
                            <div className="mb-8 grid gap-6 md:grid-cols-3">
                                {PLANS.map((plan) => (
                                    <PlanCard
                                        key={plan.id}
                                        plan={plan}
                                        isSelected={
                                            data.onboarding_plan === plan.id
                                        }
                                        billingPeriod={
                                            data.onboarding_billing_period
                                        }
                                        onSelect={() =>
                                            setData(
                                                'onboarding_plan',
                                                plan.id as
                                                    | 'free'
                                                    | 'pro'
                                                    | 'business',
                                            )
                                        }
                                    />
                                ))}
                            </div>

                            {/* Summary & Actions */}
                            <Card className="mx-auto max-w-2xl border-none shadow">
                                <CardContent className="p-6">
                                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                {t(
                                                    'onboarding.wizard.summary.selected_plan',
                                                    'Selected plan',
                                                )}
                                            </p>
                                            <div className="flex items-baseline gap-2">
                                                <h3 className="text-xl font-bold">
                                                    {t(
                                                        `onboarding.wizard.plans.${selectedPlan.id}.name`,
                                                        selectedPlan.name,
                                                    )}
                                                </h3>
                                                <span className="text-muted-foreground">
                                                    {data.onboarding_billing_period ===
                                                    'monthly'
                                                        ? t(
                                                              'onboarding.wizard.summary.per_month',
                                                              '${{price}}/month',
                                                              {
                                                                  price: selectedPlan.monthlyPrice,
                                                              },
                                                          )
                                                        : t(
                                                              'onboarding.wizard.summary.per_year',
                                                              '${{price}}/year',
                                                              {
                                                                  price: selectedPlan.yearlyPrice,
                                                              },
                                                          )}
                                                </span>
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {selectedPlan.limits
                                                    .workspaces === -1 ? (
                                                    <span className="flex items-center gap-1">
                                                        <InfinityIcon className="h-3 w-3" />{' '}
                                                        {t(
                                                            'onboarding.wizard.summary.unlimited_workspaces',
                                                            'Unlimited workspaces',
                                                        )}
                                                    </span>
                                                ) : selectedPlan.limits
                                                      .workspaces === 1 ? (
                                                    t(
                                                        'onboarding.wizard.summary.workspace',
                                                        '{{number}} workspace',
                                                        {
                                                            number: selectedPlan
                                                                .limits
                                                                .workspaces,
                                                        },
                                                    )
                                                ) : (
                                                    t(
                                                        'onboarding.wizard.summary.workspaces',
                                                        '{{number}} workspaces',
                                                        {
                                                            number: selectedPlan
                                                                .limits
                                                                .workspaces,
                                                        },
                                                    )
                                                )}
                                                {' · '}
                                                {selectedPlan.limits
                                                    .team_members === -1 ? (
                                                    <span className="flex items-center gap-1">
                                                        <InfinityIcon className="h-3 w-3" />{' '}
                                                        {t(
                                                            'onboarding.wizard.summary.unlimited_members',
                                                            'Unlimited members',
                                                        )}
                                                    </span>
                                                ) : selectedPlan.limits
                                                      .team_members === 1 ? (
                                                    t(
                                                        'onboarding.wizard.summary.team_member',
                                                        '{{number}} team member',
                                                        {
                                                            number: selectedPlan
                                                                .limits
                                                                .team_members,
                                                        },
                                                    )
                                                ) : (
                                                    t(
                                                        'onboarding.wizard.summary.team_members',
                                                        '{{number}} team members',
                                                        {
                                                            number: selectedPlan
                                                                .limits
                                                                .team_members,
                                                        },
                                                    )
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                variant="ghost"
                                                onClick={() => setStep(2)}
                                            >
                                                {t(
                                                    'onboarding.wizard.back',
                                                    'Back',
                                                )}
                                            </Button>
                                            <Button
                                                onClick={submit}
                                                disabled={processing}
                                                size="lg"
                                                className="min-w-[160px]"
                                            >
                                                {processing
                                                    ? t(
                                                          'onboarding.wizard.summary.setting_up',
                                                          'Setting up...',
                                                      )
                                                    : selectedPlan.monthlyPrice ===
                                                        0
                                                      ? t(
                                                            'onboarding.wizard.summary.start_free',
                                                            'Start Free',
                                                        )
                                                      : t(
                                                            'onboarding.wizard.summary.continue_to_payment',
                                                            'Continue to Payment',
                                                        )}
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {errors.onboarding_plan && (
                                <p className="mt-4 text-center text-sm text-destructive">
                                    {errors.onboarding_plan}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="mt-8 text-center text-sm text-muted-foreground">
                {t('onboarding.wizard.secured_by', 'Secured by AgentResolve')}
            </div>
        </div>
    );
}
