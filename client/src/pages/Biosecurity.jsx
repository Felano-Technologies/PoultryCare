import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Chart } from "chart.js/auto";

const BiosecurityPage = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const [activeTab, setActiveTab] = useState("visitor");
  const [selectedTransmission, setSelectedTransmission] = useState(null);
  const [visitorSearch, setVisitorSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  // Transmission route data
  const transmissionData = {
    aerosol: {
      title: "Aerosol Transmission",
      text: "Pathogenic agents are transmitted through the air, typically involving respiratory diseases. Infected and susceptible animals must be in close proximity. Good ventilation is key to mitigation.",
    },
    oral: {
      title: "Oral Transmission",
      text: "Occurs when animals ingest contaminated feed, water, or lick contaminated surfaces like equipment or troughs. An example is exotic Newcastle disease. Securing feed and water sources is critical.",
    },
    contact: {
      title: "Direct Contact Transmission",
      text: "Spread through physical contact between an infected and a susceptible animal, via skin, mucus membranes, or open wounds. Often involves rubbing, biting, or contact with saliva.",
    },
    fomites: {
      title: "Fomite Transmission",
      text: "Inanimate objects carry infectious agents. This includes boots, clothing, vehicles, and tools. Thorough sanitation of all items entering the farm is a crucial control point.",
    },
    vectors: {
      title: "Vector Transmission",
      text: "Involves vectors like fleas, ticks, and mosquitoes that acquire an agent from an infected animal and introduce it to a susceptible host, usually through a bite. Pest control is essential.",
    },
  };

  // Visitor data for the dashboard
  const visitorData = [
    { name: "John Doe", purpose: "Veterinarian", time: "08:15 AM", risk: "Low" },
    { name: "Jane Smith", purpose: "Feed Delivery", time: "09:30 AM", risk: "Medium" },
    { name: "Mike Johnson", purpose: "Maintenance", time: "10:00 AM", risk: "Low" },
    { name: "Emily White", purpose: "Regulator", time: "11:20 AM", risk: "Low" },
    { name: "Chris Brown", purpose: "Equipment Repair", time: "01:45 PM", risk: "High" },
  ];

  // Alerts data
  const alertsData = [
    { type: "Humidity", location: "House #3", message: "Humidity at 78% (High)", icon: "💧" },
    { type: "Pest Sighting", location: "Feed Storage", message: "Rodent spotted near feed bags", icon: "🐀" },
    { type: "Temperature", location: "House #1", message: "Temp at 34°C (High)", icon: "🌡️" },
  ];

  // Filter visitors based on search and risk level
  const filteredVisitors = visitorData.filter((visitor) => {
    const nameMatch = visitor.name.toLowerCase().includes(visitorSearch.toLowerCase());
    const riskMatch = riskFilter === "all" || visitor.risk === riskFilter;
    return nameMatch && riskMatch;
  });

  // Handle scroll to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll(".section");
      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        if (window.scrollY >= sectionTop - 100) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const flockHealthChartRef = useRef(null);
  const mortalityChartRef = useRef(null);

  useEffect(() => {
    // Cleanup previous charts if they exist
    if (flockHealthChartRef.current) {
      flockHealthChartRef.current.destroy();
    }

    if (mortalityChartRef.current) {
      mortalityChartRef.current.destroy();
    }

    // Flock Health Chart
    const flockHealthCtx = document.getElementById("flockHealthChart");
    if (flockHealthCtx) {
      flockHealthChartRef.current = new Chart(flockHealthCtx, {
        type: "doughnut",
        data: {
          labels: ["Healthy", "At-Risk", "Infected"],
          datasets: [
            {
              data: [85, 10, 5],
              backgroundColor: ["#2E8B57", "#FFD700", "#DC143C"],
              borderColor: "#FFFFFF",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" },
          },
        },
      });
    }

    // Mortality Chart
    const mortalityCtx = document.getElementById("mortalityChart");
    if (mortalityCtx) {
      mortalityChartRef.current = new Chart(mortalityCtx, {
        type: "line",
        data: {
          labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"],
          datasets: [
            {
              label: "Mortality Rate",
              data: [0.1, 0.12, 0.11, 0.15, 0.25, 0.18, 0.16],
              borderColor: "#8C6A5D",
              backgroundColor: "rgba(140, 106, 93, 0.1)",
              fill: true,
              tension: 0.4,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (value) => value + "%",
              },
            },
          },
          plugins: {
            legend: { display: false },
          },
        },
      });
    }

    // Cleanup on unmount
    return () => {
      if (flockHealthChartRef.current) {
        flockHealthChartRef.current.destroy();
      }
      if (mortalityChartRef.current) {
        mortalityChartRef.current.destroy();
      }
    };
  }, []);

  // Scroll to section
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-[#4B4B4B] font-sans">
      <Navbar />


      <main>
        {/* Introduction Section */}
        <section id="introduction" className="py-16 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-[#3A3A3A] mb-4">
              A Digital Framework for Enhanced Poultry Health
            </h2>
            <p className="text-lg text-[#595959] max-w-3xl mx-auto">
              This interactive application translates the "Digital Biosecurity Framework" report into
              an explorable experience. Discover the core principles of poultry biosecurity and see
              how modern digital tools can transform reactive measures into proactive, data-driven
              strategies for a safer and more sustainable poultry industry.
            </p>
          </div>
        </section>

        {/* Principles Section */}
        <section id="principles" className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-[#3A3A3A] mb-2">
              Foundational Biosecurity Principles
            </h2>
            <p className="text-center text-[#595959] mb-12 max-w-3xl mx-auto">
              Effective digital biosecurity starts with a deep understanding of how diseases spread
              and the core pillars that prevent it. This section breaks down these foundational
              concepts into interactive components.
            </p>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="bg-white p-6 rounded-xl border border-[#D3C5BC] shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <h3 className="text-xl font-semibold text-[#3A3A3A] mb-4">
                  Interactive: Disease Transmission Routes
                </h3>
                <p className="text-[#595959] mb-4">
                  Click on a transmission route to learn more about how pathogens spread and the
                  specific risks they pose to a flock. Understanding these vectors is the first step
                  in designing effective controls.
                </p>
                <div className="space-y-2">
                  {Object.keys(transmissionData).map((key) => (
                    <div
                      key={key}
                      onClick={() => setSelectedTransmission(key)}
                      className={`border border-[#D3C5BC] p-3 rounded-lg flex items-center space-x-3 cursor-pointer ${
                        selectedTransmission === key ? "bg-gray-100" : ""
                      }`}
                    >
                      <span className="text-2xl">
                        {key === "aerosol" && "💨"}
                        {key === "oral" && "💧"}
                        {key === "contact" && "🤝"}
                        {key === "fomites" && "👢"}
                        {key === "vectors" && "🦟"}
                      </span>
                      <span className="font-semibold text-[#3A3A3A]">
                        {transmissionData[key].title.split(" ")[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg border border-[#D3C5BC]">
                {selectedTransmission ? (
                  <>
                    <h4 className="text-lg font-bold text-[#8C6A5D] mb-2">
                      {transmissionData[selectedTransmission].title}
                    </h4>
                    <p className="text-[#595959]">
                      {transmissionData[selectedTransmission].text}
                    </p>
                  </>
                ) : (
                  <>
                    <h4 className="text-lg font-bold text-[#8C6A5D] mb-2">Select a Route</h4>
                    <p className="text-[#595959]">
                      Click an item on the left to display detailed information here.
                    </p>
                  </>
                )}
              </div>
            </div>

            <h3 className="text-2xl font-bold text-center text-[#3A3A3A] mt-16 mb-8">
              The Four Pillars of Biosecurity
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  emoji: "🚧",
                  title: "Isolation",
                  text: "Separating new or returning animals from the main flock to prevent the introduction of disease. A minimum of four weeks is recommended.",
                },
                {
                  emoji: "🚦",
                  title: "Traffic Control",
                  text: "Limiting and managing the movement of people, animals, and vehicles onto and within the farm to minimize exposure risks.",
                },
                {
                  emoji: "🧼",
                  title: "Sanitation",
                  text: "Rigorous cleaning and disinfection of all equipment, clothing, and facilities to eliminate pathogenic agents.",
                },
                {
                  emoji: "🐀",
                  title: "Pest Management",
                  text: "Implementing control programs for rodents, insects, and wild birds that can act as carriers and spreaders of disease.",
                },
              ].map((pillar) => (
                <div
                  key={pillar.title}
                  className="bg-white p-6 rounded-xl border border-[#D3C5BC] shadow-sm text-center transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="text-4xl mb-4">{pillar.emoji}</div>
                  <h4 className="text-xl font-semibold text-[#3A3A3A] mb-2">{pillar.title}</h4>
                  <p className="text-[#595959]">{pillar.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-[#3A3A3A] mb-2">
              Key Digital Biosecurity Features
            </h2>
            <p className="text-center text-[#595959] mb-8 max-w-3xl mx-auto">
              This section showcases how technology translates biosecurity principles into powerful,
              proactive digital tools. Use the tabs below to explore the core functionalities and
              proactive insights of each digital feature.
            </p>
            <div className="border-b border-gray-200">
              <div className="flex justify-center space-x-4">
                {["visitor", "health", "sanitation", "waste", "emergency"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-3 px-4 border-b-2 font-medium ${
                      activeTab === tab
                        ? "border-[#8C6A5D] text-[#8C6A5D]"
                        : "border-transparent text-[#595959] hover:text-[#8C6A5D]"
                    }`}
                  >
                    {tab === "visitor" && "Visitor Mgt."}
                    {tab === "health" && "Health Tracking"}
                    {tab === "sanitation" && "Sanitation Log"}
                    {tab === "waste" && "Waste Mgt."}
                    {tab === "emergency" && "Emergency Tools"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8">
              {/* Visitor Management */}
              {activeTab === "visitor" && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-[#3A3A3A] mb-4">
                      Visitor & Personnel Management System
                    </h3>
                    <p className="text-[#595959] mb-4">
                      Digitizes and enforces strict access control. It ensures only essential
                      personnel and approved, pre-screened visitors can interact with the flock,
                      maintaining a complete digital log for contact tracing.
                    </p>
                    <ul className="list-disc list-inside text-[#595959] space-y-2">
                      <li>Digital check-in/out via QR codes</li>
                      <li>Mandatory pre-screening health declarations</li>
                      <li>Automated alerts for high-risk visitors</li>
                      <li>Digital acknowledgment of biosecurity protocols</li>
                    </ul>
                  </div>
                  <div className="bg-[#FDFBF8] p-6 rounded-lg">
                    <h4 className="font-semibold text-[#8C6A5D] mb-2">Proactive Insight</h4>
                    <p className="text-[#595959]">
                      By integrating historical data and external disease reports, the system can
                      generate a risk score for each visitor. This shifts from reactive tracing to
                      proactive risk mitigation, automatically flagging individuals for enhanced
                      scrutiny or denying entry before they ever step foot on the farm.
                    </p>
                  </div>
                </div>
              )}

              {/* Health Tracking */}
              {activeTab === "health" && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-[#3A3A3A] mb-4">
                      Animal Health & Movement Tracking
                    </h3>
                    <p className="text-[#595959] mb-4">
                      A central system for monitoring flock health, movement, and vital statistics.
                      It combines on-farm records with IoT and AI to enable early detection and
                      rapid response.
                    </p>
                    <ul className="list-disc list-inside text-[#595959] space-y-2">
                      <li>Individual/flock identification and movement logs</li>
                      <li>Integration with IoT sensors for real-time data</li>
                      <li>AI-powered audio and visual anomaly detection</li>
                      <li>Automated disease reporting and veterinary integration</li>
                    </ul>
                  </div>
                  <div className="bg-[#FDFBF8] p-6 rounded-lg">
                    <h4 className="font-semibold text-[#8C6A5D] mb-2">Proactive Insight</h4>
                    <p className="text-[#595959]">
                      Combining IoT data (e.g., vital signs, movement) with AI analysis (e.g.,
                      respiratory sounds) creates a powerful predictive capability. The system can
                      detect subtle changes in flock behavior before clinical signs appear,
                      triggering immediate, targeted interventions like adjusting ventilation or
                      isolating a small group, thereby averting a full-blown outbreak.
                    </p>
                  </div>
                </div>
              )}

              {/* Sanitation Log */}
              {activeTab === "sanitation" && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-[#3A3A3A] mb-4">
                      Equipment & Vehicle Sanitation Log
                    </h3>
                    <p className="text-[#595959] mb-4">
                      A digital log to track and enforce the cleaning and disinfection of all
                      equipment and vehicles, which are significant fomites in disease transmission.
                    </p>
                    <ul className="list-disc list-inside text-[#595959] space-y-2">
                      <li>Digital logs for all equipment and vehicles</li>
                      <li>Enforceable digital checklists for sanitation procedures</li>
                      <li>Fomite awareness education for personnel</li>
                      <li>Restriction flags for items that cannot be cleaned</li>
                    </ul>
                  </div>
                  <div className="bg-[#FDFBF8] p-6 rounded-lg">
                    <h4 className="font-semibold text-[#8C6A5D] mb-2">Proactive Insight</h4>
                    <p className="text-[#595959]">
                      By requiring digital sign-offs on sanitation checklists linked to specific
                      assets and personnel, the system creates an immutable audit trail. This can be
                      integrated with vehicle GPS data to verify that cleaning occurred before
                      movement, drastically reducing the risk of human error or negligence and
                      providing verifiable data for audits.
                    </p>
                  </div>
                </div>
              )}

              {/* Waste Management */}
              {activeTab === "waste" && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-[#3A3A3A] mb-4">
                      Mortality & Waste Disposal Management
                    </h3>
                    <p className="text-[#595959] mb-4">
                      A critical tool for tracking the proper and timely disposal of poultry
                      mortality, as stockpiled carcasses increase disease spread risk from pests.
                    </p>
                    <ul className="list-disc list-inside text-[#595959] space-y-2">
                      <li>Real-time carcass disposal tracking</li>
                      <li>Documentation of approved disposal methods</li>
                      <li>Tools for developing mass mortality plans</li>
                      <li>Recording of postmortem examination results</li>
                    </ul>
                  </div>
                  <div className="bg-[#FDFBF8] p-6 rounded-lg">
                    <h4 className="font-semibold text-[#8C6A5D] mb-2">Proactive Insight</h4>
                    <p className="text-[#595959]">
                      By tracking mortality rates in real-time and linking them to farm zones, the
                      system provides early indicators of disease escalation. Integrating this with
                      resource availability (e.g., compost capacity), it can proactively suggest
                      optimal disposal strategies and resource allocation during an outbreak, turning
                      a simple log into a strategic response tool.
                    </p>
                  </div>
                </div>
              )}

              {/* Emergency Tools */}
              {activeTab === "emergency" && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-[#3A3A3A] mb-4">
                      Emergency Response & Reporting Tools
                    </h3>
                    <p className="text-[#595959] mb-4">
                      A digital command center for mitigating the impact of disease outbreaks with
                      rapid, coordinated action and reporting.
                    </p>
                    <ul className="list-disc list-inside text-[#595959] space-y-2">
                      <li>Digital emergency contact lists</li>
                      <li>Interactive facility maps with key infrastructure</li>
                      <li>Outbreak simulation and resource planning tools</li>
                      <li>Automated reporting and real-time threat updates</li>
                    </ul>
                  </div>
                  <div className="bg-[#FDFBF8] p-6 rounded-lg">
                    <h4 className="font-semibold text-[#8C6A5D] mb-2">Proactive Insight</h4>
                    <p className="text-[#595959]">
                      The system integrates real-time outbreak data with facility maps and
                      simulation tools to provide dynamic, scenario-based recommendations. If a
                      disease is detected, it can instantly map optimal responder routes, identify
                      isolation zones, and model potential spread, transforming a static plan into a
                      live command center that improves response speed and effectiveness.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Dashboard Section */}
        <section id="dashboard" className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-[#3A3A3A] mb-2">
              Interactive Biosecurity Dashboard
            </h2>
            <p className="text-center text-[#595959] mb-12 max-w-3xl mx-auto">
              This simulated dashboard provides a practical view of how a digital biosecurity system
              works. Interact with the components below to see real-time data monitoring, alerts,
              and logs in action, providing a comprehensive overview of the farm's biosecurity
              status.
            </p>
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#D3C5BC] shadow-sm">
                <h3 className="text-xl font-semibold text-[#3A3A3A] mb-4">Daily Visitor Log</h3>
                <div className="mb-4 flex space-x-2">
                  <input
                    type="text"
                    value={visitorSearch}
                    onChange={(e) => setVisitorSearch(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full p-2 border border-[#D3C5BC] rounded-md"
                  />
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="p-2 border border-[#D3C5BC] rounded-md"
                  >
                    <option value="all">All Risk Levels</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-2 px-4 text-left">Name</th>
                        <th className="py-2 px-4 text-left">Purpose</th>
                        <th className="py-2 px-4 text-left">Time In</th>
                        <th className="py-2 px-4 text-left">Risk</th>
                      </tr>
                    </thead>
                    <tbody className="text-[#595959]">
                      {filteredVisitors.map((visitor, index) => (
                        <tr key={index}>
                          <td className="py-2 px-4 border-b border-gray-200">{visitor.name}</td>
                          <td className="py-2 px-4 border-b border-gray-200">{visitor.purpose}</td>
                          <td className="py-2 px-4 border-b border-gray-200">{visitor.time}</td>
                          <td
                            className={`py-2 px-4 border-b border-gray-200 font-semibold ${
                              visitor.risk === "Low"
                                ? "text-green-600"
                                : visitor.risk === "Medium"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {visitor.risk}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-[#D3C5BC] shadow-sm">
                <h3 className="text-xl font-semibold text-[#3A3A3A] mb-4">Environmental Alerts</h3>
                <div className="space-y-3">
                  {alertsData.map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div
                        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                          alert.type === "Pest Sighting"
                            ? "bg-yellow-100"
                            : alert.type === "Temperature"
                            ? "bg-red-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {alert.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-[#3A3A3A]">
                          {alert.location}: {alert.message}
                        </p>
                        <p className="text-sm text-[#595959]">{alert.type} Alert</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl border border-[#D3C5BC] shadow-sm">
                <h3 className="text-xl font-semibold text-[#3A3A3A] mb-4">Flock Health Status</h3>
                <div className="chart-container" style={{ height: "250px" }}>
                  <canvas id="flockHealthChart"></canvas>
                </div>
              </div>
              <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-[#D3C5BC] shadow-sm">
                <h3 className="text-xl font-semibold text-[#3A3A3A] mb-4">
                  Weekly Mortality Rate Trend (%)
                </h3>
                <div className="chart-container" style={{ height: "250px" }}>
                  <canvas id="mortalityChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default BiosecurityPage;