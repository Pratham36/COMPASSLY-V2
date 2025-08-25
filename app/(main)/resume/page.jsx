import { getResumeAnalysis } from "@/actions/resume-analysis";
import ResumeAnalysis from "./_components/resume-analysis ";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

export default async function ResumePage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) {
    redirect("/onboarding");
  }
  const resume = await getResumeAnalysis();

  return (
    <div className="container mx-auto">
      <ResumeAnalysis data={resume} />
    </div>
  );
}