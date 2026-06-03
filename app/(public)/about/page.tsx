import HowWeSolveIt from "@/components/sections/HowWeSolveIt";
import WhatMakesUsDifferent from "@/components/sections/WhatMakesUsDifferent";
import WhatProblemsWeSolve from "@/components/sections/WhatProblemsWeSolve";
import WhoWeAreSection from "@/components/sections/WhoWeAreSection";
import TrustedBy from "@/components/sections/TrustedBy";
export default function About() {
  return (
    <>
      <WhoWeAreSection />
      <WhatProblemsWeSolve />
      <HowWeSolveIt />
      <WhatMakesUsDifferent />
      <TrustedBy />
    </>
  );
}
