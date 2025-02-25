import React, { useState } from "react";
import heroContent from "../../../assets/heroContent.png";
import { Code, FileText, Github, Mail, PenTool } from "lucide-react"; // Using lucide-react icons
import Select from "react-select";
import Modal from "react-modal";
const Minimal = ({
  aboutMe,
  skills,
  tools,
  projects,
  contact,
  resume,
  websiteTitle,
  yearsOfExperience,
  fullName,
}: any) => {

  const skillIcons = [Code, Code, PenTool]; // Example icons for each skill
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const getAbbreviation = (fullName: string) => {
    return fullName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  };
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white z-50 border-b border-gray-700 p-6">
        <div className="flex justify-between items-center px-6 lg:px-12">
          <h1
            className="text-2xl lg:text-3xl font-bold cursor-pointer"
            style={{ color: "#eb6846" }}
            onClick={() =>
              document
                .getElementById("home")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            {getAbbreviation(fullName)}.
          </h1>

          {/* Desktop Nav */}
          <ul className="hidden lg:flex space-x-6">
            <li
              className="cursor-pointer"
              onClick={() =>
                document
                  .getElementById("home")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Home
            </li>
            <li
              className="cursor-pointer"
              onClick={() =>
                document
                  .getElementById("about")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              About
            </li>
            <li
              className="cursor-pointer"
              onClick={() =>
                document
                  .getElementById("projects")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Projects
            </li>
            <li
              className="cursor-pointer"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Contact
            </li>
          </ul>

          {/* Mobile Menu Icon */}
          <div className="lg:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white focus:outline-none"
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-gray-800 text-white py-4 px-6 space-y-4">
            <div className="flex justify-end items-center mb-4">
              <button
                onClick={() => setMenuOpen(false)}
                className="text-white text-xl"
              >
                ✕
              </button>
            </div>
            <ul className="space-y-4">
              <li
                className="cursor-pointer"
                onClick={() => {
                  setMenuOpen(false);
                  document
                    .getElementById("home")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Home
              </li>
              <li
                className="cursor-pointer"
                onClick={() => {
                  setMenuOpen(false);
                  document
                    .getElementById("about")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                About
              </li>
              <li
                className="cursor-pointer"
                onClick={() => {
                  setMenuOpen(false);
                  document
                    .getElementById("projects")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Projects
              </li>
              <li
                className="cursor-pointer"
                onClick={() => {
                  setMenuOpen(false);
                  document
                    .getElementById("contact")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Contact
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        className="flex flex-col-reverse lg:flex-row justify-between items-center px-6 lg:px-12 py-12 lg:py-16 space-y-8 lg:space-y-0"
      >
        <div className="text-center lg:text-left">
          <h2 className="text-3xl lg:text-4xl font-bold pt-5">
            Hello<span style={{ color: "#eb6846" }}>.</span>
          </h2>
          <p className="text-2xl lg:text-3xl mt-4">I'm {fullName}</p>
          <div className="text-lg lg:text-2xl font-extrabold mt-4 whitespace-pre-line max-h-[12rem] overflow-hidden">
            {aboutMe}
          </div>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4 mt-6">
            <button
              className="bg-orange-400 text-white px-6 py-3 rounded-full"
              onClick={() => {
                setMenuOpen(false);
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Got a project?
            </button>

            <a
              href={resume}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-orange-400 text-white px-6 py-3 rounded-full"
            >
              My resume
            </a>
          </div>
        </div>

        <div className="w-full lg:w-[600px]">
          <img
            src={heroContent}
            alt="Hero Illustration"
            className="w-full h-auto"
          />
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-8 bg-gray-800">
        <div className="px-6 lg:px-10">
          <div className="flex flex-wrap lg:overflow-x-auto lg:whitespace-nowrap gap-4 lg:gap-8 justify-center lg:justify-start">
            {tools.map((tool: string, index: number) => (
              <span
                key={index}
                className="text-lg text-gray-300 cursor-pointer bg-gray-700 px-4 py-2 rounded-lg"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section nd about*/}
      <section
        id="about"
        className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6 md:px-10 py-16"
      >
        {/* Skills Section */}
        <div className="space-y-6 md:border-r border-gray-700 md:pr-10">
          {skills.map((skill: string, index: number) => {
            const Icon = skillIcons[index % skillIcons.length];
            return (
              <div key={index} className="flex items-center space-x-4">
                <Icon className="text-white bg-orange-400 p-2 rounded-full w-10 h-10" />
                <span className="text-lg">{skill}</span>
              </div>
            );
          })}
        </div>

        {/* About Me Section */}
        <div>
          <h2 className="text-4xl font-bold mb-4">About me</h2>
          <p className="text-lg text-gray-300 mb-6">{aboutMe}</p>

          <div className="grid grid-cols-3 gap-4 md:flex md:space-x-8">
            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold text-white">
                {projects.length}
                <span className="text-orange-400">+</span>
              </h3>
              <p className="text-gray-400">Completed Projects</p>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold text-white">
                95<span className="text-orange-400">%</span>
              </h3>
              <p className="text-gray-400">Client Satisfaction</p>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-3xl font-bold text-white">
                {yearsOfExperience}
                <span className="text-orange-400">+</span>
              </h3>
              <p className="text-gray-400">Years of experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 px-6 md:px-10">
        <h2 className="text-4xl font-bold text-center mb-12">Projects</h2>

        <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 place-items-center lg:place-items-stretch">
          {projects.map((project: any, index: number) => (
            <div
              key={index}
              className="bg-gray-800 p-6 rounded-lg space-y-4 cursor-pointer hover:shadow-lg transition-shadow w-full"
              onClick={() => setSelectedProject(project)}
            >
              <div className="flex items-center space-x-6">
                <div className="w-16 h-16 flex-shrink-0">
                  <img
                    src={project.logo}
                    alt={project.title}
                    className="rounded-full object-cover w-full h-full"
                  />
                </div>

                <div>
                  <h3 className="text-xl md:text-2xl font-bold">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  <p
                    // href={project.link}
                    // target="_blank"
                    // rel="noopener noreferrer"
                    className="text-orange-400 font-semibold"
                  >
                    View Project
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6 md:px-10 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">Contact</h2>
        <p className="text-lg md:text-xl mb-6">Have a project? Let's talk!</p>

        {/* Email Button */}
        <a
          href={`mailto:${contact.email}`}
          className="bg-orange-400 text-white px-6 py-3 rounded-lg font-semibold inline-block w-full sm:w-auto"
        >
          Send an Email
        </a>

        {/* Social Links */}
        <div className="mt-6 flex justify-center space-x-6">
          {/* Phone */}
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="text-white"
              aria-label="Phone"
            >
              📞 {contact.phone}
            </a>
          )}

          {/* GitHub */}
          {contact.social.github && (
            <a
              href={contact.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
          )}

          {/* LinkedIn */}
          {contact.social.linkedin && (
            <a
              href={contact.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
              aria-label="LinkedIn"
            >
              <i className="fab fa-linkedin text-2xl"></i>{" "}
              {/* Optional: Use lucide-react icon */}
            </a>
          )}

          {/* Twitter */}
          {contact.social.twitter && (
            <a
              href={contact.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white"
              aria-label="Twitter"
            >
              <i className="fab fa-twitter text-2xl"></i>{" "}
              {/* Optional: Use lucide-react icon */}
            </a>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-gray-500 text-sm md:text-base">
          {new Date().getFullYear()} @ GEYNIUS INC.
        </p>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onRequestClose={() => setSelectedProject(null)}
          className="bg-gray-800 p-6 md:p-8 rounded-lg w-full sm:w-3/4 md:w-1/2 mx-auto mt-24 overflow-y-auto max-h-[80vh]"
          overlayClassName="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-start pt-10"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {selectedProject.title}
            </h2>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-white text-2xl md:text-xl"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[60vh]">
            {/* Project Details */}
            <div className="text-gray-300 mb-4 whitespace-pre-wrap break-words text-sm md:text-base">
              {selectedProject.details.replace(/\\n/g, "\n")}
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <img
                src={selectedProject.image1}
                alt="Project Screenshot 1"
                className="rounded-lg w-full h-auto"
              />
              <img
                src={selectedProject.image2}
                alt="Project Screenshot 2"
                className="rounded-lg w-full h-auto"
              />
            </div>

            {/* Tools Used */}
            <div className="mb-6">
              <h3 className="text-lg md:text-xl font-bold mb-2 text-white">
                Tools Used
              </h3>
              <div className="flex flex-wrap gap-2 md:gap-4">
                {selectedProject.tools?.map((tool: string, index: number) => (
                  <span
                    key={index}
                    className="bg-gray-700 px-3 py-1 text-white rounded-lg inline-block text-sm md:text-base"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Link */}
            <a
              href={selectedProject.link}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-orange-400 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold inline-block w-full md:w-auto text-center"
            >
              Check it Out
            </a>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Minimal;
