import { PlatformStats } from "@/types";
import { formatLargeNumber } from "@/lib/data";

interface StatsProps {
  stats: PlatformStats;
}

export default function Stats({ stats }: StatsProps) {
  const statItems = [
    {
      label: "Total Raised",
      value: formatLargeNumber(stats.totalAmountRaised),
    },
    {
      label: "Active Investors",
      value: stats.totalInvestors.toLocaleString(),
    },
    {
      label: "Returns Earned",
      value: formatLargeNumber(stats.totalReturnsEarned),
    },
    {
      label: "Movies Funded",
      value: stats.moviesFunded.toString(),
    },
  ];

  return (
    <section className="border-b border-black bg-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {statItems.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-light text-black mb-2">
                {stat.value}
              </div>
              <div className="text-xs font-light text-black uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
