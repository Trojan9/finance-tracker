import React from "react";
import { FaEnvelope, FaPhone, FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

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
}: any) => {
  return (
    <div className="bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">{websiteTitle}</h1>
        <div className="hidden md:flex space-x-6 text-lg">
          <a href="#about" className="hover:text-gray-600">About</a>
          <a href="#projects" className="hover:text-gray-600">Projects</a>
          <a href="#contact" className="hover:text-gray-600">Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="text-center py-16 px-6 max-w-4xl mx-auto">
        <p className="text-lg text-gray-600">Hey there, I’m</p>
        <h1 className="text-5xl md:text-7xl font-extrabold mt-2">{fullName}</h1>
        <p className="text-xl text-gray-600 mt-4">{aboutMe}</p>
      </section>

      {/* Skills & Tools */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Skills & Tools</h2>
        <div className="flex flex-wrap gap-3">
          {[...skills, ...tools].map((item: string, index: number) => (
            <span key={index} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm">
              {item}
            </span>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Recent Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project: any, index: number) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img src={project.image1} alt={project.title} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="text-gray-600 mt-2">{project.description}</p>
                <a href={project.link} className="text-blue-600 font-semibold mt-4 block">View Project →</a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6 bg-gray-100 text-center">
        <h2 className="text-3xl font-bold mb-6">Let's Work Together</h2>
        <p className="text-lg text-gray-600">Reach out and let's build something amazing!</p>
        <div className="mt-6 flex justify-center space-x-4">
          <a href={`mailto:${contact.email}`} className="text-gray-800 text-lg flex items-center space-x-2">
            <FaEnvelope /> <span>{contact.email}</span>
          </a>
          {contact.phone && (
            <a href={`tel:${contact.phone}`} className="text-gray-800 text-lg flex items-center space-x-2">
              <FaPhone /> <span>{contact.phone}</span>
            </a>
          )}
          {contact.social?.github && (
            <a href={contact.social.github} target="_blank" className="text-gray-800 text-lg flex items-center space-x-2">
              <FaGithub /> <span>GitHub</span>
            </a>
          )}
          {contact.social?.linkedin && (
            <a href={contact.social.linkedin} target="_blank" className="text-gray-800 text-lg flex items-center space-x-2">
              <FaLinkedin /> <span>LinkedIn</span>
            </a>
          )}
          {contact.social?.twitter && (
            <a href={contact.social.twitter} target="_blank" className="text-gray-800 text-lg flex items-center space-x-2">
              <FaTwitter /> <span>Twitter</span>
            </a>
          )}
        </div>
        {resume && (
          <a href={resume} target="_blank" className="mt-4 inline-block px-6 py-3 bg-black text-white rounded-full">
            View Resume
          </a>
        )}
      </section>
    </div>
  );
};

export default Modern;
