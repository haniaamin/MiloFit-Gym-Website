import { createContext, useContext , useState} from 'react';
import profile1 from '../assets/r1.png';

const initialReviews = [
    {
      id: 1,
      rating: 4,
      name: 'Muhammad Abdel Atty',
      comment: 'A clean place, full of professional equipment...',
      date: '4 years ago',
      ratingsCount: 32,
      profilePic: profile1
    },
    // Add other initial reviews if needed
  ];
  
const ReviewContext = createContext();

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);

  const addNewReview = (newReview) => {
    const review = {
      id: reviews.length + 1,
      rating: newReview.rating,
      name: 'You',
      comment: newReview.comment,
      date: 'Just now',
      ratingsCount: 1,
      profilePic: profile1
    };
    setReviews(prev => [review, ...prev]);
  };

  return (
    <ReviewContext.Provider value={{ reviews, addNewReview }}>
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => useContext(ReviewContext);