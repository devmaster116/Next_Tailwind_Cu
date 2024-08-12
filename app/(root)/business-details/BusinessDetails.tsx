"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import withAuth from "@/app/components/Auth/withAuth";
import useWindowSize from "@/app/hooks/useWindowSize";
import LightLoader from "@/app/components/LightLoader";
import LoadingSkeleton from "./components/LoadingSkeleton";
import CustomModal from "@/app/components/CustomModal";
import Input from "@/app/components/Input";
import { Kitchen, User } from "@/app/src/types";
import { collection, query, where } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import {
  handleBlurField,
  handleInputChangeField,
  validateEmail,
  formatDate,
  validateMobileNumber,
} from "@/app/components/Auth/utils/helper";
import { User as FirebaseUser } from "firebase/auth";
import { useKitchen } from "../../context/KitchenContext";
import { useUser } from "../../context/UserContext";
import {
  getBusinessDetailsAPI,
  getOwnerAPI,
  getUserDetailsAPI,
  getSecondaryContactDataAPI,
  addUserAPI,
  checkUserExistsByEmail,
  deleteUserAPI,
  updateDataAPI,
  updateAuthenticationEmailAPI,
  sendEmailVerificationAPI,
} from "./BusinessServices";
import styles from "./BusinessDetails.module.scss";
import { FirebaseError } from "firebase/app";

