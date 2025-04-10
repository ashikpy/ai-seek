interface Props {
  hint: string | null;
}

const HintDisplay: React.FC<Props> = ({ hint }) => {
  return (
    <div className="mt-4 text-center">
      <span className="font-medium">Hint:</span>{" "}
      <span className="italic text-gray-700">{hint || "—"}</span>
    </div>
  );
};

export default HintDisplay;
