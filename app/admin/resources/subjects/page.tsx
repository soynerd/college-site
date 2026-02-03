import { fetchSubjects } from "../resources/actions/getSubjectsByDepartment";

export default async function SubjectsPage({
  searchParams,
}: {
  searchParams: { departmentId?: string };
}) {
  const subjects = searchParams.departmentId
    ? await fetchSubjects(searchParams.departmentId)
    : [];

  return (
    <div>
      <h1>Subjects</h1>

      {subjects.map((s) => (
        <div key={s.id}>{s.name}</div>
      ))}
    </div>
  );
}
