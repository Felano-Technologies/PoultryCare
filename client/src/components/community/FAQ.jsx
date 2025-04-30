const faqs = [
    {
      question: "How often should I vaccinate my chickens?",
      answer: "Vaccinations should be administered based on age and risk level. Consult your vet for a proper schedule.",
    },
    {
      question: "What are signs of respiratory diseases in poultry?",
      answer: "Look for sneezing, nasal discharge, and reduced egg production.",
    },
  ];
  
  const FAQ = () => {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-2">FAQs</h3>
        {faqs.map((item, i) => (
          <div key={i} className="mb-2">
            <p className="font-medium">{item.question}</p>
            <p className="text-sm text-gray-700">{item.answer}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default FAQ;
  