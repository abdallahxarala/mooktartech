"use client";

import { useEffect } from "react";
import Joyride, { Step } from "react-joyride";
import { useTranslations } from "@/lib/utils/next-intl-fallback";

interface TourProps {
  run: boolean;
  onComplete: () => void;
}

export function Tour({ run, onComplete }: TourProps) {
  const t = useTranslations("cards.tour");

  const steps: Step[] = [
    {
      target: ".template-selector",
      content: t("steps.template"),
      placement: "center",
    },
    {
      target: ".color-picker",
      content: t("steps.colors"),
      placement: "left",
    },
    {
      target: ".text-editor",
      content: t("steps.text"),
      placement: "right",
    },
    {
      target: ".image-upload",
      content: t("steps.image"),
      placement: "bottom",
    },
    {
      target: ".preview",
      content: t("steps.preview"),
      placement: "left",
    },
  ];

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showProgress
      showSkipButton
      styles={{
        options: {
          primaryColor: "#FF7A00",
          textColor: "#111827",
        },
      }}
      callback={({ status }) => {
        if (["finished", "skipped"].includes(status)) {
          onComplete();
        }
      }}
      locale={{
        back: t("controls.back"),
        close: t("controls.close"),
        last: t("controls.finish"),
        next: t("controls.next"),
        skip: t("controls.skip"),
      }}
    />
  );
}
