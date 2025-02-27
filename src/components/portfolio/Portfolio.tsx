import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import skillIcons from "../../utils/tools"; 
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import minimal from "../../assets/minimal.png";
import modern from "../../assets/modern.png";
import creative from "../../assets/creative.png";
import professional from "../../assets/professional.png";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth, storage } from "../../utils/firebaseConfig";
import {
  checkWebTitle,
  getFileFromBlobURL,
  getUsersPortfolioFormDetails,
  savePortfolio,
  uploadImageFile,
} from "../../api/portfolioAPI";
import { set } from "react-datepicker/dist/date_utils";
import Oval from "react-loading-icons/dist/esm/components/oval";
import ImageUpload from "./ImageUpload";
import { ToastContainer, toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import Select from "react-select"; // Using react-select for multi-select dropdown
import Minimal from "./templates/minimal";
import Modern from "./templates/Modern";
import Creative from "./templates/creative";
import Modal from "react-modal";
import Professional from "./templates/professional";

// Extract only the skill names from skillIcons
const toolSuggestions = Object.keys(skillIcons);

const Portfolio = () => {
  const [aboutMe, setAboutMe] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [user, setUser] = useState(auth.currentUser);
  const [projects, setProjects] = useState([
    {
      title: "",
      description: "",
      link: "",
      logo: "",
      image1: "",
      image2: "",
      details: "",
      tools: [],
    },
  ]);
  const [blogs, setBlogs] = useState([
    {
      title: "",
      link: "",
      image: "",
    },
  ]);
  const [websiteTitle, setWebsiteTitle] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [yearsOfExperience, setYearsOfExperience] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false); // Progress Indicator State
  const [resume, setResume] = useState<string | "">("");
  const [profileImage, setProfileImage] = useState<string | "">("");
  const [previewTheme, setPreviewTheme] = useState<string | null>(null); // State for modal preview

  const navigate = useNavigate();

  const removeSkill = (index: number) => {
    const newSkills = [...skills];
    newSkills.splice(index, 1);
    setSkills(newSkills);
  };

  const removeTool = (index: number) => {
    const newTools = [...tools];
    newTools.splice(index, 1);
    setTools(newTools);
  };

  const removeProject = (index: number) => {
    const newProjects = [...projects];
    newProjects.splice(index, 1);
    setProjects(newProjects);
  };
  useEffect(() => {
    // ✅ Ensure auth state is initialized before running Firestore queries
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser); // ✅ Store the authenticated user
      } else {
        console.error("User not authenticated.");
        navigate("/login");
        // router.push("/login"); // ✅ Redirect to login page if no user
      }
    });

    return () => unsubscribeAuth(); // ✅ Cleanup listener on unmount
  }, []);

  useEffect(() => {
    const fetchPortfolio = async () => {
      if (!user) return;

      const portfolio = await getUsersPortfolioFormDetails(user.uid);

      if (portfolio) {
        const {
          aboutMe,
          skills,
          tools,
          projects,
          contact,
          selectedTheme,
          websiteTitle,
          resume,
          fullName,
          yearsOfExperience,
          profileImage,
          blogs,
        }: any = portfolio;
        setAboutMe(aboutMe ?? "");
        setSkills(skills ?? []);
        setTools(tools ?? []);
        setProjects(
          projects ?? [
            {
              title: "",
              description: "",
              link: "",
              logo: "",
              image1: "",
              image2: "",
              details: "",
              tools: [],
            },
          ]
        );

        setContact(
          contact ?? {
            email: "", // Default value to user's email
            phone: "",
            social: { github: "", linkedin: "", twitter: "" },
          }
        );
        setSelectedTheme(selectedTheme ?? "");
        setWebsiteTitle(websiteTitle ?? "");
        setResume(resume ?? "");
        setFullName(fullName ?? "");
        setYearsOfExperience(yearsOfExperience ?? "");
        setProfileImage(profileImage ?? "");
        setBlogs(
          blogs ?? [
            {
              title: "",
              link: "",
              image: "",
            },
          ]
        );
      } else {
        if (contact.email == "") {
          setContact({ ...contact, email: auth.currentUser?.email || "" });
        }
      }
    };

    fetchPortfolio();
  }, [user]);
  const [contact, setContact] = useState({
    email: "", // Default value to user's email
    phone: "",
    social: { github: "", linkedin: "", twitter: "" },
  });
  const [selectedTheme, setSelectedTheme] = useState("default");

  const themes = [
    { name: "Minimal", image: minimal },
    { name: "Modern", image: modern },
    { name: "Creative", image: creative },
    { name: "Professional", image: professional },
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "40px",
  };

  const handleSkillAdd = () => setSkills([...skills, ""]);
  const handleToolAdd = () => setTools([...tools, ""]);
  const handleProjectAdd = () =>
    setProjects([
      ...projects,
      {
        title: "",
        description: "",
        link: "",
        logo: "",
        image1: "",
        image2: "",
        details: "",
        tools: [],
      },
    ]);

  const handleBlogAdd = () =>
    setBlogs([
      ...blogs,
      {
        title: "",
        link: "",
        image: "",
      },
    ]);

  const handleImageUpload = (index: number, key: string, file: File) => {
    const newProjects: any = [...projects];
    newProjects[index][key] = URL.createObjectURL(file);
    setProjects(newProjects);
  };

  const handleImageRemove = (index: number, key: string) => {
    const newProjects: any = [...projects];
    newProjects[index][key] = "";
    setProjects(newProjects);
  };

  const handleBlogsImageUpload = (index: number, key: string, file: File) => {
    const newBlogs: any = [...blogs];
    newBlogs[index][key] = URL.createObjectURL(file);

    setBlogs(newBlogs);
  };

  const handleBlogsImageRemove = (index: number, key: string) => {
    const newBlogs: any = [...blogs];
    newBlogs[index][key] = "";
    setBlogs(newBlogs);
  };
  const handleResumeUpload = (file: File) => {
    setResume(URL.createObjectURL(file));
  };
  const handleResumeRemove = () => {
    setResume("");
  };
  const handleProfileImageUpload = (file: File) => {
    setProfileImage(URL.createObjectURL(file));
  };
  const handleProfileImageRemove = () => {
    setProfileImage("");
  };

  const validatePortfolio = () => {
    let errors = [];
  
    // Validate Projects
    if (projects.length === 0) {
      errors.push("At least one project is required.");
    } else {
      projects.forEach((project, index) => {
        if (!project.title) errors.push(`Project ${index + 1} is missing a title.`);
        if (!project.description) errors.push(`Project ${index + 1} is missing a description.`);
        if (!project.link) errors.push(`Project ${index + 1} is missing a link.`);
        if (!project.logo) errors.push(`Project ${index + 1} is missing a logo.`);
        if (!project.image1) errors.push(`Project ${index + 1} is missing an image1.`);
        if (!project.image2) errors.push(`Project ${index + 1} is missing an image2.`);
        if (!project.details) errors.push(`Project ${index + 1} is missing details.`);
      });
    }
  
    // Validate Blogs
    if (blogs.length > 0) {
      blogs.forEach((blog, index) => {
        if (!blog.title) errors.push(`Blog ${index + 1} is missing a title.`);
        if (!blog.link) errors.push(`Blog ${index + 1} is missing a link.`);
        if (!blog.image) errors.push(`Blog ${index + 1} is missing an image.`);
      });
    }
  
    // Validate Contact
    if (!contact.email) errors.push("Contact email is required.");
    if (!contact.phone) errors.push("Contact phone number is required.");
    if (!contact.social.github) errors.push("GitHub profile link is required in social contact.");
  
    // Validate Basic Info
    if (!aboutMe) errors.push("About Me section is required.");
    if (!websiteTitle) errors.push("Website title is required.");
    if (!resume) errors.push("Resume link is required.");
    if (!fullName) errors.push("Full name is required.");
    if (!yearsOfExperience) errors.push("Years of experience field is required.");
    if (skills.length === 0) errors.push("At least one skill is required.");
    if (tools.length === 0) errors.push("At least one tool is required.");
  
    // Display errors using toast
    if (errors.length > 0) {
      toast.error(errors[0]);
      return false;
    }
  
    return true;
  };

  const handleSubmit = async () => {
    if (!user) return;

    setLoading(true); // Show progress indicator

    try {
      if (!(await checkWebTitle(websiteTitle, user.uid))) {
        toast.error(
          "Website title is already taken by another user. Please choose a different title."
        );
        return;
      }
      let resumeUrl;
      let profileImageUrl;
      if (profileImage.startsWith("blob:")) {
        const file = await getFileFromBlobURL(
          profileImage,
          `${profileImage}.png`
        );
        profileImageUrl = await uploadImageFile(
          `portfolios/${user.uid}/profileImage/${file.name}`,
          file
        );
      }
      if (resume.startsWith("blob:")) {
        const file = await getFileFromBlobURL(resume, `${resume}.pdf`);
        resumeUrl = await uploadImageFile(
          `portfolios/${user.uid}/${file.name}`,
          file
        );
      }
      const portfolioData = {
        aboutMe,
        skills,
        tools,
        projects,
        contact,
        selectedTheme,
        websiteTitle,
        resume: resumeUrl !== undefined ? resumeUrl : resume,
        fullName,
        yearsOfExperience,
        profileImage:
          profileImageUrl !== undefined ? profileImageUrl : profileImage,
        blogs,
      };
      await savePortfolio(portfolioData, user.uid);

      console.log("Portfolio Data:", portfolioData);
    } catch (error) {
      console.error("Error saving portfolio:", error);
    } finally {
      setLoading(false); // Hide progress indicator
    }
  };

  return (
    <div className="h-screen overflow-y-auto p-6 md:p-8 bg-gray-900 text-white min-h-screen">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
      <h1 className="text-2xl font-bold mb-6">Portfolio Management</h1>

      {/* Website Title */}
      <div className="mb-4">
        <h2 className="text-lg mb-2">Website Title</h2>
        <input
          type="text"
          className="w-full p-2 rounded-md bg-gray-700 text-white"
          value={websiteTitle}
          onChange={(e) => setWebsiteTitle(e.target.value.toLowerCase())}
          placeholder="e.g., your link becomes geynius.com/your-title"
        />
      </div>

      {/* About Me */}
      <div className="mb-4">
        <h2 className="text-lg mb-2">About Me</h2>
        <textarea
          className="w-full p-2 rounded-md bg-gray-700 text-white"
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          placeholder="Write about yourself..."
        />
      </div>

      {/* Full Name */}
      <div className="mb-4">
        <h2 className="text-lg mb-2">Full Name</h2>
        <input
          type="text"
          className="w-full p-2 rounded-md bg-gray-700 text-white"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="e.g., your full name"
        />
      </div>

      {/* Years of Experience */}
      <div className="mb-4">
        <h2 className="text-lg mb-2">Years of Experience</h2>

        <input
          type="number"
          name="yearsOfExperience"
          min="0"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(e.target.value)}
          placeholder="Years of Experience"
          className="w-full p-2 rounded-md bg-gray-700 text-white"
        />
      </div>
      {/* Profile Image  Upload */}
      <div className="mb-4">
        <ImageUpload
          onRemove={() => handleProfileImageRemove()}
          onUpload={(file) => handleProfileImageUpload(file)}
          url={profileImage}
          label="Profile Image"
        />
      </div>
      {/* Skills */}
      <div className="mb-4">
        <h2 className="text-lg mb-2">Skills</h2>
        {skills.map((skill, index) => (
          <div key={index} className="flex items-center mb-2">
            <input
              key={index}
              className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
              value={skill}
              onChange={(e) => {
                const newSkills = [...skills];
                newSkills[index] = e.target.value;
                setSkills(newSkills);
              }}
              placeholder="Skill"
            />
            <FaTimes
              className="text-red-500 ml-2 cursor-pointer"
              onClick={() => removeSkill(index)}
            />
          </div>
        ))}
        <button
          onClick={handleSkillAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Skill
        </button>
      </div>

      {/* Tools */}
      <div className="mb-4">
      <h2 className="text-lg mb-2">Tools</h2>

      {tools.map((tool, index) => (
        <div key={index} className="flex items-center mb-2">
          {/* Input with suggestions */}
          <input
            key={index}
            className="w-full p-2 rounded-md bg-gray-700 text-white"
            value={tool}
            onChange={(e) => {
              const newTools = [...tools];
              newTools[index] = e.target.value;
              setTools(newTools);
            }}
            placeholder="Tool"
            list="tools-list" // Connects input with datalist
          />

          {/* Remove Tool Button */}
          <FaTimes
            className="text-red-500 ml-2 cursor-pointer"
            onClick={() => removeTool(index)}
          />
        </div>
      ))}

      {/* Dropdown Suggestions */}
      <datalist id="tools-list">

        {toolSuggestions.map((tool:any, index:any) => (
          <option key={index} value={tool} />
        ))}
      </datalist>

      {/* Add Tool Button */}
      <button
        onClick={handleToolAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mt-2"
      >
        Add Tool
      </button>
    </div>

      {/* Responsive Projects Section */}
      <div className="mb-4">
        <h2 className="text-lg mb-2">Projects</h2>
        {projects.map((project, index) => (
          <div
            key={index}
            className="relative mb-4 border p-4 rounded-md bg-gray-800"
          >
            <input
              className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
              placeholder="Project Title"
              value={project.title}
              onChange={(e) => {
                const newProjects = [...projects];
                newProjects[index].title = e.target.value;
                setProjects(newProjects);
              }}
            />
            <input
              className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
              placeholder="Project Description"
              value={project.description}
              onChange={(e) => {
                const newProjects = [...projects];
                newProjects[index].description = e.target.value;
                setProjects(newProjects);
              }}
            />
            <input
              className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
              placeholder="Project Link"
              value={project.link}
              onChange={(e) => {
                const newProjects = [...projects];
                newProjects[index].link = e.target.value;
                setProjects(newProjects);
              }}
            />
            <textarea
              className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
              placeholder="Project Details"
              value={project.details ? JSON.parse(project.details) : ""}
              rows={6}
              onChange={(e) => {
                const newProjects = [...projects];
                newProjects[index].details = JSON.stringify(e.target.value);
                setProjects(newProjects);
              }}
            />

            {/* Responsive Tools Select */}
            <div>
              <label className="block text-white mb-2">Tools Used:</label>
              <Select
                isMulti
                options={tools.map((tool: string) => ({
                  value: tool,
                  label: tool,
                }))}
                value={
                  project.tools?.map((tool: string) => ({
                    value: tool,
                    label: tool,
                  })) || []
                }
                onChange={(selectedOptions) => {
                  const selectedTools = selectedOptions.map(
                    (option: any) => option.value
                  );
                  const newProjects = projects.map((p: any, idx: number) =>
                    idx === index ? { ...p, tools: selectedTools } : p
                  );
                  setProjects(newProjects);
                }}
                className="w-full p-2 bg-gray-700 text-black rounded-lg"
              />
            </div>

            {/* Responsive Image Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="w-full max-w-xs mx-auto">
                <ImageUpload
                  url={project.logo}
                  onUpload={(file) => handleImageUpload(index, "logo", file)}
                  onRemove={() => handleImageRemove(index, "logo")}
                  label="Logo Image"
                />
              </div>
              <div className="w-full max-w-xs mx-auto">
                <ImageUpload
                  url={project.image1}
                  onUpload={(file) => handleImageUpload(index, "image1", file)}
                  onRemove={() => handleImageRemove(index, "image1")}
                  label="Project Image 1"
                />
              </div>
              <div className="w-full max-w-xs mx-auto">
                <ImageUpload
                  url={project.image2}
                  onUpload={(file) => handleImageUpload(index, "image2", file)}
                  onRemove={() => handleImageRemove(index, "image2")}
                  label="Project Image 2"
                />
              </div>
            </div>

            {/* Remove Project Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => removeProject(index)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Remove Project
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={handleProjectAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Project
        </button>
      </div>

      {/* Responsive Blogs Section */}
      <div className="mb-4">
        <h2 className="text-lg mb-2">Blogs & Articles</h2>
        {blogs.map((blog, index) => (
          <div
            key={index}
            className="relative mb-4 border p-4 rounded-md bg-gray-800"
          >
            <input
              className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
              placeholder="Blog Title"
              value={blog.title}
              onChange={(e) => {
                const newBlogs = [...blogs];
                newBlogs[index].title = e.target.value;
                setBlogs(newBlogs);
              }}
            />

            <input
              className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
              placeholder="Blog Link"
              value={blog.link}
              onChange={(e) => {
                const newBlogs = [...blogs];
                newBlogs[index].link = e.target.value;
                setBlogs(newBlogs);
              }}
            />

            {/* Responsive Image Upload */}
            <div className="mb-4">
              <ImageUpload
                url={blog.image}
                onUpload={(file) =>
                  handleBlogsImageUpload(index, "image", file)
                }
                onRemove={() => handleBlogsImageRemove(index, "image")}
                label="Blog Image"
              />
            </div>

            {/* Remove Project Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  const newBlogs = [...blogs];
                  newBlogs.splice(index, 1);
                  setBlogs(newBlogs);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Remove Blog
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={handleBlogAdd}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Add Blogs
        </button>
      </div>

      {/* Contact */}
      <div className="mb-4">
        <h2 className="text-lg mb-2">Contact</h2>
        <input
          className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
          placeholder="Email"
          value={contact.email}
          onChange={(e) => setContact({ ...contact, email: e.target.value })}
        />
        <input
          className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
          placeholder="Phone"
          value={contact.phone}
          onChange={(e) => setContact({ ...contact, phone: e.target.value })}
        />
        <input
          className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
          placeholder="GitHub"
          value={contact.social.github}
          onChange={(e) =>
            setContact({
              ...contact,
              social: { ...contact.social, github: e.target.value },
            })
          }
        />
        <input
          className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
          placeholder="LinkedIn"
          value={contact.social.linkedin}
          onChange={(e) =>
            setContact({
              ...contact,
              social: { ...contact.social, linkedin: e.target.value },
            })
          }
        />
        <input
          className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
          placeholder="Twitter"
          value={contact.social.twitter}
          onChange={(e) =>
            setContact({
              ...contact,
              social: { ...contact.social, twitter: e.target.value },
            })
          }
        />
      </div>

      {/* Resume Upload */}
      <div className="mb-4">
        <ImageUpload
          onRemove={() => handleResumeRemove()}
          onUpload={(file) => handleResumeUpload(file)}
          url={resume}
          label="Upload Resume"
        />
      </div>

      {/* Theme Selection */}
      <h1 className="text-2xl font-bold mb-6">Select Portfolio Theme</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {themes.map((theme, index) => (
          <div
            key={index}
            className={`border rounded-lg overflow-hidden shadow-lg cursor-pointer transition-transform transform hover:scale-105 ${
              selectedTheme === theme.name
                ? "border-blue-500"
                : "border-gray-700"
            }`}
            // onClick={() => setSelectedTheme(theme.name)}
          >
            <img
              src={theme.image}
              alt={theme.name}
              className="w-full h-64 object-cover"
            />

            <div className="p-4">
              <h2 className="text-xl font-bold mb-1">{theme.name}</h2>
              {/* <p className="text-gray-400 text-sm">By {theme.author}</p> */}
              <div className="flex items-center my-2">
                <span className="text-yellow-400">★★★★★</span>
                <span className="text-gray-400 ml-2">(216)</span>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-md"
                  onClick={() => {
                    if ((theme.name === "Modern"|| theme.name === "Creative" || theme.name === "Professional" ) && profileImage === "") {
                      toast.error(
                        "Please upload a profile image for this theme."
                      );
                    } else {
                   
                    if (validatePortfolio()) {
                      setPreviewTheme(theme.name);
                    }
                  }
                  }}
                >
                  Live Preview
                </button>
                <button
                  className="text-white border border-white rounded-md px-4 py-2 hover:bg-white hover:text-gray-800 transition-colors duration-300"
                  onClick={() => {
                    if ((theme.name === "Modern"|| theme.name === "Creative" || theme.name === "Professional" ) && profileImage === "") {

                      toast.error(
                        "Please upload a profile image for this theme."
                      );
                    } else {
                      if(validatePortfolio()){
                      setSelectedTheme(theme.name);
                      }
                    }
                  }}
                >
                  Use this template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button with Progress Indicator */}
      <div className="text-center my-8">
        <button
          onClick={() => {
            if (validatePortfolio()) {
              handleSubmit();
            }
          }}
          className="bg-green-500 text-white px-6 py-3 rounded-md font-semibold text-lg shadow-lg"
          disabled={loading} // Disable button while loading
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <Oval stroke="#fff" width={24} height={24} />
              <span>Saving...</span>
            </div>
          ) : (
            "Save Portfolio"
          )}
        </button>
      </div>

      {/* 🔥 Live Preview Modal */}
      <Modal
       
       isOpen={!!previewTheme}
       onRequestClose={() => setPreviewTheme(null)}
       className="bg-white bg-opacity-90 p-6 md:p-8 rounded-lg w-11/12 md:w-5/6 lg:w-3/4 mx-auto mt-16 shadow-lg relative overflow-hidden max-h-[90vh] overflow-y-auto"
       overlayClassName="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center transition-opacity duration-300 ease-in-out"
     >
       {/* Close Button */}
       <button
         className="absolute top-4 right-4 text-gray-700 text-xl hover:text-red-500 transition-all"
         onClick={() => setPreviewTheme(null)}
       >
         ✕
       </button>
     
       {/* Content Container with Scrollability */}
       <div className="mt-4 overflow-y-auto">
          {previewTheme === "Minimal" && (
            <Minimal
              aboutMe={aboutMe}
              skills={skills}
              tools={tools}
              projects={projects}
              contact={contact}
              resume={resume}
              websiteTitle={websiteTitle}
              fullName={fullName}
              yearsOfExperience={yearsOfExperience}
            />
          )}
          {previewTheme === "Modern" && (
            <Modern
              aboutMe={aboutMe}
              skills={skills}
              tools={tools}
              projects={projects}
              contact={contact}
              resume={resume}
              websiteTitle={websiteTitle}
              fullName={fullName}
              yearsOfExperience={yearsOfExperience}
              profileImage={profileImage}
              blogs={blogs}
            />
          )}
          {previewTheme === "Creative" && (
            <Creative
              aboutMe={aboutMe}
              skills={skills}
              tools={tools}
              projects={projects}
              contact={contact}
              resume={resume}
              websiteTitle={websiteTitle}
              fullName={fullName}
              yearsOfExperience={yearsOfExperience}
              profileImage={profileImage}
              blogs={blogs}
            />
          )}
          {previewTheme === "Professional" && (
            <Professional
              aboutMe={aboutMe}
              skills={skills}
              tools={tools}
              projects={projects}
              contact={contact}
              resume={resume}
              websiteTitle={websiteTitle}
              fullName={fullName}
              yearsOfExperience={yearsOfExperience}
              profileImage={profileImage}
              blogs={blogs}
            />
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Portfolio;
