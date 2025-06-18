import SavingsForm from "../components/SavingsForm";


export default function SavingsPage() {
  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Predict Your Monthly Savings</h1>
      <SavingsForm/>
    </div>
  );
}
