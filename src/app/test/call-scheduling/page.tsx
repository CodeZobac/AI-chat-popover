import { CallSchedulingDemo } from "@/components/scheduling/call-scheduling-demo";
import { CallSchedulingFormWithApi } from "@/components/scheduling/call-scheduling-form-with-api";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CallSchedulingTestPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Call Scheduling Test</h1>
          <p className="text-muted-foreground">
            Test the call scheduling interface with timezone support and availability checking.
          </p>
        </div>
        
        <Tabs defaultValue="demo" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="demo">Demo Version</TabsTrigger>
            <TabsTrigger value="api">API Integration</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demo" className="space-y-4">
            <CallSchedulingDemo />
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground">
                This version integrates with the actual API endpoints and shows real success/error handling.
              </p>
            </div>
            <CallSchedulingFormWithApi />
          </TabsContent>
        </Tabs>
        
        <div className="bg-muted/50 p-6 rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Features Implemented:</h2>
          <ul className="space-y-2 text-sm">
            <li>✅ Date picker for preferred call dates (weekdays only, up to 3 months ahead)</li>
            <li>✅ Time preference selection with RadioGroup (morning, afternoon, specific)</li>
            <li>✅ Contact information collection form with validation</li>
            <li>✅ Timezone considerations for international students</li>
            <li>✅ Call purpose selection to help prepare for the conversation</li>
            <li>✅ Specific time slot selection with availability checking</li>
            <li>✅ Form validation with Zod schema</li>
            <li>✅ Responsive design with ShadCN UI components</li>
            <li>✅ API endpoint for availability checking and form submission</li>
            <li>✅ Loading states and error handling</li>
          </ul>
        </div>
      </div>
    </div>
  );
}