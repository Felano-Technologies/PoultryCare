import LiveChat from "./LiveChat";
import FAQ from "./FAQ";
import BookingForm from "./BookingForm";

const ExpertConsultation = () => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Expert Consultation</h2>
      <LiveChat />
      <div className="my-6">
        <FAQ />
      </div>
      <BookingForm />
    </div>
  );
};

export default ExpertConsultation;
