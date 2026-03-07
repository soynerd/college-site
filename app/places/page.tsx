import BottomNav from "@/components/Navigation";
import Places from "@/components/Places";
export default async function PlacesPage() {
  return (
    <div>
      <div className="h-[calc(100dvh-48px)] overflow-hidden relative">
        <Places />
      </div>
      <BottomNav />
    </div>
  );
}
