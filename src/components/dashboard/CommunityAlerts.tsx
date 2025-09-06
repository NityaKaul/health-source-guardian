import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommunityAlertsProps {
  onBack: () => void;
}

const CommunityAlerts = ({ onBack }: CommunityAlertsProps) => {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { getAlerts } = await import('@/lib/api');
        const result = await getAlerts();
        setAlerts(result.alerts);
      } catch (error) {
        toast({
          title: "Error Loading Alerts",
          description: "Could not fetch community alerts. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, [toast]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h2 className="text-2xl font-bold font-merriweather">Community Alerts</h2>
        <p className="text-muted-foreground">Stay informed about health threats and warnings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Active Alerts ({alerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="droplet-spin text-2xl mb-2">💧</div>
              <p>Loading alerts...</p>
            </div>
          ) : alerts.length === 0 ? (
            <div className="text-center py-8">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No active alerts at this time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert._id}
                  className={`border rounded-lg p-4 ${
                    alert.severity === 'critical' 
                      ? 'border-health-danger bg-health-danger/5' 
                      : alert.severity === 'high'
                      ? 'border-health-warning bg-health-warning/5'
                      : 'border-border bg-card'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-lg">{alert.title}</h3>
                    <Badge 
                      variant={alert.severity === 'critical' ? 'destructive' : 'secondary'}
                      className={
                        alert.severity === 'critical' ? 'pulse-alert' : 
                        alert.severity === 'high' ? 'animate-pulse' : ''
                      }
                    >
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{alert.message}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-2 text-sm text-muted-foreground mb-3">
                    {alert.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{alert.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{new Date(alert.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CommunityAlerts;