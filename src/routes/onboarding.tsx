import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { StepperSidebar, type StepDef } from "@/components/onboarding/StepperSidebar";
import {
  initialState,
  MOCK_PAGE_TYPES,
  type OnboardingState,
} from "@/components/onboarding/types";
import { Step1Gsc } from "@/components/onboarding/steps/Step1Gsc";
import { Step2Property } from "@/components/onboarding/steps/Step2Property";
import { Step3Business } from "@/components/onboarding/steps/Step3Business";
import { Step4Brand } from "@/components/onboarding/steps/Step4Brand";
import { Step5Economics } from "@/components/onboarding/steps/Step5Economics";
import { Step6Processing } from "@/components/onboarding/steps/Step6Processing";
import { Step7PageTypes } from "@/components/onboarding/steps/Step7PageTypes";
import { Step8Done } from "@/components/onboarding/steps/Step8Done";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingPage,
  head: () => ({
    meta: [
      { title: "Onboarding — OrganicOS" },
      { name: "description", content: "Wire up OrganicOS in 8 quick steps." },
    ],
  }),
});

const STEPS: StepDef[] = [
  { id: 1, title: "Connect GSC", subtitle: "Read-only OAuth" },
  { id: 2, title: "Pick property", subtitle: "Your main site" },
  { id: 3, title: "Business basics", subtitle: "Model · currency · market" },
  { id: 4, title: "Brand keywords", subtitle: "Brand vs. non-brand split" },
  { id: 5, title: "Economics", subtitle: "CVR & order value" },
  { id: 6, title: "Processing", subtitle: "We pull 16 months of data" },
  { id: 7, title: "Page types", subtitle: "Confirm classification" },
  { id: 8, title: "All set", subtitle: "Open the dashboard" },
];

function OnboardingPage() {
  const [state, setState] = useState<OnboardingState>(initialState);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const update = (patch: Partial<OnboardingState>) =>
    setState((s) => ({ ...s, ...patch }));

  const goTo = (step: number) => setCurrentStep(step);

  const advance = () => {
    setCompletedSteps((prev) => new Set(prev).add(currentStep));
    setCurrentStep((s) => Math.min(8, s + 1));
  };

  const back = () => setCurrentStep((s) => Math.max(1, s - 1));

  const currencySymbol =
    state.currency === "GBP" ? "£"
    : state.currency === "USD" ? "$"
    : state.currency === "EUR" ? "€"
    : state.customCurrency || "$";

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <StepperSidebar
        steps={STEPS}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={goTo}
      />

      <main className="flex-1 relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-glow blur-[160px] pointer-events-none opacity-60" />

        <div className="relative h-screen overflow-y-auto">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <Step1Gsc
                key="s1"
                connected={state.gscConnected}
                onConnect={() => update({ gscConnected: true })}
                onNext={advance}
              />
            )}
            {currentStep === 2 && (
              <Step2Property
                key="s2"
                selected={state.selectedProperty}
                onSelect={(url) => update({ selectedProperty: url })}
                onBack={back}
                onNext={advance}
              />
            )}
            {currentStep === 3 && (
              <Step3Business
                key="s3"
                businessModel={state.businessModel}
                currency={state.currency}
                customCurrency={state.customCurrency}
                primaryMarket={state.primaryMarket}
                onChange={update}
                onBack={back}
                onNext={advance}
              />
            )}
            {currentStep === 4 && (
              <Step4Brand
                key="s4"
                brandedKeywords={state.brandedKeywords}
                onChange={(brandedKeywords) => update({ brandedKeywords })}
                onBack={back}
                onNext={advance}
              />
            )}
            {currentStep === 5 && (
              <Step5Economics
                key="s5"
                mode={state.economicsMode}
                ga4Connected={state.ga4Connected}
                globalCvr={state.globalCvr}
                globalAov={state.globalAov}
                businessModel={state.businessModel}
                currencySymbol={currencySymbol}
                onModeChange={(economicsMode) => update({ economicsMode })}
                onGa4Connect={() => update({ ga4Connected: true })}
                onChange={update}
                onBack={back}
                onNext={advance}
              />
            )}
            {currentStep === 6 && (
              <Step6Processing key="s6" onComplete={advance} />
            )}
            {currentStep === 7 && (
              <Step7PageTypes
                key="s7"
                pageTypes={state.pageTypes.length ? state.pageTypes : MOCK_PAGE_TYPES}
                onChange={(pageTypes) => update({ pageTypes })}
                onBack={back}
                onNext={advance}
              />
            )}
            {currentStep === 8 && <Step8Done key="s8" currencySymbol={currencySymbol} />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
