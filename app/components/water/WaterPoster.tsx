type WaterPosterProps = {
  labelled?: boolean;
};

export function WaterPoster({ labelled = false }: WaterPosterProps) {
  if (labelled) {
    return (
      <div className="water-poster" role="img" aria-label="Illustrated water" />
    );
  }

  return <div className="water-poster" aria-hidden="true" />;
}
