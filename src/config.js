// Configuration for API endpoints
const API_BASE_URL_LESSON_PLAN_GEN = "https://school.excelpublicschool.com/ExcelSchoolAI/Service/LessonPlan";
const API_BASE_URL_UNIT_PLAN_GEN = "https://school.excelpublicschool.com/ExcelSchoolAI/Service/UnitPlan";
const API_BASE_URL_SLIDE_GEN = "https://school.excelpublicschool.com/ExcelSchoolAI/Service/SlideGen";
const API_BASE_URL_EXAMPREP = "https://school.excelpublicschool.com/ExcelSchoolAI/Service/ExamPrep";
const API_BASE_URL_QUIZ_GEN = "https://school.excelpublicschool.com/ExcelSchoolAI/Service/QuizGen";

const LOGIN_URL = "https://ai.excelsoftcorp.com/Login/LoginAIProduct";
const LOGIN_APPCODE = "AIProduct";
const LOGIN_CHECK_USER_URL = "https://school.excelpublicschool.com/ExcelSchoolAI/Service/CommonService/check-user";
const SLIDE_REPOSITORY_BASE = "https://ai.excelsoftcorp.com/SlideRepository";
const CommonServiceURL = "https://school.excelpublicschool.com/ExcelSchoolAI/Service/CommonService";

const config = {
  API_BASE_URL_LESSON_PLAN_GEN,
  API_BASE_URL_UNIT_PLAN_GEN,
  API_BASE_URL_SLIDE_GEN,
  API_BASE_URL_EXAMPREP,
  API_BASE_URL_QUIZ_GEN,
  SLIDE_REPOSITORY_BASE,
  ENDPOINTS: {
    //SessionPlan endpoints
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
    REGENERATE_ASSESSMENT_ITEMS: `${API_BASE_URL_UNIT_PLAN_GEN}/regenerate-assessment-items`,
    GENERATE_SKILLS_PER_CO: `${API_BASE_URL_UNIT_PLAN_GEN}/generate-skills-per-co`,
    GENERATE_COMPETENCIES_PER_CO: `${API_BASE_URL_UNIT_PLAN_GEN}/generate-competencies-per-co`,
    GENERATE_ELOS: `${API_BASE_URL_UNIT_PLAN_GEN}/generate-elos`,
    REGENERATE_ELO: `${API_BASE_URL_UNIT_PLAN_GEN}/regenerate-elo`,
    GENERATE_PEDAGOGICAL_APPROACHES: `${API_BASE_URL_UNIT_PLAN_GEN}/generate-pedagogical-approaches`,
    GENERATE_LEARNING_EXPERIENCE: `${API_BASE_URL_UNIT_PLAN_GEN}/generate-learning-experience`,
    GENERATE_UNIT_PLAN: `${API_BASE_URL_UNIT_PLAN_GEN}/generate-unit-plan`,
    SAVE_UNIT_PLAN_DETAILS: `${API_BASE_URL_UNIT_PLAN_GEN}/save-unit-plan-details`,
    GET_UNIT_PLAN_DETAILS: `${API_BASE_URL_UNIT_PLAN_GEN}/get-unit-plan-details`,
    GENERATE_PDF_FROM_HTML: `${API_BASE_URL_UNIT_PLAN_GEN}/generate-pdf-from-html`,
    UPDATE_UNIT_PLAN_DETAILS: `${API_BASE_URL_UNIT_PLAN_GEN}/Update_LessonPlan`,
  
    // SlideGen endpoints
    SLIDEGEN_GENERATE_PPT: `${API_BASE_URL_SLIDE_GEN}/generate_ppt`,
    SLIDEGEN_GET_SLIDE_DATA: `${API_BASE_URL_SLIDE_GEN}/get-slide-data`,
    SLIDEGEN_GET_LESSON_SESSION_DETAILS: `${API_BASE_URL_SLIDE_GEN}/get-lesson-session-details`,
    SLIDEGEN_SAVE_SLIDES: `${API_BASE_URL_SLIDE_GEN}/save-slides`,
    SLIDEGEN_DELETE_SLIDE: `${API_BASE_URL_SLIDE_GEN}/delete-slide`,
    GENERATE_PPT_FROM_UPLOAD: `${API_BASE_URL_SLIDE_GEN}/generate_ppt_from_upload`,


    // EXAMPREP endpoints used for metadata
    EXAMPREP_GET_CLASSES: `${CommonServiceURL}/get_classes`,
    EXAMPREP_GET_SUBJECT: `${CommonServiceURL}/get_subject`,
    EXAMPREP_GET_CHAPTERS: `${CommonServiceURL}/get_chapters`,
    EXAMPREP_GET_ELO_DETAILS: `${API_BASE_URL_EXAMPREP}/get-elo-details`,
    EXAMPREP_GET_PAPER_QUESTION_DETAILS: `${API_BASE_URL_EXAMPREP}/uspgetpaperquestiondetails`,
    EXAMPREP_UPDATE_PAPER: `${API_BASE_URL_EXAMPREP}/paperedit`,

    // QuizGen endpoints
    QUIZ_GENERATE_QUESTIONS: `${API_BASE_URL_QUIZ_GEN}/generate-questions`,
    QUIZ_SAVE: `${API_BASE_URL_QUIZ_GEN}/save-quiz`,
    QUIZ_GET_DETAILS: `${API_BASE_URL_QUIZ_GEN}/get-quiz-details`,
    QUIZ_GET_JSON_DETAILS: `${API_BASE_URL_QUIZ_GEN}/get-json-details`,
    QUIZ_DELETE: `${API_BASE_URL_QUIZ_GEN}/delete-quiz`,
  }
};

config.LOGIN_URL = LOGIN_URL;
config.LOGIN_APPCODE = LOGIN_APPCODE;
config.LOGIN_CHECK_USER_URL = LOGIN_CHECK_USER_URL;
config.VIDEO_TRIM_BACKEND ="https://school.excelpublicschool.com/ExcelSchoolAI/Service/VideoTrim";
config.APPCODE = "AP01";
config.SLIDE_REPOSITORY_BASE = SLIDE_REPOSITORY_BASE;

export default config;

//GENERATE_LESSON_PLAN: "https://ai.excelsoftcorp.com/aiapps/AIToolKit/LessonPlanGen/api/generate-lesson-plan"
//"https://ai.excelsoftcorp.com/aiapps/VIDEOTRIM"
