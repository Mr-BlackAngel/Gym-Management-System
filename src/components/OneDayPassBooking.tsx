import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { CheckCircle, Ticket, QrCode, Download, Mail, Phone, User, CreditCard } from 'lucide-react';
import { generateOTP, generateBookingID, supabase, isSupabaseConnected } from '../lib/supabase';
import { QRCodeSVG } from 'qrcode.react';

interface OneDayPassBookingProps {
  isOpen: boolean;
  onClose: () => void;
  bookingType: 'one_day_pass' | 'gym_tour';
}

export default function OneDayPassBooking({ isOpen, onClose, bookingType }: OneDayPassBookingProps) {
  const [step, setStep] = useState<'details' | 'otp' | 'payment' | 'ticket'>('details');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [generatedOTP, setGeneratedOTP] = useState('');
  const [enteredOTP, setEnteredOTP] = useState('');
  const [bookingID, setBookingID] = useState('');
  const [qrData, setQrData] = useState('');
  const [loading, setLoading] = useState(false);

  const amount = bookingType === 'one_day_pass' ? 500 : 200;
  const title = bookingType === 'one_day_pass' ? 'One Day Pass' : 'Gym Tour';

  const handleSendOTP = () => {
    if (!name || !phone || !email) {
      alert('Please fill all details');
      return;
    }

    if (!phone.match(/^(\+91)?[6-9]\d{9}$/)) {
      alert('Please enter a valid Indian phone number');
      return;
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      alert('Please enter a valid email');
      return;
    }

    const otp = generateOTP();
    setGeneratedOTP(otp);
    setStep('otp');
    
    // In real app, send OTP via SMS/Email
    alert(`Your OTP is: ${otp} (In production, this will be sent via SMS)`);
  };

  const handleVerifyOTP = () => {
    if (enteredOTP === generatedOTP) {
      setStep('payment');
    } else {
      alert('Invalid OTP. Please try again.');
      setEnteredOTP('');
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      const newBookingID = generateBookingID();
      setBookingID(newBookingID);
      
      // Generate QR code data
      const qrString = JSON.stringify({
        bookingId: newBookingID,
        name: name,
        type: bookingType,
        date: new Date().toLocaleDateString('en-IN'),
        amount: amount,
      });
      setQrData(qrString);

      // Save to database only if Supabase is connected
      if (isSupabaseConnected && supabase) {
        try {
          const { error } = await supabase.from('one_day_passes').insert([
            {
              name: name,
              phone: phone,
              email: email,
              booking_type: bookingType,
              otp: generatedOTP,
              payment_status: 'completed',
              amount: amount,
              booking_date: new Date().toISOString(),
              qr_code: qrString,
            },
          ]);

          if (error) {
            console.error('Database error:', error);
          }
        } catch (err) {
          console.error('Error saving to database:', err);
        }
      } else {
        console.log('Running in offline mode - booking saved locally');
      }

      setLoading(false);
      setStep('ticket');
    }, 2000);
  };

  const handleDownloadTicket = () => {
    const ticketData = `
AKHADA GYM - ${title.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Booking ID: ${bookingID}
Name: ${name}
Phone: ${phone}
Email: ${email}
Date: ${new Date().toLocaleDateString('en-IN')}
Amount Paid: ₹${amount}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Please show this ticket at the gym entrance.
Valid for one day only.
    `;

    const blob = new Blob([ticketData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AKHADA_${bookingType}_${bookingID}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setStep('details');
    setName('');
    setPhone('');
    setEmail('');
    setGeneratedOTP('');
    setEnteredOTP('');
    setBookingID('');
    setQrData('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            <Ticket className="size-6 text-orange-500" />
            Book {title}
          </DialogTitle>
          <DialogDescription>
            {bookingType === 'one_day_pass' 
              ? 'Access all gym facilities for one day - ₹500' 
              : 'Take a guided tour of our gym - ₹200'}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Enter Details */}
        {step === 'details' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 size-4 text-slate-400" />
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 size-4 text-slate-400" />
                <Input
                  id="phone"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 size-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{title}</p>
                    <p className="text-slate-600">Valid for one day</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-orange-600">₹{amount}</p>
                    <Badge className="bg-orange-500 mt-1">Pay at venue</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleSendOTP} 
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Send OTP to Verify
            </Button>
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {step === 'otp' && (
          <div className="space-y-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="size-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">OTP Sent!</p>
                    <p className="text-slate-600">
                      We've sent a 6-digit OTP to {phone}
                    </p>
                    <p className="text-green-600 font-medium mt-2">
                      Your OTP: {generatedOTP}
                    </p>
                    <p className="text-slate-500">(In production, this will be sent via SMS)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                placeholder="Enter 6-digit OTP"
                value={enteredOTP}
                onChange={(e) => setEnteredOTP(e.target.value)}
                maxLength={6}
                className="text-center text-2xl tracking-widest"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => setStep('details')}
                className="flex-1"
              >
                Back
              </Button>
              <Button 
                onClick={handleVerifyOTP}
                disabled={enteredOTP.length !== 6}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Verify OTP
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 'payment' && (
          <div className="space-y-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="size-5 text-green-600" />
                  <p className="font-medium text-slate-900">Phone Verified Successfully!</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
                <CardTitle className="text-slate-900">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Name:</span>
                  <span className="font-medium">{name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Phone:</span>
                  <span className="font-medium">{phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Email:</span>
                  <span className="font-medium">{email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Booking Type:</span>
                  <Badge className="bg-orange-500">{title}</Badge>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="font-medium text-slate-900">Total Amount:</span>
                  <span className="font-medium text-orange-600">₹{amount}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <CreditCard className="size-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-900">Payment Method</p>
                    <p className="text-slate-600">
                      Pay ₹{amount} at the gym entrance
                    </p>
                    <p className="text-slate-500 mt-1">
                      Cash, UPI, and Card accepted
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </Button>
          </div>
        )}

        {/* Step 4: Ticket with QR */}
        {step === 'ticket' && (
          <div className="space-y-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex items-center gap-3 justify-center">
                  <CheckCircle className="size-6 text-green-600" />
                  <p className="font-medium text-green-900">Booking Confirmed!</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-300 bg-gradient-to-br from-white to-orange-50">
              <CardHeader className="text-center border-b border-orange-200 bg-orange-500 text-white">
                <CardTitle>AKHADA GYM</CardTitle>
                <CardDescription className="text-white/90">{title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                {/* QR Code */}
                <div className="flex justify-center p-4 bg-white rounded-lg border-2 border-orange-200">
                  {qrData && <QRCodeSVG value={qrData} size={200} />}
                </div>

                {/* Booking Details */}
                <div className="space-y-2 bg-white p-4 rounded-lg border border-slate-200">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Booking ID:</span>
                    <span className="font-mono font-medium">{bookingID}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Name:</span>
                    <span className="font-medium">{name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Phone:</span>
                    <span className="font-medium">{phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Amount:</span>
                    <span className="font-medium text-orange-600">₹{amount}</span>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                  <p className="text-yellow-800 text-center">
                    📱 Show this QR code at the gym entrance
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button 
                onClick={handleDownloadTicket}
                variant="outline"
                className="flex-1"
              >
                <Download className="mr-2 size-4" />
                Download Ticket
              </Button>
              <Button 
                onClick={handleClose}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}