"use server";

import { getSubjectsByDepartment } from "@/lib/db/subject";

export async function fetchSubjects(departmentId: string) {
    if (!departmentId) return [];
    return getSubjectsByDepartment(departmentId);
}
