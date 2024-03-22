import { useState } from "react";
import loadjs from "loadjs";
import { useQuery, useMutation } from "@tanstack/react-query";

import axios from "../../lib/http-request";
import { API } from "../../utils/config/api-end-points.config";
import { useUserStore } from "../../store/user.store";
import { Preloader } from "./Preloader";
import { BuyComponent } from "./BuyComponent";
import { SellComponent } from "./SellComponent";
import { BuyOrSellComponent } from "./BuyOrSellComponent";
import { AccountComponent } from "./AccountComponent";

export const Transaction = () => {
  const accessToken = useUserStore((state) => state.accessToken);
  const user = useUserStore((state) => state.user);
  console.log('🟡 user: ', user)
  const [activeTab, setActiveTab] = useState("buy"); 
  const [currentStep, setCurrentStep] = useState(1);

  const [orderData, setOrderData] = useState({
    network: "ETH",
    transactionType: "FIAT",
    crypto: "USDT",
    currency: "AED",
    sendAmount: 200,
    receivedAmount: 200,
    bankAccount: "5f473cd03d24f0b7092f201",
    walletAddress: "31313",
    primaryTransactionReceipt: "asas1231313",
  });

  const handleOnChange = (e) => {
    // const {} = e.target
    setOrderData({
      ...orderData,
    });
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentStep(1);
  };

  const handleNextClick = () => {
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousClick = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleOrderSubmit = (orderData) => {
    console.log("🔶 handleOrderSubmit called!");
    mutate(orderData);
  };

  let createOrder = async (data) => {
    try {
      console.log("🔶 createOrder called!", {
        orderData,
        user
      });
      const res = await axios(API.createOrder, {
        method: "POST",
        data: {
          ...orderData,
        },
        params: {
          userId: user?.id
        },
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      return res;
    } catch (error) {
      console.log("🔺 createOrder: error: ", error);
      throw new Error("Error creating order: " + error.message);
    }
  };

  let { mutate, isPending: loading } = useMutation({
    mutationFn: (data) => createOrder(orderData),
    onSuccess: (res) => {
      console.log("🔶 useMutation: res: UserDetails: ", res);
      toast.success("User Details saved successfully");
      refetch();
    },
    onError: (error) => {
      console.log("🔺 useMutation: error: UserDetails: ", error);
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong. Please try again later."
      );
    },
  });

  const renderTabContent = () => {
    switch (true) {
      case activeTab === "buy" && currentStep === 1:
        return (
          <BuyOrSellComponent
            header="Buy Assets"
            handleNextClick={handleNextClick}
            handleOnChange={handleOnChange}
            orderData={orderData}
          />
        );
      case activeTab === "buy" && currentStep === 2:
        return <AccountComponent handleOrderSubmit={handleOrderSubmit} />;
      case activeTab === "sell" && currentStep === 1:
        return (
          <BuyOrSellComponent
            header="Sell Assets"
            handleNextClick={handleNextClick}
            handleOnChange={handleOnChange}
            orderData={orderData}
          />
        );
      case activeTab === "sell" && currentStep === 2:
        return <AccountComponent handleOrderSubmit={handleOrderSubmit} />;
      default:
        return null;
    }
  };

  console.log("🟣 : ", {
    activeTab,
    currentStep,
  });

  return (
    <div className="col-lg-6">
      <div className="row gy-5 gy-md-6 justify-content-center">
        <div className="col-lg-6 col-xxl-12">
          <div className="buy_crypto__formarea p-6 p-px-8 rounded-20 bg7-color wow fadeInUp">
            <div className="demo">
              <div className="tab">
                <div className="tab-wrapper">
                  <input
                    id="tab1"
                    type="radio"
                    name="tabBuy"
                    className="radio-inputs"
                    checked={activeTab === "buy"}
                    defaultChecked
                    onChange={() => handleTabClick("buy")}
                  />
                  <label className="tab-button" htmlFor="tab1">
                    Buy Assets
                  </label>
                  <input
                    id="tab2"
                    type="radio"
                    className="radio-inputs"
                    name="tabSell"
                    checked={activeTab === "sell"}
                    onChange={() => handleTabClick("sell")}
                  />
                  <label className="tab-button" htmlFor="tab2">
                    Sell Assets
                  </label>
                </div>
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
