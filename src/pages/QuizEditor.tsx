import { useState } from 'react';
import AddQuiz from '../components/AddQuiz';
import LeafletMapAdd from '../components/LeafletMapAdd';
import EditQuiz from '../components/EditQuiz';
import LeafletMapEdit from '../components/LeafletMapEdit';
import { Quiz } from '../types';

export default function QuizEditor() {
  const [location, setLocation] = useState({ latitude: '', longitude: '' });
  const [changeMode, setChangeMode] = useState<'add' | 'edit'>();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  return (
    <>
      <header className='flex gap-4'>
        <button
          onClick={() => {
            setChangeMode('add');
          }}
          className='flex justify-center items-center self-center h-[52px] px-6 w-fit rounded-2xl text-center text-white bg-purple-gradient text-xs font-bold mt-4 hover:bg-gradient-to-br hover:from-[#8168ff] hover:to-[#3b1ef9]'
        >
          Create Quiz
        </button>
        <button
          onClick={() => setChangeMode('edit')}
          className='flex justify-center items-center self-center h-[52px] px-6 w-fit rounded-2xl text-center text-white bg-purple-gradient text-xs font-bold mt-4 hover:bg-gradient-to-br hover:from-[#8168ff] hover:to-[#3b1ef9]'
        >
          Edit Quiz
        </button>
      </header>

      {changeMode === 'add' && (
        <>
          <section className='flex flex-col justify-center items'>
            <AddQuiz location={location} />
            <LeafletMapAdd onLocationClick={setLocation} />
          </section>
        </>
      )}

      {changeMode === 'edit' && (
        <>
          <EditQuiz setSelectedQuiz={setSelectedQuiz} location={location} />

          <LeafletMapEdit
            selectedQuiz={selectedQuiz}
            onLocationClick={setLocation}
          />
        </>
      )}
    </>
  );
}
