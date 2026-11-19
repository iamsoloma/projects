export default function ProgressBar({ done, total }) {
  const percent = total === 0 ? 0 : Math.round(done / total * 100);
  return (
    <div className="progress" title={`Готовность ${percent}%`}>
      <div className="progress__bar" style={{ width: `${percent}%` }}></div>
    </div>
  );
}