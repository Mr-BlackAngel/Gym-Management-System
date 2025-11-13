import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dumbbell, Shuffle, Target, TrendingUp } from 'lucide-react';
import { Badge } from './ui/badge';

interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
}

const exerciseDatabase = {
  push: {
    beginner: [
      { name: 'Push-ups', sets: '3', reps: '8-10', rest: '60s' },
      { name: 'Dumbbell Bench Press', sets: '3', reps: '10-12', rest: '60s' },
      { name: 'Overhead Press', sets: '3', reps: '8-10', rest: '60s' },
      { name: 'Tricep Dips', sets: '3', reps: '8-10', rest: '60s' },
      { name: 'Lateral Raises', sets: '3', reps: '12-15', rest: '45s' },
    ],
    intermediate: [
      { name: 'Barbell Bench Press', sets: '4', reps: '8-10', rest: '90s' },
      { name: 'Incline Dumbbell Press', sets: '4', reps: '10-12', rest: '75s' },
      { name: 'Military Press', sets: '4', reps: '8-10', rest: '90s' },
      { name: 'Cable Flyes', sets: '3', reps: '12-15', rest: '60s' },
      { name: 'Tricep Pushdowns', sets: '3', reps: '12-15', rest: '60s' },
      { name: 'Front Raises', sets: '3', reps: '12-15', rest: '45s' },
    ],
    advanced: [
      { name: 'Bench Press (Heavy)', sets: '5', reps: '5-6', rest: '120s' },
      { name: 'Incline Barbell Press', sets: '4', reps: '6-8', rest: '90s' },
      { name: 'Weighted Dips', sets: '4', reps: '8-10', rest: '90s' },
      { name: 'Overhead Press', sets: '4', reps: '6-8', rest: '90s' },
      { name: 'Cable Crossovers', sets: '4', reps: '12-15', rest: '60s' },
      { name: 'Skull Crushers', sets: '3', reps: '10-12', rest: '60s' },
    ],
  },
  pull: {
    beginner: [
      { name: 'Lat Pulldowns', sets: '3', reps: '10-12', rest: '60s' },
      { name: 'Seated Cable Rows', sets: '3', reps: '10-12', rest: '60s' },
      { name: 'Dumbbell Rows', sets: '3', reps: '10-12', rest: '60s' },
      { name: 'Face Pulls', sets: '3', reps: '12-15', rest: '45s' },
      { name: 'Bicep Curls', sets: '3', reps: '10-12', rest: '45s' },
    ],
    intermediate: [
      { name: 'Pull-ups', sets: '4', reps: '8-10', rest: '90s' },
      { name: 'Barbell Rows', sets: '4', reps: '8-10', rest: '90s' },
      { name: 'T-Bar Rows', sets: '4', reps: '10-12', rest: '75s' },
      { name: 'Cable Rows', sets: '3', reps: '12-15', rest: '60s' },
      { name: 'Hammer Curls', sets: '3', reps: '10-12', rest: '60s' },
      { name: 'Reverse Flyes', sets: '3', reps: '12-15', rest: '45s' },
    ],
    advanced: [
      { name: 'Weighted Pull-ups', sets: '5', reps: '6-8', rest: '120s' },
      { name: 'Deadlifts', sets: '5', reps: '5-6', rest: '120s' },
      { name: 'Pendlay Rows', sets: '4', reps: '6-8', rest: '90s' },
      { name: 'Chest Supported Rows', sets: '4', reps: '10-12', rest: '75s' },
      { name: 'Preacher Curls', sets: '3', reps: '10-12', rest: '60s' },
      { name: 'Shrugs', sets: '4', reps: '12-15', rest: '60s' },
    ],
  },
  legs: {
    beginner: [
      { name: 'Goblet Squats', sets: '3', reps: '10-12', rest: '90s' },
      { name: 'Leg Press', sets: '3', reps: '12-15', rest: '75s' },
      { name: 'Leg Curls', sets: '3', reps: '12-15', rest: '60s' },
      { name: 'Leg Extensions', sets: '3', reps: '12-15', rest: '60s' },
      { name: 'Calf Raises', sets: '3', reps: '15-20', rest: '45s' },
    ],
    intermediate: [
      { name: 'Barbell Squats', sets: '4', reps: '8-10', rest: '120s' },
      { name: 'Romanian Deadlifts', sets: '4', reps: '8-10', rest: '90s' },
      { name: 'Walking Lunges', sets: '3', reps: '12-15', rest: '75s' },
      { name: 'Leg Press', sets: '4', reps: '12-15', rest: '75s' },
      { name: 'Hamstring Curls', sets: '3', reps: '12-15', rest: '60s' },
      { name: 'Standing Calf Raises', sets: '4', reps: '15-20', rest: '45s' },
    ],
    advanced: [
      { name: 'Barbell Squats (Heavy)', sets: '5', reps: '5-6', rest: '150s' },
      { name: 'Front Squats', sets: '4', reps: '6-8', rest: '120s' },
      { name: 'Bulgarian Split Squats', sets: '4', reps: '8-10', rest: '90s' },
      { name: 'Stiff-Leg Deadlifts', sets: '4', reps: '8-10', rest: '90s' },
      { name: 'Leg Press (Heavy)', sets: '4', reps: '10-12', rest: '90s' },
      { name: 'Seated Calf Raises', sets: '4', reps: '15-20', rest: '60s' },
    ],
  },
  arms: {
    beginner: [
      { name: 'Barbell Curls', sets: '3', reps: '10-12', rest: '60s' },
      { name: 'Tricep Pushdowns', sets: '3', reps: '10-12', rest: '60s' },
      { name: 'Hammer Curls', sets: '3', reps: '10-12', rest: '60s' },
      { name: 'Overhead Tricep Extension', sets: '3', reps: '10-12', rest: '60s' },
      { name: 'Wrist Curls', sets: '2', reps: '15-20', rest: '45s' },
    ],
    intermediate: [
      { name: 'EZ Bar Curls', sets: '4', reps: '8-10', rest: '75s' },
      { name: 'Close Grip Bench Press', sets: '4', reps: '8-10', rest: '90s' },
      { name: 'Incline Dumbbell Curls', sets: '3', reps: '10-12', rest: '60s' },
      { name: 'Skull Crushers', sets: '3', reps: '10-12', rest: '75s' },
      { name: 'Cable Curls', sets: '3', reps: '12-15', rest: '60s' },
      { name: 'Tricep Dips', sets: '3', reps: '10-12', rest: '75s' },
    ],
    advanced: [
      { name: 'Barbell Curls (Heavy)', sets: '5', reps: '6-8', rest: '90s' },
      { name: 'Weighted Dips', sets: '4', reps: '8-10', rest: '90s' },
      { name: 'Preacher Curls', sets: '4', reps: '8-10', rest: '75s' },
      { name: 'Close Grip Bench', sets: '4', reps: '6-8', rest: '90s' },
      { name: 'Concentration Curls', sets: '3', reps: '10-12', rest: '60s' },
      { name: 'Overhead Cable Extensions', sets: '3', reps: '12-15', rest: '60s' },
    ],
  },
  fullbody: {
    beginner: [
      { name: 'Squats', sets: '3', reps: '10-12', rest: '90s' },
      { name: 'Push-ups', sets: '3', reps: '8-10', rest: '60s' },
      { name: 'Dumbbell Rows', sets: '3', reps: '10-12', rest: '60s' },
      { name: 'Overhead Press', sets: '3', reps: '8-10', rest: '60s' },
      { name: 'Plank', sets: '3', reps: '30-45s', rest: '60s' },
    ],
    intermediate: [
      { name: 'Deadlifts', sets: '4', reps: '6-8', rest: '120s' },
      { name: 'Bench Press', sets: '4', reps: '8-10', rest: '90s' },
      { name: 'Pull-ups', sets: '4', reps: '8-10', rest: '90s' },
      { name: 'Lunges', sets: '3', reps: '12-15', rest: '75s' },
      { name: 'Military Press', sets: '3', reps: '8-10', rest: '75s' },
      { name: 'Hanging Leg Raises', sets: '3', reps: '10-12', rest: '60s' },
    ],
    advanced: [
      { name: 'Squats (Heavy)', sets: '5', reps: '5-6', rest: '150s' },
      { name: 'Deadlifts (Heavy)', sets: '5', reps: '5-6', rest: '150s' },
      { name: 'Bench Press', sets: '5', reps: '5-6', rest: '120s' },
      { name: 'Weighted Pull-ups', sets: '4', reps: '6-8', rest: '120s' },
      { name: 'Front Squats', sets: '4', reps: '8-10', rest: '120s' },
      { name: 'Barbell Rows', sets: '4', reps: '8-10', rest: '90s' },
    ],
  },
};

