import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dumbbell, Clock, Users, Star, Check, Zap, Shield, Trophy, Activity, Apple, Calculator, Ticket, MapPin } from 'lucide-react';
import OneDayPassBooking from './OneDayPassBooking';

interface GuestPortalProps {
  onJoinNow: () => void;
  onLogin: () => void;
}

const facilities = [
  { name: 'Treadmills', icon: Activity, count: '15+ Machines' },
  { name: 'Free Weights', icon: Dumbbell, count: '500+ lbs' },
  { name: 'Yoga Studio', icon: Users, count: 'Private Room' },
  { name: 'Cardio Zone', icon: Zap, count: '20+ Equipment' },
];

const classes = [
  { name: 'Morning Yoga', trainer: 'Priya Sharma', time: '6:00 AM - 7:00 AM', days: 'Mon, Wed, Fri' },
  { name: 'HIIT Training', trainer: 'Arjun Patel', time: '7:00 AM - 8:00 AM', days: 'Tue, Thu, Sat' },
  { name: 'Strength Training', trainer: 'Vikram Singh', time: '5:00 PM - 6:00 PM', days: 'Mon, Wed, Fri' },
  { name: 'Zumba Dance', trainer: 'Ananya Reddy', time: '6:00 PM - 7:00 PM', days: 'Tue, Thu' },
];

const trainers = [
  {
    name: 'Vikram Singh',
    specialization: 'Strength & Conditioning',
    experience: '8 years',
    rating: 4.9,
    image: '👨‍🏫'
  },
  {
    name: 'Priya Sharma',
    specialization: 'Yoga & Flexibility',
    experience: '6 years',
    rating: 4.8,
    image: '👩‍🏫'
  },
  {
    name: 'Arjun Patel',
    specialization: 'HIIT & Cardio',
    experience: '10 years',
    rating: 5.0,
    image: '👨‍💼'
  },
  {
    name: 'Ananya Reddy',
    specialization: 'Dance & Aerobics',
    experience: '5 years',
    rating: 4.7,
    image: '👩‍💼'
  },
];

const plans = [
  {
    name: 'Basic',
    price: '₹2,499',
    duration: 'per month',
    features: [
      'Access to gym equipment',
      'Locker room access',
      'Free WiFi',
      '2 guest passes per month',
    ],
  },
  {
    name: 'Premium',
    price: '₹4,999',
    duration: 'per month',
    features: [
      'All Basic features',
      'Unlimited group classes',
      'Personal training (2 sessions/month)',
      'Nutrition consultation',
      'Free gym merchandise',
    ],
    popular: true,
  },
  {
    name: 'VIP',
    price: '₹8,999',
    duration: 'per month',
    features: [
      'All Premium features',
      'Personal training (8 sessions/month)',
      'Priority class booking',
      'Spa & sauna access',
      'Custom meal plans',
      'Private locker',
    ],
  },
];

