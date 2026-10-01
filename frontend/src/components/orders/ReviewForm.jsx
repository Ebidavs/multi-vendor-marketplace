import { useState } from 'react';
import { useForm } from 'react-hook-form';

export default function ReviewForm({ productId, onSubmit }) {
  const [rating, setRating] = useState(0);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submitHandler = (data) => {
    if (rating === 0) return;
    onSubmit({ productId, rating, comment: data.comment });
    reset();
    setRating(0);
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="ord-review">
      <p className="ord-review-title">Leave a review</p>

      <div className="ord-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            type="button"
            key={star}
            onClick={() => setRating(star)}
            className={`ord-star ${star <= rating ? 'ord-star--on' : ''}`}
            aria-label={`Rate ${star} star`}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        {...register('comment', { required: 'Please write a short comment' })}
        placeholder="Share your experience with this product..."
        rows={3}
        className="ord-textarea"
      />
      {errors.comment && <p className="ord-error">{errors.comment.message}</p>}

      <button type="submit" disabled={rating === 0} className="ord-btn">
        Submit Review
      </button>
    </form>
  );
}