export default function ExerciseRandomizer() {
  const [split, setSplit] = useState('push');
  const [level, setLevel] = useState('intermediate');
  const [numExercises, setNumExercises] = useState('5');
  const [goal, setGoal] = useState('muscle');
  const [workout, setWorkout] = useState<Exercise[]>([]);

  const generateWorkout = () => {
    const exercises = exerciseDatabase[split as keyof typeof exerciseDatabase][level as keyof typeof exerciseDatabase.push];
    const count = parseInt(numExercises);
    
    // Shuffle and select exercises
    const shuffled = [...exercises].sort(() => Math.random() - 0.5);
    let selected = shuffled.slice(0, Math.min(count, exercises.length));

    // Adjust sets/reps based on goal
    selected = selected.map(exercise => {
      let sets = exercise.sets;
      let reps = exercise.reps;

      if (goal === 'strength') {
        // Lower reps, higher sets for strength
        const setNum = parseInt(sets) + 1;
        sets = setNum.toString();
        reps = reps.replace(/(\d+)-(\d+)/, (_, min, max) => {
          const newMin = Math.max(3, parseInt(min) - 3);
          const newMax = Math.max(5, parseInt(max) - 3);
          return `${newMin}-${newMax}`;
        });
      } else if (goal === 'endurance') {
        // Higher reps for endurance
        reps = reps.replace(/(\d+)-(\d+)/, (_, min, max) => {
          const newMin = parseInt(min) + 3;
          const newMax = parseInt(max) + 5;
          return `${newMin}-${newMax}`;
        });
      }

      return { ...exercise, sets, reps };
    });

    setWorkout(selected);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    generateWorkout();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Dumbbell className="size-6 text-orange-500" />
            </div>
            <div>
              <CardTitle>Workout Generator</CardTitle>
              <CardDescription>Generate a customized workout plan based on your preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Configuration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="split">Workout Split</Label>
                <Select value={split} onValueChange={setSplit}>
                  <SelectTrigger id="split">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="push">Push (Chest, Shoulders, Triceps)</SelectItem>
                    <SelectItem value="pull">Pull (Back, Biceps)</SelectItem>
                    <SelectItem value="legs">Legs (Quads, Hamstrings, Calves)</SelectItem>
                    <SelectItem value="arms">Arms (Biceps, Triceps, Forearms)</SelectItem>
                    <SelectItem value="fullbody">Full Body</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Experience Level</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger id="level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner (0-1 years)</SelectItem>
                    <SelectItem value="intermediate">Intermediate (1-3 years)</SelectItem>
                    <SelectItem value="advanced">Advanced (3+ years)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Training Goal</Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger id="goal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength">Strength (Low reps, high weight)</SelectItem>
                    <SelectItem value="muscle">Muscle Building (Moderate reps)</SelectItem>
                    <SelectItem value="endurance">Endurance (High reps, lower weight)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="exercises">Number of Exercises</Label>
                <Input
                  id="exercises"
                  type="number"
                  min="3"
                  max="8"
                  value={numExercises}
                  onChange={(e) => setNumExercises(e.target.value)}
                  required
                />
                <p className="text-slate-600">Choose between 3-8 exercises</p>
              </div>

              <Button type="submit" className="w-full">
                <Shuffle className="mr-2 size-4" />
                Generate Workout
              </Button>
            </form>

            {/* Generated Workout */}
            <div className="space-y-4">
              {workout.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-slate-900">Your Workout Plan</h3>
                    <Button onClick={generateWorkout} variant="outline" size="sm">
                      <Shuffle className="mr-2 size-4" />
                      Shuffle
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {workout.map((exercise, index) => (
                      <Card key={index} className="bg-gradient-to-r from-slate-50 to-orange-50">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="text-slate-900">{exercise.name}</h4>
                              <p className="text-slate-600">Exercise {index + 1}</p>
                            </div>
                            <Badge variant="outline" className="bg-white">
                              {exercise.rest} rest
                            </Badge>
                          </div>
                          <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                              <Target className="size-4 text-orange-500" />
                              <span>{exercise.sets} sets</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="size-4 text-orange-500" />
                              <span>{exercise.reps} reps</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardHeader>
                      <CardTitle>Workout Tips</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-slate-700">
                        <li>• Warm up for 5-10 minutes before starting</li>
                        <li>• Focus on proper form over heavy weight</li>
                        <li>• Rest between sets as indicated</li>
                        <li>• Stay hydrated throughout your workout</li>
                        <li>• Cool down and stretch after finishing</li>
                        <li>• Track your progress in each session</li>
                      </ul>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="h-full flex items-center justify-center bg-slate-50">
                  <CardContent className="text-center py-12">
                    <Dumbbell className="size-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600">Configure your workout and click Generate to see your plan</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}