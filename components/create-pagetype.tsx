import CreatePageTypeButton from "./create-pagetype-button";
import CreatePageTypeModal from "./modal/create-pagetype";


export default async function CreatePageType() {
  
  return (
    <>
      <CreatePageTypeButton>
        <CreatePageTypeModal />
      </CreatePageTypeButton>
    </>
  )
};
