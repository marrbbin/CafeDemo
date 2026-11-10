import React, { useState } from 'react';
import { Business, MenuItem, Reservation } from '../types/database';
import { insertReservation } from '../lib/supabase';
import { X, Calendar, Clock, User, Phone, CheckCircle2, AlertCircle, Sparkles, MapPin } from 'lucide-react';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: Business;
  preselectedItem?: MenuItem | null;
  onSuccess?: (reservation: Reservation) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  business,
  preselectedItem,
  onSuccess
}) => {
  // Default reservation time to tomorrow at 14:00
  const getDefaultDateTime = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);
    // Format to YYYY-MM-DDThh:mm for datetime-local input
    const pad = (n: number) => (n < 10 ? '0' + n : n);
    return `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(tomorrow.getDate())}T${pad(tomorrow.getHours())}:${pad(tomorrow.getMinutes())}`;
  };

  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [reservationTime, setReservationTime] = useState(getDefaultDateTime());
  const [partySize, setPartySize] = useState<number>(2);
  const [specialNotes, setSpecialNotes] = useState(
    preselectedItem ? `Reserved to enjoy: ${preselectedItem.name}` : ''
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<Reservation | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!customerName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    
    // Philippine phone number validation (639 format)
    const cleanedPhone = contactNumber.replace(/[\s\-()]/g, '');
    const isPhilippineNumber = /^((\+?639\d{9})|(09\d{9})|(9\d{9}))$/.test(cleanedPhone);
    if (!isPhilippineNumber) {
      setErrorMessage('Please enter a valid Philippine mobile number in 639 format (e.g., +63 917 123 4567 or 09171234567).');
      return;
    }

    if (!reservationTime) {
      setErrorMessage('Please select a reservation date and time.');
      return;
    }

    try {
      setIsSubmitting(true);

      // Convert local datetime to ISO string for Supabase timestamptz column
      const isoReservationTime = new Date(reservationTime).toISOString();

      // Execute Supabase INSERT into reservations table utilizing current business_id
      const result = await insertReservation({
        business_id: business.id,
        customer_name: customerName.trim(),
        contact_number: contactNumber.trim(),
        reservation_time: isoReservationTime,
        status: 'pending',
        party_size: partySize,
        special_notes: specialNotes.trim() || undefined
      });

      if (result.success && result.data) {
        setSubmittedData(result.data);
        if (onSuccess) onSuccess(result.data);
      } else {
        setErrorMessage(result.error || 'Failed to submit reservation. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while booking.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCustomerName('');
    setContactNumber('');
    setReservationTime(getDefaultDateTime());
    setSpecialNotes('');
    setSubmittedData(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={handleResetAndClose}
    >
      <div 
        className="bg-[#F9F6F0] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#7A4B3A]/20 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#231F20]/60 hover:text-[#231F20] hover:bg-black/5 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submittedData ? (
          <div>
            {/* Header */}
            <div className="mb-6 flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#7A4B3A]/20 p-1.5 shrink-0 overflow-hidden shadow-xs">
                <img
                  src="/assets/aistudio/logo_0a74d961.jpg"
                  alt="SandBox Cafe"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-xs uppercase font-serif tracking-widest text-[#7A4B3A] font-semibold block mb-0.5">
                  Table Reservation &bull; SandBox Cafe
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#231F20] font-normal">
                  Reserve Your Table
                </h2>
                <p className="text-xs text-[#231F20]/70 mt-0.5">
                  Cadiz City Sanctuary &bull; Held for 15 minutes upon arrival
                </p>
              </div>
            </div>

            {/* Preselected menu item banner if launched from an item */}
            {preselectedItem && (
              <div className="mb-5 p-3 rounded-2xl bg-[#7A4B3A]/10 border border-[#7A4B3A]/20 flex items-center gap-3">
                <img
                  src={preselectedItem.image_url}
                  alt={preselectedItem.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="text-xs">
                  <span className="text-[#7A4B3A] font-medium block">Special Table Brew</span>
                  <strong className="text-[#231F20] font-serif text-sm block">{preselectedItem.name}</strong>
                </div>
              </div>
            )}

            {/* Error banner */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Reservation Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#231F20]/80 mb-1.5 font-sans">
                  Customer Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#7A4B3A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Maria Santos"
                    className="w-full bg-white border border-[#7A4B3A]/25 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#231F20] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7A4B3A]/40 transition-all"
                  />
                </div>
              </div>

              {/* Contact Number (639 format) */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#231F20]/80 font-sans">
                    Contact Number (639 Format) *
                  </label>
                  <span className="text-[10px] text-[#7A4B3A] font-mono">+63 9XX XXX XXXX</span>
                </div>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#7A4B3A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="e.g. +63 917 123 4567 or 09171234567"
                    className="w-full bg-white border border-[#7A4B3A]/25 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#231F20] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7A4B3A]/40 transition-all font-mono"
                  />
                </div>
                <p className="text-[10px] text-stone-500 mt-1">
                  Philippine mobile format accepted (+639..., 639..., or 09...)
                </p>
              </div>

              {/* Date & Time Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#231F20]/80 mb-1.5 font-sans">
                    Date & Time *
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#7A4B3A] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="datetime-local"
                      required
                      value={reservationTime}
                      onChange={(e) => setReservationTime(e.target.value)}
                      className="w-full bg-white border border-[#7A4B3A]/25 rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#231F20] focus:outline-none focus:ring-2 focus:ring-[#7A4B3A]/40 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#231F20]/80 mb-1.5 font-sans">
                    Party Size
                  </label>
                  <select
                    value={partySize}
                    onChange={(e) => setPartySize(Number(e.target.value))}
                    className="w-full bg-white border border-[#7A4B3A]/25 rounded-xl px-3 py-2.5 text-xs text-[#231F20] focus:outline-none focus:ring-2 focus:ring-[#7A4B3A]/40 transition-all"
                  >
                    <option value={1}>1 Guest (Solo Coffee)</option>
                    <option value={2}>2 Guests (Table for Two)</option>
                    <option value={3}>3 Guests</option>
                    <option value={4}>4 Guests (Booth Table)</option>
                    <option value={5}>5 Guests</option>
                    <option value={6}>6+ Guests (Group Lounge)</option>
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#231F20]/80 mb-1.5 font-sans">
                  Special Notes or Coffee Preference (Optional)
                </label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Window seat, quiet corner, oat milk preference..."
                  className="w-full bg-white border border-[#7A4B3A]/25 rounded-xl px-4 py-2.5 text-xs text-[#231F20] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7A4B3A]/40 transition-all resize-none"
                />
              </div>

              {/* Business ID Metadata Notice */}
              <div className="pt-1 flex items-center justify-between text-[11px] text-[#231F20]/60">
                <span>Tenant: {business.name}</span>
                <span className="font-mono text-[10px]">ID: {business.id.slice(0, 8)}...</span>
              </div>

              {/* Submit CTA Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 bg-[#7A4B3A] hover:bg-[#633A2C] disabled:bg-[#7A4B3A]/60 text-white font-serif py-3.5 px-6 rounded-2xl text-sm tracking-widest uppercase transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-99"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Executing Supabase INSERT...
                  </span>
                ) : (
                  <>
                    <Calendar className="w-4 h-4" />
                    <span>Confirm Table Booking</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Confirmation Success Screen */
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <span className="text-xs uppercase font-serif tracking-widest text-[#7A4B3A] font-semibold block mb-1">
              Booking Confirmed
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#231F20] mb-2">
              We Look Forward to Welcoming You
            </h3>
            <p className="text-xs sm:text-sm text-[#231F20]/75 max-w-sm mx-auto mb-6">
              Your reservation has been recorded in the Supabase database for <strong>{business.name}</strong>.
            </p>

            {/* Booking Details Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#7A4B3A]/15 text-left text-xs space-y-2 mb-6">
              <div className="flex justify-between py-1 border-b border-black/5">
                <span className="text-stone-500">Guest Name:</span>
                <span className="font-medium text-[#231F20]">{submittedData.customer_name}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/5">
                <span className="text-stone-500">Contact:</span>
                <span className="font-medium text-[#231F20]">{submittedData.contact_number}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/5">
                <span className="text-stone-500">Date & Time:</span>
                <span className="font-medium text-[#231F20]">
                  {new Date(submittedData.reservation_time).toLocaleString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/5">
                <span className="text-stone-500">Party Size:</span>
                <span className="font-medium text-[#231F20]">{submittedData.party_size || partySize} Guests</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-500">Status:</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-100 text-amber-800 uppercase tracking-wider">
                  {submittedData.status || 'Pending'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${business.latitude},${business.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#7A4B3A] hover:bg-[#633A2C] text-white py-3 px-4 rounded-xl font-serif text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                Get Directions to Cafe
              </a>
              <button
                onClick={handleResetAndClose}
                className="py-3 px-6 rounded-xl border border-[#7A4B3A]/30 text-[#231F20] hover:bg-black/5 text-xs font-sans transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
