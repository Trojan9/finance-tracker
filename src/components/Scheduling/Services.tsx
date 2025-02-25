import React, { useEffect, useState } from 'react';
import { db, auth, storage } from "../../utils/firebaseConfig";
import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc, query, where } from 'firebase/firestore';
import { Service } from '../../api/models/service';
import { Category } from '../../api/models/category';
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
const Services = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(auth.currentUser);
    const [categoryFormData, setCategoryFormData] = useState({ name: '', userId: '' });
    const [serviceFormData, setServiceFormData] = useState({
        name: '',
        price: '',
        duration: '',
        description: '',
        userId: '',
        categoryId: ''
    });
    const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

    const fetchCategories = async () => {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Category));
        setCategories(data);
    };

    const fetchServices = async () => {
        const querySnapshot = await getDocs(collection(db, 'services'));
        const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Service));
        setServices(data);
    };
    const navigate = useNavigate();
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
        
      if (!user) return;
        fetchCategories();
        fetchServices();
    }, [user]);

    const createCategory = async () => {
       
        setLoading(true);
        await addDoc(collection(db, 'categories'), { ...categoryFormData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), userId:user?.uid  });


        setLoading(false);
        setCategoryFormData({ name: '', userId: '' });
        fetchCategories();
    };

    const deleteCategory = async (id: string) => {
        setLoading(true);
        await deleteDoc(doc(db, 'categories', id));
        const serviceQuery = query(collection(db, 'services'), where('categoryId', '==', id));
        const serviceSnapshot = await getDocs(serviceQuery);
        serviceSnapshot.forEach(async (serviceDoc) => {
            await deleteDoc(doc(db, 'services', serviceDoc.id));
        });
        setLoading(false);
        fetchCategories();
        fetchServices();
    };

    const createOrUpdateService = async () => {
        setLoading(true);
        if (editingServiceId) {
            await updateDoc(doc(db, 'services', editingServiceId), { ...serviceFormData, updatedAt: new Date().toISOString() });
            setEditingServiceId(null);
        } else {
            await addDoc(collection(db, 'services'), { ...serviceFormData, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),userId:user?.uid });

        }
        setLoading(false);
        setServiceFormData({ name: '', price: '', duration: '', description: '', userId: '', categoryId: '' });
        fetchServices();
    };

    const deleteService = async (id: string) => {
        setLoading(true);
        await deleteDoc(doc(db, 'services', id));
        setLoading(false);
        fetchServices();
    };

    const handleEditService = (service: Service) => {
        setServiceFormData({
            name: service.name,
            price: service.price,
            duration: service.duration,
            description: service.description,
            userId: service.userId,
            categoryId: service.categoryId
        });
        setEditingServiceId(service.id);
    };


    return (
        <div className="h-screen overflow-y-auto p-6 md:p-8 bg-gray-900 text-white min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Service Categories & Services</h1>
            {loading && <div className="text-center mb-4">Processing...</div>}

            <div className="mb-6">
                <h2 className="text-xl mb-4">Create Category</h2>
                <input
                    type="text"
                    name="name"
                    placeholder="Category Name"
                    value={categoryFormData.name}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                    className="w-full p-2 rounded-md bg-gray-700 text-white mb-2"
                />
                <button onClick={createCategory} className="bg-blue-500 text-white px-4 py-2 rounded-md">Add Category</button>
            </div>

            {categories.map((category) => (
                <div key={category.id} className="mb-6 p-4 bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">{category.name}</h2>
                        <button onClick={() => deleteCategory(category.id)} className="text-red-400">Delete Category</button>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-lg mb-2">Add/Edit Service</h3>
                        <input
                            type="text"
                            name="name"
                            placeholder="Service Name"
                            value={serviceFormData.name}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, name: e.target.value, categoryId: category.id })}
                            className="w-full p-2 rounded-md bg-gray-700 text-white mb-2"
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={serviceFormData.price}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, price: e.target.value })}
                            className="w-full p-2 rounded-md bg-gray-700 text-white mb-2"
                        />
                        <input
                            type="number"
                            name="duration"
                            placeholder="Duration (minutes)"
                            value={serviceFormData.duration}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, duration: e.target.value })}
                            className="w-full p-2 rounded-md bg-gray-700 text-white mb-2"
                        />
                        <input
                            type="text"
                            name="description"
                            placeholder="Description"
                            value={serviceFormData.description}
                            onChange={(e) => setServiceFormData({ ...serviceFormData, description: e.target.value })}
                            className="w-full p-2 rounded-md bg-gray-700 text-white mb-2"
                        />
                        <button onClick={createOrUpdateService} className="bg-green-500 text-white px-4 py-2 rounded-md">
                            {editingServiceId ? 'Update Service' : 'Add Service'}
                        </button>
                    </div>

                    <div className="mt-4">
                        <h3 className="text-lg mb-2">Services</h3>
                        <ul>
                            {services.filter(service => service.categoryId === category.id).map((service) => (
                                <li key={service.id} className="flex justify-between items-center border-b border-gray-600 py-2">
                                    <span>{service.name} - ${service.price} - {service.duration} min - {service.description}</span>
                                    <div>
                                        <button onClick={() => handleEditService(service)} className="text-yellow-400 mr-4">Edit</button>
                                        <button onClick={() => deleteService(service.id)} className="text-red-400">Delete</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Services;
