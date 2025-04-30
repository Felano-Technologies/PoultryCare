import {
  FaUsers,
  FaComments,
  FaQuestionCircle,
  FaCalendarCheck,
  FaTimes,
} from "react-icons/fa";

const Sidebar = ({ isOpen, onClose }) => {
  const menuItems = [
    { icon: <FaUsers />, label: "Communities", href: "#communities" },
    { icon: <FaComments />, label: "Consult Experts", href: "#consultation" },
    { icon: <FaQuestionCircle />, label: "FAQs", href: "#faq" },
    { icon: <FaCalendarCheck />, label: "Book Appointment", href: "#booking" },
  ];

  const SidebarLink = ({ icon, label, href, onClick }) => (
    <a
      href={href}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
    >
      <span className="text-lg">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </a>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 p-4 bg-white border-r border-gray-200 shadow-sm sticky top-16 h-[calc(100vh-4rem)]">
        <h2 className="text-lg font-semibold text-gray-700 mb-6 px-2">Explore</h2>
        <nav className="flex flex-col gap-3">
          {menuItems.map((item, i) => (
            <SidebarLink key={i} {...item} />
          ))}
        </nav>
      </aside>

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-md z-50 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:hidden`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-700">Menu</h2>
          <button
            onClick={onClose}
            className="text-gray-600 text-xl"
            aria-label="Close Sidebar"
          >
            <FaTimes />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-4">
          {menuItems.map((item, i) => (
            <SidebarLink
              key={i}
              {...item}
              onClick={onClose} // Close sidebar after click
            />
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
