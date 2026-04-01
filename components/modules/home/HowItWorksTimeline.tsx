import { ClipboardCheck, Search, Star } from "lucide-react";

const STEPS = [
  {
    title: "1. Discover",
    description:
      "Search restaurants and dishes with real community signals, then shortlist the ones worth your time.",
    icon: Search,
    num: "1",
  },
  {
    title: "2. Experience",
    description:
      "Try what you found, compare expectation vs taste, and capture your own notes while details are fresh.",
    icon: ClipboardCheck,
    num: "2",
  },
  {
    title: "3. Review",
    description:
      "Rate, write, and publish. Help the next diner make better decisions with honest, useful feedback.",
    icon: Star,
    num: "3",
  },
];

export default function HowItWorksTimeline() {
  return (
    <div
      style={{ fontFamily: "'Tahoma','Verdana','Arial',sans-serif" }}
    >
      {/* Win2K wizard-style numbered panels */}
      <div className="grid gap-3 md:grid-cols-3">
        {STEPS.map((step, index) => {
          const Icon = step.icon;

          return (
            <div
              key={step.title}
              className="win-raised overflow-hidden"
            >
              {/* Mini titlebar per step */}
              <div
                className="flex items-center gap-2 px-2 py-0.5 text-[10px] font-bold text-white select-none"
                style={{ background: "linear-gradient(to right, #0a246a, #4872c4)" }}
              >
                <span
                  className="inline-flex h-4 w-4 items-center justify-center text-[9px] font-bold text-white"
                  style={{
                    background: "#cc0000",
                    border: "1px solid #800000",
                  }}
                >
                  {step.num}
                </span>
                {step.title}
              </div>
              <div className="p-3">
                {/* Icon in Win2K groupbox style */}
                <div
                  className="mb-2 inline-flex items-center justify-center p-2"
                  style={{
                    background: "#ece9d8",
                    border: "2px solid",
                    borderColor: "#808080 #ffffff #ffffff #808080",
                  }}
                >
                  <Icon className="h-5 w-5 text-[#0a246a]" />
                </div>
                <p className="text-[11px] leading-5 text-[#333333]">{step.description}</p>
              </div>
              {/* Progress indicator */}
              <div
                className="flex items-center px-3 py-1 text-[10px] text-[#0a246a]"
                style={{ borderTop: "1px solid #808080", background: "#ece9d8" }}
              >
                {"■".repeat(index + 1)}{"□".repeat(2 - index)}
                <span className="ml-2 text-[#444444]">Step {index + 1} of 3</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
