import CreateRfqForm from "@/components/rfq/CreateRfqForm"
export default function NewRfqPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-6">
        <span className="text-xs font-semibold text-blue-600 tracking-wider uppercase">Viquoe Hub</span>
      </div>
      <CreateRfqForm />
    </div>
  );
}