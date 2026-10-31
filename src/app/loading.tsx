import { LoadingScreen } from "@/components/shared/skeletons";

/** Root route-transition loader (branded spinner). */
export default function RootLoading() {
  return <LoadingScreen label="Warming up the studio lights…" />;
}
