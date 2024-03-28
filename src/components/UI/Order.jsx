import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useUserStore } from "../../store/user.store";
import axios from "../../lib/http-request";
import { API } from "../../utils/config/api-end-points.config";
import { Preloader } from "./Preloader";
import { OrderTable } from "./OrderTable";

export const Order = () => {
  const accessToken = useUserStore((state) => state.accessToken);

  const [activeTransactionTypeTab, setActiveTransactionTypeTab] =
    useState("FIAT");

  const [orderData, setOrderData] = useState([]);

  const handleTabClick = (tab) => {
    console.log("🟣 handleTabClick: tab: ", tab);
    setActiveTransactionTypeTab(tab);
  };

  let fetchOrderDetails = async () => {
    try {
      console.log(
        "🟣 OrderDetails: fetchOrderDetails API Called!!!!",
        activeTransactionTypeTab
      );
      const res = await axios.get(API.getOrderDetails, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
        params: {
          transactionType: activeTransactionTypeTab,
        },
      });
      const orderRes = res?.data?.data?.orders?.results;
      console.log("🔷 orderRes: ", orderRes);
      setOrderData(orderRes);
      return orderRes;
    } catch (error) {
      console.log("🔺 useQuery: error: ", error);
      throw new Error("Error fetching order details: " + error.message);
    }
  };

  let { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: "userDetails",
    queryFn: fetchOrderDetails,
  });

  useEffect(() => {
    if (activeTransactionTypeTab) {
      refetch({ transactionType: activeTransactionTypeTab });
    }
  }, [activeTransactionTypeTab, refetch]);

  if (isLoading) return <Preloader />;

  return (
    <>
      <section
        className="page-header bg--cover"
        style={{ backgroundImage: "url(assets/images/breadcrumb.png)" }}
      >
        <div className="container">
          <div
            className="page-header__content mt-100 text-center"
            data-aos="fade-right"
            data-aos-duration="1000"
          >
            <h2>Orders</h2>
          </div>
          <div className="page-header__shape">
            <span className="page-header__shape-item page-header__shape-item--1">
              <img src="assets/images/2.png" alt="shape-icon" />
            </span>
          </div>
        </div>
      </section>
      <section className="pools_table padding-top padding-bottom bg5-color">
        <div className="container">
          <div className="row">
            <div className="pools_table__part">
              <div className="singletab">
                <div className="demo">
                  <div className="tab">
                    <div className="tab-wrapper" style={{ padding: "20px" }}>
                      <input
                        id="tab1"
                        type="radio"
                        name="tabsA"
                        className="radio-inputs"
                        checked={activeTransactionTypeTab === "FIAT"}
                        defaultChecked
                        onChange={() => handleTabClick("FIAT")}
                      />
                      <label className="tab-button order-btn" htmlFor="tab1">
                        Buy Orders
                      </label>
                      <input
                        id="tab2"
                        type="radio"
                        className="radio-inputs"
                        name="tabsA"
                        checked={activeTransactionTypeTab === "CRYPTO"}
                        onChange={() => handleTabClick("CRYPTO")}
                      />
                      <label className="tab-button order-btn" htmlFor="tab2">
                        Sell Orders
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <OrderTable
            orderData={orderData}
            activeTransactionTypeTab={activeTransactionTypeTab}
          />
        </div>
      </section>
    </>
  );
};
