import React, { useState } from "react";
import Modal from "react-modal";
import {
  FaEnvelope,
  FaPhone,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { getAbbreviation } from "../../../utils/formatCurrency";

const Modern = ({
  aboutMe,
  skills,
  tools,
  projects,
  contact,
  resume,
  websiteTitle,
  yearsOfExperience,
  fullName,
  profileImage,
  blogs,
}: any) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  return (
    <div className="bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center max-w-6xl mx-auto relative">
        <h1 className="text-2xl font-bold">{getAbbreviation(fullName)}</h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6 text-lg">
          <a href="#about" className="hover:text-gray-600">
            About
          </a>
          <a href="#projects" className="hover:text-gray-600">
            Projects
          </a>
          {blogs && blogs.length > 0 && (
            <a href="#blogs" className="hover:text-gray-600">
              Blogs
            </a>
          )}
          <a href="#contact" className="hover:text-gray-600">
            Contact
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="absolute top-16 left-0 w-full bg-gray-50 shadow-md flex flex-col space-y-4 py-6 px-6 md:hidden">
            <a
              href="#about"
              className="hover:text-gray-600"
              onClick={() => setMenuOpen(false)}
            >
              About
            </a>
            <a
              href="#projects"
              className="hover:text-gray-600"
              onClick={() => setMenuOpen(false)}
            >
              Projects
            </a>
            {blogs && blogs.length > 0 && (
              <a
                href="#blogs"
                className="hover:text-gray-600"
                onClick={() => setMenuOpen(false)}
              >
                Blogs
              </a>
            )}
            <a
              href="#contact"
              className="hover:text-gray-600"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="text-center py-12 px-4 sm:py-12 md:py-16 lg:py-20 max-w-4xl mx-auto">
        <p className="text-md sm:text-lg text-gray-600">Hey there, I’m</p>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mt-2">
          {fullName}
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 mt-4">{aboutMe}</p>
      </section>

      {/* Profile Image */}
      {profileImage && (
        <div className="w-full">
          <img
            src={profileImage}
            alt="Profile"
            className="w-full h-96 object-cover"
          />
        </div>
      )}

      {/* Skills & Tools */}
      <section className="py-12 px-4 sm:py-16 md:py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Skills & Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {[...skills, ...tools].map((item: string, index: number) => (
            <span
              key={index}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm text-center"
            >
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Recent Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {projects.map((project: any, index: number) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <img
                src={project.image1}
                alt={project.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="text-gray-600 mt-2">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Project Details Modal */}
      {selectedProject && (
        <Modal
          isOpen={!!selectedProject}
          onRequestClose={() => setSelectedProject(null)}
          className="bg-white p-6 md:p-8 rounded-lg w-full sm:w-3/4 md:w-1/2 mx-auto mt-24 overflow-y-auto max-h-[80vh] shadow-lg"
          overlayClassName="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-start pt-10"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-black">
              {selectedProject.title}
            </h2>
            <button
              onClick={() => setSelectedProject(null)}
              className="text-black text-2xl md:text-xl"
            >
              ✕
            </button>
          </div>

          {/* Project Details */}
          <div className="text-gray-700 mb-4 whitespace-pre-wrap break-words text-sm md:text-base">
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

          {/* Project Link */}
          <a
            href={selectedProject.link}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-orange-400 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold inline-block w-full md:w-auto text-center"
          >
            Check it Out
          </a>
        </Modal>
      )}

      {/* Blogs & Articles Section */}
      {blogs && blogs.length > 0 && (
        <section id="blogs" className="py-16 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Blogs & Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
            {blogs.map((blog: any, index: number) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold">{blog.title}</h3>
                  <a
                    href={blog.link}
                    className="text-blue-600 font-semibold mt-4 block"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-6">Let's Work Together</h2>
        <p className="text-lg text-gray-600">
          Reach out and let's build something amazing!
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <a
            href={`mailto:${contact.email}`}
            className="text-gray-800 text-lg flex items-center space-x-2"
          >
            <FaEnvelope /> <span>{contact.email}</span>
          </a>
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="text-gray-800 text-lg flex items-center space-x-2"
            >
              <FaPhone /> <span>{contact.phone}</span>
            </a>
          )}
          {contact.social?.github && (
            <a
              href={contact.social.github}
              target="_blank"
              className="text-gray-800 text-lg flex items-center space-x-2"
            >
              <FaGithub /> <span>GitHub</span>
            </a>
          )}
          {contact.social?.linkedin && (
            <a
              href={contact.social.linkedin}
              target="_blank"
              className="text-gray-800 text-lg flex items-center space-x-2"
            >
              <FaLinkedin /> <span>LinkedIn</span>
            </a>
          )}
          {contact.social?.twitter && (
            <a
              href={contact.social.twitter}
              target="_blank"
              className="text-gray-800 text-lg flex items-center space-x-2"
            >
              <FaTwitter /> <span>Twitter</span>
            </a>
          )}
        </div>
        {resume && (
          <a
            href={resume}
            target="_blank"
            className="mt-4 inline-block px-6 py-3 bg-black text-white rounded-full"
          >
            View Resume
          </a>
        )}
      </section>
    </div>
  );
};

export default Modern;
