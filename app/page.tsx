import Screen from "../components/Screen";
import { getUser } from "@/lib/data/getUser";
export default async function page() {
  const user = await getUser();
  const data = { user };

  return <Screen data={data} />;
}
