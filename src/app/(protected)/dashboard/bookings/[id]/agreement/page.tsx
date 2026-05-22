import { getBookingById } from "@/lib/services/bookings";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { PrintButton } from "./PrintButton";
import Image from "next/image";

export default async function FormalAgreementPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const booking = await getBookingById(params.id);

  if (!booking) {
    notFound();
  }

  // Fetch Guarantor if applicable
  const supabase = await createClient();
  let guarantorSubmission = null;

  if (booking.job_post_id && booking.worker_id) {
    // Get application first
    const { data: appData } = await supabase
      .from('job_applications')
      .select('id')
      .eq('job_post_id', booking.job_post_id)
      .eq('worker_id', booking.worker_id)
      .single();

    if (appData) {
      const { data: guarantorData } = await supabase
        .from('guarantor_submissions')
        .select('*')
        .eq('application_id', appData.id)
        .eq('status', 'submitted')
        .single();
      
      if (guarantorData) {
        guarantorSubmission = guarantorData;
      }
    }
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="flex flex-col space-y-6 max-w-4xl mx-auto w-full p-4 print:p-0 print:m-0 print:w-full">
      
      {/* Non-printable controls */}
      <div className="flex justify-between items-center print:hidden bg-white p-4 rounded-lg shadow-sm border border-slate-200">
        <Link
          href={`/dashboard/bookings/${booking.id}`}
          className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Booking
        </Link>
        <PrintButton />
      </div>

      {/* Printable Document A4 Size */}
      <div className="bg-white p-12 md:p-16 rounded-sm shadow-md border border-slate-200 print:shadow-none print:border-none print:p-8 mx-auto w-full max-w-[210mm] min-h-[297mm] text-slate-900 font-serif relative">
        
        {/* Header */}
        <div className="text-center mb-10 pb-6 border-b-2 border-blue-600">
          <h1 className="text-4xl font-bold tracking-tighter text-blue-600 mb-2 font-sans">BC</h1>
          <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-widest">Formal Service Agreement</h2>
          <p className="text-sm text-slate-500 font-sans mt-2">Document ID: {booking.id.split('-')[0]}</p>
        </div>

        {/* Date */}
        <div className="text-right mb-8">
          <p><strong>Date:</strong> {currentDate}</p>
        </div>

        {/* Introduction */}
        <div className="mb-8 leading-relaxed">
          <p>
            This Formal Service Agreement (the "Agreement") is entered into on this {currentDate}, by and between:
          </p>
          
          <div className="my-6 space-y-4">
            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded">
              <h3 className="font-bold text-lg mb-2">The Customer (Client)</h3>
              <p><strong>Name:</strong> {booking.customer_profiles?.full_name}</p>
              <p><strong>Contact:</strong> {booking.customer_profiles?.contact_phone || "Not provided"}</p>
              <p><strong>Address:</strong> {booking.customer_profiles?.location_text}</p>
            </div>

            <div className="p-4 bg-slate-50/50 border border-slate-100 rounded">
              <h3 className="font-bold text-lg mb-2">The Worker (Contractor)</h3>
              <p><strong>Name:</strong> {booking.worker_profiles?.full_name}</p>
              <p><strong>Contact:</strong> {booking.worker_profiles?.contact_phone || "Not provided"}</p>
              <p><strong>Address:</strong> {booking.worker_profiles?.location_text}</p>
            </div>
            
            {guarantorSubmission && (
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded">
                <h3 className="font-bold text-lg text-blue-900 mb-2">Third Accountable Person (Guarantor)</h3>
                <p><strong>Name:</strong> {guarantorSubmission.full_name}</p>
                <p><strong>FAN:</strong> {guarantorSubmission.fan_number}</p>
                <p className="text-sm text-slate-600 mt-2 italic">
                  By acting as a guarantor, the individual named above accepts accountability for the actions and professional conduct of the Worker during the execution of this job.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Job Details */}
        <div className="mb-8">
          <h3 className="font-bold text-xl mb-4 border-b pb-2">1. Scope of Work</h3>
          <p className="mb-2"><strong>Job Title:</strong> {booking.job_posts?.title || booking.worker_services?.description || "Service Booking"}</p>
          <p className="mb-2"><strong>Scheduled For:</strong> {new Date(booking.scheduled_at).toLocaleString()}</p>
          <p className="mb-2"><strong>Location:</strong> {booking.location_text}</p>
          <p className="mb-4"><strong>Agreed Compensation:</strong> {booking.final_price} ETB</p>
          
          {booking.job_posts?.description && (
            <div>
              <strong>Description of Work:</strong>
              <p className="mt-2 text-slate-700 whitespace-pre-wrap pl-4 border-l-2 border-slate-200">
                {booking.job_posts.description}
              </p>
            </div>
          )}
        </div>

        {/* Legal Terms */}
        <div className="mb-12 space-y-4 text-justify">
          <h3 className="font-bold text-xl mb-4 border-b pb-2">2. Terms & Conditions</h3>
          <p>
            The Worker agrees to perform the services described above in a professional and timely manner. The Customer agrees to pay the Agreed Compensation upon satisfactory completion of the services.
          </p>
          {guarantorSubmission && (
            <p>
              The Guarantor agrees to assume full responsibility for any gross misconduct, theft, or damages caused by the Worker during the term of this job. This accountability is legally binding under the applicable laws of Ethiopia.
            </p>
          )}
        </div>

        {/* Signatures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-12 mb-12">
          
          <div className="border-t border-slate-300 pt-4">
            <p className="font-bold mb-1">Customer Signature</p>
            <p className="text-sm text-slate-500">{booking.customer_profiles?.full_name}</p>
            <div className="h-16 mt-2"></div>
            <p className="text-xs text-slate-400">Date: __________________</p>
          </div>

          <div className="border-t border-slate-300 pt-4">
            <p className="font-bold mb-1">Worker Signature</p>
            <p className="text-sm text-slate-500">{booking.worker_profiles?.full_name}</p>
            <div className="h-16 mt-2"></div>
            <p className="text-xs text-slate-400">Date: __________________</p>
          </div>

        </div>

        {/* Guarantor Signature and ID Appendix */}
        {guarantorSubmission && (
          <div className="mt-12 pt-8 border-t-2 border-blue-100 print:break-before-auto">
            <h3 className="font-bold text-xl mb-6 text-center">Guarantor Endorsement</h3>
            
            <div className="flex flex-col items-center mb-8">
              <div className="border border-slate-200 rounded p-4 bg-slate-50">
                {guarantorSubmission.signature_data && (
                  <img src={guarantorSubmission.signature_data} alt="Guarantor Signature" className="h-24 object-contain" />
                )}
              </div>
              <p className="font-bold mt-2">{guarantorSubmission.full_name}</p>
              <p className="text-sm text-slate-500">Guarantor</p>
              <p className="text-xs text-slate-400 mt-1">Signed Digitally on: {new Date(guarantorSubmission.submitted_at).toLocaleDateString()}</p>
            </div>

            <div className="mt-8">
              <h4 className="font-bold mb-4">Appendix: Guarantor National ID</h4>
              {guarantorSubmission.national_id_url && (
                <div className="border p-2 bg-slate-50 w-full max-w-sm mx-auto">
                  <img src={guarantorSubmission.national_id_url} alt="National ID" className="w-full h-auto" />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-16 pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
          <p>Generated by Digital Blue Collar Platform - {currentDate}</p>
          <p>This document is digitally verifiable and binding.</p>
        </div>
        
      </div>
    </div>
  );
}