export default function GuestPortal({ onJoinNow, onLogin }: GuestPortalProps) {
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'one_day_pass' | 'gym_tour'>('one_day_pass');

  const handleBookOneDayPass = () => {
    setBookingType('one_day_pass');
    setBookingDialogOpen(true);
  };

  const handleBookTour = () => {
    setBookingType('gym_tour');
    setBookingDialogOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-slate-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Dumbbell className="size-8 text-orange-500" />
              <h1 className="text-white">AKHADA</h1>
            </div>
            <div className="flex items-center gap-4">
              <a href="#browse" className="hover:text-orange-500 transition-colors">Browse</a>
              <a href="#pricing" className="hover:text-orange-500 transition-colors">Pricing</a>
              <a href="#tools" className="hover:text-orange-500 transition-colors">Tools</a>
              <Button onClick={onLogin} variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900">
                Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-white mb-6">Transform Your Body, Transform Your Life</h1>
          <p className="text-slate-300 max-w-2xl mx-auto mb-8">
            Join AKHADA - where champions are made. Experience world-class facilities, expert trainers, 
            and a community dedicated to your fitness journey.
          </p>
          <div className="flex gap-4 justify-center">
            <Button onClick={onJoinNow} size="lg" className="bg-orange-500 hover:bg-orange-600">
              Join Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-slate-900" onClick={handleBookTour}>
              Take a Tour
            </Button>
          </div>
        </div>
      </section>

      {/* Browse Section */}
      <section id="browse" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          {/* Facilities */}
          <div className="mb-16">
            <h2 className="text-slate-900 text-center mb-2">Our Facilities</h2>
            <p className="text-slate-600 text-center mb-8">State-of-the-art equipment for all your fitness needs</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {facilities.map((facility) => (
                <Card key={facility.name} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <facility.icon className="size-12 mx-auto text-orange-500 mb-2" />
                    <CardTitle>{facility.name}</CardTitle>
                    <CardDescription>{facility.count}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>

          {/* Classes Schedule */}
          <div className="mb-16">
            <h2 className="text-slate-900 text-center mb-2">Class Schedule</h2>
            <p className="text-slate-600 text-center mb-8">Join our expert-led group classes</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {classes.map((classItem) => (
                <Card key={classItem.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{classItem.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-2">
                          <Users className="size-4" />
                          {classItem.trainer}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{classItem.days}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="size-4" />
                      {classItem.time}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Trainer Profiles */}
          <div>
            <h2 className="text-slate-900 text-center mb-2">Meet Our Trainers</h2>
            <p className="text-slate-600 text-center mb-8">Expert professionals dedicated to your success</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {trainers.map((trainer) => (
                <Card key={trainer.name} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="text-6xl mb-2">{trainer.image}</div>
                    <CardTitle>{trainer.name}</CardTitle>
                    <CardDescription>{trainer.specialization}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2 text-slate-600">
                        <Trophy className="size-4" />
                        {trainer.experience} experience
                      </div>
                      <div className="flex items-center justify-center gap-1">
                        <Star className="size-4 fill-orange-500 text-orange-500" />
                        <span>{trainer.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-slate-900 text-center mb-2">Choose Your Plan</h2>
          <p className="text-slate-600 text-center mb-8">Flexible membership options to fit your lifestyle</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <Card 
                key={plan.name} 
                className={`relative ${plan.popular ? 'border-orange-500 border-2 shadow-xl' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-orange-500">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-center">{plan.name}</CardTitle>
                  <div className="text-center mt-4">
                    <span className="text-slate-900">{plan.price}</span>
                    <span className="text-slate-600"> {plan.duration}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="size-5 text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={onJoinNow} 
                    className={`w-full ${plan.popular ? 'bg-orange-500 hover:bg-orange-600' : ''}`}
                  >
                    Join Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* One-Day Pass & Tour */}
          <div className="mt-12 max-w-4xl mx-auto">
            <h3 className="text-slate-900 text-center mb-6">Not Ready to Commit? Try Us Out!</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-orange-200 bg-gradient-to-br from-white to-orange-50 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500 p-3 rounded-lg">
                      <Ticket className="size-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-900">One Day Pass</CardTitle>
                      <CardDescription>Full gym access for 24 hours</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center py-4">
                    <span className="text-orange-600">₹500</span>
                    <span className="text-slate-600"> / day</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-slate-600">
                      <Check className="size-4 text-green-500" />
                      <span>Access all equipment</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <Check className="size-4 text-green-500" />
                      <span>Join group classes</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <Check className="size-4 text-green-500" />
                      <span>Locker & shower facilities</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <Check className="size-4 text-green-500" />
                      <span>Instant QR code ticket</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleBookOneDayPass} className="w-full bg-orange-500 hover:bg-orange-600">
                    <Ticket className="mr-2 size-4" />
                    Book One Day Pass
                  </Button>
                </CardFooter>
              </Card>

              <Card className="border-2 border-blue-200 bg-gradient-to-br from-white to-blue-50 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-500 p-3 rounded-lg">
                      <MapPin className="size-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-slate-900">Gym Tour</CardTitle>
                      <CardDescription>Guided facility walkthrough</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center py-4">
                    <span className="text-blue-600">₹200</span>
                    <span className="text-slate-600"> / tour</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-slate-600">
                      <Check className="size-4 text-green-500" />
                      <span>30-minute guided tour</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <Check className="size-4 text-green-500" />
                      <span>Meet our trainers</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <Check className="size-4 text-green-500" />
                      <span>Free consultation</span>
                    </li>
                    <li className="flex items-center gap-2 text-slate-600">
                      <Check className="size-4 text-green-500" />
                      <span>Instant booking confirmation</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleBookTour} variant="outline" className="w-full border-blue-500 text-blue-600 hover:bg-blue-50">
                    <MapPin className="mr-2 size-4" />
                    Book Gym Tour
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Preview Section */}
      <section id="tools" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-slate-900 text-center mb-2">Fitness Tools</h2>
          <p className="text-slate-600 text-center mb-8">Advanced tools to track and plan your fitness journey</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Calculator className="size-6 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle>Health Calculator</CardTitle>
                    <CardDescription>BMI, ideal weight & nutrition</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Calculate your BMI, ideal weight, calorie needs, and get personalized macronutrient breakdowns.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={onLogin} variant="outline" className="w-full">
                  Login to Access
                </Button>
              </CardFooter>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Dumbbell className="size-6 text-orange-500" />
                  </div>
                  <div>
                    <CardTitle>Workout Generator</CardTitle>
                    <CardDescription>Custom exercise plans</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Generate randomized workout routines based on your goals, split preferences, and experience level.
                </p>
              </CardContent>
              <CardFooter>
                <Button onClick={onLogin} variant="outline" className="w-full">
                  Login to Access
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dumbbell className="size-6 text-orange-500" />
            <h3 className="text-white">AKHADA</h3>
          </div>
          <p className="text-slate-400">Transform Your Body, Transform Your Life</p>
          <p className="text-slate-500 mt-4">© 2025 AKHADA Gym. All rights reserved.</p>
        </div>
      </footer>

      {/* Booking Dialog */}
      <OneDayPassBooking
        isOpen={bookingDialogOpen}
        onClose={() => setBookingDialogOpen(false)}
        bookingType={bookingType}
      />
    </div>
  );
}