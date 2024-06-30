import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import axios from "axios";
import { BLOCKCHAIN_SERVER } from "../../../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function SinglePage() {
  const inr = 322281.745;

  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const [toggle, setToggle] = useState(0);
  const { currentUser, walletAddress } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    console.log("hh");
  }, [toggle]);
  const handlePurchase = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    try {
      console.log(inr);
        const res= await axios.post(`${BLOCKCHAIN_SERVER}/api/transfer_nft`,{
          newOwner: walletAddress,
          tokenId : post.tokenId,
          priceInEth : `${(post.price/inr)}`
      })
      console.log("response of transfer", res)
      const res2= await apiRequest.put("/posts",{
        newUserId:currentUser.id ,
        postId:post.id
      })

      console.log({
        newUserId: currentUser.id,
        postId: post.id,
      });

      console.log({
        newOwner: walletAddress,
        tokenId: post.tokenId,
        priceInEth: "100.01",
      });
      toast("Property purchased successfully");
      // navigate("/profile")
      setToggle((prev) => (prev + 1) % 2);
    } catch (err) {
      toast("Some error occoured");
      // navigate("/profile")
    }
  };
  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };
  useEffect(() => {
    if (!currentUser) navigate("/login");
  }, []);
  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">Rs. {post.price}</div>
                <div className="price">({(post.price/inr).toPrecision(6)} ETH)</div>

              </div>
              <div className="user">
                <img src={post.user.avatar} alt="" />
                <span>{post.user.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">General</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Utilities</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>Owner is responsible</p>
                ) : (
                  <p>Tenant is responsible</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Pet Policy</span>
                {post.postDetail.pet === "allowed" ? (
                  <p>Pets Allowed</p>
                ) : (
                  <p>Pets not Allowed</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Income Policy</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Sizes</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} sqft</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} beds</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} bathroom</span>
            </div>
          </div>
          <p className="title">Nearby Places</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>School</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail.school + "m"}{" "}
                  away
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Bus Stop</span>
                <p>{post.postDetail.bus}m away</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Restaurant</span>
                <p>{post.postDetail.restaurant}m away</p>
              </div>
            </div>
          </div>
          <p className="title">Location</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
            {!currentUser || post.userId !== currentUser.id ? (
              <button onClick={handlePurchase}>
                <img src="/chat.png" alt="" />
                Purchase Property
              </button>
            ) : (
              <></>
            )}
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Place Saved" : "Save the Place"}
            </button>
          </div>
        </div>
        <ToastContainer />
      </div>
      {/* {JSON.stringify(post.userId)} */}
    </div>
  );
}

export default SinglePage;
