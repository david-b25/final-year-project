
import CreateAssetButton from "./create-asset-button";
import CreateAssetModal from "./modal/create-asset";


export default async function CreateAsset() {

  return (
    <>
      <CreateAssetButton>
        <CreateAssetModal />
      </CreateAssetButton>
    </>
  )
};
