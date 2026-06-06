import HowWeSolveIt from "@/components/sections/HowWeSolveIt";
import WhatMakesUsDifferent from "@/components/sections/WhatMakesUsDifferent";
import WhatProblemsWeSolve from "@/components/sections/WhatProblemsWeSolve";
import WhoWeAreSection from "@/components/sections/WhoWeAreSection";
import FounderSection from "@/components/sections/FounderSection";
import TrustedBy from "@/components/sections/TrustedBy";
export default function About() {
  return (
    <>
      <WhoWeAreSection />
      <FounderSection />
      <WhatProblemsWeSolve />
      <HowWeSolveIt />
      <WhatMakesUsDifferent />
      <TrustedBy />
    </>
  );
}
