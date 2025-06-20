import SavingsForm from "../components/SavingsForm";


export default function SavingsPage() {
  return (
    // <div className="bg-gradient-to-b from-[#cbb5ff] via-[#e9efff] to-[#b3d1ff] max-w-xl mx-auto mt-10 px-4">
    //   <h1 className="text-2xl font-bold mb-6">Predict Your Monthly Savings</h1>
    //   <SavingsForm/>
    // </div>
    <div className="min-h-screen bg-gradient-to-b from-[#d8b4fe] via-[#c084fc] to-[#a855f7] flex items-center justify-center px-4">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-bold flex items-center justify-center text-center mt-3">Predict Your Monthly Savings</h1>
        <SavingsForm />
      </div>
    </div>
  );
}
