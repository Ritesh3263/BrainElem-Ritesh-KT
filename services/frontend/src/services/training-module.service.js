import {eliaAPI} from "./axiosSettings/axiosSettings";

const getBooks = (trainingModuleId) => {
  // Get all books in training module
  return eliaAPI.get(`training-modules/${trainingModuleId}/books`);
};


const functions = {
  getBooks
};

export default functions;
