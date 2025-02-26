/* eslint-disable no-var */
import {
  collection,
  getDocs,
  where,
  query,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {  toast } from "react-toastify";
import { db } from "../utils/firebaseConfig";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const addUser = async (user: any) => {
  const usersRef = collection(db, "Users");

  await setDoc(doc(usersRef), user);

  localStorage.setItem("user", JSON.stringify(user));
};

export const getUsersPortfolioFormDetailsSlug = async (webTitle: string) => {
  const PortfolioRef = collection(db, "portfolio");

  // Create a query against the collection.
  const q = query(PortfolioRef);
  const querySnapshot = await getDocs(q);
  var portfolio = null;
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    if (doc.data().websiteTitle == webTitle) {
      portfolio = doc.data();
    }
  });
  //   localStorage.setItem("user", JSON.stringify(user))
  return portfolio;
};


export const getFileFromBlobURL = async (blobUrl: string, fileName: string): Promise<File> => {
  const response = await fetch(blobUrl); // Fetch the blob
  const blob = await response.blob(); // Convert response to blob
  const fileType = blob.type || "image/png"; // Default file type if unknown
  return new File([blob], fileName, { type: fileType }); // Create File object
};

export const savePortfolio = async (portfolio: any, uid: string) => {
  try {
  portfolio.uid = uid; // Store UID in portfolio
   // Upload project images first (check if it's a blob or a URL)
   for (const project of portfolio.projects) {
    for (const key of ["logo", "image1", "image2"]) {
      console.log("project", project[`${key}`]);
      console.log("projectStart", project[`${key}`].startsWith("blob:"));
      if (project[`${key}`] && project[`${key}`].startsWith("blob:")) {
        const file = await getFileFromBlobURL(project[`${key}`], `${key}.png`)
        project[key] = await uploadImageFile(`portfolios/${uid}/projects/${project.title}/${key}`, file);
        delete project[`${key}File`];
      }
    }
  }

  for (const blog of portfolio.blogs) {
      if (blog[`image`] && blog[`image`].startsWith("blob:")) {
        const file = await getFileFromBlobURL(blog[`image`], `image.png`)
        blog[`image`] = await uploadImageFile(`portfolios/${uid}/blogs/${blog.title}/image`, file);
        delete blog[`imageFile`];
    }
  }
  const PortfolioRef = collection(db, "portfolio");
  const q = query(PortfolioRef, where("uid", "==", uid));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.docs.length == 0) {
    await setDoc(doc(PortfolioRef), portfolio);
  } else {
    querySnapshot.forEach(async (docs) => {
      await updateDoc(doc(db, "portfolio", docs.id), portfolio);
    });
  }
  toast.success("Portfolio saved successfully!");
} catch (error:any) {
  toast.error(`Error: ${error.toString()}`);
  console.error("Error saving portfolio:", error);
}
};

export const uploadImageFile = async (path: string, file: any) => {
  const storage = getStorage();
  const storageRef = ref(storage, path);
  let url = "";
  // 'file' comes from the Blob or File API
  await uploadBytes(storageRef, file).then(async (snapshot) => {
    await getDownloadURL(snapshot.ref).then((downloadURL) => {
      url = downloadURL;
    });
  });
  return url;
};
// types
type skillsProps = { name: string; image: string };
type servicesProps = { name: string; image: string };

export const addSearchSkills = async (skill: skillsProps) => {
  const skillRef = collection(db, "Skills");
  const q = query(skillRef, where("name", "==", skill.name.toLowerCase()));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length == 0) {
    skill.name = skill.name.toLowerCase();
    await setDoc(doc(skillRef), skill);
  }
  console.log("skiiiill", skill);
};

export const addSearchServices = async (service: servicesProps) => {
  const servicesRef = collection(db, "Services");

  const q = query(servicesRef, where("name", "==", service.name.toLowerCase()));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.docs.length == 0) {
    service.name = service.name.toLowerCase();
    await setDoc(doc(servicesRef), service);
  }
};

// getSearchedServices(servicesAddPagePortfolioSmall)

export const checkWebTitle = async (title: string, uid: string) => {
  const PortfolioRef = collection(db, "portfolio");
  const q = query(PortfolioRef, where("websiteTitle", "==", title), where("uid", "!=", uid));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.length === 0;
};

export const getUsersPortfolioFormDetails = async (uid: string) => {
  const PortfolioRef = collection(db, "portfolio");
  const q = query(PortfolioRef, where("uid", "==", uid)); // Using UID for retrieval
  const querySnapshot = await getDocs(q);
  let portfolio = null;

  querySnapshot.forEach((doc) => {
    portfolio = doc.data();
  });

  return portfolio;
};
