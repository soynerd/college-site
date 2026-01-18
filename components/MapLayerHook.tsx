"use client";

import { useEffect, useId, useState } from "react";
import { useMap } from "@/components/ui/map";
import type { FeatureCollection, Point } from "geojson";

export function useMarkerLayer({
  geoJson,
  years,
}: {
  geoJson: FeatureCollection<Point, any>;
  years: number[];
}) {
  const { map, isLoaded } = useMap();
  const id = useId();
  const sourceId = `people-src-${id}`;
  const layerId = `people-layer-${id}`;

  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  /* create layer */
  useEffect(() => {
    if (!map || !isLoaded) return;

    map.addSource(sourceId, { type: "geojson", data: geoJson });

    map.addLayer({
      id: layerId,
      type: "circle",
      source: sourceId,
      paint: {
        "circle-radius": ["case", ["get", "isUser"], 9, 6],
        "circle-color": ["case", ["get", "isUser"], "#3b82f6", "#71717a"],
        "circle-stroke-width": 2,
        "circle-stroke-color": "#fff",
      },
    });

    map.on("click", layerId, (e) => {
      if (!e.features?.length) return;
      const f = e.features[0];
      const [lng, lat] = (f.geometry as Point).coordinates;
      setSelected({ ...f.properties, lng, lat });
    });

    setReady(true);

    return () => {
      if (map.getLayer(layerId)) map.removeLayer(layerId);
      if (map.getSource(sourceId)) map.removeSource(sourceId);
    };
  }, [map, isLoaded, geoJson]);

  /* filter */
  useEffect(() => {
    if (!map || !ready) return;
    if (!map.getLayer(layerId)) return;

    map.setFilter(layerId, [
      "any",
      ["boolean", ["get", "isUser"], false],
      ["in", ["get", "year"], ["literal", years]],
    ]);
  }, [map, ready, years]);

  return {
    selected,
    clear: () => setSelected(null),
  };
}
