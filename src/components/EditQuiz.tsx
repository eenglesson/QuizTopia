import { useState, useEffect } from 'react';
import { Location, Quiz } from '../types';
import { GoQuestion } from 'react-icons/go';
import { FiInfo } from 'react-icons/fi';

type EditQuizProps = {
  setSelectedQuiz: (quiz: Quiz | null) => void;
  location: Location;
};

export default function EditQuiz({ setSelectedQuiz, location }: EditQuizProps) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setLocalSelectedQuiz] = useState<Quiz | null>(null);
  const [addQuestion, setAddQuestion] = useState<string>('');
  const [addAnswer, setAddAnswer] = useState<string>('');

  const loggedInUsername = sessionStorage.getItem('username');

  useEffect(() => {
    async function fetchQuizzes() {
      const token = sessionStorage.getItem('token');
      try {
        const response = await fetch(
          'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();

        if (response.ok && data.quizzes) {
          setQuizzes(data.quizzes);
        } else {
          console.error('Failed to fetch quizzes:', data.message);
        }
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    }

    fetchQuizzes();
  }, []);

  const handleQuizSelect = (quizId: string) => {
    const quiz = quizzes.find((quiz) => quiz.quizId === quizId);
    if (quiz) {
      setLocalSelectedQuiz(quiz);
      setSelectedQuiz(quiz);
    }
  };

  // Handle the delete quiz request
  const handleDeleteQuiz = async (quizId: string) => {
    if (selectedQuiz?.username !== loggedInUsername) {
      alert('You are not authorized to delete this quiz.');
      return;
    }

    const token = sessionStorage.getItem('token');

    try {
      const response = await fetch(
        `https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/${quizId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert('Quiz deleted successfully!');
        setQuizzes((prevQuizzes) =>
          prevQuizzes.filter((quiz) => quiz.quizId !== quizId)
        );
        setLocalSelectedQuiz(null);
        setSelectedQuiz(null);
      } else {
        alert('Failed to delete quiz: ' + data.message);
      }
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('An error occurred while deleting the quiz.');
    }
  };

  const handleEditQuestion = async () => {
    if (!selectedQuiz) {
      alert('Please select a quiz first.');
      return;
    }

    const token = sessionStorage.getItem('token');

    try {
      const response = await fetch(
        `https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: selectedQuiz.quizId,
            question: addQuestion,
            answer: addAnswer,
            location: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert('Question added successfully!');
        setAddQuestion('');
        setAddAnswer('');
        const updatedQuiz = {
          ...selectedQuiz,
          questions: [
            ...selectedQuiz.questions,
            {
              question: addQuestion,
              answer: addAnswer,
              location: {
                latitude: location.latitude,
                longitude: location.longitude,
              },
            },
          ],
        };

        setSelectedQuiz(updatedQuiz);
      } else {
        alert('Failed to add question: ' + data.message);
      }
    } catch (error) {
      console.error('Error adding question:', error);
      alert('An error occurred while adding the question.');
    }
  };

  return (
    <>
      <div className='flex flex-col gap-4'>
        <h1 className='flex font-extrabold text-[30px] text-black-text leading-none justify-center cursor-default'>
          Edit Quiz
        </h1>
        <select
          onChange={(e) => handleQuizSelect(e.target.value)}
          value={selectedQuiz?.quizId || ''}
          className='flex appearance-none justify-center items-center self-center h-[52px] w-fit rounded-2xl text-center text-white bg-purple-gradient text-xs px-3 nt-bold hover:bg-gradient-to-br hover:from-[#8168ff] hover:to-[#3b1ef9] cursor-pointer'
        >
          <option value='' disabled>
            Select a quiz
          </option>
          {quizzes.map((quiz, i) => (
            <option key={i} value={quiz.quizId}>
              Quizname:{quiz.quizId} User: {quiz.username}
            </option>
          ))}
        </select>

        {selectedQuiz && (
          <>
            {/* <h2 className='flex font-extrabold text-[30px] text-black-text leading-none justify-center cursor-default'>
              Editing Quiz: {selectedQuiz.quizId}
            </h2> */}
            <div className='flex flex-col gap-4 self-center w-[300px] max-h-[400px] overflow-auto bg-purple-gradient p-4 rounded-2xl'>
              {selectedQuiz.questions.map((q, index) => (
                <div
                  key={index}
                  className='flex flex-col gap-2 h-40px bg-white-purple shadow-lg rounded-2xl p-4'
                >
                  <p>
                    <strong>Question:</strong> {q.question}
                  </p>
                  <p>
                    <strong>Answer:</strong> {q.answer}
                  </p>
                </div>
              ))}
            </div>
            <aside className='flex flex-col self-center gap-4'>
              <div className='flex w-[364px] items-center bg-white-purple h-[52px] gap-2 p-2 rounded-2xl'>
                <GoQuestion className='ml-[8px] text-black w-[24px] h-[24px]' />
                <input
                  type='text'
                  placeholder='Add Question'
                  value={addQuestion}
                  onChange={(e) => setAddQuestion(e.target.value)}
                  className='flex bg-transparent w-full text-[14px] text-black font-medium rounded-[16px] h-full outline-none placeholder:text-black'
                />
              </div>
              <div className='flex w-[364px] items-center bg-white-purple h-[52px] gap-2 p-2 rounded-2xl'>
                <FiInfo className='ml-[8px] text-black w-[24px] h-[24px]' />
                <input
                  type='text'
                  placeholder='Add Answer'
                  value={addAnswer}
                  onChange={(e) => setAddAnswer(e.target.value)}
                  className='flex bg-transparent w-full text-[14px] text-black font-medium rounded-[16px] h-full outline-none placeholder:text-black'
                />
              </div>
              <button
                className='flex appearance-none justify-center items-center self-center h-[52px] w-fit rounded-2xl text-center text-white bg-purple-gradient text-xs px-3 nt-bold hover:bg-gradient-to-br hover:from-[#8168ff] hover:to-[#3b1ef9] cursor-pointer'
                onClick={handleEditQuestion}
              >
                Add Question
              </button>
            </aside>

            {loggedInUsername === selectedQuiz.username && (
              <button
                className='flex hover:text-red-700 text-red-500 w-fit h-fit self-center text-[14px]'
                onClick={() => handleDeleteQuiz(selectedQuiz.quizId)}
              >
                Delete Quiz
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}
