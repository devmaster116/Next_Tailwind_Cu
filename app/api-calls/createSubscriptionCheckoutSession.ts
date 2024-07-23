import { functions, httpsCallable } from "@/firebase/config";
import { SubscriptionProduct } from "../src/types";

// uid is swifti ID
// customer ID is stripe ID
export const createSubscriptionCheckoutSession = async (
  customerId: string,
  kitchenId: string,
  products: SubscriptionProduct[]
) => {
  const sendNotification = httpsCallable(functions,
    "stripeSubscriptions-createSubscriptionCheckoutSession"
  );
  return sendNotification({ customerId, kitchenId, products })
    .then((result: any) => {
      console.log("Cloud Function called successfully.", result);
      // Read results of the Cloud Function.
      const statusCode = result?.data?.statusCode;
      if (statusCode === 200) {
        return result?.data?.url;
      } else {
        throw new Error(
          "createSubscriptionCheckoutSession Request not successful"
        );
      }
    })
    .catch(function (error: any) {
      // Getting the Error details.
      // const code = error.data.statusCode;
      // const message = error.data.message;
      // const details = error.data.details;
      console.log(
        "There was an error when calling the createSubscriptionCheckoutSession Cloud Function",
        error
      );

      throw error;

      // window.alert('There was an error when calling the Cloud Function:\n\nError Code: '
      //   + code + '\nError Message:' + message + '\nError Details:' + details);
    });
};
