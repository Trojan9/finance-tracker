import React from "react";
import { motion } from "framer-motion";

import { FaEnvelope, FaGithub, FaLinkedin, FaPhone, FaTwitter } from "react-icons/fa";

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
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      {/* Navbar */}
      <motion.nav 
        className="w-full px-6 py-4 flex justify-between items-center max-w-6xl mx-auto"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-2xl font-bold">{websiteTitle}</h1>
        <div className="hidden md:flex space-x-6 text-lg">
          <a href="#about" className="hover:text-orange-400">About</a>
          <a href="#projects" className="hover:text-orange-400">Projects</a>
          {blogs && blogs.length > 0 && <a href="#blogs" className="hover:text-orange-400">Blogs</a>}
          <a href="#contact" className="hover:text-orange-400">Contact</a>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section
        className="text-center py-16 px-6 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <p className="text-lg text-orange-400">Hey there, I’m</p>
        <h1 className="text-5xl md:text-7xl font-extrabold mt-2">{fullName}</h1>
        <p className="text-xl text-gray-400 mt-4">{aboutMe}</p>
      </motion.section>

      {/* Profile Image */}
      {profileImage && (
        <motion.div
          className="w-full flex justify-center mt-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        >
          <img
            src={profileImage}
            alt="Profile"
            className="w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-orange-400"
          />
        </motion.div>
      )}

      {/* Skills & Tools */}
      <motion.section
        className="py-16 px-6 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Skills & Tools</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {[...skills, ...tools].map((item: string, index: number) => (
            <motion.span
              key={index}
              className="bg-orange-400 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold"
              whileHover={{ scale: 1.1 }}
            >
              {item}
            </motion.span>
          ))}
        </div>
      </motion.section>

      {/* Projects */}
      <motion.section
        id="projects"
        className="py-16 px-6 max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center">Recent Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: any, index: number) => (
            <motion.div
              key={index}
              className="bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
            >
              <img src={project.image1} alt={project.title} className="w-full h-64 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold">{project.title}</h3>
                <p className="text-gray-600 mt-2">{project.description}</p>
                <a href={project.link} className="text-orange-400 font-semibold mt-4 block">View Project →</a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Blogs & Articles */}
      {blogs && blogs.length > 0 && (
        <motion.section
          id="blogs"
          className="py-16 px-6 max-w-6xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Blogs & Articles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog: any, index: number) => (
              <motion.div
                key={index}
                className="bg-white text-gray-900 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-all"
                whileHover={{ scale: 1.05 }}
              >
                {blog.image && <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover" />}
                <div className="p-6">
                  <h3 className="text-xl font-bold">{blog.title}</h3>
                  <a href={blog.link} className="text-orange-400 font-semibold mt-4 block">Read More →</a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Contact */}
      <motion.section
        id="contact"
        className="py-16 px-6 bg-gray-800 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <h2 className="text-3xl font-bold mb-6">Let's Work Together</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {contact.email && <a href={`mailto:${contact.email}`} className="flex items-center space-x-2 text-orange-400"><FaEnvelope /> <span>{contact.email}</span></a>}
          {contact.phone && <a href={`tel:${contact.phone}`} className="flex items-center space-x-2 text-orange-400"><FaPhone /> <span>{contact.phone}</span></a>}
          {contact.social?.github && <a href={contact.social.github} className="flex items-center space-x-2 text-orange-400"><FaGithub /> <span>GitHub</span></a>}
        </div>
      </motion.section>
    </div>
  );
};

export default Creative;
