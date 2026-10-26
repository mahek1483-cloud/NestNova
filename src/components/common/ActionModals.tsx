"use client";

import React, { useState } from "react";
import { submitEnquiry, submitVisitRequest, submitBooking } from "@/lib/api/requests";
import {
  X,
  Send,
  Calendar,
  CheckCircle2,
  Clock,
  Building,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyName: string;
  propertyLocality: string;
  ownerId?: string;
}

/* ========================================================
   1. ENQUIRY MODAL (Ask a question about the stay)
   ======================================================== */
export function EnquiryModal({
  isOpen,
  onClose,
  propertyId,
  propertyName,
  propertyLocality,
  ownerId,
}: ModalProps) {
  const [message, setMessage] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitEnquiry({
      propertyId,
      propertyName,
      propertyLocality,
      ownerId,
      message,
      studentName,
      studentPhone,
    });
    setIsSubmitting(false);
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-slide-up border border-gray-150/70">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1B2A2F] mb-2">Enquiry Sent!</h3>
            <p className="text-sm text-gray-600 mb-6">
              Your message was delivered to the verified owner of <strong>{propertyName}</strong> in Gokak. You can track replies in your messages inbox.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-[#0F5C5C] text-white font-bold rounded-xl text-sm shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F5C5C] uppercase tracking-wider mb-1">
              <Building className="w-4 h-4" />
              <span>Direct Property Enquiry</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-sans text-[#1B2A2F] mb-1">
              Ask about {propertyName}
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Located in {propertyLocality}, Gokak. Clarify room sharing, mess menu, or gate curfew directly with the owner.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Rahul Patil"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Question or Requirement</label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g., Is 2-sharing room available from 1st of next month? Does rent include hot water in winters?"
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Enquiry</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================
   2. SCHEDULE VISIT MODAL (Strictly physical inspection)
   ======================================================== */
export function ScheduleVisitModal({
  isOpen,
  onClose,
  propertyId,
  propertyName,
  propertyLocality,
  ownerId,
}: ModalProps) {
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("11:00");
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitVisitRequest({
      propertyId,
      propertyName,
      propertyLocality,
      ownerId,
      scheduledAt: `${visitDate}T${visitTime}:00Z`,
      studentName,
      studentPhone,
      notes,
    });
    setIsSubmitting(false);
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-slide-up border border-gray-150/70">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm animate-bounce">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1B2A2F] mb-2">Visit Scheduled!</h3>
            <p className="text-sm text-gray-600 mb-6">
              Your visit request for <strong>{propertyName}</strong> in Gokak is pending owner confirmation. Remember: A visit request does NOT charge you or reserve the bed.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-[#0F5C5C] text-white font-bold rounded-xl text-sm shadow-md"
            >
              Done
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold rounded-full w-fit mb-3">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Free Physical Visit — NOT a Room Booking</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-sans text-[#1B2A2F] mb-1">
              Schedule Free Visit
            </h2>
            <p className="text-xs text-gray-500 mb-5">
              Inspect {propertyName} in person in {propertyLocality}, Gokak. Check room dimensions, bathroom cleanliness, and meet the warden.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Visit Date</label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Preferred Time</label>
                  <select
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                  >
                    <option value="10:00">10:00 AM</option>
                    <option value="11:30">11:30 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Praveen Naik"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Notes for Owner (Optional)</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Visiting along with my parents"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Scheduling...</span>
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    <span>Request Physical Visit</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================================
   3. BOOKING MODAL (Room / Bed Reservation)
   ======================================================== */
export function BookingModal({
  isOpen,
  onClose,
  propertyId,
  propertyName,
  propertyLocality,
  roomType = "2 Sharing Room",
  monthlyRent = 4500,
  depositAmount = 5000,
}: ModalProps & {
  roomType?: string;
  monthlyRent?: number;
  depositAmount?: number;
}) {
  const [startDate, setStartDate] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitBooking({
      propertyId,
      propertyName,
      propertyLocality,
      roomType,
      monthlyRent,
      depositAmount,
      startDate,
      studentName,
      studentPhone,
    });
    setIsSubmitting(false);
    setSuccess(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md transition-all duration-300">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-slide-up border border-gray-150/70">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-[#1B2A2F] mb-2">Booking Request Submitted!</h3>
            <p className="text-sm text-gray-600 mb-6">
              Your room reservation request for <strong>{propertyName}</strong> in Gokak has been sent to the owner for approval. You can track status in your Bookings dashboard.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-[#0F5C5C] text-white font-bold rounded-xl text-sm shadow-md"
            >
              View My Bookings
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-full w-fit mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Room & Bed Reservation</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-sans text-[#1B2A2F] mb-1">
              Reserve Bed in {propertyName}
            </h2>
            <p className="text-xs text-gray-500 mb-4">
              {roomType} • {propertyLocality}, Gokak, Karnataka
            </p>

            {/* Price Preview */}
            <div className="p-4 bg-gray-50 rounded-2xl mb-5 space-y-2 text-xs">
              <div className="flex justify-between font-medium text-gray-600">
                <span>Monthly Rent:</span>
                <span className="font-bold text-gray-900">₹{monthlyRent.toLocaleString("en-IN")}/mo</span>
              </div>
              <div className="flex justify-between font-medium text-gray-600">
                <span>Security Deposit:</span>
                <span className="font-bold text-gray-900">₹{depositAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm text-[#0F5C5C]">
                <span>Move-in Total Due Upon Approval:</span>
                <span>₹{(monthlyRent + depositAmount).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Planned Move-In Date</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Santosh Hegde"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={studentPhone}
                  onChange={(e) => setStudentPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5C5C]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#0F5C5C] hover:bg-[#0c4747] text-white font-bold rounded-xl shadow-md transition-all text-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Request...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Reservation Request</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
