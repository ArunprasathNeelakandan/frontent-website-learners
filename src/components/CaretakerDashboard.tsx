import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import {
  Users,
  Bell,
  Calendar as CalendarIcon,
  Mail,
  AlertTriangle,
  Check,
  Clock,
  Camera,
} from "lucide-react";
import NotificationSettings from "./NotificationSettings";
import { format, subDays, isToday, isBefore, startOfDay } from "date-fns";
import {
  GetMedicationHistory,
  apiUserSummury,
  getPatientApi,
} from "../api/api.js";
import { toast } from "sonner";
import Loading from "./Loading.jsx";

const CaretakerDashboard = () => {
  const [summary, setSummary] = useState({
    totalDays: 0,
    totalTaken: 0,
    missedDoses: 0,
    adherenceRate: 0,
    currentStreak: 0,
    patientName: "",
  });
  const [padientList, setPadientList] = useState([]);
  const [showPadients, setShowPadients] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [medicationHistory, setMedicationHistory] = useState([]);
  const [takenDates, setTakenDates] = useState<Set<string>>(new Set());
  var totalDays = "";
  var totalTaken = "";
  var missedDoses = "";
  const [showLoading, setShowLoading] = useState(false);

  const recentActivity = medicationHistory.slice(0, 7).map((entry) => ({
    date: entry.date_taken,
    taken: true,
    time: "8:00 AM",
    hasPhoto: entry.image || "",
  }));

  const dailyMedication = {
    name: "Daily Medication Set",
    time: "8:00 AM",
    status: takenDates.has(format(new Date(), "yyyy-MM-dd"))
      ? "completed"
      : "pending",
  };

  const handleSendReminderEmail = () => {
    console.log("Sending reminder email to patient...");
    alert("Reminder email sent to " + summary.patientName);
  };

  const handleConfigureNotifications = () => {
    setActiveTab("notifications");
  };

  const handleViewCalendar = () => {
    setActiveTab("calendar");
  };

  const fetchData = async () => {
    var res = await GetMedicationHistory(showPadients);
    setShowLoading(true);

    if (res.status === 200) {
      setMedicationHistory(res.data.data);
      const dates = res.data.data
        .filter((entry) => entry.date_taken)
        .map((entry) => entry.date_taken);
      setTakenDates(new Set(dates));
    } else {
      toast.error(res);
    }

    res = await apiUserSummury(showPadients);

    if (res.status === 200) {
      setSummary(res.data.data);
    } else {
      toast.error(res);
    }
    setShowLoading(false);
  };

  const fetchPatientData = async () => {
    const res = await getPatientApi();
    setShowLoading(true);
    if (res.status === 200) {
      setPadientList(res.data.data);
    } else {
      toast.error(res);
    }
    setShowLoading(false);
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  useEffect(() => {
    fetchData();
  }, [showPadients]);

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseInt(e.target.value, 10);
    setShowPadients(value);
  };

  const renderPatient = () => {
    if (padientList.length === 0) {
      return null;
    }

    return (
      <select
        name="patient"
        id="patient"
        className="border px-3 py-2 rounded"
        onChange={handlePatientChange}
        value={showPadients || ""}
      >
        {padientList.map((each, i) => (
          <option key={i} value={each.id}>
            {each.name}
          </option>
        ))}
      </select>
    );
  };

  return (
    <>
     {showLoading && <Loading/>}
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-8 text-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Caretaker Dashboard</h2>
              <p className="text-white/90 text-lg">
                Monitoring {summary.patientName}'s medication adherence
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">{summary.adherenceRate}%</div>
              <div className="text-white/80">Adherence Rate</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">{summary.currentStreak}</div>
              <div className="text-white/80">Current Streak</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">{summary.missedDoses}</div>
              <div className="text-white/80">Missed This Month</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold">
                {recentActivity.filter((a) => a.taken).length}
              </div>
              <div className="text-white/80">Taken This Week</div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Select patient
            </CardTitle>
          </CardHeader>
          <CardContent>{renderPatient()}</CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Today's Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                    Today's Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{dailyMedication.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {dailyMedication.time}
                      </p>
                    </div>
                    <Badge
                      variant={
                        dailyMedication.status === "pending"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {dailyMedication.status === "pending"
                        ? "Pending"
                        : "Completed"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={handleSendReminderEmail}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Reminder Email
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={handleConfigureNotifications}
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    Configure Notifications
                  </Button>
                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={handleViewCalendar}
                  >
                    <CalendarIcon className="w-4 h-4 mr-2" />
                    View Full Calendar
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Adherence Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Adherence Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center text-sm">
                  <div>
                    <div className="font-medium text-green-600">
                      {summary.totalTaken} days
                    </div>
                    <div className="text-muted-foreground">Taken</div>
                  </div>
                  <div>
                    <div className="font-medium text-red-600">
                      {summary.missedDoses} days
                    </div>
                    <div className="text-muted-foreground">Missed</div>
                  </div>
                  <div>
                    <div className="font-medium text-blue-600">
                      {30 - new Date().getDate()}
                    </div>
                    <div className="text-muted-foreground">
                      Remaining in this month
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Medication Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            activity.taken === true
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {activity.taken ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : (
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {format(new Date(activity.date), "EEEE, MMMM d")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {activity.taken
                              ? `Taken at ${activity.time}`
                              : "Medication missed"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {activity.hasPhoto && (
                          <Badge variant="outline">
                            <Camera className="w-3 h-3 mr-1" />
                            Photo
                          </Badge>
                        )}
                        {activity.hasPhoto && (
                          <a
                            href={`${import.meta.env.VITE_IMG_BASE_URL}${
                              activity.hasPhoto
                            }`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Badge variant="outline">View Photo</Badge>
                          </a>
                        )}
                        <Badge
                          variant={activity.taken ? "secondary" : "destructive"}
                        >
                          {activity.taken ? "Completed" : "Missed"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Medication Calendar Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-2 gap-6">
                  <div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => date && setSelectedDate(date)}
                      className="w-full"
                      modifiersClassNames={{
                        selected: "bg-blue-600 text-white hover:bg-blue-700",
                      }}
                      components={{
                        DayContent: ({ date }) => {
                          const dateStr = format(date, "yyyy-MM-dd");
                          const isTaken = takenDates.has(dateStr);
                          const isPast = isBefore(date, startOfDay(new Date()));
                          const isCurrentDay = isToday(date);

                          return (
                            <div className="relative w-full h-full flex items-center justify-center">
                              <span>{date.getDate()}</span>
                              {isTaken && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <Check className="w-2 h-2 text-white" />
                                </div>
                              )}
                              {!isTaken && isPast && !isCurrentDay && (
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-400 rounded-full"></div>
                              )}
                            </div>
                          );
                        },
                      }}
                    />

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Medication taken</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <span>Missed medication</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Today</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">
                      Details for {format(selectedDate, "MMMM d, yyyy")}
                    </h4>

                    <div className="space-y-4">
                      {takenDates.has(format(selectedDate, "yyyy-MM-dd")) ? (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Check className="w-5 h-5 text-green-600" />
                            <span className="font-medium text-green-800">
                              Medication Taken
                            </span>
                          </div>
                          <p className="text-sm text-green-700">
                            {summary.patientName} successfully took their
                            medication on this day.
                          </p>
                        </div>
                      ) : isBefore(selectedDate, startOfDay(new Date())) ? (
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <span className="font-medium text-red-800">
                              Medication Missed
                            </span>
                          </div>
                          <p className="text-sm text-red-700">
                            {summary.patientName} did not take their medication
                            on this day.
                          </p>
                        </div>
                      ) : isToday(selectedDate) ? (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="w-5 h-5 text-blue-600" />
                            <span className="font-medium text-blue-800">
                              Today
                            </span>
                          </div>
                          <p className="text-sm text-blue-700">
                            Monitor {summary.patientName}'s medication status
                            for today.
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <CalendarIcon className="w-5 h-5 text-gray-600" />
                            <span className="font-medium text-gray-800">
                              Future Date
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">
                            This date is in the future.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default CaretakerDashboard;
