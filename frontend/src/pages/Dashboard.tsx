import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { Training, trainingService } from "../services/training";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";

export function Dashboard() {
  const navigate = useNavigate();
  const [myTrainings, setMyTrainings] = useState<Training[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/");
      return;
    }

    const fetchMyTrainings = async () => {
      try {
        const data = await trainingService.getMyTrainings();
        setMyTrainings(data);
      } catch (error) {
        console.error("Failed to fetch my trainings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMyTrainings();
  }, [navigate]);

  return (
    <div className="space-y-8 py-8 max-w-6xl mx-auto px-4">
      <h1 className="text-4xl font-heading text-black dark:text-white">
        STUDENT DASHBOARD
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="bg-neo-blue dark:bg-neo-blue text-white border-black dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Active Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-heading text-white">PRO FIGHTER</p>
            <p className="text-sm mt-2 opacity-90">Valid until Dec 31, 2025</p>
          </CardContent>
        </Card>

        <Card className="bg-neo-pink dark:bg-neo-pink text-white border-black dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Next Workout</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-heading text-white">LEG DAY</p>
            <Button className="mt-4 bg-white text-black border-2 border-black shadow-neo-sm hover:translate-x-[-2px] hover:translate-y-[-2px]">
              START NOW
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-black dark:border-gray-600">
          <CardHeader>
            <CardTitle className="text-black dark:text-white">
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-black dark:text-white">
                <span>Weekly Goal</span>
                <span>3/5</span>
              </div>
              <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-full border-2 border-black dark:border-gray-600 overflow-hidden">
                <div className="h-full bg-neo-green w-[60%]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-heading text-black dark:text-white">
          MY TRAININGS
        </h2>
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-neo-blue" />
          </div>
        ) : (
          <div className="grid gap-4">
            {myTrainings.length === 0 ? (
              <p className="text-muted-foreground dark:text-gray-400">
                No trainings found.
              </p>
            ) : (
              myTrainings.map((training) => (
                <div
                  key={training.id}
                  className="bg-white dark:bg-gray-800 p-4 border-3 border-black dark:border-gray-600 rounded-base shadow-neo flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold text-lg text-black dark:text-white">
                      {training.titulo}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {training.descricao}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    VIEW DETAILS
                  </Button>
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
