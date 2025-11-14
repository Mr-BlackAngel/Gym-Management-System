import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog } from './ui/dialog';
import { Badge } from './ui/badge';
import { CheckCircle, Ticket, Download, Mail, Phone, User, CreditCard } from 'lucide-react';
import { generateOTP, generateBookingID, supabase, isSupabaseConnected } from '../lib/supabase';
import { QRCodeSVG } from 'qrcode.react';
import { SolidDialogContent } from "./ui/solid-dialog";

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
    if (!name || !phone || !email) return alert('Please fill all details');
    if (!phone.match(/^(\+91)?[6-9]\d{9}$/)) return alert('Invalid phone number');
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return alert('Invalid email');

    const otp = generateOTP();
    setGeneratedOTP(otp);
    setStep('otp');

    alert(`Your OTP is: ${otp}`);
  };

  const handleVerifyOTP = () => {
    if (enteredOTP === generatedOTP) setStep('payment');
    else {
      alert('Incorrect OTP');
      setEnteredOTP('');
    }
  };

  const handlePayment = async () => {
    setLoading(true);

    setTimeout(async () => {
      const newBookingID = generateBookingID();
      setBookingID(newBookingID);

      const qrString = JSON.stringify({
        bookingId: newBookingID,
        name,
        type: bookingType,
        date: new Date().toLocaleDateString('en-IN'),
        amount,
      });

      setQrData(qrString);

      if (isSupabaseConnected && supabase) {
        await supabase.from('one_day_passes').insert([
          {
            name,
            phone,
            email,
            booking_type: bookingType,
            otp: generatedOTP,
            payment_status: 'completed',
            amount,
            booking_date: new Date().toISOString(),
            qr_code: qrString,
          },
        ]);
      }

      setLoading(false);
      setStep('ticket');
    }, 1800);
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
Show this ticket at the gym entrance.
`;

    const blob = new Blob([ticketData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AKHADA_${bookingType}_${bookingID}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetAndClose = () => {
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
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <SolidDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">

        {/* HEADER */}
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Ticket className="size-6 text-orange-500" />
            <h2 className="text-xl font-semibold text-slate-900">Book {title}</h2>
          </div>
          <p className="text-slate-600 text-sm mt-1">
            {bookingType === 'one_day_pass'
              ? 'Access full gym facilities for one day — ₹500'
              : 'Guided gym tour — ₹200'}
          </p>
        </div>

        {/* STEP 1 — DETAILS */}
        {step === 'details' && (
          <div className="space-y-4">

            {/* Name */}
            <div className="space-y-2">
              <Label>Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 size-4 text-slate-400" />
                <Input
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 size-4 text-slate-400" />
                <Input
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 size-4 text-slate-400" />
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* SUMMARY CARD */}
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-slate-900">{title}</p>
                    <p className="text-slate-600 text-sm">Valid for one day</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-orange-600">₹{amount}</p>
                    <Badge className="bg-orange-500 mt-1">Pay at Venue</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleSendOTP}
              className="w-full bg-orange-500 hover:bg-orange-600"
            >
              Send OTP
            </Button>
          </div>
        )}

        {/* STEP 2 — OTP */}
        {step === 'otp' && (
          <div className="space-y-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <CheckCircle className="size-5 text-green-600 mt-1" />
                  <div>
                    <p className="font-medium text-slate-900">OTP Sent!</p>
                    <p className="text-slate-600 text-sm">Enter the 6-digit OTP sent to {phone}</p>
                    <p className="font-semibold text-green-700 mt-1">{generatedOTP}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Input
              placeholder="Enter OTP"
              maxLength={6}
              value={enteredOTP}
              onChange={(e) => setEnteredOTP(e.target.value)}
              className="text-center text-2xl tracking-widest"
            />

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={() => setStep('details')}>
                Back
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleVerifyOTP}
                disabled={enteredOTP.length !== 6}
              >
                Verify OTP
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3 — PAYMENT */}
        {step === 'payment' && (
          <div className="space-y-4">

            {/* Verified */}
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <CheckCircle className="size-5 text-green-600 mt-1" />
                  <p className="font-medium text-slate-900">Phone Verified!</p>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="border-2 border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-white">
                <CardTitle className="text-slate-900">Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="flex justify-between"><span>Name:</span> <span>{name}</span></p>
                <p className="flex justify-between"><span>Phone:</span> <span>{phone}</span></p>
                <p className="flex justify-between"><span>Email:</span> <span>{email}</span></p>
                <p className="flex justify-between"><span>Type:</span> <Badge className="bg-orange-500">{title}</Badge></p>
                <p className="flex justify-between font-medium border-t pt-2">
                  <span>Total:</span> <span className="text-orange-600">₹{amount}</span>
                </p>
              </CardContent>
            </Card>

            {/* Payment Info */}
            <Card className="bg-white-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex gap-3">
                  <CreditCard className="size-5 text-blue-600 mt-1" />
                  <div>
                    <p className="font-medium text-slate-900">Payment Method</p>
                    <p className="text-slate-600 text-sm">Pay at the gym entrance (Cash/UPI/Card)</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </Button>
          </div>
        )}

        {/* STEP 4 — TICKET */}
        {step === 'ticket' && (
          <div className="space-y-4">

            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4 flex justify-center items-center gap-2">
                <CheckCircle className="size-6 text-green-600" />
                <p className="text-green-900 font-medium">Booking Confirmed!</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-orange-300 bg-gradient-to-br from-white to-orange-50">
              <CardHeader className="text-center border-b border-orange-200 bg-orange-500 text-white">
                <CardTitle>AKHADA GYM</CardTitle>
                <CardDescription className="text-white/90">{title}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-6">
                <div className="flex justify-center p-4 bg-white rounded-lg border-2 border-orange-200">
                  {qrData && <QRCodeSVG value={qrData} size={200} />}
                </div>

                <div className="space-y-2 bg-white p-4 rounded-lg border border-slate-200">
                  <p className="flex justify-between"><span>Booking ID:</span> <span>{bookingID}</span></p>
                  <p className="flex justify-between"><span>Name:</span> <span>{name}</span></p>
                  <p className="flex justify-between"><span>Phone:</span> <span>{phone}</span></p>
                  <p className="flex justify-between"><span>Date:</span> <span>{new Date().toLocaleDateString('en-IN')}</span></p>
                  <p className="flex justify-between"><span>Amount:</span> <span className="text-orange-600">₹{amount}</span></p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-center text-yellow-800">
                  📱 Show this QR code at the gym entrance
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1" onClick={handleDownloadTicket}>
                <Download className="size-4 mr-2" /> Download Ticket
              </Button>
              <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={resetAndClose}>
                Done
              </Button>
            </div>
          </div>
        )}

      </SolidDialogContent>
    </Dialog>
  );
}
