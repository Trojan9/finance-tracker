import React, { useState } from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import skillIcons from "../../../utils/tools";
import Modal from "react-modal";
import { getAbbreviation } from "../../../utils/formatCurrency";
import {
  FaBars,
  FaCode,
  FaEnvelope,
  FaGithub,
  FaLinkedin,
  FaMicrosoft,
  FaTimes,
  FaTwitter,
} from "react-icons/fa";

const getSkillIcon = (skill: any) => {
  return skillIcons[skill] || <FaCode className="text-4xl text-gray-500" />;
};
const Professional = ({
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
    <div className="bg-gray-50 text-black min-h-screen">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-10 py-6 relative">
        <h1 className="text-2xl font-bold">{getAbbreviation(fullName)}</h1>
        <div className="hidden md:flex space-x-6 text-lg">
          <a href="#about" className="hover:underline cursor-pointer">
            About
          </a>
          <a href="#projects" className="hover:underline cursor-pointer">
            Projects
          </a>
          {blogs && blogs.length > 0 && (
            <a href="#blogs" className="hover:underline cursor-pointer">
              Blogs
            </a>
          )}
          <a href="#contact" className="hover:underline cursor-pointer">
            Contact
          </a>
        </div>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </nav>
      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          className="md:hidden absolute top-16 left-0 w-full bg-gray shadow-lg py-4 flex flex-col items-center space-y-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <a href="#about" className="hover:underline cursor-pointer">
            About
          </a>
          <a href="#projects" className="hover:underline cursor-pointer">
            Projects
          </a>
          {blogs && blogs.length > 0 && (
            <a href="#blogs" className="hover:underline cursor-pointer">
              Blogs
            </a>
          )}
          <a href="#contact" className="hover:underline cursor-pointer">
            Contact
          </a>
        </motion.div>
      )}

      {/* Hero Section */}
      <section id="about" className="relative text-center py-20 px-6 md:px-0">
        <motion.h2
          className="text-4xl md:text-6xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Hey there, I’m
          <br />
          {fullName}
        </motion.h2>
        <motion.div
          className="mt-8 flex flex-col md:flex-row justify-center items-center relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
        >
          <motion.img
            src={profileImage}
            alt="Profile"
            className="w-60 h-60 md:w-80 md:h-80 object-cover shadow-xl rounded-xl z-10"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            className="absolute top-3 left-3 w-20 h-20 md:w-32 md:h-32 bg-gray-200 shadow-lg rounded-lg"
            initial={{ opacity: 0, x: -20, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
          />
          <motion.div
            className="absolute bottom-3 right-3 w-24 h-24 md:w-36 md:h-36 bg-gray-300 shadow-lg rounded-lg"
            initial={{ opacity: 0, x: 20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          />
        </motion.div>
        <motion.p
          className="text-lg md:text-xl text-gray-600 mt-6 max-w-3xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
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

      {/* Statistics Section */}
      <section className="py-16 bg-gray-100 text-center">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            className="text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {yearsOfExperience}+
            <p className="text-lg text-gray-600">Years of experience</p>
          </motion.div>
          <motion.div
            className="text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
          >
            95%
            <p className="text-lg text-gray-600">Client satisfaction</p>
          </motion.div>
          <motion.div
            className="text-4xl font-bold"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4 }}
          >
            {projects.length}+
            <p className="text-lg text-gray-600">Projects delivered</p>
          </motion.div>
        </div>
      </section>
      {/* Skills & Tools Section */}
      <section  className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-6">Skills</h2>
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {skills.map((skill: any, index: any) => (
            <motion.div
              key={index}
              className="flex flex-col items-center justify-center space-y-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              {getSkillIcon(skill)}
              <span className="text-lg">{skill}</span>
            </motion.div>
          ))}
        </div>

        <h2 className="text-3xl font-bold mt-16 mb-6">Tools I Use</h2>
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {tools.map((tool: any, index: any) => (
            <motion.div
              key={index}
              className="flex flex-col items-center justify-center space-y-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              {getSkillIcon(tool)}
              <span className="text-lg">{tool}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-8">Recent Projects</h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project: any, index: any) => (
            <motion.div
              key={index}
              className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img
                src={project.image1}
                alt={project.title}
                className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div
                className="absolute inset-0 bg-transparent bg-opacity-50 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                onClick={() => setSelectedProject(project)}
              >
                <div className="bg-white text-black px-6 py-3 rounded-full text-lg font-semibold">
                  View Project
                </div>
              </div>
              <div className="p-4 text-left bg-white">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
            </motion.div>
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

      {/* Blogs Section */}
      <section id="blogs" className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl font-bold mb-8">Latest Blogs</h2>
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog: any, index: any) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{blog.title}</h3>
                <p className="text-gray-600 mb-4">{blog.summary}</p>
                <span className="text-gray-400 text-sm">{blog.date}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
      {/* Contact Section */}
      <section id="contact" className="py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">Let's Work Together</h2>
        <p className="text-lg text-gray-400">
          Reach out and let's build something amazing!
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <a
            href={`mailto:${contact.email}`}
            className="text-gray-400 text-lg flex items-center space-x-2"
          >
            <FaEnvelope /> <span>{contact.email}</span>
          </a>
          {contact.social?.github && (
            <a href={contact.social.github} className="text-gray-400 text-lg">
              <FaGithub />
            </a>
          )}
          {contact.social?.linkedin && (
            <a href={contact.social.linkedin} className="text-gray-400 text-lg">
              <FaLinkedin />
            </a>
          )}
          {contact.social?.twitter && (
            <a href={contact.social.twitter} className="text-gray-400 text-lg">
              <FaTwitter />
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

export default Professional;
