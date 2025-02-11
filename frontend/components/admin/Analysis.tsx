// app/admin/analysis/page.tsx
"use client";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";

const Analysis = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Business Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl h-96">
          <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
          <ResponsiveLine
            data={[
              {
                id: "revenue",
                data: [
                  { x: "Jan", y: 12000 },
                  { x: "Feb", y: 19000 },
                  { x: "Mar", y: 3000 },
                  { x: "Apr", y: 5000 },
                  { x: "May", y: 2000 },
                  { x: "Jun", y: 30000 },
                ],
              },
            ]}
            margin={{ top: 10, right: 10, bottom: 70, left: 40 }}
            curve="monotoneX"
            enableGridX={false}
            colors={["#3b82f6"]}
            lineWidth={2}
            enablePoints={false}
            enableArea={true}
            areaOpacity={0.1}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              format: (value) => `$${(value / 1000).toFixed(0)}K`,
            }}
            useMesh={true}
            theme={{
              tooltip: {
                container: {
                  background: "#ffffff",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  padding: "12px",
                },
              },
            }}
          />
        </div>

        {/* Order Distribution */}
        <div className="bg-white p-6 rounded-xl h-96">
          <h2 className="text-lg font-semibold mb-4">Order Distribution</h2>
          <ResponsiveBar
            data={[
              { category: "Electronics", orders: 65 },
              { category: "Fashion", orders: 130 },
              { category: "Home", orders: 80 },
              { category: "Beauty", orders: 150 },
            ]}
            keys={["orders"]}
            indexBy="category"
            margin={{ top: 10, right: 10, bottom: 90, left: 40 }}
            padding={0.3}
            colors={["#10b981"]}
            enableLabel={false}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
            theme={{
              tooltip: {
                container: {
                  background: "#ffffff",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  borderRadius: "8px",
                  padding: "12px",
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Analysis;
