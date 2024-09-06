export type Location = {
  latitude: string;
  longitude: string;
};

export type Question = {
  question: string;
  answer: string;
  location: Location;
};

export type Quiz = {
  quizId: string;
  userId: string;
  username: string;
  name: string;
  questions: Question[];
};
