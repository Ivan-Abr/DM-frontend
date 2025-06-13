export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8095';

export const API_ENDPOINTS = {
    // Auth
    AUTH: {
        LOGIN: `${API_BASE_URL}/api/auth/login`,
        REGISTER: `${API_BASE_URL}/api/auth/register`,
    },
    // User
    USER: {
        BASE: `${API_BASE_URL}/api/user`,
        BY_ID: (id: string) => `${API_BASE_URL}/api/user/${id}`,
    },
    // Organization
    ORGANIZATION: {
        BASE: `${API_BASE_URL}/api/organization`,
        BY_ID: (id: string) => `${API_BASE_URL}/api/organization/${id}`,
        BY_EXPERT: (expertId: string) => `${API_BASE_URL}/api/organization/user/${expertId}`,
    },
    // Layer
    LAYER: {
        BASE: `${API_BASE_URL}/api/layer`,
        BY_ID: (id: string) => `${API_BASE_URL}/api/layer/${id}`,
    },
    // Factor
    FACTOR: {
        BASE: `${API_BASE_URL}/api/factor`,
        BY_ID: (id: string) => `${API_BASE_URL}/api/factor/${id}`,
    },
    // Question
    QUESTION: {
        BASE: `${API_BASE_URL}/api/question`,
        BY_ID: (id: string) => `${API_BASE_URL}/api/question/${id}`,
    },
    // Mark
    MARK: {
        BASE: `${API_BASE_URL}/api/mark`,
        BY_ID: (id: string) => `${API_BASE_URL}/api/mark/${id}`,
        BY_QUESTION: (questionId: string) => `${API_BASE_URL}/api/mark/question/${questionId}`,
    },
    // Milestone
    MILESTONE: {
        BASE: `${API_BASE_URL}/api/milestone`,
        BY_ID: (id: string) => `${API_BASE_URL}/api/milestone/${id}`,
    },
    // Recommendation
    RECOMMENDATION: {
        BASE: `${API_BASE_URL}/api/recommendation`,
        BY_ID: (id: string) => `${API_BASE_URL}/api/recommendation/${id}`,
    },
    // Answer
    ANSWER: {
        BASE: `${API_BASE_URL}/api/answer`,
        ALL_BY_ORG: (orgId: string) => `${API_BASE_URL}/api/answer/all/org/${orgId}`,
    },
}; 