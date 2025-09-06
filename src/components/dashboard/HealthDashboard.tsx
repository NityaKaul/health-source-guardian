import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Droplets, 
  AlertTriangle, 
  Users, 
  FileText,
  TestTube,
  Bell,
  LogOut,
  Plus
} from "lucide-react";
import CaseReportForm from "./CaseReportForm";
import WaterTestForm from "./WaterTestForm";
import CommunityAlerts from "./CommunityAlerts";

interface HealthDashboardProps {
  user: any;
  onLogout: () => void;
}

const HealthDashboard = ({ user, onLogout }: HealthDashboardProps) => {
  const [activeView, setActiveView] = useState<'overview' | 'case-report' | 'water-test' | 'alerts'>('overview');

  const stats = [
    {
      title: "Active Cases",
      value: "12",
      icon: Users,
      color: "text-health-warning",
      bgColor: "bg-health-warning/10"
    },
    {
      title: "Water Tests",
      value: "8",
      icon: TestTube,
      color: "text-health-water",
      bgColor: "bg-health-water/10"
    },
    {
      title: "Reports Filed",
      value: "25",
      icon: FileText,
      color: "text-primary",
      bgColor: "bg-primary/10"
    },
    {
      title: "Active Alerts",
      value: "3",
      icon: AlertTriangle,
      color: "text-health-danger",
      bgColor: "bg-health-danger/10"
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'case-report':
        return <CaseReportForm onBack={() => setActiveView('overview')} />;
      case 'water-test':
        return <WaterTestForm onBack={() => setActiveView('overview')} />;
      case 'alerts':
        return <CommunityAlerts onBack={() => setActiveView('overview')} />;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="health-card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3">
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button 
                    onClick={() => setActiveView('case-report')}
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <FileText className="w-8 h-8 text-primary" />
                    <div>
                      <div className="font-medium">Report Case</div>
                      <div className="text-sm text-muted-foreground">Submit new health case</div>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveView('water-test')}
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <TestTube className="w-8 h-8 text-health-water" />
                    <div>
                      <div className="font-medium">Water Quality</div>
                      <div className="text-sm text-muted-foreground">Log test results</div>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={() => setActiveView('alerts')}
                    variant="outline" 
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <Bell className="w-8 h-8 text-health-warning" />
                    <div>
                      <div className="font-medium">View Alerts</div>
                      <div className="text-sm text-muted-foreground">Community notifications</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { type: 'case', desc: 'Diarrhea case reported in Ward 5', time: '2 hours ago', status: 'urgent' },
                    { type: 'water', desc: 'Water quality test completed - Handpump #12', time: '4 hours ago', status: 'normal' },
                    { type: 'alert', desc: 'Cholera outbreak alert for nearby district', time: '6 hours ago', status: 'warning' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          activity.type === 'case' ? 'bg-health-warning/10' :
                          activity.type === 'water' ? 'bg-health-water/10' : 
                          'bg-health-danger/10'
                        }`}>
                          {activity.type === 'case' && <Users className="w-4 h-4 text-health-warning" />}
                          {activity.type === 'water' && <TestTube className="w-4 h-4 text-health-water" />}
                          {activity.type === 'alert' && <AlertTriangle className="w-4 h-4 text-health-danger" />}
                        </div>
                        <div>
                          <p className="font-medium">{activity.desc}</p>
                          <p className="text-sm text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                      <Badge variant={activity.status === 'urgent' ? 'destructive' : 'outline'}>
                        {activity.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Droplets className="w-8 h-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold font-merriweather">ASHA Health Platform</h1>
                <p className="text-sm text-muted-foreground">Water-borne Disease Surveillance</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden md:block">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.role}</p>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {activeView === 'overview' && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-merriweather mb-2">
              Welcome back, {user.name.split(' ')[0]}!
            </h2>
            <p className="text-muted-foreground">
              Stay alert and save lives. Monitor your community's health status below.
            </p>
          </div>
        )}
        
        {renderContent()}
      </main>
    </div>
  );
};

export default HealthDashboard;