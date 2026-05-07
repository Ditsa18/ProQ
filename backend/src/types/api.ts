export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
};

export type AnalysisData = {
  serviceType: string;
  priority: string;
  location: string;
  budget: string;
  contactInfo: string;
  specifications: string;
  specialRequirements: string;
};

export type BOQItem = {
  slNo: number;
  description: string;
  unit: string;
  quantity: number;
  rate: number | null;
  amount: number | null;
};
