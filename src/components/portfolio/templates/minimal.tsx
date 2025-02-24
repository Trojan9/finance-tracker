import React from "react";
import heroContent from "../../../assets/heroContent.png";
import { Code, FileText, Github, Mail, PenTool } from "lucide-react"; // Using lucide-react icons
const Minimal = ({
  aboutMe,
  skills,
  tools,
  projects,
  contact,
  resume,
  websiteTitle,
}: any) => {
    const skillIcons = [Code, Code, PenTool]; // Example icons for each skill
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full bg-gray-900 text-white z-50 border-b border-gray-700 p-6">
        <div className="flex justify-between items-center px-12">
          <h1 className="text-3xl font-bold" style={{ color: '#eb6846' }}>{websiteTitle.toUpperCase()}.</h1>
          <ul className="flex space-x-6">
            <li className="cursor-pointer">Home</li>
            <li className="cursor-pointer">About</li>
            <li className="cursor-pointer">Projects</li>
            <li className="cursor-pointer">Contact</li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex justify-between items-center px-12 px-6 py-16">
        <div>
          <h2 className="text-4xl font-bold">
            Hello<span style={{ color: '#eb6846' }}>.</span>
          </h2>
          {/* <p className="text-3xl mt-4">I'm {websiteTitle}</p> */}
          <div className="text-2xl font-extrabold mt-4 whitespace-pre-line max-h-[12rem] overflow-hidden">
            {aboutMe}
          </div>
          <div className="flex space-x-4 mt-6">
            <button className="bg-orange-400 text-white px-6 py-3 rounded-full">
              Got a project?
            </button>
            <button className="border border-orange-400 text-white px-6 py-3 rounded-full">
              My resume
            </button>
          </div>
        </div>
        <div>

          <img
            src={heroContent}
            alt="Hero Illustration"
            className="w-[600px] h-auto"
          />
        </div>
      </section>


      {/* Tools Section */}
      <section className="py-8 bg-gray-800">
        <div className="overflow-x-auto whitespace-nowrap px-10">
          <div className="inline-flex space-x-8">
            {tools.map((tool: string, index: number) => (
              <span key={index} className="text-lg text-gray-300 cursor-pointer">
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

            {/* Skills Section */}
      <section className="grid grid-cols-2 gap-8 px-10 py-16">
        <div className="space-y-6 border-r border-gray-700 pr-10">
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
          <div className="flex space-x-8">
            <div>

              <h3 className="text-3xl font-bold text-white">{projects.length}<span className="text-orange-400">+</span></h3>
              <p className="text-gray-400">Completed Projects</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">95<span className="text-orange-400">%</span></h3>
              <p className="text-gray-400">Client Satisfaction</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-white">4<span className="text-orange-400">+</span></h3>
              <p className="text-gray-400">Years of experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-16 px-10">
        <h2 className="text-4xl font-bold text-center mb-12">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project: any, index: number) => (
            <div key={index} className="bg-gray-800 p-6 rounded-lg flex items-center space-x-6">
              <div className="w-16 h-16 flex-shrink-0">
                <img src={project.logo} alt={project.title} className="rounded-full object-cover w-full h-full" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">{project.title}</h3>
                <p className="text-gray-400 mb-4">{project.description}</p>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-orange-400 font-semibold">
                  View Project
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-10 text-center">
        <h2 className="text-4xl font-bold mb-6">Contact</h2>
        <p className="text-xl mb-6">Have a project? Let's talk!</p>
        <a
          href={`mailto:${contact.email}`}
          className="bg-orange-400 text-white px-6 py-3 rounded-lg font-semibold inline-block"
        >
          Send an Email
        </a>
        <div className="mt-6 flex justify-center space-x-6">
          {contact.social.github && (
            <a href={contact.social.github} target="_blank" rel="noopener noreferrer" className="text-white">
              <Github size={24} />
            </a>
          )}
          <a href={`mailto:${contact.email}`} className="text-white">
            <Mail size={24} />
          </a>
        </div>
        <p className="mt-8 text-gray-500">{(new Date()).getFullYear()} @ GEYNIUS INC.</p>
      </section>
    </div>
  );
};

export default Minimal;
