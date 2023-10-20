import axios from "axios";
import authHeader from "./auth-header";
import {now} from "moment";

const API_URL = "/api/v1/soft-skills-template/";

const add = (template) => {
  return axios.post(API_URL + "add", template, { headers: authHeader() });
};

const update = (template) => {
  return axios.put(API_URL + "update/" + template._id, template, { headers: authHeader(), });
};

const remove = (templateId) => {
  return axios.delete(API_URL + "delete/" + templateId, { headers: authHeader() });
};

const readGroups = () => {
  return axios.get(API_URL + "read-groups", { headers: authHeader() } );
};

const readTraineesInGroup = (groupId) => {
  return axios.get(API_URL + "read-trainees/"+groupId, { headers: authHeader() } );
};

const newReadReportsOfTraineeInGroup = (traineeId, groupId) => {
  return axios.get(API_URL + "new-read-reports-of-trainee/"+traineeId+"/"+groupId, { headers: authHeader() });
};

const readReportById = (reportId) => {
  return axios.get(API_URL + `read-report/${reportId}`, { headers: authHeader() });
};

const readAllReportsTemplates = () => {
  return axios.get(API_URL + `read-all-templates`, { headers: authHeader() });
};

const readTemplateById = (templateId) => {
  return axios.get(API_URL + `read-template/${templateId}`, { headers: authHeader() });
};

const readAllSoftSkills = () => {
  return axios.get(API_URL + `read-all-soft-skills`, { headers: authHeader() });
};

const readSoftSkillById = (softSkillId) => {
  return axios.get(API_URL + `read-soft-skill/${softSkillId}`, { headers: authHeader() });
};

const addSoftSkill = (softSkill) => {
  return axios.post(API_URL + "add-soft-skill", softSkill, { headers: authHeader() });
};

const updateSoftSkill = (softSkill) => {
  return axios.put(`${API_URL}update-soft-skill/${softSkill._id}`, softSkill, {headers: authHeader()});
};

const removeSoftSkill = (softSkillId) => {
  return axios.delete(API_URL + "removeSoftSkill/" + softSkillId, { headers: authHeader() });
};

const functions = {
  add,
  update,
  remove,
  readGroups,
  readTraineesInGroup,
  newReadReportsOfTraineeInGroup,
  readReportById,

  readAllReportsTemplates,
  readTemplateById,

  readAllSoftSkills,
  readSoftSkillById,
  removeSoftSkill,
  addSoftSkill,
  updateSoftSkill,
};

export default functions;
