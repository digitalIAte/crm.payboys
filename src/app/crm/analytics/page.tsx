import AnalyticsCharts from "./AnalyticsCharts";

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center bg-gradient-to-r from-payboys to-blue-600 rounded-xl p-8 shadow-sm">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Analytics & Performance</h2>
                    <p className="text-blue-100">Visión general del embudo de conversión y calidad de los leads</p>
                </div>
            </div>

            <AnalyticsCharts />
        </div>
    );
}
