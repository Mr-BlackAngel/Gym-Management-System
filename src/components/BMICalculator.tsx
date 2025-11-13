import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calculator, Activity, Target, TrendingUp, Apple } from 'lucide-react';

export default function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('moderate');
  const [goal, setGoal] = useState('maintain');
  const [results, setResults] = useState<any>(null);

  const calculateResults = () => {
    const heightM = parseFloat(height) / 100;
    const weightKg = parseFloat(weight);
    const ageYears = parseInt(age);

    // BMI Calculation
    const bmi = weightKg / (heightM * heightM);

    // Ideal Weight (Devine Formula)
    const idealWeight = gender === 'male' 
      ? 50 + 2.3 * ((parseFloat(height) / 2.54) - 60)
      : 45.5 + 2.3 * ((parseFloat(height) / 2.54) - 60);

    // BMR (Basal Metabolic Rate) - Mifflin-St Jeor Equation
    let bmr;
    if (gender === 'male') {
      bmr = 10 * weightKg + 6.25 * parseFloat(height) - 5 * ageYears + 5;
    } else {
      bmr = 10 * weightKg + 6.25 * parseFloat(height) - 5 * ageYears - 161;
    }

    // Activity Multiplier
    const activityMultipliers: { [key: string]: number } = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const tdee = bmr * activityMultipliers[activityLevel];

    // Goal-based calorie adjustment
    let targetCalories = tdee;
    if (goal === 'lose') targetCalories -= 500;
    if (goal === 'gain') targetCalories += 500;

    // Macronutrient breakdown (40% carbs, 30% protein, 30% fat for balanced)
    const protein = (targetCalories * 0.30) / 4; // 4 cal per gram
    const carbs = (targetCalories * 0.40) / 4; // 4 cal per gram
    const fats = (targetCalories * 0.30) / 9; // 9 cal per gram

    // BMI Category
    let bmiCategory = '';
    let bmiColor = '';
    if (bmi < 18.5) {
      bmiCategory = 'Underweight';
      bmiColor = 'text-blue-600';
    } else if (bmi < 25) {
      bmiCategory = 'Normal';
      bmiColor = 'text-green-600';
    } else if (bmi < 30) {
      bmiCategory = 'Overweight';
      bmiColor = 'text-orange-600';
    } else {
      bmiCategory = 'Obese';
      bmiColor = 'text-red-600';
    }

    setResults({
      bmi: bmi.toFixed(1),
      bmiCategory,
      bmiColor,
      idealWeight: idealWeight.toFixed(1),
      bmr: Math.round(bmr),
      tdee: Math.round(tdee),
      targetCalories: Math.round(targetCalories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateResults();
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Calculator className="size-6 text-orange-500" />
            </div>
            <div>
              <CardTitle>Health & Nutrition Calculator</CardTitle>
              <CardDescription>Calculate your BMI, ideal weight, and personalized nutrition plan</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="e.g., 175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="e.g., 70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger id="gender">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity">Activity Level</Label>
                <Select value={activityLevel} onValueChange={setActivityLevel}>
                  <SelectTrigger id="activity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                    <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                    <SelectItem value="veryActive">Very Active (2x per day)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal">Fitness Goal</Label>
                <Select value={goal} onValueChange={setGoal}>
                  <SelectTrigger id="goal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose">Lose Weight</SelectItem>
                    <SelectItem value="maintain">Maintain Weight</SelectItem>
                    <SelectItem value="gain">Gain Weight/Muscle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full">
                Calculate
              </Button>
            </form>

            {/* Results */}
            <div className="space-y-4">
              {results ? (
                <>
                  <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="size-5 text-orange-600" />
                        BMI Results
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>Your BMI:</span>
                          <span className={`${results.bmiColor}`}>{results.bmi}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Category:</span>
                          <span className={`${results.bmiColor}`}>{results.bmiCategory}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Ideal Weight:</span>
                          <span>{results.idealWeight} kg</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="size-5 text-blue-600" />
                        Calorie Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span>BMR (Base):</span>
                          <span>{results.bmr} cal/day</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>TDEE (Total):</span>
                          <span>{results.tdee} cal/day</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Target Calories:</span>
                          <span className="text-blue-600">{results.targetCalories} cal/day</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Apple className="size-5 text-green-600" />
                        Macronutrient Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span>Protein (30%):</span>
                            <span>{results.protein}g/day</span>
                          </div>
                          <div className="h-2 bg-green-200 rounded-full">
                            <div className="h-2 bg-green-600 rounded-full" style={{ width: '30%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span>Carbs (40%):</span>
                            <span>{results.carbs}g/day</span>
                          </div>
                          <div className="h-2 bg-green-200 rounded-full">
                            <div className="h-2 bg-green-600 rounded-full" style={{ width: '40%' }} />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span>Fats (30%):</span>
                            <span>{results.fats}g/day</span>
                          </div>
                          <div className="h-2 bg-green-200 rounded-full">
                            <div className="h-2 bg-green-600 rounded-full" style={{ width: '30%' }} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="size-5 text-purple-600" />
                        Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-slate-700">
                        <li>• Stay hydrated - drink at least 8 glasses of water daily</li>
                        <li>• Eat 5-6 small meals throughout the day</li>
                        <li>• Include lean proteins in every meal</li>
                        <li>• Choose complex carbs over simple sugars</li>
                        <li>• Get 7-9 hours of quality sleep</li>
                        <li>• Track your progress weekly</li>
                      </ul>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card className="h-full flex items-center justify-center bg-slate-50">
                  <CardContent className="text-center py-12">
                    <Calculator className="size-12 mx-auto text-slate-400 mb-4" />
                    <p className="text-slate-600">Enter your information and click Calculate to see your results</p>
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