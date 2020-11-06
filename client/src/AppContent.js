import { CircularProgress } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import "./AppContent.css";
import Images from "./Images";
const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
}); // leaving out the arguments will default to these values
function AppContent({ account, instance }) {
  const [images, setimages] = useState([]);
  const history = useHistory();
  useEffect(() => {
    const fetchImages = async () => {
      const images = await instance.methods.allImages().call();
      console.log(images);
      setimages(images);
    };
    fetchImages();
  }, [images.length]);
  const [buffer, setbuffer] = useState(null);
  const [caption, setcaption] = useState("");
  const [loading, setloading] = useState(false);
  const [getUploaded, setgetUploaded] = useState(false);
  const captureFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setbuffer(file);
      console.log(file);
    }
  };
  const upload = async (e) => {
    e.preventDefault();
    if (buffer) {
      setloading(true);
      console.log("uploading to ipfs>>>");
      try {
        const res = await ipfs.add(buffer);
        console.log(res.path);
        const txResult = await instance.methods
          .uploadImage(res.path, caption)
          .send({ from: account, gas: 2106924 });
        console.log(txResult);
        const getImages = await instance.methods.allImages().call();
        setimages(getImages);
        history.push({ pathname: "/images", state: getImages });
        setgetUploaded(true);
      } catch (error) {
        console.log(error);
        setloading(false);
        setbuffer(null);
      }
    }
    setloading(false);
    setbuffer(null);
    setcaption("");
  };
  return (
    <div>
      <Link to="/images" className="gotoPost">
        All posts
      </Link>
      <form className="appContent">
        <h2>Decentralised insta-clone</h2>
        <input
          type="file"
          name=""
          id=""
          accept=".jpg, .jpeg, .png, .bmp, .gif"
          required
          onChange={captureFile}
        />
        <input
          type="text"
          name=""
          id=""
          placeholder="Write a caption..."
          onChange={(e) => setcaption(e.target.value)}
          value={caption}
        />
        <button type="submit" onClick={upload}>
          {!loading ? (
            <h3>Upload</h3>
          ) : (
            <CircularProgress size={20} className="white" />
          )}
        </button>
      </form>
    </div>
  );
}

export default AppContent;
