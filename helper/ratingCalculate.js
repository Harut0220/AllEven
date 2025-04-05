const calculateAverageRating = (ratings) => {
  if (ratings.length === 0) return 0;

  const total = ratings.reduce((sum, rating) => sum + rating.rating, 0);

  const average = total / ratings.length;

  return Math.round(average * 10) / 10;
};

export default calculateAverageRating;
