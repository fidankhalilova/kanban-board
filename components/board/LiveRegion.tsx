interface Props {
  message: string;
}

export default function LiveRegion({ message }: Props) {
  return (
    <div aria-live="polite" role="status" className="sr-only">
      {message}
    </div>
  );
}
