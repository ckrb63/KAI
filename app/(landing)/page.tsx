import { LandingHero } from "@/components/custom/Hero/landing";
import LandingNavigationbar from "@/components/custom/Navigationbar/landing";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="h-full">
      <LandingNavigationbar />
      <LandingHero />
    </div>
  );
};

export default LandingPage;
