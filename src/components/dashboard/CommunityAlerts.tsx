import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, AlertTriangle, MapPin, Clock, Users, Droplets } from "lucide-react";

interface CommunityAlertsProps {
  onBack: () => void;
}

const CommunityAlerts = ({ onBack }: CommunityAlertsProps) => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      title: "Cholera Outbreak Alert",
      description: "Suspected cholera cases reported in neighboring district. Increase water testing frequency and monitor symptoms closely.",
      severity: "high",
      location: "Nearby District - 15km away",
      timestamp: "2024-01-15T08:30:00",
      affected: "~200 people",
      source: "State Health Department",
      actions: ["Increase water testing", "Monitor symptoms", "Report cases immediately"]
    },
    {
      id: 2,
      title: "Water Contamination Warning",
      description: "Hand pump #3 showing bacterial contamination. Recommend alternative water sources until testing confirms safety.",
      severity: "medium",
      location: "Ward 5, Hand Pump #3",
      timestamp: "2024-01-14T14:15:00",
      affected: "~50 families",
      source: "Local Water Authority",
      actions: ["Use alternative sources", "Boil water before use", "Await test results"]
    },
    {
      id: 3,
      title: "Seasonal Disease Advisory",
      description: "Monsoon season approaching. Increased risk of vector-borne and water-borne diseases. Enhanced surveillance recommended.",
      severity: "low",
      location: "All Districts",
      timestamp: "2024-01-13T09:00:00",
      affected: "All communities",
      source: "Regional Health Office",
      actions: ["Enhanced surveillance", "Community education", "Preventive measures"]
    }
  ]);

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'high':
        return {
          color: "text-health-danger",
          bgColor: "bg-health-danger/10",
          borderColor: "border-health-danger/30",
          badge: "destructive",
          icon: "🚨"
        };
      case 'medium':
        return {
          color: "text-health-warning",
          bgColor: "bg-health-warning/10",
          borderColor: "border-health-warning/30",
          badge: "secondary",
          icon: "⚠️"
        };
      default:
        return {
          color: "text-primary",
          bgColor: "bg-primary/10",
          borderColor: "border-primary/30",
          badge: "outline",
          icon: "ℹ️"
        };
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffHours = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 1) return "Less than 1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} days ago`;
  };

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

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-health-danger/10 rounded-full">
                <AlertTriangle className="w-5 h-5 text-health-danger" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-xl font-bold">1</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-health-warning/10 rounded-full">
                <Clock className="w-5 h-5 text-health-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-xl font-bold">{alerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-full">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">People Affected</p>
                <p className="text-xl font-bold">~250</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const config = getSeverityConfig(alert.severity);
          
          return (
            <Card 
              key={alert.id} 
              className={`border-l-4 ${config.borderColor} ${
                alert.severity === 'high' ? 'pulse-alert' : 'health-card-hover'
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`text-2xl ${config.color}`}>
                      {config.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatTimeAgo(alert.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge variant={config.badge as any}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-foreground mb-4">{alert.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Affected:</span>
                      <span>{alert.affected}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Droplets className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">Source:</span>
                      <span>{alert.source}</span>
                    </div>
                  </div>
                </div>

                {alert.actions.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-sm mb-2">Recommended Actions:</p>
                    <ul className="space-y-1">
                      {alert.actions.map((action, index) => (
                        <li key={index} className="flex items-center space-x-2 text-sm">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {alert.severity === 'high' && (
                  <div className="mt-4 p-3 rounded-lg bg-health-danger/10 border border-health-danger/30">
                    <p className="text-sm font-medium text-health-danger">
                      🚨 URGENT: This is a high-priority alert requiring immediate attention
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {alerts.length === 0 && (
        <Card className="text-center py-8">
          <CardContent>
            <div className="space-y-3">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold">No Active Alerts</h3>
              <p className="text-muted-foreground">
                Great news! There are currently no health alerts for your area.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground mb-4">
          Stay vigilant and report any suspicious cases or water quality issues immediately.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Alerts
        </Button>
      </div>
    </div>
  );
};

export default CommunityAlerts;