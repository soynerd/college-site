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

  /* ================= CREATE LAYER ================= */
  useEffect(() => {
    if (!map || !isLoaded) return;

    const m = map;

    if (m._removed) return;

    if (!m.getSource(sourceId)) {
      m.addSource(sourceId, {
        type: "geojson",
        data: geoJson,
      });
    }

    if (!m.getLayer(layerId)) {
      m.addLayer({
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
    }

    const handleClick = (e: any) => {
      if (!e.features?.length) return;
      const f = e.features[0];
      const [lng, lat] = (f.geometry as Point).coordinates;
      setSelected({ ...f.properties, lng, lat });
    };

    m.on("click", layerId, handleClick);
    setReady(true);

    return () => {
      if (!m || m._removed) return;

      try {
        m.off("click", layerId, handleClick);

        if (m.getLayer(layerId)) m.removeLayer(layerId);
        if (m.getSource(sourceId)) m.removeSource(sourceId);
      } catch {
        // ignore — map already destroyed
      }
    };
  }, [map, isLoaded, geoJson, sourceId, layerId]);

  /* ================= FILTER ================= */
  useEffect(() => {
    if (!map || map._removed || !ready) return;
    if (!map.getLayer(layerId)) return;

    map.setFilter(layerId, [
      "any",
      ["boolean", ["get", "isUser"], false],
      ["in", ["get", "year"], ["literal", years]],
    ]);
  }, [map, ready, years, layerId]);

  return {
    selected,
    clear: () => setSelected(null),
  };
}
