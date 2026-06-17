import { redirect } from "next/navigation";
import { getMyStartup } from "@/lib/actions/startups";

export default async function StartupRedirectPage() {
  const startup = await getMyStartup();
  if (startup) {
    redirect(`/dashboard/startup/${startup.id}/edit`);
  }
  redirect("/dashboard/startup/new");
}
