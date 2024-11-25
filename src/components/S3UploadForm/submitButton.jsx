export default function SubmitButton({ pending }) {
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Uploading..." : " Upload Files"}
    </button>
  );
}
