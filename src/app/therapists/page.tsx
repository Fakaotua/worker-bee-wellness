import TherapistSearch from '@/components/TherapistSearch';

export default function TherapistsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find a Therapist</h1>
      <TherapistSearch />
    </div>
  );
}
