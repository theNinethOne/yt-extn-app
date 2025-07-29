import { useEffect, useState } from "react";
import { pb } from "../pb";

export default function SearchAdd() {
  const [stichDetails, setStichDetails] = useState();

  const getStiches = async () => {
    const res = await pb.collection("stichShare").getList(1, 30, {
      filter: `user="${pb.authStore.record?.id}"`,
    });

    const details = await Promise.all(
      res.items.map((item) =>
        pb.collection("stich").getFirstListItem(`id="${item.stichId}"`)
      )
    );

    setStichDetails(details);
    console.log("details", details);
  };

  useEffect(() => {
    getStiches();
  }, []);

  return (
    <>
      <p>Paste URLs here to Search and Add STiches</p>
      <div>
        <input type="text" placeholder="Search" name="" id="" />
      </div>
      <div>
        <button>Add</button>
      </div>
      <div>YOUR SAVED STICHES ARE HERE</div>
      <div>
        {stichDetails ? (
          stichDetails.map((stich, index) => (
            <div key={index} className="flex flex-row bg-orange-500 p-2 m-2 rounded-lg">
              <p>{stich.stichName}</p>
              <p>{stich.createdBy}</p>
            </div>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </>
  );
}
