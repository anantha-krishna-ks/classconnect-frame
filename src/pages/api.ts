export interface Grade {
  ClassId: number;
  ClassName: string;
}

export interface Subject {
  SubjectId: number;
  SubjectName: string;
  PlanClassId: string;
}

export interface Chapter {
  chapterId: string;
  chapterName: string;
}

export interface CourseOutcome {
  co_id: string;
  co_title: string;
  co_description: string;
  factor: string;
}

export interface GetunitplanPayload{
  OrgCode: string;
  AppCode: string;
  CustCode: string;
  UserCode: string;
  ClassID: number;
  SubjectId: number;
  ChapterId: number;
  SearchText: string;
  UserType: number;
}

const API_BASE_URL ='https://school.excelpublicschool.com/EPSWebAPI';
const API_BASE_URLAI = 'https://ai.excelsoftcorp.com/aiapps';
    

export const getGrades = async (orgcode: string): Promise<Grade[]> => {
  const response = await fetch(`${API_BASE_URL}/api/GetClassData`, {
    method: 'GET',
    headers: {
      'Accept': '*',
      'OrgCode':orgcode
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch grades');
  }
  const data = await response.json();
  if (data.status === 'Success' && data.getClassData) {
    return data.getClassData.map((grade: any) => ({
      ClassId: parseInt(grade.classId, 10),
      ClassName: grade.className,
    }));
  } else {
    throw new Error('Failed to parse grades from API response');
  }
};

export const getSubjects = async (orgcode: string, classId: number): Promise<Subject[]> => {
  const response = await fetch(`${API_BASE_URL}/api/GetSujectData?ClassId=${classId}`, {
    method: 'GET',
    headers: {
      'accept': '*/*',
      'OrgCode': orgcode,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch subjects');
  }
  const data = await response.json();
  if (data.status === 'Success' && data.getSubjectData) {
    return data.getSubjectData.map((subject: any) => ({
      SubjectId: parseInt(subject.subjectId, 10),
      SubjectName: subject.subjectName,
      PlanClassId: subject.planClassId,
    }));
  } else {
    throw new Error('Failed to parse subjects from API response');
  }
};

export const getChapters = async (orgcode: string, planClassId: string): Promise<Chapter[]> => {
  const response = await fetch(`${API_BASE_URL}/api/GetClassesData?PlanClassId=${planClassId}`, {
    method: 'GET',
    headers: {
      'accept': '*/*',
      'OrgCode': orgcode,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch chapters');
  }
  const data = await response.json();
  if (data.status === 'Success' && data.getChapterData) {
    return data.getChapterData;
  } else {
    throw new Error('Failed to parse chapters from API response');
  }
};

export const generateCourseOutcomes = async (board: string, grade: string, subject: string, chapter: string): Promise<any> => {
  const response = await fetch(`${API_BASE_URLAI}/AIToolKit/UnitPlanGen/generate-course-outcomes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      board,
      grade,
      subject,
      chapter,
    }),
  });
  if (!response.ok) {
    throw new Error('Failed to generate course outcomes');
  }
  return response.json();
};

export const getUnitPlanDetails = async (payload:GetunitplanPayload): Promise<any> => {
  const response = await fetch(
    `${API_BASE_URLAI}/AIToolKit/UnitPlanGen/get-unit-plan-details`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        OrgCode: payload.OrgCode,
        AppCode: payload.AppCode,
        CustCode: payload.CustCode,
        UserCode: payload.UserCode,
        ClassID: payload.ClassID,
        SubjectId: payload.SubjectId,
        ChapterId: payload.ChapterId,
        SearchText: payload.SearchText,
        UserType: payload.UserType,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch unit plan details');
  }

  return response.json();
};

export const deleteUnitPlanById = async (unitPlanId: number): Promise<any> => {
  const response = await fetch(`${API_BASE_URLAI}/AIToolKit/UnitPlanGen/delete_unit_plan_by_id`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ unitplanid: unitPlanId }),
  });
  if (!response.ok) {
    throw new Error('Failed to delete unit plan');
  }
  return response.json();
};


// Base URL for API requests
export const BASE_URL = 'https://ai.excelsoftcorp.com/aiapps/EXAMPREP';

// Function to update paper details via PUT request
export async function updatePaper(paperId: number, papername: string, par_status: string) {
  const response = await fetch(`${BASE_URL}/paperedit/${paperId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ papername, par_status }),
  });
  if (!response.ok) {
    throw new Error(`Failed to update paper: ${response.statusText}`);
  }
  return response.json();
}
//  ---------------------------------------------

export async function deletePaper(paperId: number) {
  const response = await fetch(`${BASE_URL}/paperdelete/${paperId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Failed to delete paper: ${response.statusText}`);
  }
  return response.json();
}

//----------------------------------------------------------

// Function to get paper question details by paper ID
export async function getPaperQuestionDetails(par_paperid: number) {
  const response = await fetch(`${BASE_URL}/uspgetpaperquestiondetails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ par_paperid }),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch paper question details: ${response.statusText}`);
  }
  return response.json();
}

//---------------------------------------------------------------
// Function to get paper details by org code and user ID
export async function getPaperDetails(par_orgcode: string, par_userid: number) {
  const response = await fetch(`${BASE_URL}/uspgetpaperdetails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ par_orgcode, par_userid }),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch paper details: ${response.statusText}`);
  }
  return response.json();
}
//----------------------------------------------------------

