import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "./Images.css";
function Images({ instance, account, web3 }) {
  const [images, setimages] = useState([]);
  const history = useHistory();
  useEffect(() => {
    //for refresh se bachne ke liye i will be using contextApi(DataLayer)
    const fetchImages = async () => {
      console.log(instance);
      if (instance) {
        const getimages = await instance.methods.allImages().call();
        console.log(getimages);
        setimages(getimages);
      } else {
        setimages(history.location.state);
      }
    };
    fetchImages();
  }, [images.length]);
  const tip = async (id) => {
    const tx = await instance.methods
      .tipImageOwner(id)
      .send({ from: account, value: web3.utils.toWei("0.1", "ether") });
    const getimages = await instance.methods.allImages().call();
    console.log(getimages);
    setimages(getimages);
    console.log(tx);
  };
  return (
    <div className="images">
      <Link to="/" className="images__back">
        Back
      </Link>
      {images &&
        images.map((image) => (
          <div key={image.id} className="image__post">
            <h4>{image.author}</h4>
            <img src={`https://ipfs.infura.io/ipfs/${image.hash}`} alt="" />
            <h4>{image.description}</h4>
            <div className="image__tip">
              <p>
                <strong>Ammount tipped: </strong>
                {web3 && web3.utils.fromWei(image.tipAmmount, "ether")} ether
              </p>
              <button onClick={() => tip(image.id)}>tip</button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Images;
