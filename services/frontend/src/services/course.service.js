import {eliaAPI} from "./axiosSettings/axiosSettings";

const API_ROUTE = 'courses';

const create = (course) =>{
   return eliaAPI.post(`${API_ROUTE}/create`, course);
};

const readAll= () => {
    return eliaAPI.get(`${API_ROUTE}/all`);
};

const read= (courseId) => {
    return eliaAPI.get(`${API_ROUTE}/read/${courseId}`);
};

const remove = (courseId) =>{
    return eliaAPI.delete(`${API_ROUTE}/remove/${courseId}`);
}

const update = (course) =>{
    return eliaAPI.put(`${API_ROUTE}/update/${course._id}`, course);
}

const getCategoryRefs = () =>{
    return eliaAPI.get(`${API_ROUTE}/getCategoryRefs`);
}

const getCategoryRefsFromModule = () =>{
    return eliaAPI.get(`${API_ROUTE}/getCategoryRefsFromModule`);
}

const getImageUrl=(img)=>{
    if(img?._id){
        // if we have image object with id
        return `/api/v1/courses/images/${img._id}/download`;
    }else if(img === 'DEFAULT'){
        return `/api/v1/contents/categories/images/general-knowledge-1.jpg/download/`;
    }else{
        // only for now we have only id
        return `/api/v1/courses/images/${img}/download`;
    }
}
const uploadImage = (formData) => {
    return eliaAPI.post(`${API_ROUTE}/images/upload`, formData);
}
const getImageDetails = (imageId) => {
    return eliaAPI.get(`${API_ROUTE}/images/details/${imageId}`);
}

const getAllCourses = (imageId) => {
    return eliaAPI.get(`${API_ROUTE}/all-courses`);
}

// Librarian accept or reject course
const  manageCourseStatus = (course) =>{
    // Get awaiting course
    return eliaAPI.put(`${API_ROUTE}/manage-course-status`, {course});
}

const getCourse = (id) => {
    //  Get contents with provided id from database,if it is avaliable for the user.
    return eliaAPI.get(`${API_ROUTE}/${id}`);
}

const functions = {
    create,
    readAll,
    read,
    remove,
    update,
    getCategoryRefs,
    getCategoryRefsFromModule,
    getImageUrl,
    uploadImage,
    getImageDetails,
    getAllCourses,
    manageCourseStatus,
    getCourse
};

export default functions;
