import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar, Clock, Users, User } from 'lucide-react';

const classes = [
  {
    id: 1,
    name: 'Morning Yoga',
    trainer: 'Priya Sharma',
    time: '6:00 AM - 7:00 AM',
    date: 'Tomorrow',
    spots: 5,
    maxSpots: 15,
    level: 'All Levels',
  },
  {
    id: 2,
    name: 'HIIT Training',
    trainer: 'Arjun Patel',
    time: '7:00 AM - 8:00 AM',
    date: 'Tomorrow',
    spots: 2,
    maxSpots: 12,
    level: 'Intermediate',
  },
  {
    id: 3,
    name: 'Strength Training',
    trainer: 'Vikram Singh',
    time: '5:00 PM - 6:00 PM',
    date: 'Today',
    spots: 8,
    maxSpots: 15,
    level: 'All Levels',
  },
  {
    id: 4,
    name: 'Zumba Dance',
    trainer: 'Ananya Reddy',
    time: '6:00 PM - 7:00 PM',
    date: 'Today',
    spots: 3,
    maxSpots: 20,
    level: 'Beginner',
  },
  {
    id: 5,
    name: 'Pilates Core',
    trainer: 'Priya Sharma',
    time: '8:00 AM - 9:00 AM',
    date: 'Nov 12',
    spots: 10,
    maxSpots: 12,
    level: 'All Levels',
  },
  {
    id: 6,
    name: 'Boxing Cardio',
    trainer: 'Arjun Patel',
    time: '6:30 PM - 7:30 PM',
    date: 'Nov 12',
    spots: 1,
    maxSpots: 10,
    level: 'Advanced',
  },
];

export default function ClassBooking() {
  const [bookedClasses, setBookedClasses] = useState<number[]>([1, 3]);

  const handleBook = (classId: number) => {
    if (bookedClasses.includes(classId)) {
      setBookedClasses(bookedClasses.filter(id => id !== classId));
    } else {
      setBookedClasses([...bookedClasses, classId]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Calendar className="size-6 text-orange-500" />
            </div>
            <div>
              <CardTitle>Class Schedule & Booking</CardTitle>
              <CardDescription>Browse and book group fitness classes</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {classes.map((classItem) => {
              const isBooked = bookedClasses.includes(classItem.id);
              const isFull = classItem.spots === 0;
              
              return (
                <Card key={classItem.id} className={`${isBooked ? 'border-orange-500 border-2' : ''}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{classItem.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <User className="size-4" />
                          {classItem.trainer}
                        </CardDescription>
                      </div>
                      <Badge variant={classItem.level === 'Beginner' ? 'outline' : 'default'}>
                        {classItem.level}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="size-4" />
                        {classItem.date}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="size-4" />
                        {classItem.time}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-slate-600" />
                      <span className="text-slate-600">
                        {classItem.spots} spots left of {classItem.maxSpots}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {isBooked ? (
                        <Button 
                          onClick={() => handleBook(classItem.id)}
                          variant="outline" 
                          className="flex-1 border-orange-500 text-orange-500"
                        >
                          Cancel Booking
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleBook(classItem.id)}
                          disabled={isFull}
                          className="flex-1"
                        >
                          {isFull ? 'Class Full' : 'Book Now'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}