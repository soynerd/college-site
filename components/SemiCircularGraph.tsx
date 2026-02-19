import { Faculty } from "@prisma/client";
import { div } from "framer-motion/client";
import { PieChart, Pie, Label, ResponsiveContainer, Tooltip } from "recharts";

export default function SemiCircleGraph({ f }: { f: Faculty }) {
  const total = f.totalReviews || 1;
  const goatPercentage = Math.round((f.goat / total) * 100);
  const passablePercentage = Math.round((f.passable / total) * 100);
  const sleepInducerPercentage = Math.round((f.sleepInducer / total) * 100);
  const unbearablePercentage = Math.round((f.unbearable / total) * 100);
  const maxPercentage = Math.max(
    goatPercentage,
    passablePercentage,
    sleepInducerPercentage,
    unbearablePercentage,
  );
  const maxCategory = (() => {
    switch (maxPercentage) {
      case goatPercentage:
        return "GOAT";
      case passablePercentage:
        return "Passable";
      case sleepInducerPercentage:
        return "Sleep Inducer";
      case unbearablePercentage:
        return "Unbearable";
      default:
        return "";
    }
  })();

  const data = [
    { name: "GOAT", value: f.goat, fill: "#0088FE" },
    { name: "Passable", value: f.passable, fill: "#00C49F" },
    { name: "Sleep Inducer", value: f.sleepInducer, fill: "#FFBB28" },
    { name: "Unbearable", value: f.unbearable, fill: "#FF8042" },
  ];

  return (
    <div className="w-full max-w-2xl h-80 mx-auto absolute left-0 right-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Tooltip
            formatter={(value, name) => {
              const num = Number(value ?? 1);
              const total = Number(f.totalReviews ?? 1);
              return [`${Math.round((num / total) * 100)}%`, name];
            }}
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.65)",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#fff",
              fontSize: 12,
            }}
            itemStyle={{
              color: "#fff",
            }}
            labelStyle={{
              color: "#aaa",
            }}
            cursor={{ fill: "rgba(255,255,255,0.08)" }}
          />

          <Pie
            data={data}
            dataKey="value"
            cx="50%"
            cy="100%"
            startAngle={180}
            endAngle={0}
            innerRadius="75%"
            outerRadius="100%"
            paddingAngle={4}
            cornerRadius={12}
            isAnimationActive
          >
            {/* CENTER LABEL */}
            <Label
              position="center"
              content={({ viewBox }) => {
                if (!viewBox) return null;
                const { cx, cy } = viewBox as any;
                return (
                  <>
                    <text
                      x="50%"
                      y="85%"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="36"
                      fontWeight="700"
                      fill="#fff"
                    >
                      {maxPercentage}%
                    </text>
                    <text
                      x="50%"
                      y="95%"
                      textAnchor="middle"
                      fontSize="12"
                      fill="#999"
                    >
                      {maxCategory}
                    </text>
                  </>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
