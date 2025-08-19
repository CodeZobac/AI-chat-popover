import { TourSchedulingDemo } from "@/components/scheduling";

export default function TestTourSchedulingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tour Scheduling Calendar Test
          </h1>
          <p className="text-gray-600">
            Test the tour scheduling calendar component with availability checking
          </p>
        </div>
        
        <TourSchedulingDemo />
      </div>
    </div>
  );
}