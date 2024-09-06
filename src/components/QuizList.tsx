import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import L from 'leaflet';

type Location = {
  longitude: string;
  latitude: string;
};

type Question = {
  question: string;
  answer: string;
  location: Location;
};

type Quiz = {
  questions: Question[];
  userId: string;
  quizId: string;
  username: string;
};

export default function QuizList() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [position, setPosition] = useState<GeolocationCoordinates | null>(null);
  const [searchQuiz, setSearchQuiz] = useState<string>('');
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [map, setMap] = useState<L.Map | null>(null);
  const [markers, setMarkers] = useState<L.Marker[]>([]);

  async function fetchQuizData() {
    try {
      const response = await fetch(
        'https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz'
      );
      const data = await response.json();

      if (data.success) {
        setQuizzes(data.quizzes);
        console.log(data.quizzes);
      }
    } catch (error) {
      console.error('Error fetching quiz data:', error);
    }
  }

  function getCurrentPosition() {
    if ('geolocation' in navigator && !position?.latitude) {
      navigator.geolocation.getCurrentPosition((position) => {
        setPosition(position.coords);
      });
    }
  }

  useEffect(() => {
    getCurrentPosition();
  });

  useEffect(() => {
    fetchQuizData();
  }, []);

  useEffect(() => {
    if (selectedQuiz && !map && position) {
      // Initialize the map only once
      const initializedMap = L.map('map').setView(
        [
          parseFloat(selectedQuiz.questions[0].location.latitude),
          parseFloat(selectedQuiz.questions[0].location.longitude),
        ],
        13
      );

      // Add a marker for the user's current position
      L.marker([position.latitude, position.longitude])
        .addTo(initializedMap)
        .bindPopup('You are here');

      // Add tile layer to the map
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(initializedMap);

      setMap(initializedMap); // Save map instance to state
    }

    if (selectedQuiz && map) {
      // Pan the map to the first question's location when a new quiz is selected
      const { latitude, longitude } = selectedQuiz.questions[0].location;
      map.setView([parseFloat(latitude), parseFloat(longitude)], 13);

      // Remove existing markers
      markers.forEach((marker) => marker.remove());
      setMarkers([]); // Clear the marker array in state

      // Add new markers for the selected quiz
      const newMarkers: L.Marker[] = [];
      selectedQuiz.questions.forEach((question) => {
        const { latitude, longitude } = question.location;

        const newMarker = L.marker([
          parseFloat(latitude),
          parseFloat(longitude),
        ])
          .addTo(map)
          .bindPopup(
            `<b>${question.question}</b><br/>Answer: ${question.answer}`
          );

        newMarkers.push(newMarker); // Keep track of new markers
      });

      setMarkers(newMarkers); // Update state with the new markers
    }
  }, [selectedQuiz, map, position]);

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.username?.toLowerCase().includes(searchQuiz.toLowerCase())
  );

  return (
    <>
      <header className='flex flex-col self-center justify-center gap-4 mt-[64px]'>
        <h2 className='text-[30px] text-center font-bold'>
          {selectedQuiz ? selectedQuiz.quizId : 'All Quizzes'}
        </h2>
        <div className='flex w-[364px] items-center bg-white-purple h-[52px] gap-2 p-2 rounded-2xl'>
          <FiSearch className='ml-[8px] text-black w-[24px] h-[24px]' />
          <input
            type='text'
            placeholder='Search by Username'
            className='flex bg-transparent w-full text-[14px] text-black font-medium rounded-[16px] h-full outline-none placeholder:text-black'
            value={searchQuiz}
            onChange={(e) => setSearchQuiz(e.target.value)}
          />
        </div>
      </header>

      {selectedQuiz && (
        <section className='mt-8'>
          <div id='map' className='h-[700px] w-full'></div>
        </section>
      )}

      <section className='w-full mt-[24px] flex flex-wrap p-2 justify-center gap-2'>
        {filteredQuizzes.map((quiz, i) => (
          <div
            key={i}
            onClick={() => setSelectedQuiz(quiz)} // Set the selected quiz here
            className='flex flex-col items-center self-center basis-[240px] max-w-[240px] flex-grow flex-shrink-0 h-[160px] p-[16px] text-white gap-[16px] bg-purple-gradient-light rounded-[12px] shadow-mini cursor-pointer'
          >
            <h2 className='text-[30px] text-center font-bold'>Quiz</h2>
            <h3 className='tracking-wide text-[16px] font-bold'>
              {quiz.quizId}
            </h3>
            <p className='text-[10px] font-medium'>{quiz.username}</p>
          </div>
        ))}
      </section>
    </>
  );
}
