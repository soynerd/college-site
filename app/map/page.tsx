import React from "react";
import Map from "../../components/Map";
import BottomNav from "@/components/Navigation";
export default function MapPage() {
  return (
    <div>
      <div className="h-[calc(100dvh-48px)] overflow-hidden relative">
        <Map />
      </div>
      <BottomNav />
    </div>
  );
}
