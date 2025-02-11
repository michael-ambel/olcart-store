// app/admin/dashboard/page.tsx
"use client";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { ResponsivePie } from "@nivo/pie";

const Dashboard = () => {
  // Brand colors
  const colors = {
    green: "#015724",
    orange: "#E52F06",
    blue: "#13265C",
    lightGreen: "#D1FAE5",
    lightOrange: "#FEE2E2",
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Business Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Revenue",
            value: "$58.2K",
            change: "+18.5%",
            color: colors.green,
          },
          {
            title: "Active Users",
            value: "2.4K",
            change: "+12.1%",
            color: colors.blue,
          },
          {
            title: "Total Orders",
            value: "1.8K",
            change: "+6.7%",
            color: colors.orange,
          },
          {
            title: "Products Sold",
            value: "8.2K",
            change: "+9.3%",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow "
          >
            <h3 className="text-gray-500 text-sm mb-2">{stat.title}</h3>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span
                className={`text-sm ${
                  stat.change.startsWith("+") ? "text-mg" : "text-mo"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white p-6 rounded-xl h-96">
          <h2 className="text-lg font-semibold mb-4">Revenue Trend</h2>
          <ResponsiveBar
            data={[
              { month: "Jan", sales: 65, returns: 12 },
              { month: "Feb", sales: 130, returns: 18 },
              { month: "Mar", sales: 80, returns: 8 },
              { month: "Apr", sales: 150, returns: 22 },
              { month: "May", sales: 95, returns: 14 },
              { month: "Jun", sales: 200, returns: 25 },
            ]}
            keys={["sales", "returns"]}
            indexBy="month"
            margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
            padding={0.3}
            colors={[colors.green, colors.orange]}
            enableLabel={false}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
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

        {/* User Acquisition */}
        <div className="bg-white p-6 rounded-xl h-96">
          <h2 className="text-lg font-semibold mb-4">User Growth</h2>
          <ResponsiveLine
            data={[
              {
                id: "users",
                data: [
                  { x: "Jan", y: 400 },
                  { x: "Feb", y: 720 },
                  { x: "Mar", y: 980 },
                  { x: "Apr", y: 1200 },
                  { x: "May", y: 1650 },
                  { x: "Jun", y: 2400 },
                ],
              },
            ]}
            margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
            curve="monotoneX"
            colors={[colors.blue]}
            lineWidth={2}
            enablePoints={true}
            pointColor={colors.blue}
            pointBorderWidth={2}
            pointBorderColor="#ffffff"
            enableArea={true}
            areaOpacity={0.1}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
            }}
          />
        </div>

        {/* Order Status */}
        <div className="bg-white p-6 rounded-xl h-96">
          <h2 className="text-lg font-semibold mb-4">Order Status</h2>
          <ResponsivePie
            data={[
              { id: "Completed", value: 65, color: colors.green },
              { id: "Pending", value: 15, color: colors.orange },
              { id: "Processing", value: 12, color: colors.blue },
              { id: "Cancelled", value: 8, color: colors.lightOrange },
            ]}
            margin={{ top: 20, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            colors={({ data }) => data.color}
            borderWidth={1}
            borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
            enableArcLabels={false}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: "color" }}
          />
        </div>

        {/* Product Performance */}
        <div className="bg-white p-6 rounded-xl h-96">
          <h2 className="text-lg font-semibold mb-4">Product Metrics</h2>
          <ResponsiveBar
            data={[
              { category: "Electronics", inventory: 65, sales: 45 },
              { category: "Apparel", inventory: 130, sales: 112 },
              { category: "Home Goods", inventory: 80, sales: 68 },
              { category: "Beauty", inventory: 150, sales: 140 },
            ]}
            keys={["inventory", "sales"]}
            indexBy="category"
            margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
            padding={0.3}
            colors={[colors.blue, colors.green]}
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

export default Dashboard;
