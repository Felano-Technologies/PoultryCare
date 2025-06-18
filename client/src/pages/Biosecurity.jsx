import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Chart } from "chart.js/auto";
import {
  Cloud, // Aerosol
  Droplets, // Oral
  Hand, // Contact
  Footprints , // Fomites
  Bug, // Vectors
  Construction, // Isolation
  TrafficCone, // Traffic Control
  SprayCan, // Sanitation
  Rat, // Pest Management
  AlertTriangle, // Alerts
  Thermometer, // Temperature
  User, // Visitors
  HeartPulse, // Health
  ShieldCheck, // Biosecurity
  Activity // Mortality
} from "lucide-react";

const BiosecurityPage = () => {
  const [activeSection, setActiveSection] = useState("introduction");
  const [activeTab, setActiveTab] = useState("visitor");
  const [selectedTransmission, setSelectedTransmission] = useState(null);
  const [visitorSearch, setVisitorSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  // Transmission route data with Lucide icons
  const transmissionData = {
    aerosol: {
      title: "Aerosol Transmission",
      text: "Pathogenic agents are transmitted through the air, typically involving respiratory diseases. Infected and susceptible animals must be in close proximity. Good ventilation is key to mitigation.",
      icon: <Cloud className="w-6 h-6" />
    },
    oral: {
      title: "Oral Transmission",
      text: "Occurs when animals ingest contaminated feed, water, or lick contaminated surfaces like equipment or troughs. An example is exotic Newcastle disease. Securing feed and water sources is critical.",
      icon: <Droplets className="w-6 h-6" />
    },
    contact: {
      title: "Direct Contact Transmission",
      text: "Spread through physical contact between an infected and a susceptible animal, via skin, mucus membranes, or open wounds. Often involves rubbing, biting, or contact with saliva.",
      icon: <Hand className="w-6 h-6" />
    },
    fomites: {
      title: "Fomite Transmission",
      text: "Inanimate objects carry infectious agents. This includes boots, clothing, vehicles, and tools. Thorough sanitation of all items entering the farm is a crucial control point.",
      icon: <Footprints  className="w-6 h-6" />
    },
    vectors: {
      title: "Vector Transmission",
      text: "Involves vectors like fleas, ticks, and mosquitoes that acquire an agent from an infected animal and introduce it to a susceptible host, usually through a bite. Pest control is essential.",
      icon: <Bug className="w-6 h-6" />
    },
  };

  // Real visitor data from API
  const [visitorData, setVisitorData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [flockHealth, setFlockHealth] = useState({ healthy: 0, atRisk: 0, infected: 0 });
  const [mortalityData, setMortalityData] = useState([]);

  // Fetch real data
  useEffect(() => {
    // Simulated API calls - replace with actual API calls
    const fetchData = async () => {
      try {
        // Fetch visitor data
        const visitors = await fetch('/api/biosecurity/visitors').then(res => res.json());
        setVisitorData(visitors);
        
        // Fetch alerts
        const alerts = await fetch('/api/biosecurity/alerts').then(res => res.json());
        setAlertsData(alerts);
        
        // Fetch flock health
        const health = await fetch('/api/flocks/health').then(res => res.json());
        setFlockHealth(health);
        
        // Fetch mortality data
        const mortality = await fetch('/api/flocks/mortality').then(res => res.json());
        setMortalityData(mortality);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to sample data
        setVisitorData([
          { id: 1, name: "John Doe", purpose: "Veterinarian", time: "08:15 AM", risk: "Low" },
          { id: 2, name: "Jane Smith", purpose: "Feed Delivery", time: "09:30 AM", risk: "Medium" },
          { id: 3, name: "Mike Johnson", purpose: "Maintenance", time: "10:00 AM", risk: "Low" }
        ]);
        
        setAlertsData([
          { id: 1, type: "Humidity", location: "House #3", message: "Humidity at 78% (High)" },
          { id: 2, type: "Pest", location: "Feed Storage", message: "Rodent spotted near feed bags" }
        ]);
        
        setFlockHealth({ healthy: 85, atRisk: 10, infected: 5 });
        
        setMortalityData([
          { day: "Day 1", rate: 0.1 },
          { day: "Day 2", rate: 0.12 },
          { day: "Day 3", rate: 0.11 }
        ]);
      }
    };

    fetchData();
  }, []);

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
              data: [flockHealth.healthy, flockHealth.atRisk, flockHealth.infected],
              backgroundColor: ["#22c55e", "#facc15", "#ef4444"], // green-500, yellow-400, red-500
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
          labels: mortalityData.map(item => item.day),
          datasets: [
            {
              label: "Mortality Rate",
              data: mortalityData.map(item => item.rate),
              borderColor: "#16a34a", // green-600
              backgroundColor: "rgba(22, 163, 74, 0.1)",
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

    return () => {
      if (flockHealthChartRef.current) flockHealthChartRef.current.destroy();
      if (mortalityChartRef.current) mortalityChartRef.current.destroy();
    };
  }, [flockHealth, mortalityData]);

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

  // Alert icon mapping
  const getAlertIcon = (type) => {
    switch(type.toLowerCase()) {
      case "temperature":
        return <Thermometer className="w-5 h-5 text-red-500" />;
      case "pest":
        return <Rat className="w-5 h-5 text-yellow-500" />;
      case "humidity":
        return <Droplets className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Introduction Section */}
        <section id="introduction" className="py-16 bg-white rounded-lg shadow-sm my-6">
          <div className="text-center px-6">
            <ShieldCheck className="w-12 h-12 mx-auto text-green-500 mb-4" />
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Digital Biosecurity Framework
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Transforming poultry health through proactive, data-driven biosecurity measures.
              Our digital tools help prevent disease before it starts.
            </p>
          </div>
        </section>

        {/* Principles Section */}
        <section id="principles" className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Foundational Biosecurity Principles
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Understanding disease transmission is the first step in effective prevention.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Disease Transmission Routes
              </h3>
              <div className="space-y-3">
                {Object.entries(transmissionData).map(([key, data]) => (
                  <div
                    key={key}
                    onClick={() => setSelectedTransmission(key)}
                    className={`border p-4 rounded-lg flex items-center space-x-3 cursor-pointer transition-colors ${
                      selectedTransmission === key 
                        ? "border-green-500 bg-green-50" 
                        : "border-gray-200 hover:border-green-300"
                    }`}
                  >
                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                      {data.icon}
                    </div>
                    <span className="font-semibold">{data.title.split(" ")[0]}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              {selectedTransmission ? (
                <>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-full bg-green-100 text-green-600">
                      {transmissionData[selectedTransmission].icon}
                    </div>
                    <h4 className="text-lg font-bold text-gray-900">
                      {transmissionData[selectedTransmission].title}
                    </h4>
                  </div>
                  <p className="text-gray-600">
                    {transmissionData[selectedTransmission].text}
                  </p>
                </>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-500">Select a transmission route to view details</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">
              The Four Pillars of Biosecurity
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: <Construction className="w-8 h-8 text-green-600" />,
                  title: "Isolation",
                  text: "Separating new or returning animals from the main flock to prevent disease introduction."
                },
                {
                  icon: <TrafficCone className="w-8 h-8 text-green-600" />,
                  title: "Traffic Control",
                  text: "Managing movement of people, animals, and vehicles to minimize exposure risks."
                },
                {
                  icon: <SprayCan className="w-8 h-8 text-green-600" />,
                  title: "Sanitation",
                  text: "Rigorous cleaning and disinfection of all equipment and facilities."
                },
                {
                  icon: <Rat className="w-8 h-8 text-green-600" />,
                  title: "Pest Management",
                  text: "Control programs for rodents, insects, and wild birds that spread disease."
                },
              ].map((pillar) => (
                <div
                  key={pillar.title}
                  className="bg-white p-6 rounded-xl shadow-sm text-center hover:shadow-md transition-shadow"
                >
                  <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-green-100 flex items-center justify-center">
                    {pillar.icon}
                  </div>
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">{pillar.title}</h4>
                  <p className="text-gray-600">{pillar.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dashboard Section - Made Responsive */}
        <section id="dashboard" className="py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Biosecurity Dashboard
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Real-time monitoring of your farm's biosecurity status
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visitor Log - Full width on mobile, 2/3 on desktop */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-600" />
                  Daily Visitor Log
                </h3>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={visitorSearch}
                    onChange={(e) => setVisitorSearch(e.target.value)}
                    placeholder="Search visitors..."
                    className="w-32 sm:w-auto p-2 border border-gray-200 rounded-md text-sm"
                  />
                  <select
                    value={riskFilter}
                    onChange={(e) => setRiskFilter(e.target.value)}
                    className="p-2 border border-gray-200 rounded-md text-sm"
                  >
                    <option value="all">All Risks</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Purpose</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredVisitors.map((visitor) => (
                      <tr key={visitor.id}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{visitor.name}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{visitor.purpose}</td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{visitor.time}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            visitor.risk === "Low" ? "bg-green-100 text-green-800" :
                            visitor.risk === "Medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {visitor.risk}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Alerts - Full width on mobile, 1/3 on desktop */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
                Environmental Alerts
              </h3>
              <div className="space-y-4">
                {alertsData.map((alert) => (
                  <div key={alert.id} className="flex items-start space-x-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0 mt-1">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {alert.location}: {alert.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{alert.type} Alert</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Flock Health - Full width on mobile, 1/3 on desktop */}
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <HeartPulse className="w-5 h-5 mr-2 text-green-600" />
                Flock Health Status
              </h3>
              <div className="chart-container" style={{ height: "250px" }}>
                <canvas id="flockHealthChart"></canvas>
              </div>
            </div>

            {/* Mortality Chart - Full width on mobile, 2/3 on desktop */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                Weekly Mortality Rate Trend
              </h3>
              <div className="chart-container" style={{ height: "250px" }}>
                <canvas id="mortalityChart"></canvas>
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