import { useState } from 'react';
import { GoQuestion } from 'react-icons/go';
import { FiInfo } from 'react-icons/fi';

type Location = {
  latitude: string;
  longitude: string;
};

type AddQuizProps = {
  location: Location;
};

export default function AddQuiz({ location }: AddQuizProps) {
  const [quizName, setQuizName] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [quizId, setQuizId] = useState<string | null>(null);

  const handleCreateQuiz = async () => {
    const token = sessionStorage.getItem('token');

    if (!token) {
      alert('No token found. Please log in.');
      return;
    }

    try {
      const response = await fetch(
        'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: quizName }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        setQuizId(data.quizId);

        alert('Quiz created successfully!');
      } else {
        alert('Failed to create quiz: ' + data.message);
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('An error occurred while creating the quiz.');
    }
  };

  const handleAddQuestion = async () => {
    if (!quizId) {
      alert('Please create a quiz first.');
      return;
    }

    const token = sessionStorage.getItem('token');

    try {
      const response = await fetch(
        'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: quizId,
            question: question,
            answer: answer,
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
        setAnswer('');
        setQuestion('');
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
      <section className='flex flex-col self-center items-center justify-center gap-2'>
        <h1 className='flex font-extrabold text-[30px] text-black-text leading-none cursor-default'>
          Create a New Quiz
        </h1>
        <section className='flex flex-col gap-3 mb-8'>
          <div className='flex w-[364px] items-center bg-white-purple h-[52px] gap-2 p-2 rounded-2xl'>
            <input
              type='text'
              placeholder='Name of quiz...'
              value={quizName}
              onChange={(e) => setQuizName(e.target.value)}
              className='flex bg-transparent w-full text-[14px] ml-2 text-black font-medium rounded-[16px] h-full outline-none placeholder:text-black'
            />
          </div>
          <button
            className='flex justify-center items-center self-center h-[52px] px-6 w-fit rounded-2xl text-center text-white bg-purple-gradient text-xs font-bold hover:bg-gradient-to-br hover:from-[#8168ff] hover:to-[#3b1ef9]'
            onClick={handleCreateQuiz}
          >
            Create Quiz
          </button>
        </section>

        {quizId && (
          <div className='flex flex-col justify-center w-fit gap-3 items-center mb-8'>
            <h2 className='cursor-default text-[16px] text-grey-text'>
              Add a Question to the Quiz
            </h2>
            <div className='flex w-[364px] items-center bg-white-purple h-[52px] gap-2 p-2 rounded-2xl'>
              <GoQuestion className='ml-[8px] text-black w-[24px] h-[24px]' />
              <input
                type='text'
                placeholder='Question...'
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className='flex bg-transparent w-full text-[14px] text-black font-medium  rounded-[16px] h-full outline-none placeholder:text-black'
              />
            </div>
            <div className='flex w-[364px] items-center bg-white-purple h-[52px] gap-2 p-2 rounded-2xl'>
              <FiInfo className='ml-[8px] text-black w-[24px] h-[24px]' />
              <input
                type='text'
                placeholder='Answer...'
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className='flex bg-transparent w-full text-[14px] text-black font-medium  rounded-[16px] h-full outline-none placeholder:text-black'
              />
            </div>
            <button
              className='flex justify-center items-center self-center h-[52px] px-6 w-fit rounded-2xl text-center text-white bg-purple-gradient text-xs font-bold hover:bg-gradient-to-br hover:from-[#8168ff] hover:to-[#3b1ef9]'
              onClick={handleAddQuestion}
            >
              Add Question
            </button>
          </div>
        )}
      </section>
    </>
  );
}
