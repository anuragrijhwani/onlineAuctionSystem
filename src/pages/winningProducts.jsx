import "./winningProduct.css";
import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import {useNavigate} from 'react-router-dom';


export const WinningProducts = () =>{
    const[winner,setWinner] = useState([]) 
    const { user } = useAuth();
    useEffect(() => {
        const getBidsData = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/auth/user/bidWinner", {
                    method: "POST", 
                    headers:{
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({user_id: user?._id}), 
                });
                
                if(response.ok) {
                    const data = await response.json();
                    setWinner(data?.data); 
                } else {
                    console.log("No Data available");
                }
            } catch (error) {
                console.log("error", error);
            }
        };

        if (user) {
            getBidsData();
        }
    }, [user]);

    const navigate = useNavigate();
    const order = (id) => {
      navigate('/order',{state:{id}});
     }

    return (
        <>
          <section className="winner-section">
            <div className="container">
              <h1>Products Winning</h1>
            </div>
            <div className="container Winner">
              <table>
                <thead>
                  <tr>
                    <th>Product Image</th>
                    <th>Product Name</th>
                    <th>Original Product Price</th>
                    <th>Your Bid Price</th>
                    <th>Order</th>
                  </tr>
                </thead>
                <tbody>
                  {winner.map((itm, index) => (
                    <tr key={index}>
                      <td><img src={itm?.imagePath+itm?.productImages.split(',')[0]} alt="Product" /></td>
                      <td>{itm?.productName}</td>
                      <td>{itm?.productPrice}</td>
                      <td>{itm?.current_bidding_price}</td>
                      <td><button  onClick={()=>{
                        order(itm?._id)
                      }}> {itm?.bidStatus === "order" ? " View Order" : "Place Order"}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      );
}