import { Fragment } from 'react';

const STEPS = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderProgressTracker({ currentStatus }) {
  const currentIndex = STEPS.indexOf(currentStatus);

  return (
    <div className="ord-tracker">
      {STEPS.map((step, index) => {
        const isDone = index <= currentIndex;
        const isLast = index === STEPS.length - 1;

        return (
          <Fragment key={step}>
            <div className="ord-step">
              <div className={`ord-step-circle ${isDone ? 'ord-step-circle--done' : ''}`}>
                {isDone ? '✓' : index + 1}
              </div>
              <span className={`ord-step-label ${isDone ? 'ord-step-label--done' : ''}`}>{step}</span>
            </div>
            {!isLast && <div className={`ord-line ${index < currentIndex ? 'ord-line--done' : ''}`} />}
          </Fragment>
        );
      })}
    </div>
  );
}