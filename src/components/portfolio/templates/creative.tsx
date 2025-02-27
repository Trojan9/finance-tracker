import React, { useState } from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import { Code, FileText, Github, Mail, PenTool } from "lucide-react"; // Using lucide-react icons
import {
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaPhone,
  FaTwitter,
} from "react-icons/fa";
import { getAbbreviation } from "../../../utils/formatCurrency";

const Creative = ({
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
  const skillIcons = [Code, Code, PenTool]; // Example icons for each skill
  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navbar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="w-full px-6 py-4 flex justify-between items-center max-w-6xl mx-auto"
      >
        {/* Logo / Name */}
        <h1 className="text-2xl font-bold tracking-wide">
          {getAbbreviation(fullName)}
        </h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 text-lg">
          <a href="#about" className="hover:text-gray-400 transition">
            About
          </a>
          <a href="#projects" className="hover:text-gray-400 transition">
            Projects
          </a>
          {blogs && blogs.length > 0 && (
            <a href="#blogs" className="hover:text-gray-400 transition">
              Blogs
            </a>
          )}
          <a href="#contact" className="hover:text-gray-400 transition">
            Contact
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </motion.nav>

      {/* Mobile Menu (Only visible when open) */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="md:hidden absolute top-16 left-0 w-full bg-black text-white py-4 px-6 shadow-lg"
        >
          <a
            href="#about"
            className="block py-2"
            onClick={() => setMenuOpen(false)}
          >
            About
          </a>
          <a
            href="#projects"
            className="block py-2"
            onClick={() => setMenuOpen(false)}
          >
            Projects
          </a>
          {blogs && blogs.length > 0 && (
            <a
              href="#blogs"
              className="block py-2"
              onClick={() => setMenuOpen(false)}
            >
              Blogs
            </a>
          )}
          <a
            href="#contact"
            className="block py-2"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </a>
        </motion.div>
      )}

      {/* Hero Section */}
      <section className="relative text-center py-16 px-6 max-w-4xl mx-auto">
        <p className="text-lg text-gray-400">Hey there, I’m</p>
        <h1 className="text-5xl md:text-7xl font-extrabold mt-2 text-white">
          {fullName}
        </h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-xl text-gray-400 mt-4"
        >
          <Typewriter
            words={[aboutMe]}
            loop={false}
            cursor
            cursorStyle="|"
            typeSpeed={50}
          />
        </motion.p>
      </section>

      {/* Profile Image */}
      {profileImage && (
        <div className="w-full flex justify-center">
          <img
            src={profileImage}
            alt="Profile"
            className="w-full h-96 object-cover"
          />
        </div>
      )}

     {/* Skills & Tools Section */}
<section className="py-12 px-6 max-w-6xl mx-auto">

  <h2 className="text-3xl font-bold  mb-12">Skills & Tools</h2>
  
  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
    {/* Skills Section - Styled as Timeline */}
    <div>
      <h3 className="text-2xl font-semibold mb-6 text-blue-500">Skills</h3>
      <div className="relative border-l-4 border-orange-500 pl-6 space-y-6">
        {skills.map((skill: string, index: number) => (
            
          <div key={index} className="flex items-center space-x-4">
            {/* Timeline Dot */}
            <span className="absolute -left-3 w-4 h-4 bg-orange-500 rounded-full"></span>
            {/* Skill Icon (Using a placeholder for now) */}
            <span className="text-2xl">
              {skill.toLowerCase().includes("development") ? "💻" : "✍️"}
            </span>
            {/* Skill Name */}
            <span className="text-lg font-medium text-white">{skill}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Tools Section - Styled as Grid */}
    <div>
      <h3 className="text-2xl font-semibold mb-6 text-green-500">Tools</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {tools.map((tool: string, index: number) => (
          <motion.span
            key={index}
            className="bg-green-500 text-white px-4 py-2 rounded-full text-sm text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            {tool}
          </motion.span>
        ))}
      </div>
    </div>
  </div>
</section>


      {/* Projects */}
      <section id="projects" className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Recent Projects</h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 "
        >
          {projects.map((project: any, index: number) => (
            <div
              key={index}
              className="bg-gray-900 rounded-lg shadow-md overflow-hidden cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <img
                src={project.image1}
                alt={project.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="text-gray-400 mt-2">{project.description}</p>
                <a
                  href={project.link}
                  className="text-blue-400 font-semibold mt-4 block"
                >
                  View Project →
                </a>
              </div>
            </div>
          ))}
        </motion.div>

        {selectedProject && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-60 backdrop-blur-md z-50 px-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="bg-gray-900 text-white rounded-lg w-full max-w-4xl p-6 md:p-8 shadow-lg relative overflow-y-auto max-h-[80vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-200 text-2xl"
              >
                ✕
              </button>

              {/* Title */}
              <h2 className="text-3xl font-bold mb-4">
                {selectedProject.title}
              </h2>

              {/* Description */}
              <p className="text-gray-300 mb-6">
                {selectedProject.details.replace(/\\n/g, "\n")}
              </p>

              {/* Images */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <motion.img
                  src={selectedProject.image1}
                  alt="Project Screenshot 1"
                  className="rounded-lg w-full h-auto shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                />
                <motion.img
                  src={selectedProject.image2}
                  alt="Project Screenshot 2"
                  className="rounded-lg w-full h-auto shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                />
              </div>

              {/* Tools Used */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">Tools Used</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedProject.tools?.map((tool: string, index: number) => (
                    <motion.span
                      key={index}
                      className="bg-gray-700 text-white px-3 py-1 rounded-lg text-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      {tool}
                    </motion.span>
                  ))}
                </div>
              </div>

              {/* Project Link */}
              <motion.a
                href={selectedProject.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                Check it Out →
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </section>

      {/* Blogs & Articles */}
      {blogs && blogs.length > 0 && (
        <section id="blogs" className="py-16 px-6 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Blogs & Articles</h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6"
          >
            {blogs.map((blog: any, index: number) => (
              <div
                key={index}
                className="bg-gray-900 rounded-lg shadow-md overflow-hidden"
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
                    className="text-blue-400 font-semibold mt-4 block"
                  >
                    Read More →
                  </a>
                </div>
              </div>
            ))}
          </motion.div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6 bg-gray-900 text-center">
        <h2 className="text-3xl font-bold mb-6">Let's Work Together</h2>
        <p className="text-lg text-gray-400">
          Reach out and let's build something amazing!
        </p>
        <div className="mt-6 flex justify-center space-x-4 flex-wrap">
          <a
            href={`mailto:${contact.email}`}
            className="text-gray-200 text-lg flex items-center space-x-2"
          >
            <FaEnvelope /> <span>{contact.email}</span>
          </a>
          {contact.phone && (
            <a
              href={`tel:${contact.phone}`}
              className="text-gray-200 text-lg flex items-center space-x-2"
            >
              <FaPhone /> <span>{contact.phone}</span>
            </a>
          )}
          {contact.social?.github && (
            <a
              href={contact.social.github}
              target="_blank"
              className="text-gray-200 text-lg flex items-center space-x-2"
            >
              <FaGithub /> <span>GitHub</span>
            </a>
          )}
          {contact.social?.linkedin && (
            <a
              href={contact.social.linkedin}
              target="_blank"
              className="text-gray-200 text-lg flex items-center space-x-2"
            >
              <FaLinkedin /> <span>LinkedIn</span>
            </a>
          )}
          {contact.social?.twitter && (
            <a
              href={contact.social.twitter}
              target="_blank"
              className="text-gray-200 text-lg flex items-center space-x-2"
            >
              <FaTwitter /> <span>Twitter</span>
            </a>
          )}
        </div>
        {resume && (
          <a
            href={resume}
            target="_blank"
            className="mt-4 inline-block px-6 py-3 bg-blue-600 text-white rounded-full"
          >
            View Resume
          </a>
        )}
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500">
        <p>
          &copy; {new Date().getFullYear()} {fullName}. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Creative;
