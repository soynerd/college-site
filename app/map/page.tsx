import Map from "../../components/Map";
import BottomNav from "@/components/Navigation";
import { getUser, getMapLocation } from "@/lib/data/getUser";
import { Suspense } from "react";
import { MapSkeleton } from "@/components/Skeletons";
export default async function MapPage() {
  const mapLocation = await getMapLocation();
  const userData = await getUser();

  const filteredLocation = mapLocation.filter(
    (u) => u.year !== null && u.lat !== null && u.long !== null,
  );
  interface MarkerData {
    username: string;
    year: number;
    lat: number;
    long: number;
  }
  const markerData = filteredLocation as MarkerData[];
  const user = {
    username: userData?.username ?? "You",
    year: userData?.year ?? 2000,
    lat: userData?.lat ?? -100,
    long: userData?.long ?? 0,
  };

  return (
    <div>
      <div className="h-[calc(100dvh-48px)] overflow-hidden relative">
        <Suspense fallback={<MapSkeleton />}>
          <Map user={user} markerData={markerData} />
        </Suspense>
      </div>
      <BottomNav />
    </div>
  );
}
