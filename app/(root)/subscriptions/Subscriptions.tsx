"use client";
import React, { useEffect, useState } from "react";
import styles from "./Subscriptions.module.scss";
import "react-datepicker/dist/react-datepicker.css";

import useWindowSize from "@/app/hooks/useWindowSize";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import {
  ActiveSubscribtionDetails,
  ChosenSubscriptionDetails,
} from "@/app/src/types";
import { capitalizeFirstLetter } from "../reports-dashboard/components/utils/CapitalizeFirstLetter";
import LightLoader from "@/app/components/LightLoader";
import Modal from "@/app/components/Modal";
import { getDaySuffix } from "../reports-dashboard/components/utils/DateSuffix";
import { createPortalSession } from "@/app/api-calls/createPortalSession";
import { cancelStripeSubscription } from "@/app/api-calls/cancelStripeSubscription";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { continueStripeSubscription } from "@/app/api-calls/continueStripeSubscription";
import { createSubscriptionCheckoutSession } from "@/app/api-calls/createSubscriptionCheckoutSession";
import LoadingSkeleton from "./components/LoadingSkeleton";
import withAuth from "@/app/components/Auth/withAuth";
import { useKitchen } from "../../context/KitchenContext";

const Subscriptions = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [chosenSubscriptionDetails, setChosenSubscriptionDetails] =
    useState<ChosenSubscriptionDetails>();

  const [activeSubscriptionDetails, setActiveSubscriptionDetails] =
    useState<ActiveSubscribtionDetails | null>(null);

  const [isCancelSubscriptionModalOpen, setIsCancelSubscriptionModalOpen] =
    useState(false);

  const [isContinueSubscriptionModalOpen, setIsContinueSubscriptionModalOpen] =
    useState(false);

  const { width } = useWindowSize();

  const { kitchen } = useKitchen();

  const kitchenId = kitchen?.kitchenId ?? null;
  const stripeCustomerId = kitchen?.stripe_customer_id ? kitchen.stripe_customer_id : null;

  // Chosen subscription details
  const chosenSubscribedProducts = chosenSubscriptionDetails?.products
    ? chosenSubscriptionDetails.products
    : [];
  const chosenSubscriptionName =
    chosenSubscribedProducts?.length > 0
      ? chosenSubscribedProducts[0]?.productName
      : "N/A";
  const chosenAddonNames =
    chosenSubscriptionDetails?.addonNames &&
    chosenSubscriptionDetails?.addonNames?.length > 0
      ? chosenSubscriptionDetails.addonNames
      : [];

  const chosenTotalAmount = chosenSubscribedProducts.reduce(
    (accumulator, product) => accumulator + product.amount,
    0
  );

  const subscriptionStatus = activeSubscriptionDetails?.subscriptionStatus
    ? capitalizeFirstLetter(activeSubscriptionDetails?.subscriptionStatus)
    : null;

  const activeSubscribedProducts = activeSubscriptionDetails?.products
    ? activeSubscriptionDetails.products
    : [];
  const mainSubscriptionName =
    activeSubscribedProducts?.length > 0
      ? activeSubscribedProducts[0]?.productName
      : "N/A";

  const activeAddonNames =
    activeSubscriptionDetails?.addonNames &&
    activeSubscriptionDetails?.addonNames?.length > 0
      ? activeSubscriptionDetails.addonNames
      : [];

  const activeTotalAmount = activeSubscribedProducts.reduce(
    (accumulator, product) => accumulator + product.amount,
    0
  );

  const subsriptionEndDate = activeSubscriptionDetails?.current_period_end
    ? new Date(activeSubscriptionDetails.current_period_end.seconds * 1000)
    : null;
  const subscriptionEndDay = subsriptionEndDate
    ? subsriptionEndDate?.getDate()
    : null;

  const subscriptionEndMonth = subsriptionEndDate
    ? subsriptionEndDate?.toLocaleString("default", { month: "long" })
    : null;

  const subscriptionEndYear = subsriptionEndDate
    ? subsriptionEndDate?.getFullYear()
    : null;

  const subscriptionID = activeSubscriptionDetails?.subscriptionId
    ? activeSubscriptionDetails.subscriptionId
    : null;

  const isSubscriptionCancelled =
    activeSubscriptionDetails?.cancel_at_period_end === true ? true : false;

  const notify = (message: string) => toast(message);
  const handleStartSubscription = async () => {
    if (stripeCustomerId === null) {
      setError("Stripe Customer ID is missing. Stripe account needs to be created. Please contact us.");
    }
    if (
      stripeCustomerId &&
      chosenSubscribedProducts?.length > 0 &&
      kitchenId !== null
    ) {
      try {
        setLoading(true);
        const url = await createSubscriptionCheckoutSession(
          stripeCustomerId,
          kitchenId,
          chosenSubscribedProducts
        );
        setLoading(false);
        // Automatically open the fetched URL in a new tab
        // window.open(url, "_blank", "noopener,noreferrer");
        window.location.replace(url);

      } catch (err: any) {
        setLoading(false);

        setError(
          "Unable to redirect to Stripe Checkout. Please try again later. If the error persists contact us"
        );
      }
    }
  };
  const handleUpdatePaymentMethodSubscription = async () => {
    if (stripeCustomerId) {
      try {
        setLoading(true);
        const url = await createPortalSession(stripeCustomerId);
        setLoading(false);
        // Automatically open the fetched URL in a new tab
        // window.open(url, "_blank", "noopener,noreferrer");
        window.location.replace(url);

      } catch (err: any) {
        setLoading(false);

        setError(
          "Unable to redirect to Stripe payment details. Please try again later. If the error persists contact us"
        );
      }
    }
  };
  const handleCancelSubscription = async () => {
    if (subscriptionID) {
      try {
        setIsCancelSubscriptionModalOpen(false);
        setLoading(true);
        await cancelStripeSubscription(subscriptionID);
        setLoading(false);
        // Automatically open the fetched URL in a new tab
        notify("Subscription scheduled for cancellation successfully.");
      } catch (err: any) {
        setLoading(false);

        setError(
          "Unable to cancel Subscription. Please try again later. If the error persists contact us."
        );
      }
    }
  };

  const handleContinueSubscription = async () => {
    if (subscriptionID) {
      try {
        setIsContinueSubscriptionModalOpen(false);
        setLoading(true);
        await continueStripeSubscription(subscriptionID);
        setLoading(false);
        notify("Subscription resumed successfully.");
      } catch (err: any) {
        setLoading(false);

        setError(
          "Unable to cancel Subscription. Please try again later. If the error persists contact us."
        );
      }
    }
  };

  // Get Current subscription details
  useEffect(() => {

    if (kitchenId) {
      const configDocRef = doc(db, "configs", kitchenId);

      getDoc(configDocRef)
        .then((configDocSnap) => {
          if (configDocSnap.exists()) {
            const chosenSubscriptionDetailsDB = configDocSnap?.data()
              ?.chosenSubscriptionDetails
              ? configDocSnap?.data()?.chosenSubscriptionDetails
              : null;

            const activeSubscriptionDetailsDB = configDocSnap?.data()
              ?.activeSubscriptionDetails
              ? configDocSnap?.data()?.activeSubscriptionDetails
              : null;

            setChosenSubscriptionDetails(chosenSubscriptionDetailsDB);
            setActiveSubscriptionDetails(activeSubscriptionDetailsDB);
          } else {
            setChosenSubscriptionDetails({} as ChosenSubscriptionDetails);
            setActiveSubscriptionDetails({} as ActiveSubscribtionDetails);
          }
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
      setError("KitchenID missing");
    }
  }, []);

  return (
    <>
      <h1 className={styles.pageTitle}>Subscriptions</h1>
      {loading && (
        <>
          <LightLoader />
          <LoadingSkeleton />
        </>
      )}

      {isCancelSubscriptionModalOpen && (
        <Modal
          show={isCancelSubscriptionModalOpen}
          onClose={() => setIsCancelSubscriptionModalOpen(false)}
          title="Cancel Subscription"
          confirmButtonText="Confrim Cancellation"
          cancelButtonText="Keep Subscription"
          onConfirmClick={() => handleCancelSubscription()}
          description={
            <p>
              Are you sure you want to cancel your subscription? We'd love for
              you to stay. <br />
              <br />
              Cancelling now means you will lose your access on{" "}
              {subsriptionEndDate?.toLocaleDateString()}.
            </p>
          }
        />
      )}

      {isContinueSubscriptionModalOpen && (
        <Modal
          show={isContinueSubscriptionModalOpen}
          onClose={() => setIsContinueSubscriptionModalOpen(false)}
          title="Continue Subscription"
          onConfirmClick={() => handleContinueSubscription()}
          description={
            <p>
              You recently cancelled your subscription. Are you sure you want to
              reactivate it? We'd love for you to come back. <br />
              <br />
              Confirming will charge you ${activeTotalAmount?.toFixed(
                2
              )} on {subsriptionEndDate?.toLocaleDateString()}.
            </p>
          }
        />
      )}
      {!loading && chosenSubscriptionDetails === null && (
        <div className={styles.parentContainer}>
          <div style={{ padding: 16 }}>
            <span className={styles.bodyText}>
              No subscription has been configured. Please contact us to get a
              subscription setup.
            </span>
          </div>
        </div>
      )}
      {!loading &&
        (chosenSubscriptionDetails !== null ||
          activeSubscriptionDetails !== null) && (
          <div className={styles.parentContainer}>
            <div style={{ padding: 16 }}>
              {subscriptionStatus && (
                <div
                  style={{ flex: 1, display: "inline-block", paddingBottom: 8 }}
                >
                  {subscriptionStatus === "Active" &&
                    !isSubscriptionCancelled && (
                      <div className={styles.subscriptionActiveStatusContainer}>
                        <Image
                          className={styles.icon}
                          src="/icons/check.svg"
                          height={width && width >= 600 ? 16 : 12}
                          width={width && width >= 600 ? 16 : 12}
                          alt="Check icon"
                        />
                        <span className={styles.subscriotionActiveText}>
                          {subscriptionStatus}
                        </span>
                      </div>
                    )}

                  {subscriptionStatus === "Active" &&
                    isSubscriptionCancelled && (
                      <div
                        className={styles.subscriptionCancelledStatusContainer}
                      >
                        <span className={styles.subscriotionCancelledText}>
                          You’ve Cancelled.
                        </span>
                      </div>
                    )}

                  {subscriptionStatus !== "Active" && (
                    <div className={styles.subscriptioninActiveStatusContainer}>
                      <Image
                        className={styles.icon}
                        src="/icons/attention.svg"
                        height={width && width >= 600 ? 16 : 12}
                        width={width && width >= 600 ? 16 : 12}
                        alt="Attention icon"
                      />
                      <span className={styles.subscriotionInactiveText}>
                        {subscriptionStatus}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {activeSubscriptionDetails === null && (
                <div
                  style={{ flex: 1, display: "inline-block", paddingBottom: 8 }}
                >
                  <div className={styles.subscriptioninActiveStatusContainer}>
                    <Image
                      className={styles.icon}
                      src="/icons/attention.svg"
                      height={width && width >= 600 ? 16 : 12}
                      width={width && width >= 600 ? 16 : 12}
                      alt="Attention icon"
                    />
                    <span className={styles.subscriotionInactiveText}>
                      No Active Subscription
                    </span>
                  </div>
                </div>
              )}
              {activeSubscriptionDetails !== null ? (
                <p className={styles.TitleText}>
                  {mainSubscriptionName} (Tyro Bundle)
                </p>
              ) : (
                <p className={styles.TitleText}>{chosenSubscriptionName}</p>
              )}
              <>
                {activeSubscriptionDetails !== null &&
                  activeAddonNames?.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <span className={styles.headerText}>Add Ons: </span>
                      <span className={styles.bodyText}>
                        {activeAddonNames?.join(", ")}
                      </span>
                    </div>
                  )}
              </>
              <>
                {chosenSubscriptionDetails !== null && activeSubscriptionDetails === null &&
                  chosenAddonNames?.length > 0 && (
                    <div style={{ marginBottom: 8 }}>
                      <span className={styles.headerText}>Add Ons: </span>

                      <span className={styles.bodyText}>
                        {chosenAddonNames?.join(", ")}
                      </span>
                    </div>
                  )}
              </>

              <div className={styles.totalAmountContainer}>
                {activeSubscriptionDetails !== null ? (
                  <span className={styles.headerText}>
                    ${activeTotalAmount?.toFixed(2)}{" "}
                  </span>
                ) : (
                  <span className={styles.headerText}>
                    ${chosenTotalAmount?.toFixed(2)}{" "}
                  </span>
                )}
                <span className={styles.bodyText}>/ month</span>
                {activeSubscriptionDetails === null && (
                  <div
                    className={styles.billedOnText}
                    style={{
                      display: "flex",
                      gap: 4,
                      marginTop: 8,
                      alignItems: "center",
                    }}
                  >
                    <p style={{ color: "grey" }}>
                      After a subscription is added it might take a couple of
                      minutes to reflect on this page.
                    </p>
                  </div>
                )}
              </div>

              {subscriptionStatus === "Active" &&
                subscriptionEndDay !== null &&
                !isSubscriptionCancelled && (
                  <p className={styles.billedOnText}>
                    Billed on {subscriptionEndDay}
                    {getDaySuffix(subscriptionEndDay)} of every month.
                  </p>
                )}
              {subscriptionStatus === "Active" &&
                isSubscriptionCancelled &&
                subscriptionEndDay !== null && (
                  <p className={styles.billedOnText}>
                    You still have access until the {subscriptionEndDay}
                    {getDaySuffix(subscriptionEndDay)} of {subscriptionEndMonth}{" "}
                    {subscriptionEndYear}
                  </p>
                )}
            </div>
            {subscriptionStatus === "Active" && !isSubscriptionCancelled && (
              <>
                <div className={styles.button}>
                  <button onClick={handleUpdatePaymentMethodSubscription}>
                    Update Payment Method
                  </button>
                </div>
                <div className={styles.button}>
                  <button
                    onClick={() => setIsCancelSubscriptionModalOpen(true)}
                  >
                    Cancel Subscription
                  </button>
                </div>
              </>
            )}
            {subscriptionStatus === "Active" && isSubscriptionCancelled && (
              <div className={styles.button}>
                <button
                  onClick={() => setIsContinueSubscriptionModalOpen(true)}
                >
                  Continue Subscription
                </button>
              </div>
            )}

            {subscriptionStatus !== "Active" && !isSubscriptionCancelled && (
              <div className={styles.button}>
                <button onClick={handleStartSubscription}>
                  Start Subscription
                </button>
              </div>
            )}
          </div>
        )}

      {error && (
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
            padding: 16,
            gap: 6,
          }}
        >
          <Image
            className={styles.icon}
            src="/icons/attention.svg"
            height={width && width >= 600 ? 16 : 12}
            width={width && width >= 600 ? 16 : 12}
            alt="Attention icon"
          />
          <p
            style={{
              color: "#C01048",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {error}
          </p>
        </div>
      )}
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          marginTop: 19.5,
          alignItems: "center",
          maxWidth: 553,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 600 }}>
          Billing powered by
        </span>
        <Image
          className={styles.icon}
          src="/icons/stripe.svg"
          height={19}
          width={41}
          alt="Stripe logo"
        />
      </div>
      <ToastContainer position="bottom-center" />
    </>
  );
};

export default withAuth(Subscriptions);
