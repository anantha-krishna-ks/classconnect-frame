// Configuration for API endpoints
const API_BASE_URL_LESSON_PLAN_GEN = "https://ai.excelsoftcorp.com/aiapps/AIToolKit/LessonPlanGen/api";
const API_BASE_URL_UNIT_PLAN_GEN = "https://ai.excelsoftcorp.com/aiapps/AIToolKit/UnitPlanGen";
const LOGIN_URL = "https://ai.excelsoftcorp.com/Login/LoginAIProduct";
const LOGIN_APPCODE = "AIProduct";
const LOGIN_CHECK_USER_URL = "https://ai.excelsoftcorp.com/aiapps/AIToolKit/UnitPlanGen/check-user";

const config = {
  API_BASE_URL_LESSON_PLAN_GEN,
  API_BASE_URL_UNIT_PLAN_GEN,
  ENDPOINTS: {
    GENERATE_LESSON_PLAN: `${API_BASE_URL_LESSON_PLAN_GEN}/generate-lesson-plan`,
    GET_LESSON_PLANS: `${API_BASE_URL_LESSON_PLAN_GEN}/get_lesson_plans`,
    UPDATE_LESSON_PLAN: `${API_BASE_URL_LESSON_PLAN_GEN}/update_lesson_plan`,
    DELETE_LESSON_PLAN: `${API_BASE_URL_LESSON_PLAN_GEN}/delete_lesson_plan`,
    GET_CLASSES: `${API_BASE_URL_LESSON_PLAN_GEN}/get_classes`,
    GET_SUBJECTS: `${API_BASE_URL_LESSON_PLAN_GEN}/get_subjects`,
    GENERATE_SESSION_PLAN: `${API_BASE_URL_LESSON_PLAN_GEN}/generate-lesson-plan`,
    SAVE_LESSON_PLAN: `${API_BASE_URL_LESSON_PLAN_GEN}/save_lesson_plan`,
    SEARCH_IMAGES: `${API_BASE_URL_LESSON_PLAN_GEN}/search-images`,
    SEARCH_VIDEOS: `${API_BASE_URL_LESSON_PLAN_GEN}/search-videos`,
    
    // UnitPlanGen endpoints
    GENERATE_ASSESSMENT_ITEMS: `${API_BASE_URL_UNIT_PLAN_GEN}/generate-assessment-items`,
    GENERATE_SKILLS_PER_CO: `${API_BASE_URL_UNIT_PLAN_GEN}/generate-skills-per-co`,
    GENERATE_COMPETENCIES_PER_CO: `${API_BASE_URL_UNIT_PLAN_GEN}/generate-competencies-per-co`,
    GENERATE_ELOS: `${API_BASE_URL_UNIT_PLAN_GEN}/generate-elos`,
    GENERATE_PEDAGOGICAL_APPROACHES: `${API_BASE_URL_UNIT_PLAN_GEN}/generate-pedagogical-approaches`,
    GENERATE_LEARNING_EXPERIENCE: `${API_BASE_URL_UNIT_PLAN_GEN}/generate-learning-experience`,
    GENERATE_UNIT_PLAN: `${API_BASE_URL_UNIT_PLAN_GEN}/generate-unit-plan`,
    SAVE_UNIT_PLAN_DETAILS: `${API_BASE_URL_UNIT_PLAN_GEN}/save-unit-plan-details`,
  }
};

config.LOGIN_URL = LOGIN_URL;
config.LOGIN_APPCODE = LOGIN_APPCODE;
config.LOGIN_CHECK_USER_URL = LOGIN_CHECK_USER_URL;
config.VIDEO_TRIM_BACKEND = "https://ai.excelsoftcorp.com/aiapps/VIDEOTRIM";

export default config;

//GENERATE_LESSON_PLAN: "https://ai.excelsoftcorp.com/aiapps/AIToolKit/LessonPlanGen/api/generate-lesson-plan"
