export interface Question {
    id: number;
    label: string;
    type: "text" | "radio" | "checkbox" | "dropdown";
    options?: string[];
}

export interface Form {
    id: number;
    title: string;
    description: string;
    createdAt: string;
    questions: Question[];
}

export const dummyForms: Form[] = [
    {
        id: 1,
        title: "Customer Feedback",
        description: "Tell us about your lemon experience and help us improve our products.",
        createdAt: "2026-02-20",
        questions: [
            { id: 1, label: "How would you rate the sourness?", type: "text" },
            { id: 2, label: "Would you buy again?", type: "radio", options: ["Yes", "No", "Maybe"] },
            { id: 3, label: "Which products did you try?", type: "checkbox", options: ["Lemonade", "Lemon Cake", "Lemon Tart"] },
        ],
    },
    {
        id: 2,
        title: "Event Registration",
        description: "Sign up for the annual LemonFest 2026 gathering.",
        createdAt: "2026-02-18",
        questions: [
            { id: 4, label: "Full name", type: "text" },
            { id: 5, label: "T-shirt size", type: "dropdown", options: ["S", "M", "L", "XL"] },
            { id: 6, label: "Dietary restrictions", type: "checkbox", options: ["Vegetarian", "Vegan", "Gluten-free", "None"] },
        ],
    },
    {
        id: 3,
        title: "Team Satisfaction Survey",
        description: "Help us understand how happy the team is with the current workflow.",
        createdAt: "2026-02-15",
        questions: [
            { id: 7, label: "How satisfied are you with the team communication?", type: "radio", options: ["Very satisfied", "Satisfied", "Neutral", "Dissatisfied"] },
            { id: 8, label: "What could we improve?", type: "text" },
            { id: 9, label: "Would you recommend this team to a friend?", type: "radio", options: ["Yes", "No"] },
        ],
    },
    {
        id: 4,
        title: "Product Feature Request",
        description: "Let us know what features you'd like to see in LemonForm.",
        createdAt: "2026-02-10",
        questions: [
            { id: 10, label: "What feature would you like?", type: "text" },
            { id: 11, label: "Priority level", type: "dropdown", options: ["Low", "Medium", "High", "Critical"] },
            { id: 12, label: "Which area does this relate to?", type: "checkbox", options: ["Form Builder", "Analytics", "Integrations", "UI/UX"] },
        ],
    },
];