const BusinessDetails = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formState, setFormState] = useState<{ [key: string]: string }>({
    businessName: "",
    businessAddress: "",
    ownerEmail: "",
    ownerMobile: "",
    secondaryContactName: "",
    secondaryContactEmail: "",
    secondaryContacts: "",
  });
  const [newUser, setNewUser] = useState<{ [key: string]: string }>({
    name: "",
    emailAddress: "",
    mobileNumber: "",
  });
  const [ownerShipDetails, setOwnerShipDetails] = useState<{
    [key: string]: string;
  }>({
    ownerName: "",
    ownerEmailAddress: "",
    ownerMobileNumber: "",
    reason: "",
  });
  const { width } = useWindowSize();
  const [businessNameEditModalOpen, setBusinessNameEditModalOpen] =
    useState(false);
  const [
    businessRegisteredAddressEditModalOpen,
    setBusinessRegisteredAddressEditModalOpen,
  ] = useState(false);
  const [ownersEmailAddressModalOpen, setOwnersEmailAddressModalOpen] =
    useState(false);
  const [ownersMobileNumberModalOpen, setOwnersMobileNumberModalOpen] =
    useState(false);
  const [secondaryContactNameModalOpen, setSecondaryContactNameModalOpen] =
    useState(false);
  const [secondaryContactEmailModalOpen, setSecondaryContactEmailModalOpen] =
    useState(false);
  const [secondaryContactsModalOpen, setSecondaryContactsModalOpen] =
    useState(false);
  const [adminUserModalOpen, setAdminUserModalOpen] = useState(false);
  const [newUserAddModalOpen, setNewUserAddModalOpen] = useState(false);
  const [flag, setFlag] = useState("");
  const [transferOwnerShipModalOpen, setTransferOwnerShipModalOpen] =
    useState(false);
  const [businessLoading, setBusinessLoading] = useState(false);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [secondaryLoading, setSecondaryLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [businessDetails, setBusinessDetails] = useState<Kitchen>();
  const [userData, setUserData] = useState<User[]>();
  const [ownerData, setOwnerData] = useState<User[]>();
  const [secondaryData, setSecondaryData] = useState<User[]>();
  const [deleteId, setDeletedId] = useState<string>("");
  const [deleteName, setDeleteName] = useState<string>("");
  const [isTransferOwnership, setIsTransferOwnership] =
    useState<boolean>(false);

  const [verificationEmailSent, setVerificationEmailSent] = useState(false);
  const { user } = useUser();
  const { kitchen } = useKitchen();
  const kitchenId = kitchen?.kitchenId ?? null;

  const currentUser = auth?.currentUser
    ? auth.currentUser
    : ({} as FirebaseUser);

  const validateRequired = (value: string) => value?.trim().length > 0;

  useEffect(() => {
    getBusinessDetails();
    getUserDetails();
    getOwner();
    getSecondaryContact();
  }, []);

  const getBusinessDetails = async () => {
    setBusinessLoading(true);
    setLoading(true);

    if (kitchenId) {
      try {
        const businessDetailsData = await getBusinessDetailsAPI(kitchenId);
        const isTransferOwnershipReview =
          businessDetailsData?.isTransferOwnershipReview ? true : false;
        if (businessDetailsData) {
          setBusinessDetails(businessDetailsData);
          setIsTransferOwnership(isTransferOwnershipReview);
        } else {
          console.log("No business details found.");
        }
      } catch (error) {
        console.error("Error fetching business details:", error);
      } finally {
        setBusinessLoading(false);
        setLoading(false);
      }
    } else {
      setBusinessLoading(false);
      setLoading(false);
    }
  };

  const getOwner = async () => {
    setOwnerLoading(true);
    if (kitchenId) {
      try {
        const ownerDetails = await getOwnerAPI(kitchenId);
        if (ownerDetails) {
          setOwnerData(ownerDetails);
        } else {
          setOwnerData([]);
        }
      } catch (err) {
        console.error("Error fetching owner data:", err);
      } finally {
        setOwnerLoading(false);
      }
    } else {
      setOwnerLoading(false);
      setLoading(false);
    }
  };

  const getSecondaryContact = async () => {
    setSecondaryLoading(true);
    try {
      const usersCollection = collection(db, "users");
      const secondaryContactQuery = query(
        usersCollection,
        where("secondaryContact", "==", true),
        where("kitchenId", "==", kitchenId)
      );
      const secondaryContactData = await getSecondaryContactDataAPI(
        secondaryContactQuery
      );
      setSecondaryData(secondaryContactData);
    } catch (err) {
      console.error("Error fetching secondary contact data:", err);
    } finally {
      setSecondaryLoading(false);
    }
  };

  const getUserDetails = async () => {
    if (kitchenId === null) {
      throw new Error("kitchenId is null");
    }
    setUserLoading(true);
    try {
      const userDetails = await getUserDetailsAPI(kitchenId);
      const filteredUserData = userDetails.filter(
        (user: User) => !user.owner && !user.secondaryContact && user.userType === "admin"
      );
      setUserData(filteredUserData);
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setUserLoading(false);
    }
  };

  const addUser = async () => {
    setLoading(true);
    try {
      const email = newUser?.emailAddress;
      const date = new Date();
      const userData: Omit<User, "uid" | "emailVerified"> = {
        createdAt: formatDate(date),
        displayName: newUser?.name,
        email: email,
        kitchenId: kitchenId,
        setupComplete: true,
        userType: "admin",
        mobileNumber: newUser.mobileNumber,
        owner: flag === "owner" ? true : false,
        secondaryContact: flag === "secondaryContact" ? true : false,
      };

      await addUserAPI(userData);

      if (flag === "secondaryContact") {
        await getSecondaryContact();
      } else if (flag === "owner") {
        await getOwner();
      } else {
        getUserDetails();
      }
      setNewUserAddModalOpen(false);
      setLoading(false);
      handleErrors();
    } catch (err: any) {
      setLoading(false);

      console.error("Error adding user:", err);
      const newErrors: { [key: string]: string } = {};
      newErrors.addingUser = err?.message
        ? err.message
        : "An Error Occurred. Please try again later or contact us if issue persists.";
      setErrors(newErrors);
    }
  };

  const deleteUser = async () => {
    if (kitchenId === null) {
      throw new Error("kitchenId is null");
    }
    setLoading(true);
    try {
      const email = deleteId;
      await deleteUserAPI(email, kitchenId);
      await getUserDetails();
    } catch (err) {
      console.error("Error deleting user:", err);
    } finally {
      setLoading(false);
      setAdminUserModalOpen(false);
    }
  };

  const transferOwnership = async () => {
    try {
      if (!kitchenId) {
        throw new Error("Kitchen ID is required.");
      }
      await updateDataAPI("kitchens", kitchenId, {
        isTransferOwnershipReview: true,
      });
    } catch (err) {
      console.error("Error updating kitchen document:", err);
    } finally {
      setTransferOwnerShipModalOpen(false);
      handleErrors();
    }
  };

  const updateOwnerDetail = async (
    updateData: Partial<User>,
    id: string,
    type: string
  ) => {
    try {
      if (!id) {
        throw new Error("Owner ID is required.");
      }

      if (updateData.email) {
        const userExists = await checkUserExistsByEmail(updateData.email);
        if (userExists) {
          return false;
        }
      }

      await updateDataAPI("users", id, updateData);

      return true;
    } catch (err) {
      console.error("Error updating owner document:", err);
      throw err;
    } finally {
      if (type === "Owner") {
        getOwner();
        handleErrors();
      } else {
        getSecondaryContact();
        handleErrors();
      }
    }
  };

  const updateBusinessData = async (updateData: Partial<Kitchen>) => {
    try {
      if (!kitchenId) {
        throw new Error("Kitchen ID is required.");
      }
      await updateDataAPI("kitchens", kitchenId, updateData);
    } catch (err) {
      console.error("Error updating business document:", err);
    } finally {
      getBusinessDetails();
      handleErrors();
      setBusinessNameEditModalOpen(false);
    }
  };

  const handleUpdateClickBusinessName = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!validateRequired(formState?.businessName)) {
      newErrors.businessName = "Please enter a valid business name.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const updateData = {
        kitchenName: formState.businessName,
      };
      updateBusinessData(updateData);
      setBusinessNameEditModalOpen(false);
    }
  };

  const handleUpdateClickBusinessAddress = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!validateRequired(formState?.businessAddress)) {
      newErrors.businessAddress = "Please enter a valid address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const updateData = {
        fullAddress: formState.businessAddress,
      };
      updateBusinessData(updateData);
      setBusinessRegisteredAddressEditModalOpen(false);
    }
  };

  const handleUpdateOwnerEmail = async () => {
    const newErrors: { [key: string]: string } = {};
    if (
      !validateRequired(formState?.ownerEmail) ||
      !validateEmail(formState?.ownerEmail)
    ) {
      newErrors.ownerEmail = "Please enter a valid email address.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const updateData = {
        email: formState.ownerEmail,
      };
      const id = ownerData && ownerData[0]?.uid;
      if (id && user?.owner) {
        try {
          await updateAuthenticationEmailAPI(currentUser, updateData.email);
          await updateOwnerDetail(updateData, id, "Owner");
          setOwnersEmailAddressModalOpen(false);
        } catch (err: any) {
          newErrors.ownerEmail = err?.message;
          setErrors(newErrors);
        }
      } else {
        console.error("Owner ID is undefined.");
      }
    }
  };

  const handleUpdateOwnerNumber = async () => {
    const newErrors: { [key: string]: string } = {};
    if (
      !validateRequired(formState?.ownerMobile) ||
      !validateMobileNumber(formState?.ownerMobile)
    ) {
      newErrors.ownerMobile =
        "Enter a valid mobile number containing 10 digits.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const updateData = {
        mobileNumber: formState.ownerMobile,
      };
      const id = ownerData && ownerData[0]?.uid;
      if (id) {
        updateOwnerDetail(updateData, id, "Owner");
        setOwnersMobileNumberModalOpen(false);
      } else {
        console.error("Owner ID is undefined.");
      }
    }
  };

  const handleUpdateSecondaryContactName = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!validateRequired(formState?.secondaryContactName)) {
      newErrors.secondaryContactName = "Please enter a valid name";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const updateData = {
        displayName: formState.secondaryContactName,
      };

      const id = secondaryData && secondaryData[0]?.uid;
      if (id) {
        updateOwnerDetail(updateData, id, "Contact");
        setSecondaryContactNameModalOpen(false);
      } else {
        console.error("Owner ID is undefined.");
      }
    }
  };

  const handleUpdateSecondaryContactEmail = async () => {
    const newErrors: { [key: string]: string } = {};
    if (
      !validateRequired(formState?.secondaryContactEmail) ||
      !validateEmail(formState?.secondaryContactEmail)
    ) {
      newErrors.secondaryContactEmail = "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const updateData = {
        email: formState.secondaryContactEmail,
      };
      const id = secondaryData && secondaryData[0].uid;
      if (id && user?.secondaryContact) {
        try {
          await updateAuthenticationEmailAPI(currentUser, updateData.email);
          await updateOwnerDetail(updateData, id, "Contact");
          setSecondaryContactEmailModalOpen(false);
        } catch (err: any) {
          newErrors.secondaryContactEmail = err?.message;
          setErrors(newErrors);
        }
      } else {
        console.error("Owner ID is undefined.");
      }
    }
  };

  const handleUpdateSecondaryContacts = async () => {
    const newErrors: { [key: string]: string } = {};

    if (
      !validateRequired(formState?.secondaryContacts) ||
      !validateMobileNumber(formState?.secondaryContacts)
    ) {
      newErrors.secondaryContacts =
        "Enter a valid mobile number containing 10 digits.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const updateData = {
        mobileNumber: formState.secondaryContacts,
      };
      const id = secondaryData && secondaryData[0].uid;
      if (id) {
        updateOwnerDetail(updateData, id, "Contact");
        setSecondaryContactsModalOpen(false);
      } else {
        console.error("Owner ID is undefined.");
      }
    }
  };

  const handleAddNewUser = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!validateRequired(newUser?.name)) {
      newErrors.name = "Please enter a valid name.";
    }
    if (
      !validateRequired(newUser?.emailAddress) ||
      !validateEmail(newUser?.emailAddress)
    ) {
      newErrors.emailAddress = "Please enter a valid email address.";
    }
    if (
      !validateRequired(newUser?.mobileNumber) ||
      !validateMobileNumber(newUser?.mobileNumber)
    ) {
      newErrors.mobileNumber =
        "Enter a valid mobile number containing 10 digits.";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      addUser();
    }
  };

  const handleTransferOwnerShip = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!validateRequired(ownerShipDetails?.ownerName)) {
      newErrors.ownerName = "Please enter a valid name.";
    }
    if (
      !validateRequired(ownerShipDetails?.ownerEmailAddress) ||
      !validateEmail(ownerShipDetails?.ownerEmailAddress)
    ) {
      newErrors.ownerEmailAddress = "Please enter a valid email address.";
    }
    if (
      !validateRequired(ownerShipDetails?.ownerMobileNumber) ||
      !validateMobileNumber(ownerShipDetails?.ownerMobileNumber)
    ) {
      newErrors.ownerMobileNumber = "Please enter a valid mobile number.";
    }
    if (!validateRequired(ownerShipDetails?.reason)) {
      newErrors.reason = "Please enter a reason for transfer.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      transferOwnership();
    }
  };

  const handleDeleteAdminUser = () => {
    deleteUser();
  };

  const handleErrors = () => {
    setErrors({});
    setFormState({});
    setNewUser({});
    setOwnerShipDetails({});
  };

  const handleContactModal = (flagItem: string) => {
    setFlag(flagItem);
    setNewUserAddModalOpen(true);
  };

  return (
    <>
      <div className={styles.main_container}>
        {width && width >= 600 && (
          <h1 className={styles.pageTitle}>Business Details</h1>
        )}
        {businessLoading && <LoadingSkeleton />}
        {businessDetails && (
          <div className={styles.parentContainer}>
            <div>
              <div className={styles.subContainer}>
                <div className={styles.titleTextContainer}>
                  <p className={styles.titleText}>Business Name</p>
                  {user?.owner && (
                    <p
                      className={styles.editText}
                      onClick={() => setBusinessNameEditModalOpen(true)}
                    >
                      Edit
                    </p>
                  )}
                </div>
                <p className={styles.bodyText}>
                  {businessDetails?.kitchenName
                    ? businessDetails?.kitchenName
                    : "Not provided"}
                </p>
              </div>
              <div className={styles.subContainer}>
                <div className={styles.titleTextContainer}>
                  <p className={styles.titleText}>ABN</p>
                  {/* <p className={styles.editText}>Edit</p> */}
                </div>
                <p className={styles.bodyText}>
                  {businessDetails?.abn ? businessDetails?.abn : "Not provided"}
                </p>
              </div>
              <div className={styles.subContainer}>
                <div className={styles.titleTextContainer}>
                  <p className={styles.titleText}>
                    Registered Business Address
                  </p>
                  {user?.owner && (
                    <p
                      className={styles.editText}
                      onClick={() =>
                        setBusinessRegisteredAddressEditModalOpen(true)
                      }
                    >
                      Edit
                    </p>
                  )}
                </div>
                <p className={styles.bodyText}>
                  {businessDetails?.fullAddress
                    ? businessDetails?.fullAddress
                    : "Not provided"}
                </p>
              </div>
            </div>
          </div>
        )}
        <p className={styles.commonTitle}>Owner Details</p>
        {ownerLoading && <LoadingSkeleton />}
        <div className={styles.parentContainer}>
          {ownerData &&
            ownerData.length > 0 &&
            ownerData.map((item, index: number) => {
              return (
                <div key={index}>
                  <div>
                    <div className={styles.subContainer}>
                      <div className={styles.titleTextContainer}>
                        <p className={styles.titleText}>Name</p>
                      </div>
                      <p className={styles.bodyText}>
                        {item.displayName ? item.displayName : "Not provided"}
                      </p>
                    </div>
                    <div className={styles.subContainer}>
                      <div className={styles.titleTextContainer}>
                        <p className={styles.titleText}>Email</p>
                        {isTransferOwnership ? (
                          ""
                        ) : (
                          <>
                            {(user?.owner || user?.secondaryContact) && (
                              <>
                                {user?.emailVerified ? (
                                  <p
                                    className={styles.editText}
                                    onClick={() =>
                                      setOwnersEmailAddressModalOpen(true)
                                    }
                                  >
                                    Edit
                                  </p>
                                ) : (
                                  <p
                                    className={
                                      verificationEmailSent
                                        ? styles.emailVerificationText
                                        : styles.editText
                                    }
                                    onClick={() =>
                                      sendEmailVerificationAPI(
                                        currentUser
                                      ).then(() =>
                                        setVerificationEmailSent(true)
                                      )
                                    }
                                  >
                                    {verificationEmailSent
                                      ? "Email Sent"
                                      : "Verify"}
                                  </p>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </div>
                      <p className={styles.bodyText}>
                        {item.email ? item.email : "Not provided"}
                      </p>
                    </div>
                    <div className={styles.subContainer}>
                      <div className={styles.titleTextContainer}>
                        <p className={styles.titleText}>Mobile Number</p>
                        {isTransferOwnership ? (
                          ""
                        ) : (
                          <>
                            {(user?.owner || user?.secondaryContact) && (
                              <p
                                className={styles.editText}
                                onClick={() =>
                                  setOwnersMobileNumberModalOpen(true)
                                }
                              >
                                Edit
                              </p>
                            )}
                          </>
                        )}
                      </div>
                      <p className={styles.bodyText}>
                        {item.mobileNumber ? item.mobileNumber : "Not provided"}
                      </p>
                    </div>
                  </div>
                  {user?.owner && (
                    <div className={styles.button}>
                      {isTransferOwnership ? (
                        <button
                          className={styles.ownerShipButton}
                          onClick={() => setTransferOwnerShipModalOpen(true)}
                          disabled={isTransferOwnership ? true : false}
                        >
                          <Image
                            className={styles.icon}
                            src="/icons/refresh.svg"
                            height={18}
                            width={18}
                            alt="Business Details icon"
                          />
                          <span>Transfer Of Ownership Processing</span>
                        </button>
                      ) : (
                        <>
                          <button
                            className={styles.button_container}
                            onClick={() => setTransferOwnerShipModalOpen(true)}
                            disabled={isTransferOwnership ? true : false}
                          >
                            <Image
                              className={styles.icon}
                              src="/icons/arrowIcon.svg"
                              height={18}
                              width={18}
                              alt="Business Details icon"
                            />
                            <span>Transfer of ownership</span>
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

          {ownerData && ownerData?.length === 0 && (
            <div className={styles.subContainer}>
            <p className={styles.bodyText}>Not provided</p>
          </div>
          )}
        </div>
        <p className={styles.commonTitle}>Secondary contact</p>
        {secondaryLoading && <LoadingSkeleton />}
        <div className={styles.parentContainer}>
          {secondaryData &&
            secondaryData.length > 0 &&
            secondaryData.map((item: any, index: number) => {
              return (
                <div key={index}>
                  <div className={styles.subContainer}>
                    <div className={styles.titleTextContainer}>
                      <p className={styles.titleText}>Name</p>
                      {user?.secondaryContact && (
                        <p
                          className={styles.editText}
                          onClick={() => setSecondaryContactNameModalOpen(true)}
                        >
                          Edit
                        </p>
                      )}
                    </div>
                    <p className={styles.bodyText}>
                      {item.displayName ? item.displayName : "Not provided"}
                    </p>
                  </div>
                  <div className={styles.subContainer}>
                    <div className={styles.titleTextContainer}>
                      <p className={styles.titleText}>Email</p>
                      {user?.secondaryContact && (
                        <p
                          className={styles.editText}
                          onClick={() =>
                            setSecondaryContactEmailModalOpen(true)
                          }
                        >
                          Edit
                        </p>
                      )}
                    </div>
                    <p className={styles.bodyText}>
                      {item.email ? item.email : "Not provided"}
                    </p>
                  </div>
                  <div className={styles.subContainer}>
                    <div className={styles.titleTextContainer}>
                      <p className={styles.titleText}>Mobile Number</p>
                      {user?.secondaryContact && (
                        <p
                          className={styles.editText}
                          onClick={() => setSecondaryContactsModalOpen(true)}
                        >
                          Edit
                        </p>
                      )}
                    </div>
                    <p className={styles.bodyText}>
                      {item.mobileNumber ? item.mobileNumber : "Not provided"}
                    </p>
                  </div>
                </div>
              );
            })}

          {secondaryData && secondaryData.length <= 0 && (
            <>
              {user?.owner ? (
                <div className={styles.button}>
                  <button
                    className={styles.button_container}
                    onClick={() => handleContactModal("secondaryContact")}
                  >
                    <Image
                      className={styles.icon}
                      src="/icons/plus.svg"
                      height={18}
                      width={18}
                      alt="Create a Secondary Contact"
                    />
                    <span>Create a Secondary Contact</span>
                  </button>
                </div>
              ) : (
                <div className={styles.subContainer}>
                  <p className={styles.bodyText}>Not provided</p>
                </div>
              )}
            </>
          )}
        </div>
        <p className={styles.commonTitle}>Additional Admin User</p>
        {userLoading && <LoadingSkeleton />}
        <div className={styles.parentContainer}>
          {userData &&
            userData.length > 0 &&
            userData.map((item: any, index: any) => {
              return (
                <div key={index}>
                  <div className={styles.subContainer}>
                    <div className={styles.titleTextContainer}>
                      <p className={styles.titleText}>
                        {item.displayName ? item.displayName : "Not provided"}
                      </p>
                      {(user?.owner || user?.secondaryContact) && (
                        <p
                          className={styles.editText}
                          onClick={() => {
                            setAdminUserModalOpen(true);
                            setDeletedId(item.email);
                            setDeleteName(item.displayName);
                          }}
                        >
                          Delete
                        </p>
                      )}
                    </div>
                    <p className={styles.bodyText}>
                      {item.email ? item.email : "Not provided"}
                    </p>
                  </div>
                </div>
              );
            })}

          {userData && userData?.length === 0 && (
            <div className={styles.button}>
              <button
                className={styles.button_container}
                onClick={() => handleContactModal("newUser")}
              >
                <Image
                  className={styles.icon}
                  src="/icons/plus.svg"
                  height={18}
                  width={18}
                  alt="New User"
                />
                <span>New User</span>
              </button>
            </div>
          )}
        </div>

        {businessNameEditModalOpen && (
          <CustomModal
            show={businessNameEditModalOpen}
            onClose={() => {
              handleErrors();
              setBusinessNameEditModalOpen(false);
              setDeletedId("");
              setDeleteName("");
            }}
            type="edit"
            title="Edit Business Name"
            onUpdateClick={handleUpdateClickBusinessName}
            content={
              <>
                <form className={styles.formContainer}>
                  <Input
                    value={formState.businessName}
                    handleInputChange={(e) =>
                      handleInputChangeField(
                        e,
                        setFormState,
                        setErrors,
                        "businessName"
                      )
                    }
                    handleBlurField={(e) =>
                      handleBlurField(
                        e,
                        setFormState,
                        setErrors,
                        validateRequired,
                        "Please enter a valid business name.",
                        "businessName"
                      )
                    }
                    error={errors.businessName}
                    loading={loading}
                    placeholder="Enter New Business Name"
                  />
                </form>
              </>
            }
          />
        )}

        {businessRegisteredAddressEditModalOpen && (
          <CustomModal
            show={businessRegisteredAddressEditModalOpen}
            onClose={() => {
              handleErrors();
              setBusinessRegisteredAddressEditModalOpen(false);
            }}
            type="edit"
            title="Enter new address"
            onUpdateClick={handleUpdateClickBusinessAddress}
            content={
              <>
                <form className={styles.formContainer}>
                  <Input
                    value={formState.businessAddress}
                    handleInputChange={(e) =>
                      handleInputChangeField(
                        e,
                        setFormState,
                        setErrors,
                        "businessAddress"
                      )
                    }
                    handleBlurField={(e) =>
                      handleBlurField(
                        e,
                        setFormState,
                        setErrors,
                        validateRequired,
                        "Please enter a valid address.",
                        "businessAddress"
                      )
                    }
                    error={errors.businessAddress}
                    loading={loading}
                    placeholder="Enter New Address"
                  />
                </form>
              </>
            }
          />
        )}

        {ownersEmailAddressModalOpen && (
          <CustomModal
            show={ownersEmailAddressModalOpen}
            onClose={() => {
              handleErrors();
              setOwnersEmailAddressModalOpen(false);
            }}
            type="edit"
            title="Edit Owner Email Address"
            onUpdateClick={handleUpdateOwnerEmail}
            content={
              <>
                <form className={styles.formContainer}>
                  <Input
                    value={formState.ownerEmail}
                    handleInputChange={(e) =>
                      handleInputChangeField(
                        e,
                        setFormState,
                        setErrors,
                        "ownerEmail"
                      )
                    }
                    handleBlurField={(e) =>
                      handleBlurField(
                        e,
                        setFormState,
                        setErrors,
                        validateRequired,
                        "Please enter a valid email address.",
                        "ownerEmail"
                      )
                    }
                    error={errors.ownerEmail}
                    loading={loading}
                    placeholder="Enter new email address"
                  />
                </form>
              </>
            }
          />
        )}

        {ownersMobileNumberModalOpen && (
          <CustomModal
            show={ownersMobileNumberModalOpen}
            onClose={() => {
              handleErrors();
              setOwnersMobileNumberModalOpen(false);
            }}
            type="edit"
            title="Edit Owners Mobile Number"
            onUpdateClick={handleUpdateOwnerNumber}
            content={
              <>
                <form className={styles.formContainer}>
                  <Input
                    value={formState.ownerMobile}
                    maxLength={10}
                    type="number"
                    handleInputChange={(e) =>
                      handleInputChangeField(
                        e,
                        setFormState,
                        setErrors,
                        "ownerMobile"
                      )
                    }
                    handleBlurField={(e) =>
                      handleBlurField(
                        e,
                        setFormState,
                        setErrors,
                        validateRequired,
                        "Enter a valid mobile number containing 10 digits.",
                        "ownerMobile"
                      )
                    }
                    error={errors.ownerMobile}
                    loading={loading}
                    placeholder="Enter new mobile number"
                  />
                </form>
              </>
            }
          />
        )}

        {secondaryContactNameModalOpen && (
          <CustomModal
            show={secondaryContactNameModalOpen}
            onClose={() => {
              handleErrors();
              setSecondaryContactNameModalOpen(false);
            }}
            type="edit"
            title="Edit Secondary Contact Name"
            onUpdateClick={handleUpdateSecondaryContactName}
            content={
              <>
                <form className={styles.formContainer}>
                  <Input
                    value={formState.secondaryContactName}
                    handleInputChange={(e) =>
                      handleInputChangeField(
                        e,
                        setFormState,
                        setErrors,
                        "secondaryContactName"
                      )
                    }
                    handleBlurField={(e) =>
                      handleBlurField(
                        e,
                        setFormState,
                        setErrors,
                        validateRequired,
                        "Please enter a valid name",
                        "secondaryContactName"
                      )
                    }
                    error={errors.secondaryContactName}
                    loading={loading}
                    placeholder="Enter contact full name"
                  />
                </form>
              </>
            }
          />
        )}

        {secondaryContactEmailModalOpen && (
          <CustomModal
            show={secondaryContactEmailModalOpen}
            onClose={() => {
              handleErrors();
              setSecondaryContactEmailModalOpen(false);
            }}
            type="edit"
            title="Edit Secondary Contact Email"
            onUpdateClick={handleUpdateSecondaryContactEmail}
            content={
              <>
                <form className={styles.formContainer}>
                  <Input
                    value={formState.secondaryContactEmail}
                    handleInputChange={(e) =>
                      handleInputChangeField(
                        e,
                        setFormState,
                        setErrors,
                        "secondaryContactEmail"
                      )
                    }
                    handleBlurField={(e) =>
                      handleBlurField(
                        e,
                        setFormState,
                        setErrors,
                        validateRequired,
                        "Please enter a valid email address",
                        "secondaryContactEmail"
                      )
                    }
                    error={errors.secondaryContactEmail}
                    loading={loading}
                    placeholder="Enter new email address"
                  />
                </form>
              </>
            }
          />
        )}

        {secondaryContactsModalOpen && (
          <CustomModal
            show={secondaryContactsModalOpen}
            onClose={() => {
              handleErrors();
              setSecondaryContactsModalOpen(false);
            }}
            type="edit"
            title="Edit Secondary Contact Mobile"
            onUpdateClick={handleUpdateSecondaryContacts}
            content={
              <>
                <form className={styles.formContainer}>
                  <Input
                    value={formState.secondaryContacts}
                    maxLength={10}
                    type="number"
                    handleInputChange={(e) =>
                      handleInputChangeField(
                        e,
                        setFormState,
                        setErrors,
                        "secondaryContacts"
                      )
                    }
                    handleBlurField={(e) =>
                      handleBlurField(
                        e,
                        setFormState,
                        setErrors,
                        validateRequired,
                        "Enter a valid mobile number containing 10 digits.",
                        "secondaryContacts"
                      )
                    }
                    error={errors.secondaryContacts}
                    loading={loading}
                    placeholder="Enter new mobile number"
                  />
                </form>
              </>
            }
          />
        )}

        {newUserAddModalOpen && (
          <CustomModal
            show={newUserAddModalOpen}
            onClose={() => {
              handleErrors();
              setNewUserAddModalOpen(false);
            }}
            type="add"
            title={
              flag === "newUser"
                ? "Create a New Admin User"
                : flag === "secondaryContact"
                ? "Create a Secondary Contact"
                : "Create New Owner"
            }
            onUpdateClick={handleAddNewUser}
            updateButtonText={
              flag === "secondaryContact"
                ? "Create Contact"
                : flag === "newUser"
                ? "Create user"
                : "Create Owner"
            }
            content={
              <>
                <form className={styles.formContainer}>
                  <div>
                    <p className={styles.label}>Full Name</p>
                    <Input
                      value={newUser.name}
                      handleInputChange={(e) =>
                        handleInputChangeField(e, setNewUser, setErrors, "name")
                      }
                      handleBlurField={(e) =>
                        handleBlurField(
                          e,
                          setNewUser,
                          setErrors,
                          validateRequired,
                          "Please enter a valid name.",
                          "name"
                        )
                      }
                      error={errors.name}
                      loading={loading}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <p className={styles.label}>Email Address</p>
                    <Input
                      value={newUser.emailAddress}
                      handleInputChange={(e) =>
                        handleInputChangeField(
                          e,
                          setNewUser,
                          setErrors,
                          "emailAddress"
                        )
                      }
                      handleBlurField={(e) =>
                        handleBlurField(
                          e,
                          setNewUser,
                          setErrors,
                          validateRequired,
                          "Please enter a valid email address.",
                          "emailAddress"
                        )
                      }
                      error={errors.emailAddress}
                      loading={loading}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <p className={styles.label}>Mobile Number</p>
                    <Input
                      value={newUser.mobileNumber}
                      maxLength={10}
                      type="number"
                      handleInputChange={(e) =>
                        handleInputChangeField(
                          e,
                          setNewUser,
                          setErrors,
                          "mobileNumber"
                        )
                      }
                      handleBlurField={(e) =>
                        handleBlurField(
                          e,
                          setNewUser,
                          setErrors,
                          validateRequired,
                          "Enter a valid mobile number containing 10 digits.",
                          "mobileNumber"
                        )
                      }
                      error={errors.mobileNumber}
                      loading={loading}
                      placeholder="Enter mobile number"
                    />
                  </div>
                  {errors?.addingUser && (
                    <p className={styles.errorLabel}>{errors.addingUser}</p>
                  )}
                </form>
              </>
            }
          />
        )}

        {transferOwnerShipModalOpen && (
          <CustomModal
            show={transferOwnerShipModalOpen}
            onClose={() => {
              handleErrors();
              setTransferOwnerShipModalOpen(false);
            }}
            type="add"
            title="Transfer of Ownership"
            onUpdateClick={handleTransferOwnerShip}
            updateButtonText="Submit Request"
            content={
              <>
                <form className={styles.formContainer}>
                  <div>
                    <p className={styles.label}>New Owner Name</p>
                    <Input
                      value={ownerShipDetails.ownerName}
                      handleInputChange={(e) =>
                        handleInputChangeField(
                          e,
                          setOwnerShipDetails,
                          setErrors,
                          "ownerName"
                        )
                      }
                      handleBlurField={(e) =>
                        handleBlurField(
                          e,
                          setOwnerShipDetails,
                          setErrors,
                          validateRequired,
                          "Please enter a valid name.",
                          "ownerName"
                        )
                      }
                      error={errors.ownerName}
                      loading={loading}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div>
                    <p className={styles.label}>Email Address</p>
                    <Input
                      value={ownerShipDetails.ownerEmailAddress}
                      handleInputChange={(e) =>
                        handleInputChangeField(
                          e,
                          setOwnerShipDetails,
                          setErrors,
                          "ownerEmailAddress"
                        )
                      }
                      handleBlurField={(e) =>
                        handleBlurField(
                          e,
                          setOwnerShipDetails,
                          setErrors,
                          validateRequired,
                          "Please enter a valid email address.",
                          "ownerEmailAddress"
                        )
                      }
                      error={errors.ownerEmailAddress}
                      loading={loading}
                      placeholder="Enter email address"
                    />
                  </div>
                  <div>
                    <p className={styles.label}>New Owner Mobile Number</p>
                    <Input
                      maxLength={10}
                      type="number"
                      value={ownerShipDetails.ownerMobileNumber}
                      handleInputChange={(e) =>
                        handleInputChangeField(
                          e,
                          setOwnerShipDetails,
                          setErrors,
                          "ownerMobileNumber"
                        )
                      }
                      handleBlurField={(e) =>
                        handleBlurField(
                          e,
                          setOwnerShipDetails,
                          setErrors,
                          validateRequired,
                          "Please enter a valid mobile number.",
                          "ownerMobileNumber"
                        )
                      }
                      error={errors.ownerMobileNumber}
                      loading={loading}
                      placeholder="Enter mobile number"
                    />
                  </div>
                  <div>
                    <p className={styles.label}>Reason for Transfer</p>
                    <Input
                      value={ownerShipDetails.reason}
                      handleInputChange={(e) =>
                        handleInputChangeField(
                          e,
                          setOwnerShipDetails,
                          setErrors,
                          "reason"
                        )
                      }
                      handleBlurField={(e) =>
                        handleBlurField(
                          e,
                          setOwnerShipDetails,
                          setErrors,
                          validateRequired,
                          "Please enter a reason for transfer.",
                          "reason"
                        )
                      }
                      error={errors.reason}
                      loading={loading}
                      placeholder="Enter reason for transfer"
                    />
                  </div>
                </form>
              </>
            }
          />
        )}

        {adminUserModalOpen && (
          <CustomModal
            show={adminUserModalOpen}
            onClose={() => setAdminUserModalOpen(false)}
            type="delete"
            title=""
            onUpdateClick={handleDeleteAdminUser}
            content={
              <>
                <h3 className={styles.deleteModalTitle}>Delete Admin User</h3>
                <p className={styles.deleteMessage}>
                  Are you sure you want to delete {deleteName} as an admin user?
                </p>
                <p className={styles.description}>
                  Confirming this means they wont have access to the portal
                  anymore.
                </p>
              </>
            }
          />
        )}

        {loading && (
          <>
            <LightLoader />
          </>
        )}
      </div>
    </>
  );
};

export default withAuth(BusinessDetails);
