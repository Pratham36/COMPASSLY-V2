import { getUserOnboardingStatus } from "@/actions/user";
import { saveRoadMap } from "@/actions/road-map";
import { redirect } from "next/navigation";
import CareerRoadmap from "./_components/roadmap";


export default async function ResumePage() {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) {
    redirect("/onboarding");
  }

  const roadmap = await saveRoadMap();
  return (
    <div className="container mx-auto">
    <CareerRoadmap roadmap={roadmap} />
    </div>
  );
}
