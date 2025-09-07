import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, TestTube, MapPin } from "lucide-react";

interface WaterTestFormProps {
  onBack: () => void;
}

const WaterTestForm = ({ onBack }: WaterTestFormProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    sourceLocation: "",
    sourceType: "",
    turbidity: "",
    phLevel: "",
    temperature: "",
    chlorine: "",
    bacteria: "",
    notes: "",
    testDate: new Date().toISOString().split('T')[0],
    testTime: new Date().toTimeString().split(' ')[0].substring(0, 5)
  });

  const sourceTypes = [
    "Hand Pump #1", "Hand Pump #2", "Hand Pump #3", 
    "Borewell A", "Borewell B", "Community Well",
    "River Point 1", "Pond", "Piped Supply"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast({
        title: "Water Test Submitted",
        description: "Water quality data has been logged successfully.",
      });

      onBack();
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getWaterQualityStatus = () => {
    const ph = parseFloat(formData.phLevel);
    const turbidity = parseFloat(formData.turbidity);

    if (ph >= 6.5 && ph <= 8.5 && turbidity <= 1) {
      return { status: "Good", color: "text-health-success", bgColor: "bg-health-success/10" };
    } else if ((ph >= 6.0 && ph < 6.5) || (ph > 8.5 && ph <= 9.0) || (turbidity > 1 && turbidity <= 5)) {
      return { status: "Fair", color: "text-health-warning", bgColor: "bg-health-warning/10" };
    } else if (ph < 6.0 || ph > 9.0 || turbidity > 5) {
      return { status: "Poor", color: "text-health-danger", bgColor: "bg-health-danger/10" };
    }
    return { status: "Unknown", color: "text-muted-foreground", bgColor: "bg-muted" };
  };

  const qualityStatus = getWaterQualityStatus();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold font-merriweather">Water Quality Test</h2>
        <p className="text-muted-foreground">Log water quality test results</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="w-5 h-5" />
            Test Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Source Information */}
            <div className="space-y-4">
              <h3 className="font-semibold">Source Information</h3>
              <div className="space-y-2">
                <Label>Water Source *</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, sourceType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select water source" />
                  </SelectTrigger>
                  <SelectContent>
                    {sourceTypes.map((source) => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sourceLocation">Location Details *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="sourceLocation"
                    value={formData.sourceLocation}
                    onChange={(e) => setFormData(prev => ({ ...prev, sourceLocation: e.target.value }))}
                    placeholder="Ward/Village name or GPS coordinates"
                    required
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" size="sm">
                    <MapPin className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="testDate">Test Date</Label>
                  <Input
                    id="testDate"
                    type="date"
                    value={formData.testDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, testDate: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="testTime">Test Time</Label>
                  <Input
                    id="testTime"
                    type="time"
                    value={formData.testTime}
                    onChange={(e) => setFormData(prev => ({ ...prev, testTime: e.target.value }))}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Physical Parameters */}
            <div className="space-y-4">
              <h3 className="font-semibold">Physical Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="turbidity">Turbidity (NTU) *</Label>
                  <Input
                    id="turbidity"
                    type="number"
                    step="0.1"
                    value={formData.turbidity}
                    onChange={(e) => setFormData(prev => ({ ...prev, turbidity: e.target.value }))}
                    placeholder="0.0"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Normal: &lt;1 NTU</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperature (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={formData.temperature}
                    onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                    placeholder="25.0"
                  />
                </div>
              </div>
            </div>

            {/* Chemical Parameters */}
            <div className="space-y-4">
              <h3 className="font-semibold">Chemical Parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phLevel">pH Level *</Label>
                  <Input
                    id="phLevel"
                    type="number"
                    step="0.1"
                    min="0"
                    max="14"
                    value={formData.phLevel}
                    onChange={(e) => setFormData(prev => ({ ...prev, phLevel: e.target.value }))}
                    placeholder="7.0"
                    required
                  />
                  <p className="text-xs text-muted-foreground">Normal: 6.5 - 8.5</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="chlorine">Residual Chlorine (mg/L)</Label>
                  <Input
                    id="chlorine"
                    type="number"
                    step="0.01"
                    value={formData.chlorine}
                    onChange={(e) => setFormData(prev => ({ ...prev, chlorine: e.target.value }))}
                    placeholder="0.5"
                  />
                  <p className="text-xs text-muted-foreground">Normal: 0.2 - 0.5 mg/L</p>
                </div>
              </div>
            </div>

            {/* Biological Parameters */}
            <div className="space-y-2">
              <Label>Bacteria Test Result</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, bacteria: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select test result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="negative">Negative (Safe)</SelectItem>
                  <SelectItem value="positive">Positive (Contaminated)</SelectItem>
                  <SelectItem value="pending">Test Pending</SelectItem>
                  <SelectItem value="not-tested">Not Tested</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quality Assessment */}
            {(formData.phLevel || formData.turbidity) && (
              <div className="p-4 rounded-lg border">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Overall Water Quality:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${qualityStatus.color} ${qualityStatus.bgColor}`}>
                    {qualityStatus.status}
                  </span>
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any observations, unusual conditions, or recommendations..."
                rows={4}
              />
            </div>

            {/* Submit */}
            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !formData.sourceLocation || !formData.sourceType || !formData.turbidity || !formData.phLevel}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="droplet-spin">💧</div>
                    Submitting...
                  </div>
                ) : (
                  "Submit Test Results"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WaterTestForm;