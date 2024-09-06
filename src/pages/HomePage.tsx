import Form from '../components/Form';

import QuizList from '../components/QuizList';

export default function HomePage() {
  return (
    <>
      <section className='flex flex-col mt-10'>
        <Form />
        <QuizList />
      </section>
    </>
  );
}
