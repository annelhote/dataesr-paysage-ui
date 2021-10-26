import CreateForm from "../../components/CreateForm";
import Layout from "../../components/Layout";
import SideNavigation from "../../components/SideNavigation";
import useCSSProperty from "../../hooks/useCSSProperty";
import CreatePerson from "./form.json";

export default function CreateP() {
  const { style: pink } = useCSSProperty("--pink-soft-700");

  return (
    <Layout pageTitle="Create a person">
      <SideNavigation items={CreatePerson[0].form}>
        <CreateForm jsonForm={CreatePerson[0]} color={pink} />
      </SideNavigation>
    </Layout>
  );
}
